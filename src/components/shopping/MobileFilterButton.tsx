import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';

interface MobileFilterButtonProps {
  onClick: () => void;
  filterCount?: number;
  isActive?: boolean;
  className?: string;
}

export default function MobileFilterButton({ 
  onClick, 
  filterCount = 0, 
  isActive = false,
  className = ''
}: MobileFilterButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 필터가 활성화되면 버튼에 포커스 이동
  useEffect(() => {
    if (isActive && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isActive]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-expanded={isActive}
      aria-haspopup="dialog"
      aria-controls="filter-dialog"
      className={`inline-flex items-center px-4 py-2.5 border rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        isActive 
          ? 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'
      } ${className}`}
    >
      <AdjustmentsHorizontalIcon 
        className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'} mr-2`} 
        aria-hidden="true"
      />
      <span>필터</span>
      {filterCount > 0 && (
        <span 
          className={`ml-2 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-white/20 text-white' 
              : 'bg-indigo-100 text-indigo-800'
          }`}
          aria-hidden="true"
        >
          {filterCount}
        </span>
      )}
    </button>
  );
}
