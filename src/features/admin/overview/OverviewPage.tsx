import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/features/admin/shared/PageHeader'
import { PermissionGate } from '@/features/admin/shared/PermissionGate'
import { listContactMessages } from '@/lib/api/admin-contact'
import { getProjectStatistics } from '@/lib/api/admin-projects'
import { useAuth } from '@/features/admin/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function OverviewPage() {
  const { can } = useAuth()

  const statsQuery = useQuery({
    queryKey: ['admin', 'project-stats'],
    queryFn: getProjectStatistics,
    enabled: can('projects.view'),
  })

  const inboxQuery = useQuery({
    queryKey: ['admin', 'contact', 'new-count'],
    queryFn: () => listContactMessages({ status: 'new', per_page: 1 }),
    enabled: can('contact.view'),
  })

  const stats = statsQuery.data
  const newMessages = inboxQuery.data?.meta.total ?? 0

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Resumo do portfólio e atalhos rápidos."
        actions={
          <>
            <PermissionGate permission="projects.create">
              <Button asChild>
                <Link to="/admin/projects/new">Novo projeto</Link>
              </Button>
            </PermissionGate>
            <PermissionGate permission="contact.view">
              <Button variant="outline" asChild>
                <Link to="/admin/contact">Inbox</Link>
              </Button>
            </PermissionGate>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Publicados"
          value={stats?.published}
          loading={statsQuery.isLoading}
        />
        <StatCard
          title="Drafts"
          value={stats?.draft}
          loading={statsQuery.isLoading}
        />
        <StatCard
          title="Featured"
          value={stats?.featured}
          loading={statsQuery.isLoading}
        />
        <StatCard
          title="Mensagens novas"
          value={can('contact.view') ? newMessages : undefined}
          loading={inboxQuery.isLoading}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Views totais</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular-nums">
            {statsQuery.isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              (stats?.views ?? '—')
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Arquivados</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tabular-nums">
            {statsQuery.isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              (stats?.archived ?? '—')
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  loading,
}: {
  title: string
  value?: number
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-3xl font-semibold tabular-nums">
            {value ?? '—'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
