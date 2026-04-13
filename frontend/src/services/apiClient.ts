const BASE_URL = '/api'

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`)
  return response.json()
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`POST ${path} failed: ${response.status}`)
  return response.json()
}
