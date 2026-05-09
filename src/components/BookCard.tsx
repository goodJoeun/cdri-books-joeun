'use client'

import { useState, useRef } from 'react'
import { Book } from '@/types/book'
import Button from './Button'

export default function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  const displayPrice = book.sale_price > 0 ? book.sale_price : book.price
  const hasDiscount = book.sale_price > 0 && book.price > 0 && book.price !== book.sale_price

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
    <li className="border border-gray-200 rounded overflow-hidden">
      {/* 기본 행 */}
      <div className="flex items-center gap-4 px-4 py-3">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-12 h-16 object-cover shrink-0 rounded"
          />
        ) : (
          <div className="w-12 h-16 bg-gray-100 shrink-0 rounded" />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 flex items-baseline min-w-0">
            <span
              ref={titleRef}
              className="font-semibold truncate min-w-0 cursor-default"
              onMouseEnter={showTooltip}
              onMouseLeave={() => setTooltip(null)}
            >
              {book.title}
            </span>
            <span className="text-sm text-gray-500 ml-2 shrink-0">
              {book.authors.join(', ')}
            </span>
          </p>
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
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 w-24 justify-center"
        >
          상세보기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* 상세 패널 */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5 flex gap-6">
          <div className="shrink-0">
            {book.thumbnail ? (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-32 h-44 object-cover rounded shadow-sm"
              />
            ) : (
              <div className="w-32 h-44 bg-gray-200 rounded" />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div>
              <p className="text-base font-bold text-gray-900">{book.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {book.authors.join(', ')}
                {book.publisher ? ` · ${book.publisher}` : ''}
              </p>
            </div>

            {book.contents && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">책 소개</p>
                <p className="text-sm text-gray-700 leading-relaxed">{book.contents}</p>
              </div>
            )}

            <div className="mt-auto">
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through">
                  정가 {book.price.toLocaleString()}원
                </p>
              )}
              {displayPrice > 0 && (
                <p className="text-sm font-semibold text-gray-800">
                  {hasDiscount ? '판매가 ' : ''}
                  {displayPrice.toLocaleString()}원
                </p>
              )}
              <Button variant="primary" className="mt-3 w-full" onClick={openPurchase}>
                구매하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
