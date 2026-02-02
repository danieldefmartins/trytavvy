/**
 * NotificationBadge - Red badge component for displaying unread counts
 * Used on navigation items and dashboard tiles to show notification counts
 * 
 * Install path: client/src/components/NotificationBadge.tsx
 */

import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NotificationBadge({ count, size = 'md', className }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();
  
  const sizeClasses = {
    sm: 'min-w-[16px] h-[16px] text-[10px] px-1',
    md: 'min-w-[20px] h-[20px] text-xs px-1.5',
    lg: 'min-w-[24px] h-[24px] text-sm px-2',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-red-500 text-white font-bold',
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </span>
  );
}

export default NotificationBadge;
