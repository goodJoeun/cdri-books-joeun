import { useState, useCallback, useEffect } from 'react';
import type { Book } from '@/types/book';

const STORAGE_KEY = 'book-wishlist';
const CHANGE_EVENT = 'wishlist:change';

function readWishlist(): Book[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Book[]>([]);

  useEffect(() => {
    setWishlist(readWishlist());
    const refresh = () => setWishlist(readWishlist());
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CHANGE_EVENT, refresh);
  }, []);

  const toggle = useCallback((book: Book) => {
    const prev = readWishlist();
    const exists = prev.some((b) => b.isbn === book.isbn);
    const next = exists
      ? prev.filter((b) => b.isbn !== book.isbn)
      : [book, ...prev];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setWishlist(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const isWishlisted = (isbn: string) => wishlist.some((b) => b.isbn === isbn);

  return { wishlist, toggle, isWishlisted };
}
