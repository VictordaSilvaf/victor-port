import { useState } from 'react'
import { Link } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  deleteAdminPage,
  listAdminPages,
  publishAdminPage,
  archiveAdminPage,
  duplicateAdminPage,
} from '@/lib/api/admin-pages'
import { ApiError } from '@/lib/api/client'
import { PageHeader, EmptyState } from '@/features/admin/shared/PageHeader'
import { PermissionGate } from '@/features/admin/shared/PermissionGate'
import { ConfirmDialog } from '@/features/admin/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function PagesListPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['admin', 'pages', page],
    queryFn: () => listAdminPages({ page, per_page: 20 }),
  })

  const items = query.data?.data ?? []
  const meta = query.data?.meta

  const actionMutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string
      action: 'publish' | 'archive' | 'duplicate' | 'delete'
    }) => {
      if (action === 'publish') return publishAdminPage(id)
      if (action === 'archive') return archiveAdminPage(id)
      if (action === 'duplicate') return duplicateAdminPage(id)
      return deleteAdminPage(id)
    },
    onSuccess: async () => {
      toast.success('Atualizado')
      setDeleteId(null)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    },
  })

  return (
    <div>
      <PageHeader
        title="Páginas"
        description="CMS de páginas e blocos."
        actions={
          <PermissionGate permission="pages.create">
            <Button asChild>
              <Link to="/admin/pages/new">Nova página</Link>
            </Button>
          </PermissionGate>
        }
      />

      {query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhuma página"
          actionHref="/admin/pages/new"
          actionLabel="Criar página"
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Home</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      to={`/admin/pages/${item.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">/{item.slug}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.is_home ? 'Sim' : '—'}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <PermissionGate permission="pages.publish">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() =>
                            actionMutation.mutate({
                              id: item.id,
                              action:
                                item.status === 'published'
                                  ? 'archive'
                                  : 'publish',
                            })
                          }
                        >
                          {item.status === 'published' ? 'Archive' : 'Publish'}
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission="pages.create">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            actionMutation.mutate({
                              id: item.id,
                              action: 'duplicate',
                            })
                          }
                        >
                          Dup
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission="pages.delete">
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => setDeleteId(item.id)}
                        >
                          Del
                        </Button>
                      </PermissionGate>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta && meta.total > meta.per_page ? (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page * meta.per_page >= meta.total}
            onClick={() => setPage((p) => p + 1)}
          >
            Seguinte
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar página?"
        confirmLabel="Eliminar"
        destructive
        loading={actionMutation.isPending}
        onConfirm={async () => {
          if (deleteId) {
            await actionMutation.mutateAsync({ id: deleteId, action: 'delete' })
          }
        }}
      />
    </div>
  )
}
