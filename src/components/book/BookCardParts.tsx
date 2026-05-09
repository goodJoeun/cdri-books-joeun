'use client';

import { cva } from 'class-variance-authority';
import { Book } from '@/types/book';
import { cn } from '@/lib/cn';
import { strings } from '@/constants/strings';

export type CardSize = 'compact' | 'expanded';

export const thumbnailStyles = cva('object-cover rounded', {
  variants: {
    size: {
      compact: 'w-12 h-thumb-h',
      expanded: 'w-full h-full shadow-sm',
    },
  },
});

export const thumbnailPlaceholderStyles = cva('rounded', {
  variants: {
    size: {
      compact: 'w-12 h-thumb-h bg-gray-100',
      expanded: 'w-44 h-60 bg-gray-200',
    },
  },
});

export const wishlistButtonStyles = cva('absolute', {
  variants: {
    size: {
      compact: 'top-0.5 right-0.5',
      expanded: 'top-1.5 right-1.5',
    },
  },
});

export const heartIconStyles = cva('', {
  variants: {
    size: {
      compact: 'w-4 h-4',
      expanded: 'w-6 h-6',
    },
  },
});

export function ThumbnailWithWishlist({
  book,
  wishlisted,
  onToggle,
  size,
}: {
  book: Book;
  wishlisted: boolean;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
  size: CardSize;
}) {
  return (
    <div
      className={cn(
        'relative shrink-0',
        size === 'expanded' && 'w-44 overflow-hidden',
      )}
    >
      {book.thumbnail ? (
        <img
          src={book.thumbnail}
          alt={book.title}
          className={thumbnailStyles({ size })}
        />
      ) : (
        <div className={thumbnailPlaceholderStyles({ size })} />
      )}
      <button
        onClick={onToggle}
        className={wishlistButtonStyles({ size })}
        aria-label={wishlisted ? strings.book.wishRemove : strings.book.wishAdd}
      >
        <img
          src={wishlisted ? '/icon/heart_filled.svg' : '/icon/heart_empty.svg'}
          alt=""
          className={heartIconStyles({ size })}
        />
      </button>
    </div>
  );
}

export function ChevronIcon({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-3.5 h-3.5', rotated && 'rotate-180')}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
