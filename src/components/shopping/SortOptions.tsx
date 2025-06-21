import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { FilterOptions } from '@/types/shopping';

interface SortOption {
  value: FilterOptions['sortBy'];
  label: string;
  icon?: React.ReactNode;
}

const sortOptions: SortOption[] = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '신상품순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
  { value: 'rating', label: '평점순' },
];

interface SortOptionsProps {
  sortBy: FilterOptions['sortBy'];
  onChange: (sortBy: FilterOptions['sortBy']) => void;
  className?: string;
  buttonClassName?: string;
}

export default function SortOptions({ 
  sortBy, 
  onChange, 
  className = '',
  buttonClassName = ''
}: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 현재 선택된 정렬 옵션 레이블 가져오기
  const selectedOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  // 정렬 옵션 선택 핸들러
  const handleSelect = (option: SortOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent, option: SortOption) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(option);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${buttonClassName} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="정렬 옵션 선택"
      >
        <span className="mr-2">{selectedOption.label}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 z-10 w-48 mt-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="listbox"
          tabIndex={-1}
        >
          <ul className="py-1">
            {sortOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === sortBy}
                className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${
                  option.value === sortBy 
                    ? 'bg-indigo-50 text-indigo-900' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleKeyDown(e, option)}
                tabIndex={0}
              >
                <span>{option.label}</span>
                {option.value === sortBy && (
                  <CheckIcon className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
