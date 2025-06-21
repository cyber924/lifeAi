import React, { useState } from 'react';
import { DietRecommendation as DietType } from '@/types/diet';

interface DietRecommendationProps {
  recommendations: DietType[];
}

const DietRecommendation: React.FC<DietRecommendationProps> = ({ recommendations }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null);

  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(diet => diet.type === activeTab);

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'diet', name: '다이어트' },
    { id: 'health', name: '건강식' },
    { id: 'recovery', name: '보양식' },
    { id: 'quick', name: '간편요리' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">🍽️ 오늘의 추천 식단</h2>
      
      {/* 카테고리 탭 */}
      <div className="flex overflow-x-auto mb-4 pb-2 space-x-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeTab === category.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 추천 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredRecommendations.map((diet) => (
          <div 
            key={diet.id}
            onClick={() => setSelectedDiet(diet)}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative h-32">
              <img 
                src={diet.imageUrl} 
                alt={diet.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{diet.title}</span>
                  <span className="text-xs">{diet.calories}kcal</span>
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>⏱️ {diet.cookingTime}분</span>
                <span>난이도: {diet.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      {selectedDiet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedDiet.imageUrl} 
                alt={selectedDiet.title}
                className="w-full h-48 object-cover"
              />
              <button 
                onClick={() => setSelectedDiet(null)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{selectedDiet.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {selectedDiet.type === 'diet' ? '다이어트' : 
                   selectedDiet.type === 'health' ? '건강식' : 
                   selectedDiet.type === 'recovery' ? '보양식' : '간편요리'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {selectedDiet.calories}kcal
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  ⏱️ {selectedDiet.cookingTime}분 소요
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  난이도: {selectedDiet.difficulty}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">🍴 재료</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDiet.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">📝 조리 방법</h4>
                <ol className="space-y-2 list-decimal list-inside">
                  {selectedDiet.instructions.map((step, idx) => (
                    <li key={idx} className="mb-2">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <button 
                  className="flex items-center text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    // TODO: 즐겨찾기 기능 구현
                    alert('즐겨찾기에 추가되었습니다!');
                  }}
                >
                  <span className="text-xl">{selectedDiet.isFavorite ? '★' : '☆'}</span>
                  <span className="ml-1">즐겨찾기</span>
                </button>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    // TODO: 장보기 목록에 추가 기능
                    alert('장보기 목록에 추가되었습니다!');
                  }}
                >
                  장보기 목록에 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietRecommendation;
