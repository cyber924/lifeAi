'use client';

import { memo } from 'react';
import { Cloud, CloudRain, CloudSun, Sun, CloudLightning, CloudSnow, CloudFog, Loader2 } from 'lucide-react';

interface WeatherIconProps {
  iconCode?: string | null;
  className?: string;
  showLoading?: boolean;
}

const WeatherIcon = memo(({ 
  iconCode, 
  className = 'w-5 h-5',
  showLoading = false 
}: WeatherIconProps) => {
  const iconMap = {
    '01': <Sun className={className} />,
    '02': <CloudSun className={className} />,
    '03': <Cloud className={className} />,
    '04': <Cloud className={className} />,
    '09': <CloudRain className={className} />,
    '10': <CloudRain className={className} />,
    '11': <CloudLightning className={className} />,
    '13': <CloudSnow className={className} />,
    '50': <CloudFog className={className} />,
  } as const;

  // 로딩 상태 표시
  if (showLoading) {
    return <Loader2 className={`${className} animate-spin`} />;
  }

  // 기본값 반환
  const defaultIcon = <Cloud className={className} />;
  if (!iconCode) return defaultIcon;
  
  try {
    const iconKey = iconCode.slice(0, 2) as keyof typeof iconMap;
    return iconMap[iconKey] || defaultIcon;
  } catch (error) {
    console.error('날씨 아이콘 로딩 중 오류:', error);
    return defaultIcon;
  }
});

WeatherIcon.displayName = 'WeatherIcon';

export default WeatherIcon;
