import Image from 'next/image';
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '@/types/shopping';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleWish: (productId: string) => void;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWish,
  isWishlisted,
}: ProductCardProps) {
  const hasDiscount = product.discountRate && product.discountRate > 0;
  
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* 상품 이미지 */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* 뱃지 영역 */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
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
        
        {/* 찜하기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWish(product.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          aria-label={isWishlisted ? '위시리스트에서 제거' : '위시리스트에 추가'}
        >
          {isWishlisted ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>
      
      {/* 상품 정보 */}
      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {product.rating.toFixed(1)}
              <span className="text-gray-400 ml-1">({product.reviewCount})</span>
            </span>
          </div>
          {product.isFreeShipping && (
            <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              무료배송
            </span>
          )}
        </div>
        
        <h3 className="font-medium text-gray-900 line-clamp-2 h-12">
          {product.name}
        </h3>
        
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString()}원
            </span>
            {hasDiscount && (
              <>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {product.originalPrice?.toLocaleString()}원
                </span>
                <span className="ml-2 text-sm font-medium text-red-500">
                  {product.discountRate}% 할인
                </span>
              </>
            )}
          </div>
        </div>
        
        <a
          href={`/products/${product.id.replace('prod_', '')}`}
          className="mt-3 block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          상세보기
        </a>
      </div>
    </div>
  );
}
