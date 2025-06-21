'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Category } from '@/types/shopping';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import SortOptions from './SortOptions';

interface ShoppingHeaderProps {
  categories: Category[];
  selectedCategories: string[];
  sortBy: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  onSortChange: (sortBy: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating') => void;
  onFilterToggle: () => void;
  className?: string;
}

export default function ShoppingHeader({
  categories,
  selectedCategories,
  sortBy,
  onSortChange,
  onFilterToggle,
  className = '',
}: ShoppingHeaderProps) {
  const searchParams = useSearchParams();
  const [isSticky, setIsSticky] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch(prev => !prev);
  }, []);

  const updateSearchQuery = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    
    params.delete('page');
    
    const queryString = params.toString();
    const newUrl = `/shopping${queryString ? `?${queryString}` : ''}`;
    
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
    
    if (showMobileSearch) {
      setShowMobileSearch(false);
    }
  }, [searchParams, showMobileSearch]);

  return (
    <div className={`bg-white ${className}`}>
      <div className={`py-4 transition-all duration-200 border-b ${isSticky ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-6">
            <div className="hidden md:block flex-1 max-w-2xl">
              <SearchBar 
                initialQuery={searchParams.get('q') || ''} 
                className="w-full"
                onQueryChange={updateSearchQuery}
              />
            </div>
            
            {/* 정렬 및 필터 버튼 */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <SortOptions 
                  sortBy={sortBy} 
                  onChange={onSortChange}
                />
              </div>
              <button
                onClick={onFilterToggle}
                className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5" />
                <span className="hidden sm:inline">필터</span>
              </button>
              
              {/* 모바일 검색 버튼 */}
              <button
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                aria-label="검색"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* 모바일 검색 바 */}
          {showMobileSearch && (
            <div className="mt-3 md:hidden">
              <SearchBar 
                initialQuery={searchParams.get('q') || ''} 
                className="w-full"
                onQueryChange={updateSearchQuery}
                autoFocus
              />
            </div>
          )}
          
          {/* 카테고리 탭 */}
          <div className="mt-4">
            <CategoryTabs 
              categories={categories}
              selectedCategories={selectedCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
