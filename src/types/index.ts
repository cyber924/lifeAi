// c:\lifeAi\src\types\index.ts

// --- '오늘 뭐 먹지' 관련 타입 --- //

/**
 * 오늘의 운세 데이터 구조
 */
export interface FortuneData {
  title: string; // 예: "성공적인 하루의 시작"
  summary: string; // 예: "오늘은 기분 좋은 일들이 가득할 거예요."
  fullContent: string; // 상세 운세 내용
  positiveKeywords: string[]; // 긍정 키워드 (예: ['성취', '행운'])
}

/**
 * 추천 음식 데이터 구조
 */
export interface RecommendedFood {
  name: string; // 예: "따뜻한 쌀국수"
  description: string; // 추천 이유
  imageUrl: string; // 음식 이미지 URL
  category: '한식' | '중식' | '일식' | '양식' | '기타';
}

/**
 * '오늘 뭐 먹지' 페이지 전체 데이터 구조
 */
export interface TodayPageData {
  fortune: FortuneData;
  recommendedFoods: RecommendedFood[]; // 여러 음식을 추천하도록 배열로 변경
}

// --- LifeAI 핵심 여행 콘텐츠 관련 타입 --- //

/**
 * LifeAI의 핵심 콘텐츠 카테고리
 * - Place: 개별 장소 (맛집, 카페, 명소 등)
 * - ThemedList: 테마별 장소 목록 (예: '연남동 소품샵 BEST 5')
 * - TravelPlan: 동선이 포함된 여행 계획 (예: '부산 뚜벅이 1박 2일 코스')
 */
export type ContentType = 'Place' | 'ThemedList' | 'TravelPlan';

/**
 * 공통 위치 정보
 */
export interface Location {
  address: string;
  lat: number; // 위도
  lng: number; // 경도
}

/**
 * 개별 장소 (Place) - 모든 콘텐츠의 기본 단위
 */
export interface Place {
  id: string;
  type: 'Place';
  category: '맛집' | '카페' | '명소' | '쇼핑' | '숙소' | '체험';
  name: string;
  description: string;
  location: Location;
  images: string[]; // 이미지 URL 배열 (picsum.photos 사용 규칙 준수)
  tags?: string[];
  // 카테고리별 추가 정보
  details?: {
    openingHours?: string;
    signatureMenu?: string;
    priceRange?: '저렴' | '보통' | '비쌈';
    parkingInfo?: '가능' | '불가능' | '공영주차장 이용';
  };
}

/**
 * 테마별 장소 목록 (ThemedList)
 */
export interface ThemedList {
  id: string;
  type: 'ThemedList';
  title: string; // 예: '제주 애월읍 감성 카페 TOP 7'
  description: string;
  coverImage: string;
  places: Place[]; // 포함된 장소 목록
  tags?: string[];
}

/**
 * 여행 코스 (TravelPlan)
 */
export interface TravelPlan {
  id: string;
  title: string;
  summary: string; // 여행 코스 요약
  category: string; // 예: '국내여행', '해외여행'
  tags?: string[];
  dailyPlans: {
    day: number;
    description: string;
    places: {
      id: string;
      name: string;
      category: '명소' | '맛집' | '쇼핑' | '숙소' | '카페' | '체험';
      description: string;
    }[];
  }[];
  imageUrl: string;
  duration: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

// 모든 콘텐츠 타입을 통합하여 사용
export type LifeAiContent = Place | ThemedList | TravelPlan;
