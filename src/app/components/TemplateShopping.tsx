import { ShoppingBagIcon, LightBulbIcon } from '@heroicons/react/24/solid';

interface Recommendation {
  fullContent: {
    items: {
      type: 'product' | 'tip';
      name?: string;
      description?: string;
      content?: string;
      price?: string;
    }[];
  };
}

export function ShoppingTemplate({ recommendation }: { recommendation: Recommendation }) {
  const { fullContent } = recommendation;

  if (!fullContent || !fullContent.items) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">추천 상품 목록</h2>
      <div className="space-y-6">
        {fullContent.items.map((item, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              <span className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                {item.type === 'product' && <ShoppingBagIcon className="h-6 w-6 text-green-600" />}
                {item.type === 'tip' && <LightBulbIcon className="h-6 w-6 text-green-600" />}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{item.name || '알아두면 좋은 팁!'}</h3>
                {item.price && <p className="text-lg font-bold text-green-700">{item.price}</p>}
              </div>
              <p className="mt-1 text-base text-gray-600">{item.description || item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
