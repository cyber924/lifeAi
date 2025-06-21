import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  type: 'food' | 'tip';
  name?: string;
  description?: string;
  content?: string;
}

interface Recommendation {
  fullContent: {
    items: MenuItem[];
  };
}

const tomorrowsRecommendations: MenuItem[] = [
  {
    type: 'food',
    name: '삼계탕',
    description: '여름 보양식으로 최고! 진한 국물과 부드러운 닭고기의 조화',
  },
  {
    type: 'food',
    name: '연어 포케볼',
    description: '신선한 연어와 아보카도의 완벽한 조합, 건강한 한끼',
  },
  {
    type: 'food',
    name: '마라샹궈',
    description: '중국 사천식 매콤한 훠궈, 특제 소스가 일품',
  },
];

export function RestaurantTemplate({ recommendation }: { recommendation: Recommendation }) {
  const { fullContent } = recommendation;

  if (!fullContent || !fullContent.items) {
    return null;
  }

  const renderMenuItem = (item: MenuItem, index: number) => (
    <div key={index} className="group flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex-shrink-0 pt-1">
        <span className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
          {item.type === 'food' && <SparklesIcon className="h-5 w-5 text-yellow-600" />}
          {item.type === 'tip' && <LightBulbIcon className="h-5 w-5 text-yellow-600" />}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-yellow-700">
            {item.name || '알아두면 좋은 팁!'}
          </h3>
          {item.type === 'food' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              추천
            </span>
          )}
        </div>
        <p className="mt-1 text-base text-gray-600">{item.description || item.content}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">오늘의 추천 메뉴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fullContent.items.map((item, index) => renderMenuItem(item, index))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-7 w-7 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">내일의 추천 메뉴</h2>
          </div>
          <p className="mt-2 md:mt-0 text-sm text-gray-500">
            내일의 날씨와 기분에 어울리는 특별한 메뉴들을 준비했어요!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tomorrowsRecommendations.map((item, index) => (
            <div key={index} className="transform transition-transform hover:-translate-y-1">
              {renderMenuItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
