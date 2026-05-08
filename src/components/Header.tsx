'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: '도서 검색', href: '/' },
  { label: '내가 찜한 책', href: '/wishlist' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-bold text-base tracking-tight">CERTICOS BOOKS</span>
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm pb-1 transition-colors ${
                  active
                    ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
