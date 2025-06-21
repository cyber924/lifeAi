'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { HeroSection } from '@/components/home/HeroSection';
import MainPageClient from './components/MainPageClient';
import { FortuneData } from '@/app/actions/fortune';
import { CityWeatherData } from '@/types/weather';

interface HomeContentProps {
  initialData: {
    randomCitiesWeather: CityWeatherData[];
    todaysFortune: FortuneData | null;
  };
}

// 에러 컴포넌트
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6 max-w-md mx-auto">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">문제가 발생했습니다</h2>
        <p className="text-gray-600 mb-4">{error.message || '죄송합니다. 일시적인 오류가 발생했습니다.'}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}

export default function HomeContent({ initialData }: HomeContentProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen flex flex-col">
        <HeroSection />
        <MainPageClient 
          randomCitiesWeather={initialData.randomCitiesWeather}
          todaysFortune={initialData.todaysFortune}
        />
      </div>
    </ErrorBoundary>
  );
}
