import { get, post } from './apiClient'
import type { LogEntry, CreateLogPayload } from '../types'

export async function createEntry(payload: CreateLogPayload): Promise<LogEntry> {
  return post<LogEntry>('/logs', payload)
}

export async function getEntries(from: string, to: string): Promise<LogEntry[]> {
  return get<LogEntry[]>(`/logs?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
}
