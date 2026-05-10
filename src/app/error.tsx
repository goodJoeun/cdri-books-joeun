'use client';

import { useEffect } from 'react';
import Text from '@/components/ui/Text';
import { cn } from '@/lib/cn';
import { strings } from '@/resource/strings';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className={cn(
        'w-full max-w-[960px] mx-auto',
        'py-10 px-4 sm:px-6 lg:px-0',
        'flex flex-col items-center justify-center gap-4',
      )}
    >
      <Text
        as="p"
        size="sm"
        color="error"
        className="text-center"
        text={strings.search.error}
      />
      <button
        onClick={reset}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg',
          'bg-palette-primary text-white',
          'hover:opacity-90 transition-opacity',
        )}
      >
        다시 시도
      </button>
    </main>
  );
}
