'use client';

import Link from 'next/link';

// 이 컴포넌트는 서버 컴포넌트(page.tsx)에서 날씨 데이터를 받아 렌더링합니다.
interface WeatherInfo {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface CityWeatherData {
  name: string;
  weatherInfo: WeatherInfo | null;
}

interface WeatherLifestyleSectionProps {
  randomCitiesWeather: CityWeatherData[];
}

export function WeatherLifestyleSection({ randomCitiesWeather }: WeatherLifestyleSectionProps) {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">날씨와 생활</h2>
          <Link href="/weather-lifestyle" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            전체보기 &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomCitiesWeather.map(({ name, weatherInfo }) => {
            if (!weatherInfo) {
              return (
                <div key={name} className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
                  <h3 className="text-xl font-semibold text-gray-700">{name}</h3>
                  <p className="text-red-500 mt-2">정보 없음</p>
                </div>
              );
            }

            const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherInfo.weather[0]?.icon}@2x.png`;

            return (
              <div key={name} className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{weatherInfo.name}</h3>
                    {weatherInfo.weather[0]?.icon && (
                      <img src={weatherIconUrl} alt={weatherInfo.weather[0]?.description} className="w-12 h-12 -mt-2" />
                    )}
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{Math.round(weatherInfo.main.temp)}°C</p>
                  <p className="text-gray-500 capitalize">{weatherInfo.weather[0]?.description}</p>
                </div>
                <div className="mt-4 text-right">
                  <Link href="/weather-lifestyle" className="text-sm font-medium text-blue-500 hover:underline">
                    생활 정보 보기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
