'use client';

import { WeatherLifestyleSection } from './WeatherLifestyleSection';
import { FortuneSection } from './FortuneSection';
import dynamic from 'next/dynamic';
import { CityWeatherData } from '@/types/weather';
import { FortuneData } from '@/app/actions/fortune';
import Link from 'next/link';
import { Hotel, MapPin, Star } from 'lucide-react';

// 클라이언트 컴포넌트로만 동적 임포트
const TodayFoodSection = dynamic(() => import('@/components/home/TodayFoodSection'), { ssr: false });
const TodayTravelSection = dynamic(() => import('@/components/home/TodayTravelSection'), { ssr: false });

type MainPageClientProps = {
  randomCitiesWeather: CityWeatherData[];
  todaysFortune: FortuneData | null;
};

// 1박2일 숙소 명소 데이터
const stayDestinations = [
  {
    id: 1,
    title: '경복궁과 인사동 투어',
    location: '서울 종로구',
    type: '도심 여행',
    price: '150,000원~',
    rating: 4.8,
    image: 'https://picsum.photos/400/300?gyeongbok',
    duration: '1박 2일',
    tags: ['역사', '문화', '도보여행']
  },
  {
    id: 2,
    title: '부산 해운대 해수욕장',
    location: '부산 해운대구',
    type: '바다 여행',
    price: '200,000원~',
    rating: 4.7,
    image: 'https://picsum.photos/400/300?haeundae',
    duration: '1박 2일',
    tags: ['휴양', '해변', '가족여행']
  },
  {
    id: 3,
    title: '제주 올레길 트래킹',
    location: '제주도',
    type: '트레킹',
    price: '250,000원~',
    rating: 4.9,
    image: 'https://picsum.photos/400/300?jeju',
    duration: '1박 2일',
    tags: ['자연', '트레킹', '힐링']
  }
];

export default function MainPageClient({ 
  randomCitiesWeather, 
  todaysFortune 
}: MainPageClientProps) {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1박2일 숙소 명소 섹션 */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">1박2일 추천 여행지</h2>
            <Link href="/travel" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              더보기 &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stayDestinations.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center text-white text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {item.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm text-gray-700">{item.rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.type}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">{item.price}</span>
                    <button className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors">
                      예약하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 날씨와 생활 섹션 */}
        <WeatherLifestyleSection randomCitiesWeather={randomCitiesWeather} />

        {/* 오늘의 운세 섹션 */}
        <FortuneSection fortuneData={todaysFortune} />

        {/* 오늘의 추천 섹션 */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">오늘의 추천</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
              <TodayFoodSection />
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
              <TodayTravelSection />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
