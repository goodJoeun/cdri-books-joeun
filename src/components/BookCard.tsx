'use client'

import { useState, useRef } from 'react'
import { cva } from 'class-variance-authority'
import { Book } from '@/types/book'
import Button from './Button'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/cn'
import { strings } from '@/constants/strings'

// className 정리
const thumbnailStyles = cva('object-cover rounded', {
  variants: {
    size: {
      compact: 'w-12 h-[68px]',
      expanded: 'w-44 h-60 shadow-sm',
    },
  },
})

const thumbnailPlaceholderStyles = cva('rounded', {
  variants: {
    size: {
      compact: 'w-12 h-[68px] bg-gray-100',
      expanded: 'w-44 h-60 bg-gray-200',
    },
  },
})

const wishlistButtonStyles = cva('absolute', {
  variants: {
    size: {
      compact: 'top-0.5 right-0.5',
      expanded: 'top-1.5 right-1.5',
    },
  },
})

const heartIconStyles = cva('', {
  variants: {
    size: {
      compact: 'w-4 h-4',
      expanded: 'w-6 h-6',
    },
  },
})

// --- Sub-components ---

type CardSize = 'compact' | 'expanded'

function ThumbnailWithWishlist({
  book,
  wishlisted,
  onToggle,
  size,
}: {
  book: Book
  wishlisted: boolean
  onToggle: React.MouseEventHandler<HTMLButtonElement>
  size: CardSize
}) {
  return (
    <div className="relative shrink-0">
      {book.thumbnail ? (
        <img src={book.thumbnail} alt={book.title} className={thumbnailStyles({ size })} />
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
  )
}

function ChevronIcon({ rotated }: { rotated?: boolean }) {
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
  )
}

// --- Main Component ---

export default function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const { toggle, isWishlisted } = useWishlist()

  const displayPrice = book.sale_price > 0 ? book.sale_price : book.price
  const hasDiscount = book.sale_price > 0 && book.price > 0 && book.price !== book.sale_price
  const wishlisted = isWishlisted(book.isbn)

  const openPurchase = () => {
    if (book.url) window.open(book.url, '_blank')
  }

  const showTooltip = () => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect()
      setTooltip({ x: rect.left, y: rect.bottom + 4 })
    }
  }

  return (
    <li className="border-b border-[#D2D6DA]">
      {!expanded && (
        <div className="flex items-center gap-[45px] px-12 py-2 h-[100px]">
          <ThumbnailWithWishlist
            book={book}
            wishlisted={wishlisted}
            size="compact"
            onToggle={e => { e.stopPropagation(); toggle(book) }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 min-w-0">
              <span
                ref={titleRef}
                className="text-[18px] font-bold text-text-primary truncate min-w-0 cursor-default"
                onMouseEnter={showTooltip}
                onMouseLeave={() => setTooltip(null)}
              >
                {book.title}
              </span>
              <span className="text-sm text-text-secondary shrink-0">
                {book.authors.join(', ')}
              </span>
                {displayPrice > 0 && (
              <span className="text-[18px] font-medium text-text-primary shrink-0 w-20 text-right ml-auto">
                {displayPrice.toLocaleString()}원
              </span>
            )}
            </div>
          
            {tooltip && (
              <div
                className="fixed z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none"
                style={{ top: tooltip.y, left: tooltip.x }}
              >
                {book.title}
              </div>
            )}
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
        <div className="bg-white px-12 py-6">
          <div className="flex items-start gap-[45px]">
            <ThumbnailWithWishlist
              book={book}
              wishlisted={wishlisted}
              size="expanded"
              onToggle={() => toggle(book)}
            />

            <div className="flex-1 flex flex-col gap-6 min-w-0 p-2 max-w-[360px]">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-xl font-bold text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.authors.join(', ')}</p>
                </div>          
              </div>

              {book.contents && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-4">{strings.book.intro}</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{book.contents}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end shrink-0 self-stretch justify-between ml-auto">
              <Button
                variant="ghost"
                onClick={() => setExpanded(false)}
                className="flex items-center gap-1 justify-center"
              >
                {strings.book.detail}
                <ChevronIcon rotated />
              </Button>

              <div className="flex flex-col items-end">
                {hasDiscount && (
                  <p className="text-sm text-gray-400 line-through">
                    {strings.book.originalPrice(book.price.toLocaleString())}
                  </p>
                )}
                {displayPrice > 0 && (
                  <p className="text-lg font-bold text-gray-900">
                    {hasDiscount
                      ? strings.book.discountPrice(displayPrice.toLocaleString())
                      : strings.book.regularPrice(displayPrice.toLocaleString())}
                  </p>
                )}
                <Button
                  variant="primary"
                  className="mt-4 w-[240px] h-[48px]"
                  onClick={openPurchase}
                >
                  {strings.book.buy}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
