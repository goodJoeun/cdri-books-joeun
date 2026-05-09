'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { strings } from '@/constants/strings';

export default function Header() {
  const pathname = usePathname();
  const [searchHref, setSearchHref] = useState('/');

  useEffect(() => {
    const saved = sessionStorage.getItem('lastSearchHref');
    if (saved) setSearchHref(saved);

    const handler = (e: Event) => {
      setSearchHref((e as CustomEvent<string>).detail);
    };
    window.addEventListener('search:navigate', handler);
    return () => window.removeEventListener('search:navigate', handler);
  }, []);

  const NAV_ITEMS = [
    { label: strings.nav.search, href: searchHref },
    { label: strings.nav.wishlist, href: '/wishlist' },
  ];

  return (
    <header className="bg-white">
      <div className="relative w-full h-header px-4 sm:px-6 lg:px-10 flex items-center">
        <span className="font-bold text-base tracking-tight text-text-primary">
          {strings.brand}
        </span>
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-15">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href.split('?')[0];
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  'text-xl font-medium pb-1 text-text-primary transition-colors',
                  active && 'border-b border-palette-primary',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
