import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export default function PaginationButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'px-3 py-1.5 text-sm border border-gray-300 rounded',
        'hover:bg-gray-50',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
