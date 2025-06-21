ring, string> = {
  '숙소': '🏨',
  '명소': '🏞️',
  '여행': '✈️',
  '쇼핑': '🛍️',
  '맛집': '🍽️'
};

// 기본 카테고리 목록 (로딩 중이거나 에러 시 사용)
const defaultCategories = ['숙소', '명소', '여행', '쇼핑'];

export function Navigation() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('Navigation rendered with pathname:', pathname);

  useEffect(() => {
    console.log('Fetching categories on component mount...');
    let isMounted = true;
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!isMounted) return;
        
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          console.log('Categories loaded successfully:', data.data);
          setCategories(data.data);
        } else {
          console.warn('No categories found, using defaults');
          setCategories(defaultCategories);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching categories:', err);
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
        setCategories(defaultCategories);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();
    
    return () => {
      isMounted = false;
    };
  }, []); // 빈 배열로 변경하여 최초 마운트 시에만 실행

  // 카테고리 메뉴 항목 생성
  const categoryNavItems: NavItem[] = categories.map((category, index) => ({
    id: `cat-${index}`,
    title: category,
    icon: (active: boolean) => (
      <span className={`text-2xl ${active ? '' : 'opacity-70'}`}>
        {categoryIcons[category] || '📌'}
      </span>
    ),
    href: `/${encodeURIComponent(category)}`,
    category
  }));

  // 정적 메뉴와 카테고리 메뉴 결합
  const navItems = [...staticNavItems, ...categoryNavItems];
  
  // 로딩 중이거나 에러가 있을 때 표시할 UI
  if (isLoading) {
    return <div className="h-16"></div>; // 로딩 중에는 빈 공간 유지
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-t border-gray-200 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 min-w-max">
          {navItems.map((item) => {
            const isActive = Boolean(
              pathname === item.href || 
              (item.category && pathname.startsWith(`/${encodeURIComponent(item.category)}`))
            );
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 text-gray-500 hover:text-purple-600 transition-colors ${isActive ? 'text-purple-600' : ''}`}
              >
                {item.icon(isActive)}
                <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : ''}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  title: string;
  icon: (active: boolean) => React.ReactNode;
  href: string;
  category?: string;
}

// 정적 메뉴 항목 (고정)
const staticNavItems: NavItem[] = [
  { id: 'home', title: '홈', icon: (active) => <span className={`text-2xl ${active ? '' : 'opacity-70'}`}>🏠</span>, href: '/' },
  { id: 'recommend', title: '추천', icon: (active) => <span className={`text-2xl ${active ? '' : 'opacity-70'}`}>⭐</span>, href: '/recommend' }
];

// 카테고리 아이콘 맵핑
const categoryIcons: Record<st