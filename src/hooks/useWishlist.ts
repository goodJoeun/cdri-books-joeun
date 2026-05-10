import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Book } from '@/types/book';

const WISHLIST_KEY = ['wishlist'];

async function fetchWishlist(): Promise<Book[]> {
  const res = await fetch('/api/wishlist');
  return res.json();
}

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data: wishlist = [] } = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: fetchWishlist,
  });

  const mutation = useMutation({
    mutationFn: async (book: Book) => {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
    },
    onMutate: async (book: Book) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData<Book[]>(WISHLIST_KEY);
      queryClient.setQueryData<Book[]>(WISHLIST_KEY, (old = []) => {
        const exists = old.some((b) => b.isbn === book.isbn);
        return exists
          ? old.filter((b) => b.isbn !== book.isbn)
          : [...old, book];
      });
      return { previous };
    },
    onError: (_err, _book, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(WISHLIST_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
    },
  });

  const toggle = (book: Book) => mutation.mutate(book);
  const isWishlisted = (isbn: string) => wishlist.some((b) => b.isbn === isbn);

  return { wishlist, toggle, isWishlisted };
}
