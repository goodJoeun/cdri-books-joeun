'use client';

import { useState } from 'react';
import { Book } from '@/types/book';
import Button from '../ui/Button';
import Text from '../ui/Text';
import { cn } from '@/lib/cn';
import { useWishlist } from '@/hooks/useWishlist';
import { strings } from '@/resource/strings';
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
            <div
              className={cn(
                'flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 min-w-0',
              )}
            >
              <TruncatedTooltip
                text={book.title}
                className="text-base sm:text-lg font-bold text-text-primary"
              />
              <Text
                size="xs"
                color="secondary"
                className="sm:text-sm truncate sm:shrink-0"
                text={book.authors.join(', ')}
              />
              {displayPrice > 0 && (
                <Text
                  size="sm"
                  weight="medium"
                  color="primary"
                  className="sm:text-lg shrink-0 sm:w-20 sm:text-right sm:ml-auto"
                  text={strings.book.regularPrice(
                    displayPrice.toLocaleString(),
                  )}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              className="sm:w-[115px] sm:h-[48px] sm:text-sm"
              onClick={openPurchase}
            >
              {strings.book.buy}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(true)}
              className="sm:w-[115px] sm:h-[48px] flex items-center gap-1 justify-center"
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
