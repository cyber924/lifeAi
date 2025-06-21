'use client';

import { AccommodationItem } from '@/services/contentService';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// ClientLayout을 동적으로 로드 (SSR 비활성화)
const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout').then((mod) => mod.default),
  { ssr: false }
);

const AccommodationPage = () => {
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. 상태 초기화
    setLoading(true);
    setError(null);
    
    // 2. 새로운 AbortController 인스턴스 생성 (매 요청마다 새로 생성)
    const abortController = new AbortController();
    const { signal } = abortController;
    
    // 3. 마운트 상태 추적
    let isMounted = true;

    const fetchAccommodations = async () => {
      if (!isMounted) return;
      
      try {
        // 4. 캐시 방지 옵션 추가
        const response = await fetch('/api/accommodations', {
          signal,
          cache: 'no-store', // 브라우저 캐시 방지
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        if (!isMounted) return;

        // 5. HTTP 에러 처리
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!isMounted) return;

        // 6. 응답 형식 검증
        if (!data || typeof data !== 'object') {
          throw new Error('유효하지 않은 응답 형식입니다.');
        }

        if (data.success === false) {
          throw new Error(data.error || '요청을 처리할 수 없습니다.');
        }

        if (!Array.isArray(data.data)) {
          throw new Error('데이터 형식이 올바르지 않습니다.');
        }

        // 7. 성공 시 상태 업데이트
        setAccommodations(data.data);
        setError(null);
      } catch (error) {
        // 8. 타입 안전한 에러 처리
        const err = error as Error & { name?: string; code?: string };
        
        // 9. 중단된 요청은 무시
        if (err.name === 'AbortError') {
          console.log('요청이 취소되었습니다.');
          return;
        }
        
        console.error('숙소 정보 조회 실패:', err);
        
        if (isMounted) {
          setError(err.message || '숙소 정보를 불러오는 중 오류가 발생했습니다.');
          setAccommodations([]); // 오류 시 빈 배열로 초기화
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // 10. 데이터 가져오기 실행
    fetchAccommodations();

    // 11. 클린업 함수
    return () => {
      isMounted = false; // 컴포넌트 언마운트 표시
      abortController.abort(); // 진행 중인 요청 취소
    };
  }, []); // 빈 배열로 최초 마운트 시에만 실행

  if (loading) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">오류 발생! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">추천 숙소</h1>
        {accommodations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={
                      item.imageUrl || 'https://picsum.photos/400/300?random=1'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://picsum.photos/400/300?random=1';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.location || '위치 정보 없음'}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">
                      {item.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="font-semibold mt-2">
                    ₩{item.price?.toLocaleString()}~
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 숙소가 없습니다.</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default AccommodationPage;
