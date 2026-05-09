'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useBookSearch } from '@/hooks/useBookSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import Button from '@/components/Button'
import BookList from '@/components/BookList'

export default function Home() {
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [showHistory, setShowHistory] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isFetching, isError } = useBookSearch(searchQuery, page)
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  const handleSearch = (term?: string) => {
    const trimmed = (term ?? query).trim()
    if (!trimmed) return
    addHistory(trimmed)
    setQuery(trimmed)
    setSearchQuery(trimmed)
    setPage(1)
    setShowHistory(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setShowHistory(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const books = data?.documents ?? []
  const totalCount = data?.meta.total_count ?? 0
  const pageableCount = data?.meta.pageable_count ?? 0
  const isEnd = data?.meta.is_end ?? true
  const totalPages = Math.max(1, Math.ceil(pageableCount / 10))

  const shouldShowHistory = showHistory && history.length > 0 && !query.trim()

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-xl font-bold mb-6">도서 검색</h1>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative" ref={containerRef}>
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2 focus-within:border-gray-500">
            <button onClick={() => handleSearch()} className="shrink-0 text-gray-400 hover:text-gray-600">
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
              onFocus={() => setShowHistory(true)}
              placeholder="검색어를 입력하세요"
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
            />
          </div>

          {shouldShowHistory && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-md z-10">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <span className="text-xs text-gray-500">최근 검색어</span>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  전체 삭제
                </button>
              </div>
              {history.map(term => (
                <div
                  key={term}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSearch(term)}
                >
                  <span className="text-sm text-gray-700">{term}</span>
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={e => {
                      e.stopPropagation()
                      removeHistory(term)
                    }}
                    className="text-gray-300 hover:text-gray-500 text-base leading-none px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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

      {!isFetching && books.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={isEnd || page >= totalPages}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </main>
  )
}
