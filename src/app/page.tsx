'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useBookSearch } from '@/hooks/useBookSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import Button from '@/components/Button'
import BookList from '@/components/BookList'

type DetailTarget = 'title' | 'person' | 'publisher'

const TARGET_OPTIONS: { value: DetailTarget; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'person', label: '저자명' },
  { value: 'publisher', label: '출판사' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [showHistory, setShowHistory] = useState(false)
  const [showDetailPopup, setShowDetailPopup] = useState(false)
  const [detailTarget, setDetailTarget] = useState<DetailTarget>('title')
  const [detailQuery, setDetailQuery] = useState('')
  const [searchTarget, setSearchTarget] = useState<string | undefined>(undefined)

  const containerRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const { data, isFetching, isError } = useBookSearch(searchQuery, page, searchTarget)
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  const handleSearch = (term?: string) => {
    const trimmed = (term ?? query).trim()
    if (!trimmed) return
    addHistory(trimmed)
    setQuery(trimmed)
    setSearchQuery(trimmed)
    setSearchTarget(undefined)
    setDetailQuery('')
    setPage(1)
    setShowHistory(false)
    setShowDetailPopup(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setShowHistory(false)
  }

  const handleToggleDetailPopup = () => {
    const opening = !showDetailPopup
    if (opening && query) {
      setQuery('')
    }
    setShowDetailPopup(opening)
    setShowHistory(false)
  }

  const handleDetailSearch = () => {
    if (!detailQuery.trim()) return
    setSearchQuery(detailQuery.trim())
    setSearchTarget(detailTarget)
    setQuery('')
    setPage(1)
    setShowDetailPopup(false)
  }

  const handleDetailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleDetailSearch()
    if (e.key === 'Escape') setShowDetailPopup(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
      if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
        setShowDetailPopup(false)
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
    <main className="w-full max-w-[960px] mx-auto py-10 px-4 sm:px-6 lg:px-0">
      <h1 className="text-xl font-bold mb-6">도서 검색</h1>

      <div className="flex items-center gap-2 mb-3 w-full max-w-[568px]">
        <div className="flex-1 relative" ref={containerRef}>
          <div className="flex items-center rounded px-3 py-2 gap-[11px] h-[50px] w-full">
            <button onClick={() => handleSearch()} className="shrink-0 text-gray-400 hover:text-gray-600">
              <img src="/search.svg" alt="" className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowHistory(true)}
              placeholder="검색어를 입력하세요"
              className="flex-1 outline-none text-gray-800 text-base font-medium placeholder:text-text-subTitle placeholder:text-base placeholder:font-medium"
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

        <div className="relative" ref={detailRef}>
          <Button
            variant="outline"
            className="text-sm whitespace-nowrap"
            style={{ borderWidth: '1px', borderRadius: '8px', padding: '5px 10px', gap: '10px', width: '72px', height: '35px', color: 'var(--color-text-subTitle)' }}
            onClick={handleToggleDetailPopup}
          >
            상세검색
          </Button>

          {showDetailPopup && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 w-80">
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={detailTarget}
                  onChange={e => setDetailTarget(e.target.value as DetailTarget)}
                  className="text-sm border border-gray-300 rounded px-2 py-1.5 text-gray-700 outline-none focus:border-gray-500 cursor-pointer"
                >
                  {TARGET_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={detailQuery}
                  onChange={e => setDetailQuery(e.target.value)}
                  onKeyDown={handleDetailKeyDown}
                  placeholder="검색어 입력"
                  autoFocus
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-gray-500 text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={() => setShowDetailPopup(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <Button variant="primary" style={{ width: '100%' }} onClick={handleDetailSearch}>
                검색하기
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-base font-medium text-text-primary mb-6">
        도서 검색 결과&nbsp;&nbsp;총{' '}
        <span className="font-medium text-palette-primary">{searchQuery ? totalCount : 0}</span>건
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
