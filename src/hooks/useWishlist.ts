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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
    },
  });

  const toggle = (book: Book) => mutation.mutate(book);
  const isWishlisted = (isbn: string) => wishlist.some((b) => b.isbn === isbn);

  return { wishlist, toggle, isWishlisted };
}
