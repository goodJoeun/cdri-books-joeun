'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import BookList from '@/components/book/BookList';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
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
    <main className="w-full max-w-[960px] mx-auto py-10 px-4 sm:px-6 lg:px-0">
      <Heading className="mb-2" text={strings.wishlist.pageTitle} />
      <Text
        as="p"
        size="sm"
        color="muted"
        className="mb-6"
        text={
          <>
            {strings.wishlist.countPrefix}&nbsp;&nbsp;총{' '}
            <Text weight="medium" color="accent" text={wishlist.length} />
            {strings.wishlist.countUnit}
          </>
        }
      />

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
