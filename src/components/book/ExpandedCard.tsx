'use client';

import { Book } from '@/types/book';
import Button from '../ui/Button';
import { cn } from '@/lib/cn';
import { strings } from '@/constants/strings';
import { ThumbnailWithWishlist, ChevronIcon } from './BookCardParts';
import TruncatedTooltip from '../ui/TruncatedTooltip';

export default function ExpandedCard({
  book,
  wishlisted,
  displayPrice,
  hasDiscount,
  onToggleWishlist,
  onCollapse,
  onPurchase,
}: {
  book: Book;
  wishlisted: boolean;
  displayPrice: number;
  hasDiscount: boolean;
  onToggleWishlist: () => void;
  onCollapse: () => void;
  onPurchase: () => void;
}) {
  return (
    <div className="bg-white px-4 sm:px-6 lg:px-12 py-4 lg:py-6">
      <div className="flex justify-end mb-2 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCollapse}
          className="flex items-center gap-1 justify-center"
        >
          {strings.book.detail}
          <ChevronIcon rotated />
        </Button>
      </div>

      <div
        className={cn(
          'flex flex-col lg:flex-row items-stretch lg:items-start',
          'gap-4 lg:gap-card-gap',
        )}
      >
        <div className="self-center lg:self-auto">
          <ThumbnailWithWishlist
            book={book}
            wishlisted={wishlisted}
            size="expanded"
            onToggle={onToggleWishlist}
          />
        </div>

        <div
          className={cn(
            'flex-1 flex flex-col gap-4 lg:gap-6 min-w-0',
            'lg:p-2 lg:max-w-[360px]',
          )}
        >
          <div className="flex items-baseline gap-2 flex-wrap">
            <TruncatedTooltip
              text={book.title}
              className="text-lg lg:text-xl font-bold text-text-primary"
            />
            <p className="text-sm text-text-secondary">
              {book.authors.join(', ')}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-text-primary mb-4">
              {strings.book.intro}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {book.contents || strings.book.noContents}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col items-end shrink-0',
            'lg:self-stretch lg:justify-between lg:ml-auto',
          )}
        >
          <Button
            variant="ghost"
            onClick={onCollapse}
            className="hidden lg:flex items-center gap-1 justify-center"
          >
            {strings.book.detail}
            <ChevronIcon rotated />
          </Button>

          <div className="flex flex-col items-end w-full lg:w-auto">
            {hasDiscount && (
              <p className="text-sm text-text-subTitle line-through">
                {strings.book.originalPrice(book.price.toLocaleString())}
              </p>
            )}
            {displayPrice > 0 && (
              <p className="text-lg font-bold text-text-primary">
                {hasDiscount
                  ? strings.book.discountPrice(displayPrice.toLocaleString())
                  : strings.book.regularPrice(displayPrice.toLocaleString())}
              </p>
            )}
            <Button
              variant="primary"
              className="mt-4 w-full lg:w-buy-wide h-12"
              onClick={onPurchase}
            >
              {strings.book.buy}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
