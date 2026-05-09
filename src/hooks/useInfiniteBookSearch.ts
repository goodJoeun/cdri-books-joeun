import { useInfiniteQuery } from '@tanstack/react-query'
import type { BookSearchResponse } from '@/types/book'

async function fetchBooks(query: string, page: number, target?: string): Promise<BookSearchResponse> {
  const params = new URLSearchParams({ query, page: String(page) })
  if (target) params.set('target', target)
  const res = await fetch(`/api/books/search?${params}`)
  if (!res.ok) throw new Error('검색 중 오류가 발생했습니다.')
  return res.json()
}

export function useInfiniteBookSearch(query: string, target?: string) {
  return useInfiniteQuery({
    queryKey: ['books', 'infinite', query, target],
    queryFn: ({ pageParam }) => fetchBooks(query, pageParam, target),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.meta.is_end ? undefined : lastPageParam + 1,
    enabled: query.trim().length > 0,
  })
}
