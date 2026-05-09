import type { Metadata } from 'next';
import SearchBar from '@/components/search/SearchBar';
import InfiniteBookResults from '@/components/search/InfiniteBookResults';
import { cn } from '@/lib/cn';
import { strings } from '@/constants/strings';

export const metadata: Metadata = {
  title: strings.search.pageTitle,
};

interface PageProps {
  searchParams: Promise<{ q?: string; target?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { q = '', target } = await searchParams;

  return (
    <main className={cn('w-full max-w-[960px] mx-auto', 'py-10 px-4 sm:px-6 lg:px-0')}>
      <h1 className="text-xl font-bold mb-6">{strings.search.pageTitle}</h1>
      <SearchBar defaultQuery={q} defaultTarget={target} />
      <InfiniteBookResults query={q} target={target} />
    </main>
  );
}
