import { useQuery } from '@tanstack/react-query'
import type { BookSearchResponse } from '@/types/book'

async function fetchBooks(query: string, page: number, target?: string): Promise<BookSearchResponse> {
  const params = new URLSearchParams({ query, page: String(page) })
  if (target) params.set('target', target)
  const res = await fetch(`/api/books/search?${params}`)
  if (!res.ok) throw new Error('검색 중 오류가 발생했습니다.')
  return res.json()
}

export function useBookSearch(query: string, page = 1, target?: string) {
  return useQuery({
    queryKey: ['books', query, page, target],
    queryFn: () => fetchBooks(query, page, target),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  })
}
