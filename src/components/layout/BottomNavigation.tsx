'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Hotel, MapPin, ShoppingBag, Utensils, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '숙소', href: '/accommodation', icon: Hotel },
  { name: '명소', href: '/attraction', icon: MapPin },
  { name: '쇼핑', href: '/shopping', icon: ShoppingBag },
  { name: '맛집', href: '/restaurants', icon: Utensils },
  { name: '여행', href: '/travel', icon: Plane },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // 클라이언트 사이드에서만 실행되도록 함
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 서버 사이드 렌더링 시 또는 /shopping 경로일 때는 렌더링하지 않음
  if (!isClient || pathname?.startsWith('/shopping')) {
    return null;
  }

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="flex h-16 items-center justify-around px-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-1 flex-col items-center justify-center p-1 text-[10px] font-medium ${
              isActive(item.href) ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon 
              className={`h-5 w-5 ${isActive(item.href) ? 'text-indigo-600' : 'text-gray-500'}`} 
            />
            <span className="mt-0.5">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
