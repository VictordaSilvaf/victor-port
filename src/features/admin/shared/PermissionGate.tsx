import type { ReactNode } from 'react'
import { useAuth } from '@/features/admin/auth/auth-context'

export function PermissionGate({
  permission,
  anyOf,
  children,
  fallback = null,
}: {
  permission?: string | string[]
  anyOf?: string[]
  children: ReactNode
  fallback?: ReactNode
}) {
  const auth = useAuth()
  const allowed = anyOf
    ? auth.canAny(anyOf)
    : permission
      ? auth.can(permission)
      : true

  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}
