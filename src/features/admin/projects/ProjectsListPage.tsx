import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  archiveAdminProject,
  deleteAdminProject,
  duplicateAdminProject,
  listAdminProjects,
  publishAdminProject,
  reorderAdminProjects,
} from '@/lib/api/admin-projects'
import { ApiError } from '@/lib/api/client'
import { PageHeader, EmptyState } from '@/features/admin/shared/PageHeader'
import { PermissionGate } from '@/features/admin/shared/PermissionGate'
import { ConfirmDialog } from '@/features/admin/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function ProjectsListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ['admin', 'projects', { search, status, page }],
    queryFn: () =>
      listAdminProjects({
        page,
        per_page: 20,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        sort: 'sort_order',
        direction: 'asc',
      }),
  })

  const items = query.data?.data ?? []
  const meta = query.data?.meta

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })

  const actionMutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string
      action: 'publish' | 'archive' | 'duplicate' | 'delete'
    }) => {
      switch (action) {
        case 'publish':
          return publishAdminProject(id)
        case 'archive':
          return archiveAdminProject(id)
        case 'duplicate':
          return duplicateAdminProject(id)
        case 'delete':
          return deleteAdminProject(id)
      }
    },
    onSuccess: async (_, vars) => {
      toast.success(
        vars.action === 'delete' ? 'Projeto eliminado' : 'Projeto atualizado',
      )
      setDeleteId(null)
      await invalidate()
      await queryClient.invalidateQueries({ queryKey: ['admin', 'project-stats'] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha na ação')
    },
  })

  const reorderMutation = useMutation({
    mutationFn: reorderAdminProjects,
    onSuccess: async () => {
      toast.success('Ordem atualizada')
      await invalidate()
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha ao reordenar')
    },
  })

  const orderedIds = useMemo(() => items.map((item) => item.id), [items])

  function move(id: string, direction: -1 | 1) {
    const index = orderedIds.indexOf(id)
    const next = index + direction
    if (index < 0 || next < 0 || next >= orderedIds.length) return
    const nextIds = [...orderedIds]
    const [removed] = nextIds.splice(index, 1)
    nextIds.splice(next, 0, removed!)
    reorderMutation.mutate(
      nextIds.map((projectId, order) => ({ id: projectId, order: order + 1 })),
    )
  }

  return (
    <div>
      <PageHeader
        title="Projetos"
        description="Gerir portfolio, publicação e ordem de destaque."
        actions={
          <PermissionGate permission="projects.create">
            <Button asChild>
              <Link to="/admin/projects/new">Novo projeto</Link>
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar…"
          value={search}
          onChange={(event) => {
            setPage(1)
            setSearch(event.target.value)
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1)
            setStatus(value)
          }}
        >
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum projeto"
          description="Crie o primeiro projeto para aparecer no site."
          actionHref="/admin/projects/new"
          actionLabel="Criar projeto"
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      to={`/admin/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      /{project.slug}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.status}</Badge>
                  </TableCell>
                  <TableCell>{project.featured ? 'Sim' : '—'}</TableCell>
                  <TableCell className="tabular-nums">
                    {project.views ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-1">
                      <PermissionGate permission="projects.update">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => move(project.id, -1)}
                        >
                          ↑
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => move(project.id, 1)}
                        >
                          ↓
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission="projects.publish">
                        {project.status !== 'published' ? (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              actionMutation.mutate({
                                id: project.id,
                                action: 'publish',
                              })
                            }
                          >
                            Publish
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              actionMutation.mutate({
                                id: project.id,
                                action: 'archive',
                              })
                            }
                          >
                            Archive
                          </Button>
                        )}
                      </PermissionGate>
                      <PermissionGate permission="projects.create">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            actionMutation.mutate({
                              id: project.id,
                              action: 'duplicate',
                            })
                          }
                        >
                          Dup
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission="projects.delete">
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => setDeleteId(project.id)}
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
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {meta.total} projetos · página {meta.page}
          </span>
          <div className="flex gap-2">
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
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar projeto?"
        description="Soft delete. Pode restaurar depois no detalhe se a API permitir."
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
