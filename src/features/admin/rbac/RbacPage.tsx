import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createRole,
  deleteRole,
  listPermissions,
  listRoles,
  syncRolePermissions,
} from '@/lib/api/admin-users'
import { ApiError } from '@/lib/api/client'
import { PageHeader, EmptyState } from '@/features/admin/shared/PageHeader'
import { PermissionGate } from '@/features/admin/shared/PermissionGate'
import { ConfirmDialog } from '@/features/admin/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function RbacPage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const rolesQuery = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: listRoles,
  })
  const permissionsQuery = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: listPermissions,
  })

  const roles = rolesQuery.data ?? []
  const permissions = permissionsQuery.data ?? []

  const createMutation = useMutation({
    mutationFn: () => createRole({ name, slug }),
    onSuccess: async () => {
      toast.success('Role criada')
      setName('')
      setSlug('')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    },
  })

  const syncMutation = useMutation({
    mutationFn: () => syncRolePermissions(selectedRoleId!, permissionIds),
    onSuccess: async () => {
      toast.success('Permissões atualizadas')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: async () => {
      toast.success('Role eliminada')
      setDeleteId(null)
      if (selectedRoleId === deleteId) setSelectedRoleId(null)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    },
  })

  function selectRole(roleId: string) {
    setSelectedRoleId(roleId)
    const role = roles.find((item) => item.id === roleId)
    const current =
      role?.permissions?.map((permission) => permission.id) ?? []
    setPermissionIds(current)
  }

  return (
    <div>
      <PageHeader
        title="RBAC"
        description="Papéis e permissões do painel."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rolesQuery.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : roles.length === 0 ? (
              <EmptyState title="Sem roles" />
            ) : (
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <button
                      type="button"
                      className="text-left text-sm font-medium hover:underline"
                      onClick={() => selectRole(role.id)}
                    >
                      {role.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {role.slug}
                      </span>
                    </button>
                    <PermissionGate permission="roles.delete">
                      <Button
                        size="xs"
                        variant="destructive"
                        disabled={role.is_system}
                        onClick={() => setDeleteId(role.id)}
                      >
                        Del
                      </Button>
                    </PermissionGate>
                  </div>
                ))}
              </div>
            )}

            <PermissionGate permission="roles.create">
              <div className="space-y-2 border-t pt-4">
                <Label>Nova role</Label>
                <Input
                  placeholder="Nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Input
                  placeholder="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                />
                <Button
                  disabled={!name || !slug || createMutation.isPending}
                  onClick={() => createMutation.mutate()}
                >
                  Criar
                </Button>
              </div>
            </PermissionGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Permissões
              {selectedRoleId
                ? ` · ${roles.find((role) => role.id === selectedRoleId)?.name ?? ''}`
                : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedRoleId ? (
              <p className="text-sm text-muted-foreground">
                Selecione uma role para editar permissões.
              </p>
            ) : permissionsQuery.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="max-h-80 space-y-2 overflow-auto rounded-lg border p-3">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Checkbox
                        checked={permissionIds.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          setPermissionIds((prev) =>
                            checked
                              ? [...prev, permission.id]
                              : prev.filter((id) => id !== permission.id),
                          )
                        }}
                      />
                      <span>
                        <span className="font-medium">{permission.slug}</span>
                        {permission.description ? (
                          <span className="block text-xs text-muted-foreground">
                            {permission.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>
                <PermissionGate permission="roles.assign_permissions">
                  <Button
                    disabled={syncMutation.isPending}
                    onClick={() => syncMutation.mutate()}
                  >
                    Guardar permissões
                  </Button>
                </PermissionGate>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar role?"
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteId) await deleteMutation.mutateAsync(deleteId)
        }}
      />
    </div>
  )
}
