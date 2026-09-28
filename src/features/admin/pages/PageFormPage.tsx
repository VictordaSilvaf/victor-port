import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  createAdminPage,
  getAdminPage,
  listBlockTypes,
  syncPageBlocks,
  updateAdminPage,
  type PageBlock,
} from '@/lib/api/admin-pages'
import { ApiError } from '@/lib/api/client'
import { PageHeader } from '@/features/admin/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const schema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().optional(),
  layout: z.enum(['default', 'full-width', 'landing']),
  is_home: z.boolean(),
  status: z.enum(['draft', 'published', 'archived']),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function PageFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [blocks, setBlocks] = useState<PageBlock[]>([])

  const pageQuery = useQuery({
    queryKey: ['admin', 'page', id],
    queryFn: () => getAdminPage(id!),
    enabled: !isNew,
  })

  const blockTypesQuery = useQuery({
    queryKey: ['block-types'],
    queryFn: listBlockTypes,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      layout: 'default',
      is_home: false,
      status: 'draft',
      meta_title: '',
      meta_description: '',
    },
  })

  useEffect(() => {
    const page = pageQuery.data
    if (!page) return
    const seo = (page.seo ?? {}) as Record<string, string>
    form.reset({
      title: page.title,
      slug: page.slug,
      layout: (page.layout as FormValues['layout']) || 'default',
      is_home: Boolean(page.is_home),
      status: (page.status as FormValues['status']) || 'draft',
      meta_title: seo.meta_title ?? seo.title ?? '',
      meta_description: seo.meta_description ?? seo.description ?? '',
    })
    setBlocks(page.blocks ?? [])
  }, [pageQuery.data, form])

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const body = {
        title: values.title,
        slug: values.slug || undefined,
        layout: values.layout,
        is_home: values.is_home,
        status: values.status,
        seo: {
          meta_title: values.meta_title || undefined,
          meta_description: values.meta_description || undefined,
        },
      }
      if (isNew) return createAdminPage(body)
      const updated = await updateAdminPage(id!, body)
      await syncPageBlocks(id!, blocks)
      return updated
    },
    onSuccess: async (page) => {
      toast.success(isNew ? 'Página criada' : 'Página atualizada')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] })
      navigate(`/admin/pages/${page.id}`)
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha ao guardar')
    },
  })

  function addBlock(type: string) {
    setBlocks((prev) => [
      ...prev,
      { type, payload: {}, settings: {}, order: prev.length + 1 },
    ])
  }

  function updateBlockPayload(index: number, raw: string) {
    try {
      const payload = JSON.parse(raw) as Record<string, unknown>
      setBlocks((prev) =>
        prev.map((block, i) => (i === index ? { ...block, payload } : block)),
      )
    } catch {
      // keep typing until valid JSON
    }
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      const tmp = next[index]!
      next[index] = next[target]!
      next[target] = tmp
      return next
    })
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  if (!isNew && pageQuery.isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <PageHeader
        title={isNew ? 'Nova página' : pageQuery.data?.title || 'Editar página'}
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/pages">Voltar</Link>
          </Button>
        }
      />

      <form
        className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
      >
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input {...form.register('title')} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...form.register('slug')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Meta title</Label>
                  <Input {...form.register('meta_title')} />
                </div>
                <div className="space-y-2">
                  <Label>Meta description</Label>
                  <Input {...form.register('meta_description')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {!isNew ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base">Blocos</CardTitle>
                <Select onValueChange={addBlock}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Adicionar bloco" />
                  </SelectTrigger>
                  <SelectContent>
                    {(blockTypesQuery.data ?? []).map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-3">
                {blocks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sem blocos. Adicione a partir do seletor.
                  </p>
                ) : (
                  blocks.map((block, index) => (
                    <div key={`${block.type}-${index}`} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{block.type}</p>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            onClick={() => moveBlock(index, -1)}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            onClick={() => moveBlock(index, 1)}
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="destructive"
                            onClick={() => removeBlock(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        rows={6}
                        defaultValue={JSON.stringify(block.payload ?? {}, null, 2)}
                        onBlur={(event) =>
                          updateBlockPayload(index, event.target.value)
                        }
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Payload JSON (blur para aplicar)
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">
              Guarde a página primeiro para editar blocos.
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publicação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Layout</Label>
              <Select
                value={form.watch('layout')}
                onValueChange={(value) =>
                  form.setValue('layout', value as FormValues['layout'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">default</SelectItem>
                  <SelectItem value="full-width">full-width</SelectItem>
                  <SelectItem value="landing">landing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) =>
                  form.setValue('status', value as FormValues['status'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">draft</SelectItem>
                  <SelectItem value="published">published</SelectItem>
                  <SelectItem value="archived">archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.watch('is_home')}
                onCheckedChange={(checked) =>
                  form.setValue('is_home', Boolean(checked))
                }
              />
              Página home
            </label>
            <Button
              type="submit"
              className="w-full"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'A guardar…' : 'Guardar'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
