'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { WeatherInfo } from '@/types/weather';
import toast from 'react-hot-toast';

interface WeatherContextType {
  weather: WeatherInfo | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<WeatherInfo | null>;
  lastUpdated: Date | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// 캐시 유효 시간 (1시간)
const CACHE_EXPIRY = 60 * 60 * 1000;

// 서울의 기본 좌표 (위도, 경도)
const DEFAULT_LOCATION = {
  lat: 37.5665,
  lng: 126.9780,
};

// 로컬 스토리지에서 캐시된 날씨 데이터 가져오기
const getCachedWeather = (): { data: WeatherInfo; timestamp: number } | null => {
  if (typeof window === 'undefined') return null;
  
  const cached = localStorage.getItem('weather');
  if (!cached) return null;
  
  try {
    return JSON.parse(cached);
  } catch (e) {
    console.error('캐시 파싱 오류:', e);
    return null;
  }
};

// 날씨 데이터를 로컬 스토리지에 캐시
const cacheWeather = (data: WeatherInfo): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('weather', JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.error('캐시 저장 오류:', e);
  }
};

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 날씨 데이터 가져오기
  const transformWeatherData = (data: any): WeatherInfo => {
    // 기본값 설정
    const defaultWeather: Partial<WeatherInfo> = {
      name: '알 수 없는 지역',
      main: {
        temp: 0,
        temp_min: 0,
        temp_max: 0,
        pressure: 1013, // 표준 대기압
        humidity: 0,
      },
      weather: [{
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: 0,
        deg: 0,
      },
      visibility: 10000, // 10km
      dt: Math.floor(Date.now() / 1000),
      sys: {
        country: 'KR',
        sunrise: 0,
        sunset: 0,
      },
      timezone: 32400, // 서울 시간대 (UTC+9)
      id: 0,
      cod: 200
    };

    // API 응답 데이터와 기본값 병합
    return {
      ...defaultWeather,
      ...data,
      main: {
        ...defaultWeather.main,
        ...data.main,
      },
      weather: (data.weather || defaultWeather.weather || []).map((w: any) => ({
        id: w.id || 800,
        main: w.main || 'Unknown',
        description: w.description || '날씨 정보 없음',
        icon: w.icon || '01d',
      })),
      wind: {
        ...defaultWeather.wind!,
        ...data.wind,
      },
      sys: {
        ...defaultWeather.sys!,
        ...data.sys,
      },
      dt: data.dt ? data.dt * 1000 : Date.now(), // 초를 밀리초로 변환
    } as WeatherInfo;
  };

  const fetchWeather = useCallback(async (lat: number, lon: number): Promise<WeatherInfo | null> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      const errorMsg = '날씨 정보를 불러올 수 없습니다. (API 키 누락)';
      console.error(errorMsg);
      setError(errorMsg);
      toast.error('날씨 정보를 불러올 수 없습니다.');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 캐시된 데이터가 있고 유효하면 사용
      const cached = getCachedWeather();
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        setWeather(cached.data);
        setLastUpdated(new Date(cached.timestamp));
        return cached.data;
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
      );
      
      if (!response.ok) {
        throw new Error(`날씨 정보를 가져오는데 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      const data = await response.json();
      const weatherInfo = transformWeatherData(data);
      
      setWeather(weatherInfo);
      cacheWeather(weatherInfo);
      setLastUpdated(new Date());
      return weatherInfo;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '날씨 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.';
      console.error('날씨 정보를 가져오는 중 오류 발생:', err);
      setError(errorMsg);
      
      // 캐시에서 이전 데이터 로드 시도
      const cached = getCachedWeather();
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        setWeather(cached.data);
        setError(null);
        return cached.data;
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 위치 정보 가져오기 및 날씨 조회
  const getLocationAndWeather = useCallback(async (): Promise<WeatherInfo | null> => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const errorMsg = '이 브라우저는 위치 정보를 지원하지 않습니다. 기본 위치로 표시됩니다.';
      console.warn(errorMsg);
      setError(errorMsg);
      toast.custom((t) => (
        <div className={`px-6 py-4 shadow-lg rounded-lg ${t.visible ? 'animate-enter' : 'animate-lead'}`}>
          <p className='text-yellow-600'>위치 정보를 사용할 수 없어 기본 위치로 표시됩니다.</p>
        </div>
      ), { duration: 3000 });
      return await fetchWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            console.warn('위치 정보를 가져오는데 실패했습니다. 기본 위치로 대체합니다.', error);
            toast.custom((t) => (
              <div className={`px-6 py-4 shadow-lg rounded-lg ${t.visible ? 'animate-enter' : 'animate-lead'}`}>
                <p className='text-yellow-600'>현재 위치를 가져올 수 없어 기본 위치로 표시됩니다.</p>
              </div>
            ), { duration: 3000 });
            resolve({
              coords: {
                latitude: DEFAULT_LOCATION.lat,
                longitude: DEFAULT_LOCATION.lng,
                accuracy: 10000,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
              },
              timestamp: Date.now(),
            } as GeolocationPosition);
          },
          {
            timeout: 5000, // 5초 타임아웃
            maximumAge: 15 * 60 * 1000, // 15분 이내의 캐시 사용
            enableHighAccuracy: false, // 배터리 절약을 위해 정확도 낮춤
          }
        );
      });
      
      return await fetchWeather(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      console.error('날씨 정보를 가져오는 중 오류 발생:', err);
      toast.error('날씨 정보를 불러오는 중 오류가 발생했습니다.');
      return null;
    }
  }, [fetchWeather]);

  // 수동으로 날씨 새로고침
  const refreshWeather = useCallback(async (): Promise<WeatherInfo | null> => {
    return getLocationAndWeather();
  }, [getLocationAndWeather]);

  // 초기 데이터 로드
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      // 캐시된 데이터가 있으면 먼저 표시
      const cached = getCachedWeather();
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        setWeather(cached.data);
      }
      
      // 최신 데이터 가져오기
      if (mounted) {
        await getLocationAndWeather();
      }
    };
    
    init();
    
    // 주기적으로 데이터 갱신
    const intervalId = setInterval(() => {
      if (mounted) {
        refreshWeather();
      }
    }, CACHE_EXPIRY); // 1시간마다 갱신
    
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [getLocationAndWeather, refreshWeather]);

  // Context 값 메모이제이션
  const contextValue = useMemo(() => ({
    weather,
    loading,
    error,
    lastUpdated,
    refreshWeather,
  }), [weather, loading, error, lastUpdated, refreshWeather]);

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather는 WeatherProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};
