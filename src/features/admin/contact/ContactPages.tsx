import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getContactMessage,
  listContactMessages,
  updateContactMessageStatus,
} from '@/lib/api/admin-contact'
import { ApiError } from '@/lib/api/client'
import { PageHeader, EmptyState } from '@/features/admin/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ContactInboxPage() {
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ['admin', 'contact', status, page],
    queryFn: () =>
      listContactMessages({
        page,
        per_page: 20,
        status: status === 'all' ? undefined : status,
      }),
  })

  const items = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <div>
      <PageHeader
        title="Contacto"
        description="Inbox de mensagens do formulário público."
      />
      <div className="mb-4">
        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1)
            setStatus(value)
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {query.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : items.length === 0 ? (
        <EmptyState title="Sem mensagens" />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>De</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      to={`/admin/contact/${item.id}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                  </TableCell>
                  <TableCell>{item.subject || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleString('pt-BR')}
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
    </div>
  )
}

export function ContactDetailPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin', 'contact', id],
    queryFn: () => getContactMessage(id),
    enabled: Boolean(id),
  })

  const mutation = useMutation({
    mutationFn: (status: 'read' | 'archived') =>
      updateContactMessageStatus(id, status),
    onSuccess: async () => {
      toast.success('Status atualizado')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'contact'] })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    },
  })

  if (query.isLoading) return <Skeleton className="h-64 w-full" />
  if (!query.data) return <EmptyState title="Mensagem não encontrada" />

  const message = query.data

  return (
    <div>
      <PageHeader
        title={message.subject || 'Mensagem'}
        description={`${message.name} · ${message.email}`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/contact">Voltar</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => mutation.mutate('read')}
              disabled={mutation.isPending}
            >
              Marcar lida
            </Button>
            <Button
              onClick={() => mutation.mutate('archived')}
              disabled={mutation.isPending}
            >
              Arquivar
            </Button>
          </>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Badge variant="outline">{message.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.body}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleString('pt-BR')}
            {message.ip_address ? ` · IP ${message.ip_address}` : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
