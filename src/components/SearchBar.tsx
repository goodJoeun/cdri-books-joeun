'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { strings } from '@/constants/strings'

type DetailTarget = 'title' | 'person' | 'publisher'

const TARGET_OPTIONS: { value: DetailTarget; label: string }[] = [
  { value: 'title', label: strings.search.targetOptions.title },
  { value: 'person', label: strings.search.targetOptions.person },
  { value: 'publisher', label: strings.search.targetOptions.publisher },
]

interface SearchBarProps {
  defaultQuery?: string
  defaultTarget?: string
}

export default function SearchBar({ defaultQuery = '', defaultTarget }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultQuery)
  const [showHistory, setShowHistory] = useState(false)
  const [showDetailPopup, setShowDetailPopup] = useState(false)
  const [detailTarget, setDetailTarget] = useState<DetailTarget>(
    (defaultTarget as DetailTarget) ?? 'title',
  )
  const [detailQuery, setDetailQuery] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  // URL이 바뀔 때 (뒤로가기, 히스토리 클릭 등) 입력값 동기화
  useEffect(() => {
    setQuery(defaultQuery)
  }, [defaultQuery])

  const navigate = (term: string, target?: string) => {
    const params = new URLSearchParams({ q: term, page: '1' })
    if (target) params.set('target', target)
    router.push(`/?${params}`)
  }

  const handleSearch = (term?: string) => {
    const trimmed = (term ?? query).trim()
    if (!trimmed) return
    addHistory(trimmed)
    setQuery(trimmed)
    setShowHistory(false)
    setShowDetailPopup(false)
    navigate(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setShowHistory(false)
  }

  const handleToggleDetailPopup = () => {
    const opening = !showDetailPopup
    if (opening && query) setQuery('')
    setShowDetailPopup(opening)
    setShowHistory(false)
  }

  const handleDetailSearch = () => {
    if (!detailQuery.trim()) return
    navigate(detailQuery.trim(), detailTarget)
    setDetailQuery('')
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

  const shouldShowHistory = showHistory && history.length > 0 && !query.trim()

  return (
    <div className="flex items-center gap-2 mb-3 w-full max-w-[568px]">
      <div className="flex-1 relative" ref={containerRef}>
        <div className="flex items-center rounded px-3 py-2 gap-[11px] h-[50px] w-full">
          <button onClick={() => handleSearch()} className="shrink-0 text-gray-400 hover:text-gray-600">
            <img src="/icon/search.svg" alt="" className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            placeholder={strings.search.placeholder}
            className="flex-1 outline-none text-gray-800 text-base font-medium placeholder:text-text-subTitle placeholder:text-base placeholder:font-medium"
          />
        </div>

        {shouldShowHistory && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-md z-10">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500">{strings.search.recentHistory}</span>
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={clearHistory}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                {strings.search.clearAll}
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
          size="sm"
          className="text-text-subTitle whitespace-nowrap"
          onClick={handleToggleDetailPopup}
        >
          {strings.search.detailSearch}
        </Button>

        {showDetailPopup && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 w-80">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowDetailPopup(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 border-b border-palette-primary pb-1.5 mb-4">
              <select
                value={detailTarget}
                onChange={e => setDetailTarget(e.target.value as DetailTarget)}
                className="text-sm text-gray-700 outline-none cursor-pointer bg-transparent"
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
                placeholder={strings.search.detailPlaceholder}
                autoFocus
                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
              />
            </div>
            <Button variant="primary" className="w-full" onClick={handleDetailSearch}>
              {strings.search.searchButton}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
