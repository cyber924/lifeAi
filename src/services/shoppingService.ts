import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase-client';
import { Product, Category } from '@/types/shopping';

// Use the client-side Firestore instance
const db = firestore;

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

// 상품 목록 가져오기
export const getProducts = async ({
  categoryId = null,
  limitCount = 10,
  lastVisible = null,
  sortBy = 'createdAt',
  sortDirection = 'desc',
}: {
  categoryId?: string | null;
  limitCount?: number;
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
} = {}) => {
  try {
    let q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy(sortBy, sortDirection)
    );

    // 카테고리 필터 적용
    if (categoryId) {
      q = query(q, where('categoryIds', 'array-contains', categoryId));
    }

    // 페이지네이션 적용
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    q = query(q, limit(limitCount));

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return { products, lastDoc };
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// 카테고리 목록 가져오기
export const getCategories = async () => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
      } as Category);
    });

    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// 상품 상세 정보 가져오기
export const getProductById = async (productId: string) => {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), where('id', '==', productId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    } as Product;
  } catch (error) {
    console.error('Error getting product by id:', error);
    throw error;
  }
};
