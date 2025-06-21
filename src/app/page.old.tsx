import dynamic from 'next/dynamic';
import HomeContent from './HomeContent';
import { getTodaysFortune } from './actions/fortune';
import { CityWeatherData } from '../types/weather';
import { Metadata } from 'next';

// 클라이언트 컴포넌트로 동적 임포트
const WeatherInfo = dynamic(
  () => import('@/components/common/WeatherInfo').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-10 bg-white"></div> }
);

export const metadata: Metadata = {
  title: 'LifeAI - 홈',
  description: '인공지능이 추천하는 맞춤형 라이프스타일 서비스',
};

// 도시 목록
const cities = [
  { name: '서울', query: 'Seoul,KR' }, { name: '부산', query: 'Busan,KR' },
  { name: '대구', query: 'Daegu,KR' }, { name: '대전', query: 'Daejeon,KR' },
  { name: '광주', query: 'Gwangju,KR' }, { name: '춘천', query: 'Chuncheon,KR' },
  { name: '태백', query: 'Taebaek,KR' }, { name: '제주', query: 'Jeju,KR' },
  { name: '속초', query: 'Sokcho,KR' },
];

// 날씨 정보 가져오기 함수
async function fetchWeatherForCity(city: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=kr`,
      { next: { revalidate: 3600 } } // 1시간마다 재검증
    );
    if (!response.ok) {
      throw new Error(`날씨 정보를 가져오지 못했습니다: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}:`, error);
    return null;
  }
}

export default async function Home() {
  try {
    // 오늘의 운세 가져오기
    const todaysFortune = await getTodaysFortune();

    // 랜덤으로 3개 도시 선택
    const shuffled = [...cities].sort(() => 0.5 - Math.random());
    const selectedCities = shuffled.slice(0, 3);

    // 선택된 도시들의 날씨 정보 가져오기
    const weatherPromises = selectedCities.map(async (city) => {
      const data = await fetchWeatherForCity(city.query);
      return {
        name: city.name,
        weatherInfo: data
          ? {
              name: data.name,
              main: { temp: data.main.temp },
              weather: data.weather.map((w: any) => ({
                description: w.description,
                icon: w.icon,
              })),
            }
          : null,
      };
    });

    const randomCitiesWeather = await Promise.all(weatherPromises);

    return (
      <HomeContent 
        initialData={{
          randomCitiesWeather,
          todaysFortune,
        }} 
      />
    );
  } catch (error) {
    console.error('Error in home page:', error);
    // 에러 발생 시 빈 데이터로 초기화
    return (
      <HomeContent 
        initialData={{
          randomCitiesWeather: [],
          todaysFortune: null,
        }} 
      />
    );
  }
}
