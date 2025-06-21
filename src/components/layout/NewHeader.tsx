'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, MapPin, Calendar, Clock, User, Menu, X, Cloud, CloudRain, CloudSun, Sun, CloudLightning, CloudSnow, CloudFog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWeather } from '@/context/WeatherContext';

interface NavItem {
  name: string;
  href: string;
  isActive?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: '추천 1박2일', href: '/recommend/1night-2days' },
  { name: '여행', href: '/travel' },
  { name: '숙소', href: '/accommodation' },
  { name: '명소', href: '/attraction' },
  { name: '식단', href: '/diet' },
  { name: '쇼핑', href: '/shopping' },
];

// 날씨 아이콘 렌더링 함수
const renderWeatherIcon = (iconCode?: string) => {
  if (!iconCode) return <Cloud className="w-5 h-5" />;
  
  const baseIconProps = { className: 'w-5 h-5' };
  
  // 날씨 코드에 따라 아이콘 반환
  switch (iconCode.slice(0, 2)) {
    case '01': // clear sky
      return <Sun {...baseIconProps} />;
    case '02': // few clouds
      return <CloudSun {...baseIconProps} />;
    case '03': // scattered clouds
    case '04': // broken clouds
      return <Cloud {...baseIconProps} />;
    case '09': // shower rain
    case '10': // rain
      return <CloudRain {...baseIconProps} />;
    case '11': // thunderstorm
      return <CloudLightning {...baseIconProps} />;
    case '13': // snow
      return <CloudSnow {...baseIconProps} />;
    case '50': // mist
      return <CloudFog {...baseIconProps} />;
    default:
      return <Cloud {...baseIconProps} />;
  }
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 날짜와 시간을 업데이트하는 함수
  const updateDateTime = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const now = new Date();
    
    // Time format: 오전/오후 hh:mm
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Date format: YYYY년 MM월 DD일 (요일)
    const dateString = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
    
    setCurrentTime(timeString);
    setCurrentDate(dateString);
  }, []);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // 컴포넌트 마운트 시 날짜/시간 설정 및 1분마다 업데이트
  useEffect(() => {
    setIsMounted(true);
    updateDateTime();
    
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, [updateDateTime]);

  // 서버 사이드 렌더링 시 window 객체 접근 방지
  if (!isMounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* 상단 정보 바 */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* 왼쪽 로고/브랜드 */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                LifeAI
              </Link>
            </div>

            {/* 오른쪽 정보 영역 */}
            <div className="flex items-center space-x-6">
              {/* 위치 정보 */}
              <div className="hidden items-center text-sm text-gray-500 xl:flex">
                <MapPin className="mr-1 h-4 w-4" />
                <span>서울시 강남구</span>
              </div>
              
              {/* 날씨 정보 */}
              {weather && !weatherError && (
                <div className="hidden md:flex items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    {renderWeatherIcon(weather.weather[0]?.icon)}
                    <span className="ml-1">{Math.round(weather.main.temp)}°C</span>
                  </div>
                </div>
              )}
              {weatherLoading && !weather && (
                <div className="hidden md:block animate-pulse h-5 w-16 bg-gray-200 rounded"></div>
              )}
              {weatherError && (
                <div className="hidden md:block text-xs text-red-500">날씨 불러오기 실패</div>
              )}

              {/* 날짜 및 시간 */}
              <div className="hidden items-center text-sm text-gray-500 md:flex">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{currentDate}</span>
              </div>
              <div className="hidden items-center text-sm text-gray-500 md:flex">
                <Clock className="mr-1 h-4 w-4" />
                <span>{currentTime}</span>
              </div>

              {/* 알림 및 사용자 메뉴 */}
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 바 */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* 모바일 메뉴 버튼 */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex md:space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith(item.href)
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* 검색 바 */}
            <div className="flex flex-1 items-center justify-center px-2 md:ml-6 md:justify-end">
              <div className="w-full max-w-lg lg:max-w-xs">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname.startsWith(item.href)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
