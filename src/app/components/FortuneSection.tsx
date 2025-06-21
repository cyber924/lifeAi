'use client';

interface FortuneData {
  date: string;
  message: string;
  luckyItem: string;
  luckyColor: string;
}

interface FortuneSectionProps {
  fortuneData?: FortuneData | null;
}

const colorMap: { [key: string]: string } = {
  '하늘색': '#87CEEB',
  '빨간색': '#FF4136',
  '초록색': '#2ECC40',
  '베이지색': '#F5F5DC',
  '노란색': '#FFDC00',
  '금색': '#FFD700',
  '분홍색': '#FF85A1',
};

export function FortuneSection({ fortuneData }: FortuneSectionProps) {
  if (!fortuneData) {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 my-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">오늘의 운세</h2>
            <p className="text-lg text-gray-500">오늘은 운세 정보가 없네요. 내일 다시 확인해주세요!</p>
        </div>
    );
  }

  const luckyColorCode = colorMap[fortuneData.luckyColor] || fortuneData.luckyColor;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg rounded-xl p-6 my-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">✨ 오늘의 운세 ✨</h2>
      <blockquote className="text-center text-lg text-gray-800 italic my-4 p-4 bg-white/50 rounded-lg">
        &ldquo;{fortuneData.message}&rdquo;
      </blockquote>
      <div className="flex justify-around text-center mt-4 pt-4 border-t border-purple-200">
        <div>
          <p className="text-sm text-gray-600">🍀 행운의 아이템</p>
          <p className="font-semibold text-lg text-gray-900">{fortuneData.luckyItem}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600">🎨 행운의 색상</p>
          <div className="flex items-center">
            <div 
              className="w-5 h-5 rounded-full mr-2 border border-gray-300" 
              style={{ backgroundColor: luckyColorCode }}
            ></div>
            <p className="font-semibold text-lg text-gray-900">{fortuneData.luckyColor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
