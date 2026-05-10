'use client';

import { Book } from '@/types/book';
import Button from '../ui/Button';
import Text from '../ui/Text';
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
    <div className="animate-expand-in bg-white px-4 sm:px-6 lg:px-12 py-4 lg:py-6">
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
            <Text
              as="p"
              size="sm"
              color="secondary"
              text={book.authors.join(', ')}
            />
          </div>

          <div>
            <Text
              as="p"
              size="sm"
              weight="semibold"
              color="primary"
              className="mb-4"
              text={strings.book.intro}
            />
            <Text
              as="p"
              size="xs"
              color="secondary"
              className="leading-relaxed"
              text={book.contents || strings.book.noContents}
            />
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
              <Text
                as="p"
                size="sm"
                color="subTitle"
                className="line-through"
                text={strings.book.originalPrice(book.price.toLocaleString())}
              />
            )}
            {displayPrice > 0 && (
              <Text
                as="p"
                size="lg"
                weight="bold"
                color="primary"
                text={
                  hasDiscount
                    ? strings.book.discountPrice(displayPrice.toLocaleString())
                    : strings.book.regularPrice(displayPrice.toLocaleString())
                }
              />
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
