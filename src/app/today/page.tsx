'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { FortuneData, RecommendedFood } from '@/types';
import { allFoods } from '@/data/foods';

// 특정 메뉴(김치찌개, 꿔바로우, 스테이크)를 반환하는 함수
const getDailyRecommendations = (): RecommendedFood[] => {
  // 원하는 메뉴 이름들
  const targetMenus = ['김치찌개', '꿔바로우', '스테이크'];
  
  // allFoods에서 해당 메뉴들만 필터링
  return allFoods.filter(food => targetMenus.includes(food.name));
};

// 내일의 추천 메뉴 데이터
const tomorrowsRecommendations: RecommendedFood[] = [
  {
    name: '삼계탕',
    description: '여름 보양식으로 최고! 진한 국물과 부드러운 닭고기의 조화',
    imageUrl: 'https://picsum.photos/seed/samgyetang/800/600',
    category: '한식',
  },
  {
    name: '연어 포케볼',
    description: '신선한 연어와 아보카도의 완벽한 조합, 건강한 한끼',
    imageUrl: 'https://picsum.photos/seed/pokebowl/800/600',
    category: '양식',
  },
  {
    name: '마라샹궈',
    description: '중국 사천식 매콤한 훠궈, 특제 소스가 일품',
    imageUrl: 'https://picsum.photos/seed/malaxiangguo/800/600',
    category: '중식',
  },
];

// 운세 데이터는 정적이므로 컴포넌트 외부에 둡니다.
const fortuneData: FortuneData = {
  title: '성공적인 하루의 시작',
  summary: '오늘은 기분 좋은 일들이 가득할 거예요. 작은 성취가 큰 기쁨으로 이어집니다.',
  fullContent:
    '아침에 일어나 창문을 열면 상쾌한 공기가 당신을 맞이할 것입니다. 오늘 하루는 계획했던 일들이 순조롭게 풀리며, 예상치 못한 행운이 찾아올 수 있습니다. 동료와의 협업에서 좋은 아이디어가 떠오를 수 있으니, 열린 마음으로 소통해보세요. 저녁에는 가벼운 산책으로 하루를 마무리하는 것도 좋겠습니다.',
  positiveKeywords: ['성취', '행운', '협업', '상쾌함'],
};

export default function TodayPage() {
  const [recommendedFoods, setRecommendedFoods] = useState<RecommendedFood[]>([]);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행되도록 보장합니다.
    setRecommendedFoods(getDailyRecommendations());
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">오늘 뭐 먹지?</h1>

      {/* 오늘의 운세 섹션 */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">오늘의 운세</h2>
        <p className="text-lg font-bold text-gray-700">{fortuneData.title}</p>
        <p className="text-gray-600 mb-4">{fortuneData.summary}</p>
        <div className="text-gray-500 text-sm leading-relaxed">
          {fortuneData.fullContent}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {fortuneData.positiveKeywords.map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
              #{keyword}
            </span>
          ))}
        </div>
      </section>

      {/* 오늘의 추천 메뉴 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-green-600">오늘의 추천 메뉴</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">오늘의 특별 추천</span>
            <span className="text-green-600 font-medium">김치찌개 • 꿔바로우 • 스테이크</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[320px]">
          {recommendedFoods.length > 0 ? (
            recommendedFoods.map((food, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                  <Image
                    src={food.imageUrl}
                    alt={food.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      {food.category}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{food.description}</p>
                </div>
              </div>
            ))
          ) : (
            // 로딩 중 또는 데이터가 없을 때의 플레이스홀더
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg shadow-md animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 내일의 추천 메뉴 섹션 */}
      <section className="mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-7 w-7 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">내일의 추천 메뉴</h2>
          </div>
          <p className="mt-2 md:mt-0 text-sm text-gray-500">
            내일의 날씨와 기분에 어울리는 특별한 메뉴들을 준비했어요!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tomorrowsRecommendations.map((food, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    추천
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{food.category}</p>
                <p className="mt-1 text-gray-600">{food.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
