import { cn } from '../../utils/cn';
import { Star } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface RatingProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

// ============================================
// STYLES
// ============================================

const sizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// ============================================
// COMPONENT
// ============================================

export function Rating({
  value,
  maxValue = 5,
  size = 'md',
  showValue = true,
  reviewCount,
  className,
}: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: maxValue }).map((_, index) => {
          const isFilled = index < fullStars;
          const isHalf = index === fullStars && hasHalfStar;

          return (
            <Star
              key={index}
              className={cn(
                sizes[size],
                isFilled || isHalf
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-medium text-gray-700', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn('text-gray-500', textSizes[size])}>
          ({reviewCount} recensioni)
        </span>
      )}
    </div>
  );
}
