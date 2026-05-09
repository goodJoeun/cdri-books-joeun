import type { BookSearchResponse } from '@/types/book'

export async function fetchBooks(
  query: string,
  page: number,
  target?: string,
): Promise<BookSearchResponse> {
  const params = new URLSearchParams({ query, size: '10', page: String(page) })
  if (target) params.set('target', target)

  const res = await fetch(`https://dapi.kakao.com/v3/search/book?${params}`, {
    headers: { Authorization: `KakaoAK ${process.env.REST_API_KEY}` },
    next: { revalidate: 300 },
  })

  if (!res.ok) throw new Error('Kakao API error')
  return res.json()
}
