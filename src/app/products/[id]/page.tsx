'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Product } from '@/types/shopping';
import { StarIcon, HeartIcon, ArrowLeftIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // URL 파라미터에서 상품 ID 추출 (prod_ 접두사가 없으면 추가)
  const productId = params.id.startsWith('prod_') ? params.id : `prod_${params.id}`;
  
  // 상품 데이터 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRef = doc(firestore, 'products', productId);
        const productSnap = await getDoc(productRef);
        
        if (!productSnap.exists()) {
          throw new Error('상품을 찾을 수 없습니다.');
        }
        
        const productData = { id: productSnap.id, ...productSnap.data() } as Product;
        setProduct(productData);
        
        // 관련 상품 가져오기 (동일 카테고리 상품 중 최대 4개)
        if (productData.category) {
          const relatedQuery = query(
            collection(firestore, 'products'),
            where('category', '==', productData.category),
            where('__name__', '!=', productId),
            limit(4)
          );
          const relatedSnapshot = await getDocs(relatedQuery);
          const related = relatedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          setRelatedProducts(related);
        }
        
      } catch (err) {
        console.error('상품을 불러오는 중 오류가 발생했습니다:', err);
        setError(err instanceof Error ? err.message : '상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // 수량 조절 핸들러
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > (product.stock || 10)) {
      toast.error(`최대 구매 가능 수량은 ${product.stock || 10}개입니다.`);
      return;
    }
    setQuantity(newQuantity);
  };
  
  // 장바구니 추가 핸들러
  const handleAddToCart = () => {
    // TODO: 장바구니 추가 로직 구현
    toast.success('장바구니에 상품을 추가했습니다.');
  };
  
  // 위시리스트 토글 핸들러
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? '위시리스트에서 제거되었습니다.' : '위시리스트에 추가되었습니다.');
  };
  
  // 이미지 갤러리 네비게이션
  const nextImage = () => {
    if (!product) return;
    const images = product.images || [];
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    if (!product) return;
    const images = product.images || [];
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // 로딩 중일 때
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="mt-6 lg:mt-0 space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="flex space-x-4 pt-4">
                <div className="h-12 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 에러 발생 시
  if (error || !product) {
    return (
      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">상품을 불러올 수 없습니다</h1>
          <p className="text-gray-600 mb-6">{error || '요청하신 상품을 찾을 수 없습니다.'}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              이전으로
            </button>
            <Link
              href="/shopping"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-1" />
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // 상품 정보
  const hasDiscount = (product.discountRate ?? 0) > 0;
  const discountPrice = hasDiscount && product.discountRate
    ? Math.round(product.price * (1 - product.discountRate / 100))
    : product.price;
    
  // 이미지 배열 처리 (단일 이미지 URL 또는 이미지 객체 배열 대응)
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [{ url: product.imageUrl || 'https://picsum.photos/800/800?random=1' }];
    
  // 현재 선택된 이미지 URL
  const currentImage = productImages[selectedImage]?.url || 'https://picsum.photos/800/800?random=1';

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* 상품 이미지 */}
          <div className="mb-8 lg:mb-0">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {/* 뱃지 영역 */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {product.isNew && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                )}
                {product.isBest && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">BEST</span>
                )}
                {hasDiscount && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.discountRate}% 할인
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="lg:pl-8">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-gray-600">
                    {product.rating.toFixed(1)}
                    <span className="text-gray-400 ml-1">({product.reviewCount})</span>
                  </span>
                </div>
                {product.isFreeShipping && (
                  <span className="ml-3 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    무료배송
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price.toLocaleString()}원
                </span>
                {hasDiscount && (
                  <>
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      {product.originalPrice?.toLocaleString()}원
                    </span>
                    <span className="ml-2 text-lg font-medium text-red-500">
                      {product.discountRate}% 할인
                    </span>
                  </>
                )}
              </div>
            </div>


            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">상품 설명</h3>
              <div className="mt-4 text-sm text-gray-600 space-y-3">
                <p>{product.description}</p>
                <p>브랜드: {product.brand}</p>
                <p>카테고리: {product.category}</p>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                장바구니에 담기
              </button>
              <button className="flex items-center justify-center p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                {isWishlisted ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" aria-hidden="true" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                )}
                <span className="sr-only">위시리스트에 추가</span>
              </button>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">배송 정보</h3>
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <p>• {product.isFreeShipping ? '무료 배송' : '배송비 별도'}</p>
                <p>• 1-3일 이내 출고 (주말, 공휴일 제외)</p>
                <p>• 제주 및 도서산간 지역은 추가 배송비 발생할 수 있음</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
