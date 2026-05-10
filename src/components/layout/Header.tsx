'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Text from '../ui/Text';
import { cn } from '@/lib/cn';
import { strings } from '@/resource/strings';

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
      <div className="relative w-full h-header px-4 sm:px-6 lg:px-10 flex items-center justify-between md:justify-start gap-4">
        <Text weight="bold" size="base" color="primary" className="tracking-tight shrink-0" text={strings.brand} />
        <nav className="flex items-center gap-4 sm:gap-8 md:gap-15 md:absolute md:left-1/2 md:-translate-x-1/2">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href.split('?')[0];
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  'text-base sm:text-lg md:text-xl font-medium pb-1 text-text-primary transition-colors',
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
