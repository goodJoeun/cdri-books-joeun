import { useState, useCallback } from 'react'

const MAX_HISTORY = 8
const STORAGE_KEY = 'book-search-history'

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addHistory = useCallback((term: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h !== term)
      const next = [term, ...filtered].slice(0, MAX_HISTORY)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const removeHistory = useCallback((term: string) => {
    setHistory(prev => {
      const next = prev.filter(h => h !== term)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setHistory([])
  }, [])

  return { history, addHistory, removeHistory, clearHistory }
}
