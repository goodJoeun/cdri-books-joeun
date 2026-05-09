'use client'

import { useState, useRef } from 'react'
import { cva } from 'class-variance-authority'
import { Book } from '@/types/book'
import Button from './Button'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/cn'

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
        aria-label={wishlisted ? '찜 해제' : '찜하기'}
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
        <div className="flex items-center gap-4 px-12 py-2 h-[100px]">
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
            </div>
          </div>

          {tooltip && (
            <div
              className="fixed z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg pointer-events-none"
              style={{ top: tooltip.y, left: tooltip.x }}
            >
              {book.title}
            </div>
          )}

          {displayPrice > 0 && (
            <span className="text-sm font-medium text-gray-800 shrink-0 w-20 text-right">
              {displayPrice.toLocaleString()}원
            </span>
          )}

          <Button variant="primary" onClick={openPurchase}>
            구매하기
          </Button>

          <Button
            variant="outline"
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 justify-center"
          >
            상세보기
            <ChevronIcon />
          </Button>
        </div>
      )}

      {expanded && (
        <div className="bg-white">
          <div className="flex justify-end px-4 pt-3">
            <Button
              variant="outline"
              onClick={() => setExpanded(false)}
              className="flex items-center gap-1 justify-center"
            >
              상세보기
              <ChevronIcon rotated />
            </Button>
          </div>

          <div className="flex gap-6 px-5 pb-5">
            <ThumbnailWithWishlist
              book={book}
              wishlisted={wishlisted}
              size="expanded"
              onToggle={() => toggle(book)}
            />

            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-xl font-bold text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-500">{book.authors.join(', ')}</p>
                </div>
                {book.publisher && (
                  <p className="text-sm text-gray-400 mt-0.5">{book.publisher}</p>
                )}
              </div>

              {book.contents && (
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">책 소개</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{book.contents}</p>
                </div>
              )}

              <div className="mt-auto">
                {hasDiscount && (
                  <p className="text-sm text-gray-400 line-through">
                    원가 {book.price.toLocaleString()}원
                  </p>
                )}
                {displayPrice > 0 && (
                  <p className="text-lg font-bold text-gray-900">
                    {hasDiscount ? '할인가 ' : ''}{displayPrice.toLocaleString()}원
                  </p>
                )}
                <Button
                  variant="primary"
                  className="mt-4 w-full h-[52px]"
                  onClick={openPurchase}
                >
                  구매하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
