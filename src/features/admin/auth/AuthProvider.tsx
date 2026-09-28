import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  changePassword as changePasswordRequest,
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  type AuthUser,
} from '@/lib/api/auth'
import { AuthContext } from '@/features/admin/auth/auth-context'
import { can, canAny } from '@/lib/auth/permissions'
import {
  clearAuthSession,
  getAccessToken,
  getStoredPermissions,
  getStoredRoles,
  setAuthSession,
} from '@/lib/auth/token-store'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [permissions, setPermissions] = useState<string[]>(getStoredPermissions())
  const [roles, setRoles] = useState<string[]>(getStoredRoles())
  const [ready, setReady] = useState(false)

  const refreshUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      setPermissions([])
      setRoles([])
      return
    }
    const me = await getMe()
    setUser(me)
    setRoles(me.roles ?? [])
    setPermissions(me.permissions ?? [])
    setAuthSession({
      accessToken: token,
      roles: me.roles,
      permissions: me.permissions,
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (getAccessToken()) {
          await refreshUser()
        }
      } catch {
        if (!cancelled) {
          clearAuthSession()
          setUser(null)
          setPermissions([])
          setRoles([])
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginRequest(email, password)
    setAuthSession({
      accessToken: session.access_token,
      roles: session.roles,
      permissions: session.permissions,
    })
    setRoles(session.roles ?? [])
    setPermissions(session.permissions ?? [])
    const me = await getMe()
    setUser(me)
    setRoles(me.roles ?? session.roles ?? [])
    setPermissions(me.permissions ?? session.permissions ?? [])
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // ignore
    }
    clearAuthSession()
    setUser(null)
    setRoles([])
    setPermissions([])
  }, [])

  const changePassword = useCallback(
    async (input: {
      current_password: string
      password: string
      password_confirmation: string
    }) => {
      await changePasswordRequest(input)
    },
    [],
  )

  const value = useMemo(
    () => ({
      user,
      permissions,
      roles,
      ready,
      isAuthenticated: Boolean(user && getAccessToken()),
      login,
      logout,
      refreshUser,
      changePassword,
      can: (permission: string | string[]) => can(permissions, permission),
      canAny: (needed: string[]) => canAny(permissions, needed),
    }),
    [
      user,
      permissions,
      roles,
      ready,
      login,
      logout,
      refreshUser,
      changePassword,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
