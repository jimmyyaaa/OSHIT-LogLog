import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { LogEntry, CreateLogPayload } from '../types'

interface LogContextValue {
  entries: LogEntry[]
  addEntry: (payload: CreateLogPayload) => LogEntry
}

const LogContext = createContext<LogContextValue | null>(null)

const STORAGE_KEY = 'loglog_entries'

export function LogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = useCallback((payload: CreateLogPayload): LogEntry => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      userId: 'demo-user',
      timestamp: new Date().toISOString(),
      ...payload,
    }
    setEntries(prev => [...prev, entry])
    return entry
  }, [])

  return (
    <LogContext.Provider value={{ entries, addEntry }}>
      {children}
    </LogContext.Provider>
  )
}

export function useLogContext() {
  const ctx = useContext(LogContext)
  if (!ctx) throw new Error('useLogContext must be used within LogProvider')
  return ctx
}
