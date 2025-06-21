import React from 'react';
import Link from 'next/link';
import { Utensils } from 'lucide-react';

const foodRecommendations = [
  { id: 1, name: '삼겹살 구이', category: '한식', image: 'https://picsum.photos/300/200?food1' },
  { id: 2, name: '마라탕', category: '중식', image: 'https://picsum.photos/300/200?food2' },
  { id: 3, name: '규카츠', category: '일식', image: 'https://picsum.photos/300/200?food3' },
];

const TodayFoodSection = () => {
  const randomFood = foodRecommendations[Math.floor(Math.random() * foodRecommendations.length)];

  return (
    <div className="h-full">
      <div className="flex items-center mb-4 px-4 pt-4">
        <Utensils className="w-5 h-5 mr-2 text-orange-500" />
        <h2 className="text-lg font-semibold">오늘 뭐먹지?</h2>
      </div>
      
      <div className="relative overflow-hidden h-40 bg-gray-100">
        <img 
          src={randomFood.image} 
          alt={randomFood.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className="text-xs text-white bg-orange-500 px-2 py-1 rounded-full">
            {randomFood.category}
          </span>
          <h3 className="text-white font-medium mt-1">{randomFood.name}</h3>
        </div>
      </div>
      
      <Link href="/diet" className="block text-sm text-blue-500 hover:underline flex items-center justify-end p-4">
        더 많은 추천 보기
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default TodayFoodSection;
