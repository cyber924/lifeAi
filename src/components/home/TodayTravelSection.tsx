import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const travelRecommendations = [
  { 
    id: 1, 
    name: '제주도 한라산', 
    location: '제주특별자치도', 
    category: '자연',
    image: 'https://picsum.photos/300/200?travel1' 
  },
  { 
    id: 2, 
    name: '경주 불국사', 
    location: '경상북도 경주시', 
    category: '역사',
    image: 'https://picsum.photos/300/200?travel2' 
  },
  { 
    id: 3, 
    name: '부산 광안리 해수욕장', 
    location: '부산광역시 수영구', 
    category: '휴양',
    image: 'https://picsum.photos/300/200?travel3' 
  },
];

const TodayTravelSection = () => {
  const randomTravel = travelRecommendations[Math.floor(Math.random() * travelRecommendations.length)];

  return (
    <div className="h-full">
      <div className="flex items-center mb-4 px-4 pt-4">
        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
        <h2 className="text-lg font-semibold">오늘의 추천 여행</h2>
      </div>
      
      <div className="relative overflow-hidden h-40 bg-gray-100">
        <img 
          src={randomTravel.image} 
          alt={randomTravel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center">
            <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full mr-2">
              {randomTravel.category}
            </span>
            <span className="text-xs text-white/80">{randomTravel.location}</span>
          </div>
          <h3 className="text-white font-medium mt-1">{randomTravel.name}</h3>
        </div>
      </div>
      
      <Link href="/travel" className="block text-sm text-blue-500 hover:underline flex items-center justify-end p-4">
        더 많은 여행지 보기
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default TodayTravelSection;
