import { useState, useCallback, useEffect } from 'react';
import type { Book } from '@/types/book';

const CHANGE_EVENT = 'wishlist:change';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Book[]>([]);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = (await res.json()) as Book[];
      setWishlist(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchWishlist();
    const refresh = () => void fetchWishlist();
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CHANGE_EVENT, refresh);
  }, [fetchWishlist]);

  const toggle = useCallback(
    async (book: Book) => {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      }).catch(() => {});
      await fetchWishlist();
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [fetchWishlist],
  );

  const isWishlisted = (isbn: string) => wishlist.some((b) => b.isbn === isbn);

  return { wishlist, toggle, isWishlisted };
}
