import { Product, Category } from '@/types/shopping';

export const categories: Category[] = [
  { id: 'smartphone', name: '스마트폰', icon: '📱' },
  { id: 'laptop', name: '노트북/태블릿', icon: '💻' },
  { id: 'audio', name: '이어폰/헤드폰', icon: '🎧' },
  { id: 'watch', name: '스마트워치', icon: '⌚' },
  { id: 'accessory', name: '액세서리', icon: '🔌' },
  { id: 'charger', name: '충전기/케이블', icon: '🔋' },
];

const brands = ['삼성', '애플', 'LG', '샤오미', '소니', '보스', '제닉스', '기타'];

const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.floor(Math.random() * 500000) + 10000;
    const discountRate = Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0;
    const originalPrice = discountRate > 0 ? Math.round(price / (1 - discountRate / 100)) : price;
    const rating = Number((Math.random() * 3 + 2).toFixed(1));
    const reviewCount = Math.floor(Math.random() * 1000);

    return {
      id: `prod_${i + 1}`,
      name: `${category.name} ${brands[Math.floor(Math.random() * brands.length)]} ${i + 1000}`,
      price,
      originalPrice: discountRate > 0 ? originalPrice : undefined,
      discountRate: discountRate > 0 ? discountRate : undefined,
      imageUrl: `https://picsum.photos/seed/product-${i + 1}/800/800`,
      rating,
      reviewCount,
      category: category.name,
      isFreeShipping: Math.random() > 0.3,
      isNew: Math.random() > 0.7,
      isBest: Math.random() > 0.8,
      description: '이 제품은 더미 데이터로 생성된 상품 설명입니다.',
      brand: brands[Math.floor(Math.random() * brands.length)],
    };
  });
};

// 12개의 상품만 생성
export const products: Product[] = generateProducts(12);

// 상품 ID 목록을 내보내서 상세 페이지 생성에 사용
export const productIds = products.map(product => product.id);
