import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

// ============================================
// CARD
// ============================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
          hoverable && 'hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer',
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================
// CARD HEADER
// ============================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-4 py-3 border-b border-gray-100', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ============================================
// CARD CONTENT
// ============================================

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// ============================================
// CARD FOOTER
// ============================================

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-4 py-3 border-t border-gray-100 bg-gray-50', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
