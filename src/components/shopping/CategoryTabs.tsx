'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/shopping';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategories: string[];
  className?: string;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategories = [],
  className = '' 
}: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // 현재 선택된 카테고리 목록에서 클릭한 카테고리 토글
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    // URL 파라미터 업데이트
    if (newSelectedCategories.length > 0) {
      params.set('categories', newSelectedCategories.join(','));
    } else {
      params.delete('categories');
    }
    
    // 페이지 초기화 (필터 변경 시 1페이지로 이동)
    params.delete('page');
    
    const queryString = params.toString();
    router.push(`/shopping${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // 모든 카테고리 선택 해제
  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    params.delete('page');
    
    const queryString = params.toString();
    router.push(`/shopping${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // 전체 카테고리 여부 확인
  const isAllCategories = selectedCategories.length === 0;

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* 전체 카테고리 버튼 */}
        <button
          onClick={handleClearAll}
          className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
            isAllCategories 
              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          전체보기
        </button>
        
        {/* 카테고리 목록 */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
              selectedCategories.includes(category.id)
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
