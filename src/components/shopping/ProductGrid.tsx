import { useState, useMemo } from 'react';
import { Product } from '@/types/shopping';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface FilterOptions {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  onlyFreeShipping: boolean;
  onlyDiscount: boolean;
  onlyNew: boolean;
  sortBy: string;
}

interface ProductGridProps {
  products: Product[];
  filters: FilterOptions;
  wishlist: string[];
  onToggleWish: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  filters,
  onToggleWish,
  onAddToCart,
  wishlist,
  isLoading = false,
}: ProductGridProps) {
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
  }, [products, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse h-96" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">상품이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
          {/* Product Image */}
          <div className="relative w-full aspect-square overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isNew && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
              )}
              {product.isBest && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">BEST</span>
              )}
              {product.discountRate && product.discountRate > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {product.discountRate}% 할인
                </span>
              )}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWish(product.id);
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
              aria-label={wishlist.includes(product.id) ? '위시리스트에서 제거' : '위시리스트에 추가'}
            >
              {wishlist.includes(product.id) ? (
                <span className="text-red-500">♥</span>
              ) : (
                <span className="text-gray-400 hover:text-red-500">♡</span>
              )}
            </button>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-12">
              {product.name}
            </h3>
            
            {/* Price and Add to Cart Button */}
            <div className="mt-3 flex items-center justify-between">
              <div>
                {product.discountRate && product.discountRate > 0 ? (
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-gray-900">
                      {Math.round(product.price * (100 - product.discountRate) / 100).toLocaleString()}원
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {product.price.toLocaleString()}원
                    </span>
                    <span className="ml-2 text-sm font-medium text-red-600">
                      {product.discountRate}% 할인
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                  </span>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    리뷰 {product.reviewCount.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                aria-label="장바구니에 추가"
              >
                🛒
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
