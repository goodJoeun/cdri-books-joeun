'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { strings } from '@/constants/strings'

const NAV_ITEMS = [
  { label: strings.nav.search, href: '/' },
  { label: strings.nav.wishlist, href: '/wishlist' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-[80px] flex items-center relative">
        <span className="font-bold text-base tracking-tight">{strings.brand}</span>
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-15">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-xl font-medium pb-1 transition-colors text-text-primary',
                  active && 'border-b border-palette-primary'
                )}
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
