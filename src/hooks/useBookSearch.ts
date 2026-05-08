import { useQuery } from '@tanstack/react-query'
import type { BookSearchResponse } from '@/types/book'

async function fetchBooks(query: string): Promise<BookSearchResponse> {
  const res = await fetch(`/api/books/search?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('검색 중 오류가 발생했습니다.')
  return res.json()
}

export function useBookSearch(query: string) {
  return useQuery({
    queryKey: ['books', query],
    queryFn: () => fetchBooks(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  })
}
