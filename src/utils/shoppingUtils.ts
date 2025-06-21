import { FilterOptions } from '@/types/shopping';

export const updateURL = (filters: FilterOptions, router: any) => {
  const params = new URLSearchParams();
  
  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','));
  }
  if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.onlyFreeShipping) params.set('freeShipping', 'true');
  if (filters.onlyDiscount) params.set('discount', 'true');
  if (filters.onlyNew) params.set('new', 'true');
  
  const queryString = params.toString();
  const newUrl = queryString ? `/shopping?${queryString}` : '/shopping';
  
  // Only update if the URL has actually changed
  if (window.location.search !== `?${queryString}`) {
    router.push(newUrl, { scroll: false });
  }
};

export const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const parseFiltersFromURL = (searchParams: URLSearchParams): Partial<FilterOptions> => {
  const filters: Partial<FilterOptions> = {};
  
  if (searchParams.has('categories')) {
    filters.categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  }
  
  if (searchParams.has('minPrice')) {
    filters.minPrice = Number(searchParams.get('minPrice')) || '';
  }
  
  if (searchParams.has('maxPrice')) {
    filters.maxPrice = Number(searchParams.get('maxPrice')) || '';
  }
  
  if (searchParams.has('sortBy')) {
    filters.sortBy = searchParams.get('sortBy') as any;
  }
  
  if (searchParams.has('freeShipping')) {
    filters.onlyFreeShipping = searchParams.get('freeShipping') === 'true';
  }
  
  if (searchParams.has('discount')) {
    filters.onlyDiscount = searchParams.get('discount') === 'true';
  }
  
  if (searchParams.has('new')) {
    filters.onlyNew = searchParams.get('new') === 'true';
  }
  
  return filters;
};
