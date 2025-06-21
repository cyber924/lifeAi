'use client'

import { useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보가 지원되지 않는 브라우저입니다.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '날씨 정보를 가져오는데 실패했습니다.');
          }
          const data = await response.json();
          setWeather(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('위치 정보 접근이 거부되었습니다. 날씨 정보를 보려면 위치 접근을 허용해주세요.');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center space-x-4">
        <p className="text-gray-600 animate-pulse">날씨 정보 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto p-4 bg-red-50 rounded-xl shadow-lg flex items-center space-x-4">
        <BeakerIcon className="h-8 w-8 text-red-500" />
        <div>
          <p className="text-red-700 text-sm font-semibold">오류</p>
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={weather.icon} alt={weather.description} className="w-16 h-16" />
        <div>
          <p className="text-lg font-semibold text-gray-800">{weather.city}</p>
          <p className="text-gray-600 capitalize">{weather.description}</p>
        </div>
      </div>
      <p className="text-4xl font-bold text-purple-600">{Math.round(weather.temp)}°</p>
    </div>
  );
}
