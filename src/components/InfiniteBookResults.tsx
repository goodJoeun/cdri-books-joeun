'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import BookList from './BookList';
import BookCardSkeleton from './BookCardSkeleton';
import { cn } from '@/lib/cn';
import { useInfiniteBookSearch } from '@/hooks/useInfiniteBookSearch';
import { strings } from '@/constants/strings';

const spinnerClass = cn(
  'w-6 h-6 rounded-full',
  'border-2 border-palette-primary border-t-transparent',
  'animate-spin',
);

interface InfiniteBookResultsProps {
  query: string;
  target?: string;
}

export default function InfiniteBookResults({
  query,
  target,
}: InfiniteBookResultsProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteBookSearch(query, target);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <Image
          src="/icon/no_data.svg"
          alt="검색 결과 없음"
          width={160}
          height={121}
          priority
        />
      </div>
    );
  }

  if (isPending) {
    return (
      <>
        <div className="flex justify-center py-4">
          <div className={spinnerClass} />
        </div>
        <ul className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </ul>
      </>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500 text-center py-10">
        {strings.search.error}
      </p>
    );
  }

  const books = data.pages.flatMap((p) => p.documents);
  const totalCount = data.pages[0].meta.total_count;

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <Image
          src="/icon/no_data.svg"
          alt="검색 결과 없음"
          width={160}
          height={121}
          priority
        />
      </div>
    );
  }

  return (
    <>
      <p className="text-base font-medium text-text-primary mb-6">
        {strings.search.resultLabel}&nbsp;&nbsp;총{' '}
        <span className="font-medium text-palette-primary">{totalCount}</span>
        {strings.search.resultUnit}
      </p>
      <BookList books={books} />
      <div ref={sentinelRef} />
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <div className={spinnerClass} />
        </div>
      )}
    </>
  );
}
