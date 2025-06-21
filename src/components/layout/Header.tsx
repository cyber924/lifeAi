'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  name: string;
  href: string;
}

// 요청하신 대로 메뉴 항목만 남김
const NAV_ITEMS: NavItem[] = [
  { name: '숙소', href: '/accommodation' },
  { name: '식단', href: '/diet' },
  { name: '추천 1박2일', href: '/recommendation' },
  { name: '명소', href: '/attraction' },
  { name: '쇼핑', href: '/shopping' },
];

const Header = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 클라이언트 사이드에서만 실행되도록 설정
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 쇼핑 페이지 여부 확인
  const isShoppingPage = pathname?.startsWith('/shopping');

  // 스크롤 이벤트 핸들러 - isClient로 안전하게 처리
  useEffect(() => {
    // 클라이언트가 아니면 실행하지 않음
    if (!isClient) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);
  
  // 서버 사이드 렌더링 시에는 빈 헤더만 렌더링
  if (!isClient) {
    return <div className="h-16 bg-white"></div>;
  }
  
  // 네비게이션 아이템에 활성 상태 추가 (쇼핑 페이지에서는 비활성화)
  const navItems = NAV_ITEMS.map(item => ({
    ...item,
    isActive: !isShoppingPage && (pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/')),
  }));

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
        isShoppingPage 
          ? 'bg-white/90 backdrop-blur-sm shadow-md' 
          : `bg-white/80 backdrop-blur-sm ${isScrolled ? 'shadow-md' : 'shadow-sm'}`
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">LifeAI</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 토글 버튼 */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="메뉴 토글"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
