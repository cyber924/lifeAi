export interface ProductImage {
  url: string;
  alt?: string;
  isMain?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  imageUrl: string; // Legacy single image URL
  images?: ProductImage[]; // Array of product images
  rating: number;
  reviewCount: number;
  category: string;
  isFreeShipping: boolean;
  isNew: boolean;
  isBest: boolean;
  description?: string;
  details?: string;
  brand?: string;
  stock?: number;
  sku?: string;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface FilterOptions {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  onlyFreeShipping: boolean;
  onlyDiscount: boolean;
  onlyNew: boolean;
}

export interface ShoppingState {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
}
