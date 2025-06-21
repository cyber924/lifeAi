import { XMarkIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterOptions {
  categories: string[];
  minPrice: number | '';
  maxPrice: number | '';
  onlyFreeShipping: boolean;
  onlyDiscount: boolean;
  onlyNew: boolean;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  categories,
  filters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md">
            <div className="flex h-full flex-col bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">필터</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-8">
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">카테고리</h3>
                      <div className="mt-2 space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <input
                              id={`category-${category.id}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={filters.categories.includes(category.id)}
                              onChange={(e) => {
                                const newCategories = e.target.checked
                                  ? [...filters.categories, category.id]
                                  : filters.categories.filter((id) => id !== category.id);
                                onFilterChange({ categories: newCategories });
                              }}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">가격 범위</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="min-price" className="block text-sm text-gray-700">
                            최소
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="min-price"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              value={filters.minPrice}
                              onChange={(e) =>
                                onFilterChange({ minPrice: Number(e.target.value) || '' })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="max-price" className="block text-sm text-gray-700">
                            최대
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="max-price"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              value={filters.maxPrice}
                              onChange={(e) =>
                                onFilterChange({ maxPrice: Number(e.target.value) || '' })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">추가 옵션</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="free-shipping"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={filters.onlyFreeShipping}
                            onChange={(e) =>
                              onFilterChange({ onlyFreeShipping: e.target.checked })
                            }
                          />
                          <label
                            htmlFor="free-shipping"
                            className="ml-3 text-sm text-gray-600"
                          >
                            무료 배송만 보기
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="discount"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={filters.onlyDiscount}
                            onChange={(e) =>
                              onFilterChange({ onlyDiscount: e.target.checked })
                            }
                          />
                          <label
                            htmlFor="discount"
                            className="ml-3 text-sm text-gray-600"
                          >
                            할인 상품만 보기
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="new-arrivals"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={filters.onlyNew}
                            onChange={(e) =>
                              onFilterChange({ onlyNew: e.target.checked })
                            }
                          />
                          <label
                            htmlFor="new-arrivals"
                            className="ml-3 text-sm text-gray-600"
                          >
                            신상품만 보기
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 flex justify-between">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onReset}
                >
                  초기화
                </button>
                <button
                  type="button"
                  className="ml-4 rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
