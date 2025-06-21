export interface DietRecommendation {
  id: string;
  type: 'diet' | 'health' | 'recovery' | 'quick' | 'seasonal' | 'time';
  title: string;
  description: string;
  imageUrl: string;
  calories: number;
  ingredients: string[];
  cookingTime: number; // 분 단위
  difficulty: '쉬움' | '보통' | '어려움';
  isFavorite: boolean;
  instructions: string[];
  nutritionInfo?: {
    protein: number; // 단백질 (g)
    carbs: number;   // 탄수화물 (g)
    fat: number;     // 지방 (g)
    fiber: number;   // 식이섬유 (g)
  };
}

// 더미 데이터 생성 함수
export function generateDummyDietRecommendations(): DietRecommendation[] {
  const types: Array<DietRecommendation['type']> = ['diet', 'health', 'recovery', 'quick'];
  const difficulties: Array<DietRecommendation['difficulty']> = ['쉬움', '보통', '어려움'];
  
  const titles = {
    diet: ['헬스 다이어트 식단', '단백질 풍부한 샐러드', '저칼로리 덮밥'],
    health: ['퀴노아 샐러드', '연어와 퀴노아 볼', '두부 스크램블'],
    recovery: ['삼계탕', '추어탕', '영양돌솥밥'],
    quick: ['아보카도 토스트', '그래놀라 요거트', '퀵 샌드위치']
  };

  const descriptions = {
    diet: '체중 감량에 도움되는 저칼로리 식단',
    health: '영양소가 풍부한 건강한 식사',
    recovery: '지친 몸에 활력을 주는 보양식',
    quick: '바쁠 때 간편하게 즐기는 한끼'
  };

  const ingredients = [
    ['닭가슴살', '브로콜리', '고구마', '달걀', '아보카도'],
    ['연어', '퀴노아', '시금치', '체리토마토', '오이'],
    ['소고기', '버섯', '당근', '양파', '대파'],
    ['두부', '계란', '시금치', '양파', '당근'],
    ['아보카도', '통밀빵', '토마토', '양상추', '올리브오일']
  ];

  const instructions = [
    '재료를 준비해주세요.',
    '냄비에 물을 끓인 후 소금을 넣어주세요.',
    '재료를 적당한 크기로 썰어주세요.',
    '팬에 오일을 두르고 재료를 볶아주세요.',
    '불을 약하게 줄이고 10분간 조려주세요.',
    '완성된 요리를 그릇에 담아주세요.'
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const type = types[i % types.length] as DietRecommendation['type'];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const titleIndex = i % titles[type].length;
    
    return {
      id: `diet-${i + 1}`,
      type,
      title: titles[type][titleIndex],
      description: descriptions[type],
      imageUrl: `https://picsum.photos/seed/diet-${i + 1}/800/600`,
      calories: Math.floor(Math.random() * 400) + 300, // 300-700 kcal
      ingredients: ingredients[Math.floor(Math.random() * ingredients.length)],
      cookingTime: [10, 20, 30, 45, 60][Math.floor(Math.random() * 5)],
      difficulty,
      isFavorite: Math.random() > 0.7,
      instructions: instructions.slice(0, Math.floor(Math.random() * 3) + 3),
      nutritionInfo: {
        protein: Math.floor(Math.random() * 30) + 10, // 10-40g
        carbs: Math.floor(Math.random() * 50) + 30,   // 30-80g
        fat: Math.floor(Math.random() * 20) + 5,      // 5-25g
        fiber: Math.floor(Math.random() * 10) + 2     // 2-12g
      }
    };
  });
}
