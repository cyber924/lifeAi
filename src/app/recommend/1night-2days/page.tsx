import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// 추천 코스 데이터 (서울 시내 코스만 표시)
const recommendedCourses = [
  {
    id: 'seoul',
    title: '서울 시내 핵심 코스',
    description: '역사와 현대가 공존하는 서울의 매력을 만끽할 수 있는 코스',
    image: 'https://picsum.photos/800/400?random=1',
    duration: '1박 2일',
    tags: ['#역사', '#도심', '#가족여행']
  }
  // 추가 코스는 추후 업데이트 예정
];

const OneNightTwoDaysPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">추천 1박 2일 코스</h1>
        <p className="text-lg text-gray-600">전국 각지의 다양한 1박 2일 여행 코스를 만나보세요</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendedCourses.map((course) => (
          <Link href={`/recommend/1night-2days/${course.id}`} key={course.id}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.duration}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-blue-600 font-medium">
                  자세히 보기
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">더 많은 코스가 업데이트 될 예정입니다.</p>
      </div>
    </div>
  );
};

export default OneNightTwoDaysPage;
