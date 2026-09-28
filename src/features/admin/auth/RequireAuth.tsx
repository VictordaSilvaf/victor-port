import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/features/admin/auth/auth-context'
import { Skeleton } from '@/components/ui/skeleton'

export function RequireAuth() {
  const { ready, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}
