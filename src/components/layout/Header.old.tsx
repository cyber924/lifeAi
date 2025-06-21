'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, MapPin, Calendar, Clock, User, Menu, X } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: '여행', href: '/travel' },
  { name: '맛집', href: '/diet' },
  { name: '쇼핑', href: '/shopping' },
  { name: '숙소', href: '/accommodation' },
  { name: '명소', href: '/attraction' },
];

export default function Header() {
  // 현재 날짜와 시간 상태 관리 (클라이언트 사이드에서만 실행)
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const updateDateTime = () => {
      const now = new Date();
      
      // 시간 형식: 오전/오후 hh:mm
      const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // 날짜 형식: YYYY년 MM월 DD일 (요일)
      const dateString = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    // 초기 설정
    updateDateTime();
    
    // 1분마다 시간 업데이트
    const interval = setInterval(updateDateTime, 60000);
    
    // 클린업
    return () => clearInterval(interval);
  }, []);

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 메뉴 토글 핸들러
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 메인 페이지가 아닌 경우 헤더 스타일 변경
  const isMainPage = pathname === '/';

  return (
    <header 
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 & 데스크탑 네비게이션 */}
          <div className="flex items-center">
            {/* 모바일 메뉴 버튼 */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
              >
                <span className="sr-only">메뉴 {isMenuOpen ? '닫기' : '열기'}</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* 로고 */}
            <Link href="/" className="ml-2 flex-shrink-0 md:ml-0">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LifeAI
              </span>
            </Link>

            {/* 데스크탑 네비게이션 */}
            <nav className="ml-6 hidden space-x-8 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 우측 유틸리티 메뉴 */}
          <div className="flex items-center">
            <div className="hidden items-center md:flex md:space-x-6">
              {/* 위치 정보 */}
              <div className="hidden items-center text-sm text-gray-500 lg:flex">
                <MapPin className="mr-1 h-4 w-4" />
                <span>서울시 강남구</span>
              </div>

              {/* 날짜 */}
              <div className="hidden items-center text-sm text-gray-500 xl:flex">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{currentDate}</span>
              </div>

              {/* 시간 */}
              <div className="hidden items-center text-sm text-gray-500 xl:flex">
                <Clock className="mr-1 h-4 w-4" />
                <span>{currentTime}</span>
              </div>

              {/* 알림 버튼 */}
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="sr-only">알림 보기</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* 프로필 버튼 */}
              <div className="relative ml-2">
                <button
                  type="button"
                  className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">프로필 메뉴 열기</span>
                  <User className="h-8 w-8 rounded-full text-gray-400" />
                </button>
              </div>
            </div>

            {/* 모바일 검색 버튼 */}
            <div className="ml-4 flex md:hidden">
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
              >
                <span className="sr-only">검색</span>
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 rounded-full text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">로그인 해주세요</div>
                <div className="text-xs text-gray-500">서비스를 모두 이용하려면 로그인하세요</div>
              </div>
            </div>
          </div>
        </div>
      )}
        
        {/* 모바일 검색창 */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="검색어를 입력하세요..." 
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
