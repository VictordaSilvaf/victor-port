import {
  clearAuthSession,
  getAccessToken,
  setAccessToken,
  setAuthSession,
} from '@/lib/auth/token-store'

const DEFAULT_API_URL = 'https://api.victorsf.com'

export function getApiBaseUrl() {
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  return (fromEnv || DEFAULT_API_URL).replace(/\/$/, '')
}

export function apiUrl(path: string) {
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}/api/v1${normalized}`
}

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  auth?: boolean
  skipRefresh?: boolean
}

function buildQuery(query?: ApiFetchOptions['query']): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const token = getAccessToken()
    if (!token) return null

    try {
      const response = await fetch(apiUrl('/auth/refresh'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })
      if (!response.ok) {
        clearAuthSession()
        return null
      }
      const payload = (await response.json()) as {
        access_token?: string
        roles?: string[]
        permissions?: string[]
      }
      if (!payload.access_token) {
        clearAuthSession()
        return null
      }
      setAuthSession({
        accessToken: payload.access_token,
        roles: payload.roles,
        permissions: payload.permissions,
      })
      return payload.access_token
    } catch {
      clearAuthSession()
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    body,
    query,
    headers,
    auth = true,
    skipRefresh = false,
    ...init
  } = options
  const url = `${apiUrl(path)}${buildQuery(query)}`
  const token = auth ? getAccessToken() : null

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && !(body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  })

  if (response.status === 401 && auth && !skipRefresh) {
    const nextToken = await refreshAccessToken()
    if (nextToken) {
      return apiFetch<T>(path, { ...options, skipRefresh: true })
    }
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.location.assign('/admin/login')
    }
  }

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : null) || `Request failed (${response.status})`
    const errors =
      payload &&
      typeof payload === 'object' &&
      'errors' in payload &&
      (payload as { errors: unknown }).errors &&
      typeof (payload as { errors: unknown }).errors === 'object'
        ? (payload as { errors: Record<string, string[]> }).errors
        : undefined
    throw new ApiError(message, response.status, errors)
  }

  return payload as T
}

export { setAccessToken }
