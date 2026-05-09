import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar'
import BookResults from '@/components/BookResults'
import BookCardSkeleton from '@/components/BookCardSkeleton'
import { strings } from '@/constants/strings'

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; target?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { q = '', page = '1', target } = await searchParams

  return (
    <main className="w-full max-w-[960px] mx-auto py-10 px-4 sm:px-6 lg:px-0">
      <h1 className="text-xl font-bold mb-6">{strings.search.pageTitle}</h1>
      <SearchBar defaultQuery={q} defaultTarget={target} />
      <Suspense key={`${q}-${page}-${target}`} fallback={<BookResultsSkeleton />}>
        <BookResults query={q} page={Number(page)} target={target} />
      </Suspense>
    </main>
  )
}

function BookResultsSkeleton() {
  return (
    <>
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 rounded-full border-2 border-palette-primary border-t-transparent animate-spin" />
      </div>
      <ul className="flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </ul>
    </>
  )
}
