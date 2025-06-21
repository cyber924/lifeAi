'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams, useSearchParams as useSearchParamsNext } from 'next/navigation';
import { XMarkIcon, ArrowPathIcon, ExclamationTriangleIcon, ShoppingBagIcon, FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { ErrorBoundary } from 'react-error-boundary';
import { collection, query, where, orderBy, limit, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Category, FilterOptions } from '@/types/shopping';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// ClientLayout을 동적으로 로드 (SSR 비활성화)
const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout').then((mod) => mod.default),
  { ssr: false }
);

// 동적 임포트를 사용하여 클라이언트 컴포넌트 로드
const ProductGrid = dynamic(() => import('@/components/shopping/ProductGrid'), { ssr: false });
const FilterSidebar = dynamic(() => import('@/components/shopping/FilterSidebar'), { ssr: false });
const ShoppingHeader = dynamic(() => import('@/components/shopping/NewShoppingHeader'), { ssr: false });

// 에러 폴백 컴포넌트
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            문제가 발생했습니다.
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={resetErrorBoundary}
              className="rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 상품 목록 컴포넌트를 분리하여 메모이제이션
const ProductList = ({ 
  products, 
  filters, 
  wishlist, 
  onWishlistToggle 
}: { 
  products: Product[]; 
  filters: FilterOptions; 
  wishlist: string[]; 
  onWishlistToggle: (id: string) => void;
}) => {
  // 상품 필터링 및 정렬 로직을 useMemo로 최적화
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // 카테고리 필터
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // 가격 범위 필터
    result = result.filter(
      product => 
        product.price >= (filters.minPrice || 0) && 
        product.price <= (filters.maxPrice || Number.MAX_SAFE_INTEGER)
    );
    
    // 추가 필터 옵션
    if (filters.onlyFreeShipping) {
      result = result.filter(product => product.isFreeShipping);
    }
    
    if (filters.onlyDiscount) {
      result = result.filter(product => product.discountRate && product.discountRate > 0);
    }
    
    if (filters.onlyNew) {
      result = result.filter(product => product.isNew);
    }
    
    // 정렬
    return [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return 0; // 더미 데이터에서는 정확한 날짜가 없으므로 임시 처리
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [filters, products]);

  // 장바구니 기능 사용
  const { addToCart } = useCart();

  // 상품 추가 핸들러
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
    toast.success('장바구니에 상품이 추가되었습니다', {
      position: 'bottom-center',
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }, [addToCart]);

  return (
    <ProductGrid 
      products={filteredProducts} 
      filters={filters}
      wishlist={wishlist} 
      onToggleWish={onWishlistToggle}
      onAddToCart={handleAddToCart}
    />
  );
};

// URL 파라미터를 상태로 변환하는 함수
const parseURLParams = (searchParams: URLSearchParams): Partial<FilterOptions> => {
  const params = {
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000000,
    sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'popular',
    onlyFreeShipping: searchParams.get('freeShipping') === 'true',
    onlyDiscount: searchParams.get('discount') === 'true',
    onlyNew: searchParams.get('new') === 'true',
  };
  
  // 디버깅을 위한 로그
  console.log('URL 파라미터 파싱 결과:', params);
  return params;
};

// 메인 쇼핑 페이지 컴포넌트
function ShoppingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // 클라이언트 사이드에서만 실행되도록 처리
  useEffect(() => {
    setIsClient(true);
    // 로컬 스토리지에서 위시리스트 불러오기
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('위시리스트 파싱 오류:', e);
        setWishlist([]);
      }
    }
  }, []);

  // Firestore에서 상품 데이터 가져오기
  const fetchProducts = useCallback(async () => {
    if (!isClient) return;
    
    try {
      setIsProductsLoading(true);
      setError(null);
      console.log('상품 데이터를 불러오는 중...');
      
      const productsRef = collection(db, 'products');
      // isActive 필터 제거 (모든 상품 조회)
      const q = query(productsRef);
      const querySnapshot = await getDocs(q);
      
      console.log(`총 ${querySnapshot.size}개의 상품을 찾았습니다.`);
      
      const productsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`상품 ID: ${doc.id}`, data);
        return {
          id: doc.id,
          name: data.name || '이름 없음',
          price: Number(data.price) || 0,
          originalPrice: Number(data.originalPrice) || Number(data.price) || 0,
          discountRate: Number(data.discountRate) || 0,
          rating: Number(data.rating) || 0,
          reviewCount: Number(data.reviewCount) || 0,
          isFreeShipping: Boolean(data.isFreeShipping),
          isNew: Boolean(data.isNew),
          isBest: Boolean(data.isBest),
          category: data.category || '기타',
          imageUrl: data.imageUrl || '/images/placeholder-product.png',
          description: data.description || '',
          brand: data.brand || '',
        } as Product;
      });
      
      console.log('가공된 상품 데이터:', productsData);
      setProducts(productsData);
    } catch (err) {
      console.error('상품을 불러오는 중 오류가 발생했습니다:', err);
      setError('상품을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsProductsLoading(false);
      setIsLoading(false);
    }
  }, [isClient]);

  // Firestore에서 카테고리 데이터 가져오기
  const fetchCategories = useCallback(async () => {
    if (!isClient) return;
    
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      // 카테고리 데이터가 없을 경우 기본 카테고리 생성
      let categoriesData: Category[] = [];
      
      if (querySnapshot.empty) {
        console.log('카테고리 데이터가 없어 기본 카테고리를 생성합니다.');
        categoriesData = [
          { id: '1', name: '전체', icon: '⭐' },
          { id: '2', name: '의류', icon: '👕' },
          { id: '3', name: '가전', icon: '📱' },
          { id: '4', name: '식품', icon: '🍎' },
          { id: '5', name: '생활용품', icon: '🏠' },
        ];
      } else {
        categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || '카테고리',
          icon: doc.data().icon || '📦',
        }));
      }
      
      setCategories(categoriesData);
    } catch (err) {
      console.error('카테고리를 불러오는 중 오류가 발생했습니다:', err);
      setError('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
    };
    
    loadData();
  }, [fetchProducts, fetchCategories]);

  // URL에서 초기 상태 파싱
  const initialFilters = useMemo(() => 
    parseURLParams(new URLSearchParams(searchParams.toString()))
  , [searchParams.toString()]);

  // 필터 상태 초기화
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: 'popular',
    onlyFreeShipping: false,
    onlyDiscount: false,
    onlyNew: false,
    ...initialFilters,
  });

  // URL 업데이트 함수
  const updateURL = useCallback((newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams();
    
    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','));
    }
    
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.onlyFreeShipping) params.set('freeShipping', 'true');
    if (newFilters.onlyDiscount) params.set('discount', 'true');
    if (newFilters.onlyNew) params.set('new', 'true');
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/shopping';
    
    // 현재 URL과 다를 때만 라우터 업데이트
    if (window.location.search !== `?${queryString}`) {
      router.push(newUrl, { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, updateURL]);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters(prev => !prev);
  }, []);

  const handleSortChange = useCallback((sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);

    params.delete('page');

    const queryString = params.toString();
    router.push(`/shopping${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router, searchParams]);

  const handleFilterChange = useCallback((newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.categories) {
      if (newFilters.categories.length > 0) {
        params.set('categories', newFilters.categories.join(','));
      } else {
        params.delete('categories');
      }
    }

    if (newFilters.minPrice !== undefined) {
      params.set('minPrice', newFilters.minPrice.toString());
    }

    if (newFilters.maxPrice !== undefined) {
      params.set('maxPrice', newFilters.maxPrice.toString());
    }

    if (newFilters.onlyFreeShipping !== undefined) {
      params.set('freeShipping', newFilters.onlyFreeShipping.toString());
    }

    if (newFilters.onlyDiscount !== undefined) {
      params.set('discount', newFilters.onlyDiscount.toString());
    }

    if (newFilters.onlyNew !== undefined) {
      params.set('new', newFilters.onlyNew.toString());
    }

    params.delete('page');

    const queryString = params.toString();
    router.push(`/shopping${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router, searchParams]);

  const resetFilters = useCallback(() => {
    router.push('/shopping', { scroll: false });
  }, [router]);

  const handleWishlistToggle = useCallback((productId: string) => {
    if (!isClient) return;

    setWishlist(prev => {
      const newWishlist = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];

      try {
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      } catch (e) {
        console.error('로컬 스토리지 저장 오류:', e);
      }

      toast.success(
        prev.includes(productId)
          ? '위시리스트에서 제거되었습니다.'
          : '위시리스트에 추가되었습니다.',
        {
          position: 'bottom-center',
          icon: '❤️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );

      return newWishlist;
    });
  }, [isClient]);

  const { addToCart } = useCart();

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
    toast.success('장바구니에 상품이 추가되었습니다', {
      position: 'bottom-center',
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }, [addToCart]);

  const selectedCategoryIds = useMemo(() => {
    return Array.isArray(filters.categories) ? filters.categories : [];
  }, [filters.categories]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">상품을 불러오는 중입니다...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">오류 발생</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setError(null);
                fetchProducts();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return (
      <ProductList
        products={products}
        filters={filters}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ShoppingHeader
        categories={categories}
        selectedCategories={selectedCategoryIds}
        sortBy={filters.sortBy}
        onSortChange={handleSortChange}
        onFilterToggle={toggleMobileFilters}
        className="sticky top-0 z-30 border-b border-gray-200 bg-white"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              isMobile={false}
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          <div className="flex-1">
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                setError(null);
                fetchProducts();
              }}
            >
              {renderContent()}
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <FilterSidebar
          isMobile={true}
          onClose={toggleMobileFilters}
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
      )}

      {isProductsLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-700">상품을 불러오는 중입니다...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShoppingPageWrapper() {
  return (
    <ClientLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ShoppingPage />
      </ErrorBoundary>
    </ClientLayout>
  );
}
