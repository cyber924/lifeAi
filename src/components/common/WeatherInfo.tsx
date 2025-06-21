'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Calendar, Clock, Cloud, CloudRain, CloudSun, Sun, CloudLightning, CloudSnow, CloudFog, Droplets, Wind, Gauge, Eye, Sun as SunIcon, SunDim, CloudRain as CloudRainIcon, CloudLightning as CloudLightningIcon, CloudSnow as CloudSnowIcon, CloudFog as CloudFogIcon, Loader2, AlertCircle } from 'lucide-react';
import { useWeather } from '@/context/WeatherContext';
import { cn } from '@/lib/utils';
import WeatherIcon from './WeatherIcon';

const WeatherInfo = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const { weather, loading: weatherLoading, error: weatherError, lastUpdated } = useWeather();

  // 날씨 설명 한글로 변환
  const getKoreanWeatherDescription = (description: string) => {
    const descriptions: Record<string, string> = {
      'clear sky': '맑음',
      'few clouds': '대체로 맑음',
      'scattered clouds': '흐린',
      'broken clouds': '구름 많음',
      'shower rain': '소나기',
      'rain': '비',
      'thunderstorm': '뇌우',
      'snow': '눈',
      'mist': '안개',
      'haze': '연무',
      'fog': '안개',
      'drizzle': '이슬비',
      'dust': '황사',
    };
    return descriptions[description.toLowerCase()] || description;
  };

  // 날씨 상태에 따른 배경 색상 클래스
  const getWeatherBackgroundClass = (weatherId?: number) => {
    if (!weatherId) return 'bg-blue-50';
    
    // 날씨 코드에 따른 색상 클래스 반환
    const weatherCode = Math.floor(weatherId / 100);
    switch (weatherCode) {
      case 2: // 뇌우
        return 'bg-purple-50';
      case 3: // 이슬비
      case 5: // 비
        return 'bg-blue-50';
      case 6: // 눈
        return 'bg-blue-50';
      case 7: // 대기 상태 (안개, 연무 등)
        return 'bg-gray-50';
      case 8: // 구름
        return weatherId === 800 ? 'bg-blue-50' : 'bg-gray-100';
      default:
        return 'bg-blue-50';
    }
  };

  // 날짜와 시간 업데이트
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Time format: 오전/오후 hh:mm
      setCurrentTime(now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Seoul'
      }));
      
      // Date format: YYYY년 MM월 DD일 (요일)
      setCurrentDate(now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        timeZone: 'Asia/Seoul'
      }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 30000); // 30초마다 업데이트
    return () => clearInterval(timer);
  }, []);

  // 마지막 업데이트 시간 포맷팅
  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    return new Date(lastUpdated).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Seoul'
    });
  }, [lastUpdated]);

  // 날씨 정보 상태
  const isLoading = weatherLoading;
  const hasError = !!weatherError;
  const hasWeatherData = !isLoading && !hasError && weather && Array.isArray(weather.weather);
  const weatherData = hasWeatherData ? weather.weather[0] : null;
  const temperature = weather?.main?.temp;
  const humidity = weather?.main?.humidity;
  const windSpeed = weather?.wind?.speed;
  const visibility = weather?.visibility ? weather.visibility / 1000 : null; // 미터를 킬로미터로 변환
  const pressure = weather?.main?.pressure; // hPa
  const tempMin = weather?.main?.temp_min;
  const tempMax = weather?.main?.temp_max;

  // 날씨 상태에 따른 배경 클래스
  const weatherBgClass = getWeatherBackgroundClass(weatherData?.id);

  return (
    <div className={cn("shadow-sm py-2 transition-colors duration-300", weatherBgClass)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* 왼쪽 - 위치 및 날씨 */}
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="truncate max-w-[120px] md:max-w-none">
                {weather?.name || '서울시 강남구'}
              </span>
            </div>
            
            {isLoading ? (
              // 로딩 중일 때
              <div className="flex items-center text-sm text-gray-700">
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  <span>날씨 불러오는 중...</span>
                </div>
              </div>
            ) : hasError ? (
              // 에러 발생 시
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>날씨 정보를 불러올 수 없습니다.</span>
              </div>
            ) : hasWeatherData ? (
              // 날씨 정보가 있는 경우
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-gray-800">
                  <WeatherIcon 
                    iconCode={weatherData?.icon} 
                    className="w-5 h-5"
                    showLoading={isLoading}
                  />
                  <span className="ml-1 font-medium">
                    {typeof temperature === 'number' ? Math.round(temperature) : '--'}°C
                  </span>
                </div>
                {weatherData?.description && (
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {getKoreanWeatherDescription(weatherData.description)}
                  </span>
                )}
                {tempMin !== undefined && tempMax !== undefined && (
                  <div className="text-xs text-gray-500 hidden md:flex items-center">
                    <span className="text-blue-600">
                      {Math.round(tempMax)}°
                    </span>
                    <span className="mx-1">/</span>
                    <span className="text-blue-400">
                      {Math.round(tempMin)}°
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // 날씨 정보가 없는 경우
              <div className="flex items-center text-sm text-gray-500">
                <Cloud className="w-4 h-4 mr-1" />
                <span>날씨 정보 없음</span>
              </div>
            )}
            
            {/* 추가 날씨 정보 (데스크탑에서만 표시) */}
            {hasWeatherData && !isLoading && !hasError && (
              <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600">
                {humidity !== undefined && (
                  <div className="flex items-center">
                    <Droplets className="w-3.5 h-3.5 mr-1 text-blue-500" />
                    <span>{humidity}%</span>
                  </div>
                )}
                {windSpeed !== undefined && (
                  <div className="flex items-center">
                    <Wind className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    <span>{windSpeed}m/s</span>
                  </div>
                )}
                {visibility !== null && (
                  <div className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1 text-gray-500" />
                    <span>{visibility}km</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽 - 날짜, 시간 및 마지막 업데이트 */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="hidden md:flex items-center text-gray-700">
              <Calendar className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{currentDate}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {currentTime}
                {formattedLastUpdated && (
                  <span className="ml-1 text-xs text-gray-500">
                    (업데이트: {formattedLastUpdated})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        {/* 모바일용 추가 날씨 정보 */}
        {hasWeatherData && !isLoading && !hasError && (
          <div className="mt-2 pt-2 border-t border-gray-100 md:hidden">
            <div className="flex items-center space-x-4 overflow-x-auto pb-1 text-xs text-gray-600">
              {tempMin !== undefined && tempMax !== undefined && (
                <div className="flex items-center">
                  <span className="text-blue-600 font-medium">
                    {Math.round(tempMax)}°
                  </span>
                  <span className="mx-1">/</span>
                  <span className="text-blue-400">
                    {Math.round(tempMin)}°
                  </span>
                </div>
              )}
              {humidity !== undefined && (
                <div className="flex items-center">
                  <Droplets className="w-3 h-3 mr-0.5 text-blue-500" />
                  <span>{humidity}%</span>
                </div>
              )}
              {windSpeed !== undefined && (
                <div className="flex items-center">
                  <Wind className="w-3 h-3 mr-0.5 text-blue-400" />
                  <span>{windSpeed}m/s</span>
                </div>
              )}
              {visibility !== null && (
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-0.5 text-gray-500" />
                  <span>{visibility}km</span>
                </div>
              )}
              {pressure !== undefined && (
                <div className="flex items-center">
                  <Gauge className="w-3 h-3 mr-0.5 text-gray-500" />
                  <span>{pressure}hPa</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherInfo;
