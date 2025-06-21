type SortOption = 'recommended' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export default function SortSelect({ value, onChange, className = '' }: SortSelectProps) {
  const sortOptions = [
    { value: 'recommended', label: '추천순' },
    { value: 'newest', label: '신상품순' },
    { value: 'price_asc', label: '낮은 가격순' },
    { value: 'price_desc', label: '높은 가격순' },
    { value: 'rating', label: '평점순' },
    { value: 'popular', label: '인기순' },
  ] as const;

  return (
    <div className={className}>
      <label htmlFor="sort" className="sr-only">
        정렬 기준
      </label>
      <select
        id="sort"
        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
