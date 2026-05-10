import type { Metadata } from 'next';
import SearchBar from '@/components/search/SearchBar';
import InfiniteBookResults from '@/components/search/InfiniteBookResults';
import Heading from '@/components/ui/Heading';
import { cn } from '@/lib/cn';
import { strings } from '@/resource/strings';

export const metadata: Metadata = {
  title: strings.search.pageTitle,
};

interface PageProps {
  searchParams: Promise<{ q?: string; target?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { q = '', target } = await searchParams;

  return (
    <main
      className={cn(
        'w-full max-w-[960px] mx-auto',
        'py-10 px-4 sm:px-6 lg:px-0',
      )}
    >
      <Heading className="mb-6" text={strings.search.pageTitle} />
      <SearchBar defaultQuery={q} defaultTarget={target} />
      <InfiniteBookResults query={q} target={target} />
    </main>
  );
}
