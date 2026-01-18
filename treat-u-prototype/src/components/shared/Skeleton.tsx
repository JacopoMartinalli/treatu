import { cn } from '../../utils/cn';

// ============================================
// SKELETON BASE
// ============================================

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
    />
  );
}

// ============================================
// SKELETON CARD
// ============================================

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// ============================================
// SKELETON LIST
// ============================================

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ============================================
// SKELETON PROFILE
// ============================================

export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    </div>
  );
}
