'use client'

import { useRouter } from 'next/navigation'
import PaginationButton from './PaginationButton'
import { strings } from '@/constants/strings'

interface PaginationControlsProps {
  page: number
  totalPages: number
  isEnd: boolean
  query: string
  target?: string
}

export default function PaginationControls({
  page,
  totalPages,
  isEnd,
  query,
  target,
}: PaginationControlsProps) {
  const router = useRouter()

  const navigate = (newPage: number) => {
    const params = new URLSearchParams({ q: query, page: String(newPage) })
    if (target) params.set('target', target)
    router.push(`/?${params}`)
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <PaginationButton onClick={() => navigate(page - 1)} disabled={page === 1}>
        {strings.pagination.prev}
      </PaginationButton>
      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <PaginationButton onClick={() => navigate(page + 1)} disabled={isEnd || page >= totalPages}>
        {strings.pagination.next}
      </PaginationButton>
    </div>
  )
}
