'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [query, setQuery] = useState('')

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-xl font-bold mb-6">도서 검색</h1>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center flex-1 border border-gray-300 rounded px-3 py-2 gap-2 focus-within:border-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400 shrink-0"
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
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
        <button className="shrink-0 border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          상세검색
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-12">
        도서 검색 결과&nbsp;&nbsp;총 <span className="font-medium">0</span>건
      </p>

      <div className="flex flex-col items-center py-16 gap-4">
        <Image src="/no_data.svg" alt="검색 결과 없음" width={160} height={121} priority />
        <p className="text-sm text-gray-500">검색된 결과가 없습니다.</p>
      </div>
    </main>
  )
}
