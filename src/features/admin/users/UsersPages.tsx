import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  createAdminUser,
  getAdminUser,
  listAdminUsers,
  listRoles,
  syncUserRoles,
  updateAdminUser,
} from '@/lib/api/admin-users'
import { ApiError } from '@/lib/api/client'
import { PageHeader, EmptyState } from '@/features/admin/shared/PageHeader'
import { PermissionGate } from '@/features/admin/shared/PermissionGate'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UsersListPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ['admin', 'users', search, page],
    queryFn: () =>
      listAdminUsers({
        page,
        per_page: 20,
        search: search || undefined,
      }),
  })

  const items = query.data?.items ?? []
  const total = query.data?.total ?? 0

  return (
    <div>
      <PageHeader
        title="Utilizadores"
        actions={
          <PermissionGate permission="users.create">
            <Button asChild>
              <Link to="/admin/users/new">Novo utilizador</Link>
            </Button>
          </PermissionGate>
        }
      />
      <Input
        className="mb-4 max-w-sm"
        placeholder="Buscar nome ou e-mail"
        value={search}
        onChange={(event) => {
          setPage(1)
          setSearch(event.target.value)
        }}
      />
      {query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : items.length === 0 ? (
        <EmptyState title="Sem utilizadores" />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {total > 20 ? (
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
            disabled={page * 20 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Seguinte
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function UserFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'

  const userQuery = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => getAdminUser(id!),
    enabled: !isNew,
  })

  const rolesQuery = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: listRoles,
  })

  if (!isNew && userQuery.isLoading) return <Skeleton className="h-64 w-full" />
  if (!isNew && !userQuery.data) return <EmptyState title="Utilizador não encontrado" />

  return (
    <UserFormFields
      key={userQuery.data?.id ?? 'new'}
      isNew={isNew}
      user={userQuery.data}
      roles={rolesQuery.data ?? []}
    />
  )
}

function UserFormFields({
  isNew,
  user,
  roles,
}: {
  isNew: boolean
  user?: Awaited<ReturnType<typeof getAdminUser>>
  roles: Awaited<ReturnType<typeof listRoles>>
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const derivedRoleIds = useMemo(() => {
    if (!user || roles.length === 0) return []
    return roles
      .filter(
        (role) =>
          user.roles.includes(role.slug) || user.roles.includes(role.name),
      )
      .map((role) => role.id)
  }, [user, roles])

  const [roleIds, setRoleIds] = useState<string[]>(derivedRoleIds)

  const form = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      password_confirmation: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => {
      if (isNew) {
        const created = await createAdminUser(values)
        if (roleIds.length) await syncUserRoles(created.id, roleIds)
        return created.id
      }
      await updateAdminUser(user!.id, {
        name: values.name,
        email: values.email,
      })
      await syncUserRoles(user!.id, roleIds)
      return user!.id
    },
    onSuccess: async (userId) => {
      toast.success('Utilizador guardado')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      navigate(`/admin/users/${userId}`)
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    },
  })

  return (
    <div>
      <PageHeader
        title={isNew ? 'Novo utilizador' : user?.name || 'Utilizador'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/users">Voltar</Link>
          </Button>
        }
      />
      <form
        className="mx-auto max-w-xl space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...form.register('name', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                {...form.register('email', { required: true })}
              />
            </div>
            {isNew ? (
              <>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    {...form.register('password', {
                      required: true,
                      minLength: 8,
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar senha</Label>
                  <Input
                    type="password"
                    {...form.register('password_confirmation', {
                      required: true,
                    })}
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <PermissionGate permission="users.assign_roles">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={roleIds.includes(role.id)}
                    onCheckedChange={(checked) => {
                      setRoleIds((prev) =>
                        checked
                          ? [...prev, role.id]
                          : prev.filter((value) => value !== role.id),
                      )
                    }}
                  />
                  {role.name}{' '}
                  <span className="text-muted-foreground">({role.slug})</span>
                </label>
              ))}
            </CardContent>
          </Card>
        </PermissionGate>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'A guardar…' : 'Guardar'}
        </Button>
      </form>
    </div>
  )
}
