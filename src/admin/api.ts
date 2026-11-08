export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'pack-up-admin', ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('json') ? await res.json() : null
  if (!res.ok) throw new ApiError(data?.error || `Request failed (${res.status})`, res.status)
  if (data === null) throw new ApiError('The admin API is not available. Run the Node server (npm start) instead of static hosting.', 0)
  return data as T
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  put: <T>(url: string, body: unknown) => request<T>('PUT', url, body),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body ?? {}),
  del: <T>(url: string) => request<T>('DELETE', url),
  upload: <T>(url: string, files: File[]) => {
    const f = new FormData()
    files.forEach((x) => f.append('files', x))
    return request<T>('POST', url, f)
  },
}

export interface MediaFile {
  name: string
  url: string
  size: number
}
export interface SchemaField {
  key: string
  group: string
  label: string
  type: 'text' | 'textarea'
  default: string
}
export interface AdminContent {
  copy: Record<string, string>
  site: { email: string; phone: string; location: string; social: { instagram: string; linkedin: string; facebook: string } }
  categories: import('../data/content').Category[]
  why: { title: string; text: string }[]
  work: import('../data/work').WorkItem[]
  schema: SchemaField[]
  options: { tones: string[]; kinds: string[]; filters: string[]; finishes: string[]; sizes: string[] }
  updatedAt: string
}
