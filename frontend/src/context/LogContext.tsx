import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { LogEntry, CreateLogPayload } from '../types'
import { createEntry as apiCreate, getEntries as apiList } from '../services/logService'

interface LogContextValue {
  entries: LogEntry[]
  addEntry: (payload: CreateLogPayload) => Promise<LogEntry>
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

const LogContext = createContext<LogContextValue | null>(null)

export function LogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEntries = useCallback(async () => {
    const from = '2020-01-01'
    const to = new Date().toISOString().slice(0, 10)
    try {
      const data = await apiList(from, to)
      setEntries(data)
      setError(null)
    } catch (e) {
      setError(e as Error)
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const addEntry = useCallback(
    async (payload: CreateLogPayload): Promise<LogEntry> => {
      const entry = await apiCreate(payload)
      setEntries((prev) => [entry, ...prev])
      return entry
    },
    []
  )

  return (
    <LogContext.Provider value={{ entries, addEntry, loading, error, refresh: fetchEntries }}>
      {children}
    </LogContext.Provider>
  )
}

export function useLogContext() {
  const ctx = useContext(LogContext)
  if (!ctx) throw new Error('useLogContext must be used within LogProvider')
  return ctx
}
