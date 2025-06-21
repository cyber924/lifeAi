import { NextResponse } from 'next/server';
import { getTodaysFortune } from '../../actions/fortune';

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
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric&lang=kr`
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

export async function GET() {
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

    return NextResponse.json({
      randomCitiesWeather,
      todaysFortune,
    });
  } catch (error) {
    console.error('Error in home data API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}
