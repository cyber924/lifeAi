import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeAI - 대시보드',
  description: '나만의 AI 라이프 어시스턴트',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pb-16">
            <div className="container mx-auto px-4 py-4">
              {children}
            </div>
          </main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
