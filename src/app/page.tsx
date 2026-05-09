'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useBookSearch } from '@/hooks/useBookSearch'
import Button from '@/components/Button'
import BookList from '@/components/BookList'

export default function Home() {
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isFetching, isError } = useBookSearch(searchQuery)

  const handleSearch = () => {
    const trimmed = query.trim()
    if (trimmed) setSearchQuery(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const books = data?.documents ?? []
  const totalCount = data?.meta.total_count ?? 0

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-xl font-bold mb-6">도서 검색</h1>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center flex-1 border border-gray-300 rounded px-3 py-2 gap-2 focus-within:border-gray-500">
          <button onClick={handleSearch} className="shrink-0 text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
        <Button variant="outline" className="py-2">
          상세검색
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        도서 검색 결과&nbsp;&nbsp;총{' '}
        <span className="font-medium">{searchQuery ? totalCount : 0}</span>건
      </p>

      {isFetching && (
        <p className="text-sm text-gray-400 text-center py-10">검색 중...</p>
      )}

      {isError && (
        <p className="text-sm text-red-500 text-center py-10">검색 중 오류가 발생했습니다.</p>
      )}

      {!isFetching && !isError && books.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-4">
          <Image src="/no_data.svg" alt="검색 결과 없음" width={160} height={121} priority />
        </div>
      )}

      {!isFetching && <BookList books={books} />}
    </main>
  )
}
