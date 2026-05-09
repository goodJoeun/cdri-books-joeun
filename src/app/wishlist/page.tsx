'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import BookList from '@/components/BookList';
import { cn } from '@/lib/cn';
import { strings } from '@/constants/strings';

const PAGE_SIZE = 10;

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(wishlist.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedBooks = wishlist.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <main className="w-[960px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-2">{strings.wishlist.pageTitle}</h1>
      <p className="text-sm text-gray-600 mb-6">
        {strings.wishlist.countPrefix}&nbsp;&nbsp;총{' '}
        <span className="font-medium text-palette-primary">
          {wishlist.length}
        </span>
        {strings.wishlist.countUnit}
      </p>

      {wishlist.length === 0 ? (
        <div className={cn('flex flex-col items-center', 'py-16 gap-4')}>
          <Image
            src="/icon/wishList_empty.svg"
            alt={strings.wishlist.emptyAlt}
            width={160}
            height={121}
            priority
          />
        </div>
      ) : (
        <BookList books={pagedBooks} />
      )}
    </main>
  );
}
