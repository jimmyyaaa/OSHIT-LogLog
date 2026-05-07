const BASE_URL = import.meta.env.VITE_API_BASE ?? ''

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) throw new Error(await formatError(response, `GET ${path}`))
  return response.json()
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(await formatError(response, `POST ${path}`))
  return response.json()
}

async function formatError(response: Response, label: string): Promise<string> {
  const body = await response.text().catch(() => '')
  if (!body) return `${label} failed: ${response.status}`

  try {
    const parsed = JSON.parse(body) as { error?: string; message?: string }
    return `${label} failed: ${response.status} ${parsed.error || parsed.message || body}`
  } catch {
    return `${label} failed: ${response.status} ${body}`
  }
}
