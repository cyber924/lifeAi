import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  doc, 
  getDoc,
  DocumentData,
  Timestamp,
  QueryDocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { getDb, initializeFirebase } from '@/lib/firebase';

// Firebase 초기화 보장
initializeFirebase();

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
const extractBaseFields = (doc: QueryDocumentSnapshot): BaseContent => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    imageUrl: data.imageUrl || '',
    category: data.category || '',
    is_published: Boolean(data.is_published),
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
  };
};

// 숙소 목록 조회
export const getAccommodations = async (options: QueryOptions = {}) => {
  const { limit: pageSize = 20 } = options;
  const db = getDb();
  
  const q = query(
    collection(db, 'prepared_contents'),
    where('category', '==', '숙소'),  // 'accommodation'에서 '숙소'로 변경
    where('is_published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  
  console.log('Firestore query:', JSON.stringify(q, null, 2));  // 디버깅용 로그 추가

  const snapshot = await getDocs(q);
  
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
  const db = getDb();
  
  const q = query(
    collection(db, 'prepared_contents'),
    where('category', '==', 'attraction'),
    where('is_published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  const snapshot = await getDocs(q);
  
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
  const docRef = doc(getDb(), 'prepared_contents', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
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
};

export const toggleLike = async (id: string, userId: string) => {
  console.log(`Like toggled for content: ${id} by user: ${userId}`);
  return { likeCount: 0, isLiked: false };
};
