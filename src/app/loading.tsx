import Heading from '@/components/ui/Heading';
import BookCardSkeleton from '@/components/book/BookCardSkeleton';
import { cn } from '@/lib/cn';
import { strings } from '@/resource/strings';

const spinnerClass = cn(
  'w-6 h-6 rounded-full',
  'border-2 border-palette-primary border-t-transparent',
  'animate-spin',
);

export default function Loading() {
  return (
    <main
      className={cn(
        'w-full max-w-[960px] mx-auto',
        'py-10 px-4 sm:px-6 lg:px-0',
      )}
    >
      <Heading className="mb-6" text={strings.search.pageTitle} />
      <div className="flex justify-center py-4">
        <div className={spinnerClass} />
      </div>
      <ul className="flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </ul>
    </main>
  );
}
