'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useWishlist } from '@/hooks/useWishlist'
import BookList from '@/components/BookList'

const PAGE_SIZE = 10

export default function WishlistPage() {
  const { wishlist } = useWishlist()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(wishlist.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedBooks = wishlist.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="w-[960px] mx-auto py-10">
      <h1 className="text-xl font-bold mb-2">내가 찜한 책</h1>
      <p className="text-sm text-gray-600 mb-6">
        찜한 책&nbsp;&nbsp;총 <span className="font-medium">{wishlist.length}</span>건
      </p>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4">
          <Image src="/wishList_empty.svg" alt="찜한 책이 없습니다" width={160} height={121} priority />
          <p className="text-sm text-gray-400">찜한 책이 없습니다.</p>
        </div>
      ) : (
        <>
          <BookList books={pagedBooks} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
