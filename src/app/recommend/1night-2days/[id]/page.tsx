import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react';

// 코스 상세 데이터 (실제로는 API나 데이터베이스에서 가져올 수 있음)
const courseDetails = {
  seoul: {
    id: 'seoul',
    title: '서울 시내 핵심 코스',
    description: '역사와 현대가 공존하는 서울의 매력을 만끽할 수 있는 코스',
    image: 'https://picsum.photos/1600/800?random=1',
    duration: '1박 2일',
    location: '서울시 종로구, 용산구, 강남구 일대',
    bestSeason: '봄, 가을',
    tags: ['#역사', '#도심', '#가족여행'],
    days: [
      {
        title: '1일차: 도심 속 역사 여행',
        schedule: [
          {
            time: '10:00 - 12:00',
            title: '경복궁',
            description: '조선의 대표 궁궐에서 아름다운 전통 건축물 감상',
            image: 'https://picsum.photos/600/400?random=11',
            location: '서울 종로구 사직로 161',
            tip: '수요일은 휴궁일이니 방문 전 확인해주세요.'
          },
          {
            time: '12:30 - 14:00',
            title: '인사동',
            description: '전통 한옥 분위기 속에서의 점심 식사',
            image: 'https://picsum.photos/600/400?random=12',
            location: '서울 종로구 인사동길 44',
            tip: '주말에는 인파가 많으니 평일에 방문하는 것을 추천합니다.'
          },
          {
            time: '15:00 - 18:00',
            title: '남산타워',
            description: '서울의 전경을 감상하며 사진 촬영',
            image: 'https://picsum.photos/600/400?random=13',
            location: '서울 용산구 남산공원길 105',
            tip: '일몰 시간대에 방문하면 낮과 밤의 풍경을 모두 즐길 수 있습니다.'
          }
        ]
      },
      {
        title: '2일차: 현대적인 서울 즐기기',
        schedule: [
          {
            time: '09:00 - 11:00',
            title: '한강공원',
            description: '아름다운 한강 풍경과 함께하는 산책',
            image: 'https://picsum.photos/600/400?random=14',
            location: '서울 영등포구 여의도동 84-14',
            tip: '자전거 대여가 가능하니 한강 자전거 코스를 즐겨보세요.'
          },
          {
            time: '13:00 - 15:30',
            title: '동대문 디자인 플라자',
            description: '현대 건축물 구경과 쇼핑',
            image: 'https://picsum.photos/600/400?random=15',
            location: '서울 중구 을지로 281',
            tip: '야간 조명이 아름다워 밤에 방문해도 좋습니다.'
          }
        ]
      }
    ]
  }
  // 다른 코스들도 이어서 추가 가능
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = courseDetails[params.id as keyof typeof courseDetails];
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">코스를 찾을 수 없습니다</h1>
          <Link href="/recommend/1night-2days" className="text-blue-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 헤더 이미지 */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6">{course.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <MapPin size={18} className="mr-1" />
                <span>{course.location}</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Clock size={18} className="mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <Calendar size={18} className="mr-1" />
                <span>추천 계절: {course.bestSeason}</span>
              </div>
            </div>
          </div>
        </div>
        <Link 
          href="/recommend/1night-2days" 
          className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        >
          <ArrowLeft size={24} />
        </Link>
      </div>

      {/* 코스 상세 내용 */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {course.tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* 일정 */}
        <div className="space-y-12">
          {course.days.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-3">
                <h2 className="text-xl font-bold">{day.title}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {day.schedule.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex items-center text-blue-600 font-medium mb-2">
                          <Clock size={16} className="mr-1" />
                          <span>{item.time}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-700 mb-4">{item.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin size={14} className="mr-1" />
                          <span>{item.location}</span>
                        </div>
                        {item.tip && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                            <p className="text-sm text-yellow-700 flex items-start">
                              <span className="font-medium mr-1">💡</span>
                              <span>{item.tip}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/accommodation" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
          >
            주변 숙소 예약하기
          </Link>
          <Link 
            href="/attraction" 
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 border border-gray-300 rounded-lg text-center transition-colors"
          >
            다른 명소 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}
