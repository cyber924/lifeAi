import { useState, useEffect, useCallback } from 'react';

export const useCurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const updateDateTime = useCallback(() => {
    const now = new Date();
    
    // Time format: 오전/오후 hh:mm
    setCurrentTime(now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }));
    
    // Date format: YYYY년 MM월 DD일 (요일)
    setCurrentDate(now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }));
  }, []);

  useEffect(() => {
    updateDateTime();
    const timer = setInterval(updateDateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [updateDateTime]);

  return { currentTime, currentDate };
};
