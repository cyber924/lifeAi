'use client';

import dynamic from 'next/dynamic';
import { CartProvider } from '@/context/CartContext';

// 동적 임포트로 컴포넌트 로드 (SSR 비활성화)
const Header = dynamic(
  () => import('@/components/layout/Header').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-16 bg-white"></div> }
);

const BottomNavigation = dynamic(
  () => import('@/components/layout/BottomNavigation').then((mod) => mod.default),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-full flex flex-col">
        <Header />
        <main className="flex-grow pb-16">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </CartProvider>
  );
}
