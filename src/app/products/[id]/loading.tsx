import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Image Skeleton */}
        <div className="mb-8 lg:mb-0">
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>
        
        {/* Info Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
