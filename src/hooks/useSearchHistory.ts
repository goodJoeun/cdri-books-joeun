import { useState, useCallback, useEffect } from 'react';

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/search-history')
      .then((r) => r.json())
      .then((data: string[]) => setHistory(data))
      .catch(() => {});
  }, []);

  const addHistory = useCallback(async (term: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h !== term);
      return [term, ...filtered].slice(0, 8);
    });
    await fetch('/api/search-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term }),
    }).catch(() => {});
  }, []);

  const removeHistory = useCallback(async (term: string) => {
    setHistory((prev) => prev.filter((h) => h !== term));
    await fetch(`/api/search-history/${encodeURIComponent(term)}`, {
      method: 'DELETE',
    }).catch(() => {});
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await fetch('/api/search-history', { method: 'DELETE' }).catch(() => {});
  }, []);

  return { history, addHistory, removeHistory, clearHistory };
}
