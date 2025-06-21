import { Timestamp } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase-admin';

// Firebase Admin SDK는 자동으로 초기화됨

// 상세 조회용으로만 사용할 변환 유틸 (리스트에서는 사용하지 않음)
const convertFirestoreData = <T = any>(data: any): T => {
  if (data === null || data === undefined) return data as T;
  if (data instanceof Timestamp) return data.toDate().toISOString() as unknown as T;
  if (typeof data !== 'object') return data as T;
  
  if (Array.isArray(data)) {
    return data.map(item => convertFirestoreData(item)) as unknown as T;
  }
  
  const result: Record<string, any> = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = convertFirestoreData(data[key]);
    }
  }
  return result as T;
};

// 공통 기본 필드 인터페이스
interface BaseContent {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  is_published: boolean;
  createdAt: string; // ISO 문자열
  updatedAt: string; // ISO 문자열
}

// 숙소 항목 인터페이스
export interface AccommodationItem extends BaseContent {
  price: number;
  location: string;
  rating: number;
}

// 명소 항목 인터페이스
export interface AttractionItem extends BaseContent {
  address: string;
  admissionFee: number;
  openingHours: string;
}

// 쇼핑 항목 인터페이스
export interface ShoppingItem extends BaseContent {
  price: number;
  brand: string;
  discountRate?: number;
}

// 상세 조회용 인터페이스
export interface ContentDetail extends BaseContent {
  [key: string]: any; // 추가 필드 허용
}

// 공통 쿼리 옵션
interface QueryOptions {
  limit?: number;
}

// 기본 필드 추출 함수
const extractBaseFields = (doc: FirebaseFirestore.QueryDocumentSnapshot): BaseContent => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    imageUrl: data.imageUrl || data.thumbnail || '',
    category: data.category || '',
    is_published: data.is_published || false,
    createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
  };
};

// 숙소 목록 조회
export const getAccommodations = async (options: QueryOptions = {}) => {
  const { limit: pageSize = 20 } = options;
  
  const snapshot = await db
    .collection('prepared_contents')
    .where('category', '==', '숙소')
    .where('is_published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(pageSize)
    .get();
  
  return snapshot.docs.map(doc => {
    const base = extractBaseFields(doc);
    const data = doc.data();
    
    return {
      ...base,
      price: Number(data.price) || 0,
      location: data.location || '',
      rating: Number(data.rating) || 0
    } as AccommodationItem;
  });
};

// 명소 목록 조회
export const getAttractions = async (options: QueryOptions = {}) => {
  const { limit: pageSize = 20 } = options;
  
  const snapshot = await db
    .collection('prepared_contents')
    .where('category', '==', 'attraction')
    .where('is_published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(pageSize)
    .get();
  
  return snapshot.docs.map(doc => {
    const base = extractBaseFields(doc);
    const data = doc.data();
    
    return {
      ...base,
      address: data.address || '',
      admissionFee: Number(data.admissionFee) || 0,
      openingHours: data.openingHours || '09:00-18:00'
    } as AttractionItem;
  });
};

// 컨텐츠 상세 조회 (필요한 경우에만 사용)
export const getContentById = async (id: string): Promise<ContentDetail> => {
  const docRef = db.collection('prepared_contents').doc(id);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    throw { 
      code: 'not-found', 
      message: '요청하신 콘텐츠를 찾을 수 없습니다.',
      status: 404
    };
  }
  
  // 상세 조회 시에만 convertFirestoreData 사용
  return convertFirestoreData({
    id: docSnap.id,
    ...docSnap.data()
  }) as ContentDetail;
};

export const incrementViewCount = async (id: string): Promise<void> => {
  console.log(`View count incremented for content: ${id}`);
  // TODO: 실제 조회수 증가 로직 구현
  // await db.collection('prepared_contents').doc(id).update({
  //   viewCount: admin.firestore.FieldValue.increment(1)
  // });
};

export async function toggleLike(id: string, userId: string) {
  // TODO: Implement like functionality
  console.log(`Like toggled for content: ${id} by user: ${userId}`);
  return { likeCount: 0, isLiked: false };
}

// 컨텐츠 목록 조회 옵션
export interface GetContentsOptions {
  limit?: number;
  category?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// 컨텐츠 목록 조회
export async function getContents(options: GetContentsOptions = {}) {
  const { 
    limit = 10, 
    category, 
    orderBy = 'createdAt', 
    orderDirection = 'desc' 
  } = options;
  
  let query = db
    .collection('prepared_contents')
    .where('is_published', '==', true)
    .orderBy(orderBy, orderDirection)
    .limit(limit);

  if (category) {
    query = query.where('category', '==', category);
  }

  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => {
    const base = extractBaseFields(doc);
    const data = doc.data();
    
    // 카테고리별로 다른 필드 반환
    switch (base.category) {
      case '숙소':
        return {
          ...base,
          price: Number(data.price) || 0,
          location: data.location || '',
          rating: Number(data.rating) || 0
        };
      case '명소':
        return {
          ...base,
          address: data.address || '',
          admissionFee: Number(data.admissionFee) || 0,
          openingHours: data.openingHours || ''
        };
      case '쇼핑':
        return {
          ...base,
          price: Number(data.price) || 0,
          brand: data.brand || '',
          discountRate: Number(data.discountRate) || 0
        };
      default:
        return base;
    }
  });
}
