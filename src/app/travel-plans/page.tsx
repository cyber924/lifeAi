import Link from 'next/link';
import dynamic from 'next/dynamic';
import { travelPlans } from '@/data/travelPlans';

// ClientLayout을 동적으로 로드 (SSR 비활성화)
const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout').then((mod) => mod.default),
  { ssr: false }
);

function TravelPlansContent() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">추천 여행 코스</h1>
      <p className="text-center text-gray-600 mb-12">LifeAI가 엄선한 특별한 여행 계획을 만나보세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {travelPlans.map((plan) => (
          <Link href={`/travel-plans/${plan.id}`} key={plan.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col">
              <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.title}</h2>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">{plan.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {plan.tags && plan.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-100 p-4 text-right text-sm text-gray-500">
                자세히 보기 &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TravelPlansPage() {
  return (
    <ClientLayout>
      <TravelPlansContent />
    </ClientLayout>
  );
}
