'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  onQueryChange?: (query: string) => void;
  autoFocus?: boolean;
}

export default function SearchBar({ 
  initialQuery = '', 
  className = '',
  onQueryChange,
  autoFocus = false
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  // URL 파라미터와 동기화
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // 검색 실행 함수 (디바운싱 적용)
  const handleSearch = useCallback(
    (query: string) => {
      if (onQueryChange) {
        onQueryChange(query);
      } else {
        const params = new URLSearchParams(searchParams.toString());
        
        if (query.trim()) {
          params.set('q', query.trim());
        } else {
          params.delete('q');
        }
        
        // 페이지 초기화 (검색 시 1페이지로 이동)
        params.delete('page');
        
        const queryString = params.toString();
        const url = queryString ? `/shopping?${queryString}` : '/shopping';
        
        router.push(url, { scroll: false });
      }
    },
    [router, searchParams, onQueryChange]
  );

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 검색 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // 검색어 지우기
  const handleClear = () => {
    setSearchQuery('');
    handleSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            autoComplete="off"
            autoFocus={autoFocus}
            className={`block w-full rounded-lg border-0 py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
            placeholder="상품명, 브랜드, 키워드 검색"
            value={searchQuery}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            aria-label="상품 검색"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="검색어 지우기"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>
      
      {/* 검색어 추천 드롭다운 (선택사항) */}
      {isFocused && false && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {/* 추천 검색어 목록 */}
          <div className="px-4 py-2 text-sm text-gray-500">최근 검색어</div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">스마트폰</div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">이어폰</div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">노트북</div>
        </div>
      )}
    </div>
  );
}
