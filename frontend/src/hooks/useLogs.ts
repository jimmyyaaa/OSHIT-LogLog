import { useState, useEffect } from 'react'
import type { LogEntry } from '../types'
import { getEntries } from '../services/logService'

export function useLogs(from: string, to: string) {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    getEntries(from, to)
      .then(setEntries)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [from, to])

  return { entries, loading, error }
}
