const ACCESS_TOKEN_KEY = 'admin_access_token'
const ROLES_KEY = 'admin_roles'
const PERMISSIONS_KEY = 'admin_permissions'

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage
}

export function getAccessToken(): string | null {
  return storage()?.getItem(ACCESS_TOKEN_KEY) ?? null
}

export function setAccessToken(token: string | null) {
  const store = storage()
  if (!store) return
  if (token) store.setItem(ACCESS_TOKEN_KEY, token)
  else store.removeItem(ACCESS_TOKEN_KEY)
}

export function getStoredRoles(): string[] {
  try {
    const raw = storage()?.getItem(ROLES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function getStoredPermissions(): string[] {
  try {
    const raw = storage()?.getItem(PERMISSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function setAuthSession(input: {
  accessToken: string
  roles?: string[]
  permissions?: string[]
}) {
  const store = storage()
  if (!store) return
  store.setItem(ACCESS_TOKEN_KEY, input.accessToken)
  store.setItem(ROLES_KEY, JSON.stringify(input.roles ?? []))
  store.setItem(PERMISSIONS_KEY, JSON.stringify(input.permissions ?? []))
}

export function clearAuthSession() {
  const store = storage()
  if (!store) return
  store.removeItem(ACCESS_TOKEN_KEY)
  store.removeItem(ROLES_KEY)
  store.removeItem(PERMISSIONS_KEY)
}
