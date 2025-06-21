'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunnelIcon, XMarkIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSticky, setIsSticky] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // 스크롤 이벤트 핸들러 - 스티키 헤더 처리
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 검색 바 토글
  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch(prev => !prev);
  }, []);

  // URL 업데이트 핸들러 (SearchBar의 내부 검색 로직을 대체)
  const updateSearchQuery = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    
    // 페이지 초기화 (검색 시 1페이지로 이동)
    params.delete('page');
    
    const queryString = params.toString();
    const newUrl = `/shopping${queryString ? `?${queryString}` : ''}`;
    
    // URL만 업데이트 (SearchBar가 내부적으로 라우팅을 처리하므로 여기서는 URL만 동기화)
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
    
    // 모바일에서 검색 후 검색바 닫기
    if (showMobileSearch) {
      setShowMobileSearch(false);
    }
  }, [searchParams, showMobileSearch]);

  return (
    <div className={`bg-white ${className} sticky top-0 z-10`}>
      {/* 데스크톱 헤더 */}
      <div className="hidden md:block">
        <div className={`py-4 transition-all duration-200 ${isSticky ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-6">
              {/* 로고 */}
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">LifeAI Shop</h1>
              </div>
              
              {/* 검색 바 */}
              <div className="flex-1 max-w-2xl">
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
                    className="w-48"
                    buttonClassName="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={onFilterToggle}
                  className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategories.length > 0 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 hover:bg-indigo-200' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                  aria-label="필터"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                  <span>필터</span>
                  {selectedCategories.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* 카테고리 탭 */}
            <div className="mt-2">
              <CategoryTabs 
                categories={categories} 
                selectedCategories={selectedCategories}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 모바일 헤더 */}
      <div className="md:hidden">
        <div className={`sticky top-0 z-40 bg-white transition-shadow ${isSticky ? 'shadow-sm' : ''}`}>
          {/* 상단 바 */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-900">쇼핑</h1>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={toggleMobileSearch}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="검색"
              >
                {showMobileSearch ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={onFilterToggle}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="필터"
              >
                <FunnelIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          {/* 모바일 검색 바 */}
          {showMobileSearch && (
            <div className="w-full">
              <SearchBar 
                initialQuery={searchParams.get('q') || ''} 
                autoFocus
                onQueryChange={updateSearchQuery}
              />
            </div>
          )}
          
          {/* 모바일 정렬 및 카테고리 */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex-1 mr-2">
                <SortOptions 
                  sortBy={sortBy} 
                  onChange={onSortChange}
                  className="w-full"
                />
              </div>
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-500">
                  {selectedCategories.length > 0 
                    ? `${selectedCategories.length}개 필터 적용`
                    : '필터 적용 안 됨'}
                </span>
              </div>
            </div>
            
            <div className="px-4 pb-2 overflow-x-auto">
              <CategoryTabs 
                categories={categories} 
                selectedCategories={selectedCategories}
                className="pb-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
