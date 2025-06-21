import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    isFreeShipping: boolean;
    discountRate?: number;
    isNew?: boolean;
    rating: number;
    reviewCount: number;
    isWishlist?: boolean;
  };
  onWishlistToggle: (id: string) => void;
}

export default function ProductCard({ product, onWishlistToggle }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={product.image || 'https://picsum.photos/300/300'}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          priority
        />
        {product.discountRate && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discountRate}% 할인
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle(product.id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label={product.isWishlist ? '위시리스트에서 제거' : '위시리스트에 추가'}
        >
          {product.isWishlist ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={`/product/${product.id}`} className="hover:underline">
              {product.name}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <svg
                key={rating}
                className={`h-4 w-4 ${
                  rating <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {product.discountRate ? (
              <>
                <span className="line-through text-gray-400 mr-2">
                  {product.price.toLocaleString()}원
                </span>
                <span className="text-red-600">
                  {Math.round(product.price * (1 - product.discountRate / 100)).toLocaleString()}원
                </span>
              </>
            ) : (
              <>{product.price.toLocaleString()}원</>
            )}
          </p>
          {product.isFreeShipping && (
            <p className="text-xs text-blue-600">무료 배송</p>
          )}
        </div>
      </div>
    </div>
  );
}
