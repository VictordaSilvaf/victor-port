import { createContext, useContext } from 'react'
import type { AuthUser } from '@/lib/api/auth'

export type AuthContextValue = {
  user: AuthUser | null
  permissions: string[]
  roles: string[]
  ready: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  changePassword: (input: {
    current_password: string
    password: string
    password_confirmation: string
  }) => Promise<void>
  can: (permission: string | string[]) => boolean
  canAny: (permissions: string[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
