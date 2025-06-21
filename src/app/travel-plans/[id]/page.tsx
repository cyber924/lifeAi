'use client';

import { travelPlans } from '@/data/travelPlans';
import { notFound } from 'next/navigation';
import { 
  MapPinIcon, 
  BuildingStorefrontIcon, 
  ShoppingBagIcon, 
  HomeIcon, 
  CameraIcon,
  MugIcon
} from '@heroicons/react/24/outline';

const categoryIcons: { [key: string]: React.ElementType } = {
  '명소': CameraIcon,
  '맛집': BuildingStorefrontIcon,
  '쇼핑': ShoppingBagIcon,
  '숙소': HomeIcon,
  '카페': MugIcon,
  '기타': MapPinIcon,
};

export default function TravelPlanDetailPage({ params }: { params: { id: string } }) {
  const plan = travelPlans.find((p) => p.id === params.id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* 헤더 섹션 */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{plan.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{plan.summary}</p>
        <div className="mt-4 flex justify-center flex-wrap gap-2">
          {plan.tags?.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* 일자별 계획 섹션 */}
      <div className="space-y-12">
        {plan.dailyPlans.map((dayPlan) => (
          <section key={dayPlan.day} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-teal-600 mb-2">Day {dayPlan.day}</h2>
            <p className="text-gray-500 mb-6">{dayPlan.description}</p>
            
            <div className="relative border-l-2 border-teal-200 pl-8 space-y-8">
              {dayPlan.places.map((place, index) => {
                const Icon = categoryIcons[place.category] || MapPinIcon;
                return (
                  <div key={place.id} className="relative">
                    <div className="absolute -left-11 top-1 w-6 h-6 bg-teal-500 rounded-full border-4 border-white"></div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <Icon className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{place.name}</h3>
                        <p className="text-sm font-semibold text-gray-500 mb-1">{place.category}</p>
                        <p className="text-gray-600">{place.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
