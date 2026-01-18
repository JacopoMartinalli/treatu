import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
}

// ============================================
// STYLES
// ============================================

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// ============================================
// COMPONENT
// ============================================

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = 'md', src, alt, name, ...props }, ref) => {
    const getInitials = (name: string) => {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    if (src) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(
            'rounded-full object-cover',
            sizes[size],
            className
          )}
          {...props}
        />
      );
    }

    if (name) {
      return (
        <div
          className={cn(
            'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium',
            sizes[size],
            className
          )}
        >
          {getInitials(name)}
        </div>
      );
    }

    return (
      <div
        className={cn(
          'rounded-full bg-gray-200 text-gray-500 flex items-center justify-center',
          sizes[size],
          className
        )}
      >
        <User className={iconSizes[size]} />
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
