'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Heart, User, PlusCircle } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { 
      name: '홈', 
      icon: Home, 
      href: '/',
      active: pathname === '/'
    },
    { 
      name: '식단', 
      icon: Utensils, 
      href: '/diet',
      active: pathname?.startsWith('/diet')
    },
    {
      name: '추가',
      icon: PlusCircle,
      href: '/add',
      active: false,
      isAction: true
    },
    { 
      name: '즐겨찾기', 
      icon: Heart, 
      href: '/favorites',
      active: pathname?.startsWith('/favorites')
    },
    { 
      name: '내 정보', 
      icon: User, 
      href: '/profile',
      active: pathname?.startsWith('/profile')
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1 text-blue-500">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                item.active ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
