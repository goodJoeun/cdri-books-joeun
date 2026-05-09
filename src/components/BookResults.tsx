import Image from 'next/image'
import BookList from './BookList'
import PaginationControls from './PaginationControls'
import { fetchBooks } from '@/lib/fetchBooks'
import { strings } from '@/constants/strings'

interface BookResultsProps {
  query: string
  page: number
  target?: string
}

export default async function BookResults({ query, page, target }: BookResultsProps) {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <Image src="/icon/no_data.svg" alt="검색 결과 없음" width={160} height={121} priority />
      </div>
    )
  }

  let data
  try {
    data = await fetchBooks(query, page, target)
  } catch {
    return (
      <p className="text-sm text-red-500 text-center py-10">{strings.search.error}</p>
    )
  }

  const books = data.documents
  const totalCount = data.meta.total_count
  const pageableCount = data.meta.pageable_count
  const isEnd = data.meta.is_end
  const totalPages = Math.max(1, Math.ceil(pageableCount / 10))

  return (
    <>
      <p className="text-base font-medium text-text-primary mb-6">
        {strings.search.resultLabel}&nbsp;&nbsp;총{' '}
        <span className="font-medium text-palette-primary">{totalCount}</span>
        {strings.search.resultUnit}
      </p>

      {books.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4">
          <Image src="/icon/no_data.svg" alt="검색 결과 없음" width={160} height={121} priority />
        </div>
      ) : (
        <>
          <BookList books={books} />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            isEnd={isEnd}
            query={query}
            target={target}
          />
        </>
      )}
    </>
  )
}
