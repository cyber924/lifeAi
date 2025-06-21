'use client'

import { useState, useEffect } from 'react';

export function TopInfoBar() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };
      setCurrentDate(now.toLocaleDateString('ko-KR', options));
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };

    updateDateTime();
    const timerId = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="bg-purple-500/10 backdrop-blur-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm text-purple-800">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">☀️</span>
                    <span>맑음, 24°C</span>
                    <span className="hidden sm:inline-block">|</span>
                    <span className="hidden sm:inline-block">서울</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                    <span>{currentDate}</span>
                    <span className="hidden sm:inline-block">|</span>
                    <span className="hidden sm:inline-block">{currentTime}</span>
                </div>
            </div>
        </div>
    </div>
  );
}
