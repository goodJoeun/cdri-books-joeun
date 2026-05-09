'use client';

import { useState } from 'react';
import { Book } from '@/types/book';
import Button from '../ui/Button';
import { cn } from '@/lib/cn';
import { useWishlist } from '@/hooks/useWishlist';
import { strings } from '@/constants/strings';
import { ThumbnailWithWishlist, ChevronIcon } from './BookCardParts';
import ExpandedCard from './ExpandedCard';
import TruncatedTooltip from '../ui/TruncatedTooltip';

export default function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  const { toggle, isWishlisted } = useWishlist();

  const displayPrice = book.sale_price > 0 ? book.sale_price : book.price;
  const hasDiscount =
    book.sale_price > 0 && book.price > 0 && book.price !== book.sale_price;
  const wishlisted = isWishlisted(book.isbn);

  const openPurchase = () => {
    if (book.url) window.open(book.url, '_blank');
  };

  return (
    <li className="border-b border-border-card">
      {!expanded && (
        <div className="card-row">
          <ThumbnailWithWishlist
            book={book}
            wishlisted={wishlisted}
            size="compact"
            onToggle={(e) => {
              e.stopPropagation();
              toggle(book);
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 min-w-0">
              <TruncatedTooltip
                text={book.title}
                className="text-lg font-bold text-text-primary"
              />
              <span className="text-sm text-text-secondary shrink-0">
                {book.authors.join(', ')}
              </span>
              {displayPrice > 0 && (
                <span className={cn('text-lg font-medium text-text-primary', 'shrink-0 w-20 text-right ml-auto')}>
                  {strings.book.regularPrice(displayPrice.toLocaleString())}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={openPurchase}>
              {strings.book.buy}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1 justify-center"
            >
              {strings.book.detail}
              <ChevronIcon />
            </Button>
          </div>
        </div>
      )}

      {expanded && (
        <ExpandedCard
          book={book}
          wishlisted={wishlisted}
          displayPrice={displayPrice}
          hasDiscount={hasDiscount}
          onToggleWishlist={() => toggle(book)}
          onCollapse={() => setExpanded(false)}
          onPurchase={openPurchase}
        />
      )}
    </li>
  );
}
