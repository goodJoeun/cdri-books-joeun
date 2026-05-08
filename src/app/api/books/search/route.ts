import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const params = new URLSearchParams({ query, target: 'title' })
  const res = await fetch(`https://dapi.kakao.com/v3/search/book?${params}`, {
    headers: {
      Authorization: `KakaoAK ${process.env.REST_API_KEY}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Kakao API error' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
