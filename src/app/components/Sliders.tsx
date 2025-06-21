'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export function Sliders() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations');
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setCards(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <div className="text-center p-10">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">에러: {error}</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      loop={cards.length > 2} // 루프는 카드가 충분히 많을 때만 활성화
    >
      {cards.map((card) => (
        <SwiperSlide key={card.id}>
          <div className="group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="relative aspect-video">
                <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-4 h-10">{card.description}</p>
              <Link href={`/recommendations/${card.id}`} className="block w-full">
                <button className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  둘러보기
                </button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
