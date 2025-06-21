import { XMarkIcon } from '@heroicons/react/24/outline';
import { Category, FilterOptions } from '@/types/shopping';
import { useEffect, useRef } from 'react';

interface FilterSidebarProps {
  categories: Category[];
  filters: Omit<FilterOptions, 'categories'> & { categories: string[] };
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onReset,
  isMobile = false,
  onClose,
}: FilterSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 모바일에서 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isMobile || !onClose) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isMobile || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, onClose]);

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    onFilterChange({ categories: newCategories });
  };

  const handleReset = () => {
    onReset();
    // 모바일에서는 필터 초기화 후 자동으로 닫기
    if (isMobile && onClose) {
      setTimeout(onClose, 300);
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`bg-white ${isMobile ? 'fixed inset-0 z-50 overflow-y-auto p-4' : 'w-48 pr-4'}`}
      role="dialog"
      aria-modal={isMobile}
    >
      {isMobile && (
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4 pt-2">
          <h2 className="text-lg font-medium text-gray-900">필터</h2>
          <button 
            onClick={onClose} 
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="닫기"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* 카테고리 필터 */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">카테고리</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 -mr-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center py-1">
                <input
                  id={`category-${category.id}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  aria-label={`${category.name} 필터`}
                />
                <label 
                  htmlFor={`category-${category.id}`} 
                  className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 필터 초기화 버튼 */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 -mx-4 px-4">
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            필터 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
