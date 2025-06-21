'use client';

import { useEffect, useState } from 'react';
import DietRecommendation from '@/components/diet/DietRecommendation';
import { DietRecommendation as DietType, generateDummyDietRecommendations } from '@/types/diet';

export default function DietRecommendationPage() {
  const [recommendations, setRecommendations] = useState<DietType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출 대신 더미 데이터 사용
    const dummyData = generateDummyDietRecommendations();
    setRecommendations(dummyData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🍽️ 오늘의 맞춤 식단 추천</h1>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">안녕하세요! 오늘의 추천 메뉴에요 👋</h2>
          <p className="text-gray-600 mb-6">
            당신의 선호도를 고려한 맞춤 식단을 준비했어요.
            마음에 드는 메뉴를 선택해 상세 레시피를 확인해보세요!
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              선호도: 한식 70%, 양식 30%
            </span>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-yellow-100 text-yellow-800 p-2 rounded-full mr-2">🔥</span>
            인기 추천 메뉴
          </h2>
          <DietRecommendation recommendations={recommendations} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-2">💡</span>
              오늘의 건강 팁
            </h3>
            <p className="text-gray-700 mb-4">
              아침 식사를 거르지 마세요! 아침 식사는 하루 에너지의 시작점입니다.
              단백질이 풍부한 아침 식사가 하루 종일의 혈당 조절에 도움이 됩니다.
            </p>
            <button className="text-blue-600 hover:underline text-sm">
              더 많은 건강 팁 보기 →
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-green-100 text-green-800 p-2 rounded-full mr-2">📱</span>
              식단 기록하고 포인트 받기
            </h3>
            <p className="text-gray-700 mb-4">
              오늘의 식단을 기록하고 건강한 습관을 만들어보세요.
              7일 연속 기록 시 500포인트를 드립니다!
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
              식단 기록 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
