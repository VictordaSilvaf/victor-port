import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  addProjectImage,
  createAdminProject,
  getAdminProject,
  patchAdminProject,
  removeProjectImage,
  setProjectCover,
  setProjectThumbnail,
  updateAdminProject,
} from '@/lib/api/admin-projects'
import { uploadFile } from '@/lib/api/admin-uploads'
import {
  listCategories,
  listTags,
  listTechnologies,
} from '@/lib/api/admin-users'
import { ApiError } from '@/lib/api/client'
import type { ProjectDetail, TaxonomyItem } from '@/lib/api/types'
import { EmptyState, PageHeader } from '@/features/admin/shared/PageHeader'
import { PermissionGate } from '@/features/admin/shared/PermissionGate'
import { Badge } from '@/components/ui/badge'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  repository_url: z.string().optional(),
  demo_url: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
})

type FormValues = z.infer<typeof schema>

function projectToFormValues(project?: ProjectDetail): FormValues {
  return {
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    description: project?.description ?? '',
    content: project?.content ?? '',
    repository_url: project?.repository_url ?? '',
    demo_url: project?.demo_url ?? '',
    status: (project?.status as FormValues['status']) || 'draft',
    featured: Boolean(project?.featured),
  }
}

export function ProjectFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'

  const projectQuery = useQuery({
    queryKey: ['admin', 'project', id],
    queryFn: () => getAdminProject(id!),
    enabled: !isNew,
  })

  const technologiesQuery = useQuery({
    queryKey: ['taxonomies', 'technologies'],
    queryFn: listTechnologies,
  })
  const categoriesQuery = useQuery({
    queryKey: ['taxonomies', 'categories'],
    queryFn: listCategories,
  })
  const tagsQuery = useQuery({
    queryKey: ['taxonomies', 'tags'],
    queryFn: listTags,
  })

  if (!isNew && projectQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (!isNew && (projectQuery.isError || !projectQuery.data)) {
    return (
      <EmptyState
        title="Projeto não encontrado"
        description={
          projectQuery.error instanceof ApiError
            ? projectQuery.error.message
            : 'Não foi possível carregar o projeto para edição.'
        }
        actionHref="/admin/projects"
        actionLabel="Voltar à lista"
      />
    )
  }

  return (
    <ProjectFormFields
      key={projectQuery.data?.id ?? 'new'}
      isNew={isNew}
      project={projectQuery.data}
      categories={categoriesQuery.data ?? []}
      technologies={technologiesQuery.data ?? []}
      tags={tagsQuery.data ?? []}
    />
  )
}

function ProjectFormFields({
  isNew,
  project,
  categories,
  technologies,
  tags,
}: {
  isNew: boolean
  project?: ProjectDetail
  categories: TaxonomyItem[]
  technologies: TaxonomyItem[]
  tags: TaxonomyItem[]
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const projectId = project?.id

  const [categoryIds, setCategoryIds] = useState<string[]>(
    () => project?.categories?.map((item) => item.id) ?? [],
  )
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    () => project?.technologies?.map((item) => item.id) ?? [],
  )
  const [tagIds, setTagIds] = useState<string[]>(
    () => project?.tags?.map((item) => item.id) ?? [],
  )
  const [uploading, setUploading] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | undefined>()
  const [thumbPreview, setThumbPreview] = useState<string | undefined>()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: projectToFormValues(project),
  })

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const body = {
        title: values.title,
        slug: values.slug || undefined,
        description: values.description || null,
        content: values.content || null,
        repository_url: values.repository_url || null,
        demo_url: values.demo_url || null,
        // Preserve existing media paths on full PUT (API replaces them when omitted).
        thumbnail: project?.thumbnail ?? null,
        cover: project?.cover ?? null,
        status: values.status,
        featured: values.featured,
        categories: categoryIds,
        technologies: technologyIds,
        tags: tagIds,
      }
      if (isNew) return createAdminProject(body)
      return updateAdminProject(projectId!, body)
    },
    onSuccess: async (saved) => {
      toast.success(isNew ? 'Projeto criado' : 'Projeto atualizado')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'project-stats'] })
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'project', saved.id],
      })
      form.reset(projectToFormValues(saved))
      setCategoryIds(saved.categories?.map((item) => item.id) ?? [])
      setTechnologyIds(saved.technologies?.map((item) => item.id) ?? [])
      setTagIds(saved.tags?.map((item) => item.id) ?? [])
      if (isNew) {
        navigate(`/admin/projects/${saved.id}`, { replace: true })
      }
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Falha ao guardar')
    },
  })

  const mediaMutation = useMutation({
    mutationFn: async ({
      file,
      kind,
    }: {
      file: File
      kind: 'thumbnail' | 'cover' | 'gallery'
    }) => {
      if (isNew || !projectId) {
        throw new Error('Guarde o projeto antes de enviar mídia')
      }
      const localPreview = URL.createObjectURL(file)
      if (kind === 'cover') setCoverPreview(localPreview)
      if (kind === 'thumbnail') setThumbPreview(localPreview)

      setUploading(true)
      try {
        const uploaded = await uploadFile(file)
        if (kind === 'gallery') {
          await addProjectImage(projectId, { image_id: uploaded.id })
        } else if (kind === 'thumbnail') {
          await setProjectThumbnail(projectId, uploaded.id)
          if (uploaded.path) {
            await patchAdminProject(projectId, { thumbnail: uploaded.path })
          }
          const remote =
            uploaded.thumbnail_url || uploaded.display_url || uploaded.url
          if (remote) setThumbPreview(remote)
        } else {
          await setProjectCover(projectId, uploaded.id)
          if (uploaded.path) {
            await patchAdminProject(projectId, { cover: uploaded.path })
          }
          const remote = uploaded.display_url || uploaded.url
          if (remote) setCoverPreview(remote)
        }
        return uploaded
      } finally {
        setUploading(false)
      }
    },
    onSuccess: async () => {
      toast.success('Mídia atualizada')
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'project', projectId],
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha no upload',
      )
    },
  })

  const removeImageMutation = useMutation({
    mutationFn: (imageId: string) => removeProjectImage(projectId!, imageId),
    onSuccess: async () => {
      toast.success('Imagem removida')
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'project', projectId],
      })
    },
  })

  const coverUrl =
    coverPreview ||
    (project?.cover_url && /^https?:\/\//i.test(project.cover_url)
      ? project.cover_url
      : undefined)
  const thumbUrl =
    thumbPreview ||
    (project?.thumbnail_url && /^https?:\/\//i.test(project.thumbnail_url)
      ? project.thumbnail_url
      : undefined)

  const taxonomyGroups = useMemo(
    () => [
      {
        label: 'Categorias',
        items: categories,
        selected: categoryIds,
        setSelected: setCategoryIds,
      },
      {
        label: 'Tecnologias',
        items: technologies,
        selected: technologyIds,
        setSelected: setTechnologyIds,
      },
      {
        label: 'Tags',
        items: tags,
        selected: tagIds,
        setSelected: setTagIds,
      },
    ],
    [
      categories,
      technologies,
      tags,
      categoryIds,
      technologyIds,
      tagIds,
    ],
  )

  return (
    <div>
      <PageHeader
        title={isNew ? 'Novo projeto' : project?.title || 'Editar projeto'}
        description={
          isNew
            ? 'Crie e publique um case study.'
            : 'Atualize o conteúdo actual — os campos já vêm preenchidos.'
        }
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/projects">Voltar</Link>
          </Button>
        }
      />

      <form
        className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]"
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
      >
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Título">
                <Input {...form.register('title')} />
              </Field>
              <Field label="Slug (opcional)">
                <Input {...form.register('slug')} placeholder="auto do título" />
              </Field>
              <Field label="Descrição">
                <Textarea rows={3} {...form.register('description')} />
              </Field>
              <Field label="Content (markdown)">
                <Textarea rows={10} {...form.register('content')} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Demo URL">
                  <Input {...form.register('demo_url')} />
                </Field>
                <Field label="Repository URL">
                  <Input {...form.register('repository_url')} />
                </Field>
              </div>
            </CardContent>
          </Card>

          {!isNew ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Mídia</CardTitle>
                {uploading || mediaMutation.isPending ? (
                  <Badge variant="outline">Uploading…</Badge>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MediaSlot
                    label="Cover"
                    url={coverUrl}
                    onFile={(file) =>
                      mediaMutation.mutate({ file, kind: 'cover' })
                    }
                  />
                  <MediaSlot
                    label="Thumbnail"
                    url={thumbUrl}
                    onFile={(file) =>
                      mediaMutation.mutate({ file, kind: 'thumbnail' })
                    }
                  />
                </div>
                <div>
                  <Label>Galeria</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) mediaMutation.mutate({ file, kind: 'gallery' })
                      event.target.value = ''
                    }}
                  />
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {project?.images?.map((image) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-lg border"
                      >
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={image.caption ?? ''}
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-video items-center justify-center text-xs text-muted-foreground">
                            sem url
                          </div>
                        )}
                        <div className="p-2">
                          <Button
                            type="button"
                            size="xs"
                            variant="destructive"
                            onClick={() => removeImageMutation.mutate(image.id)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Status">
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) =>
                    form.setValue('status', value as FormValues['status'], {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch('featured')}
                  onCheckedChange={(checked) =>
                    form.setValue('featured', Boolean(checked), {
                      shouldDirty: true,
                    })
                  }
                />
                Featured
              </label>
              <PermissionGate
                permission={isNew ? 'projects.create' : 'projects.update'}
              >
                <Button
                  type="submit"
                  className="w-full"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'A guardar…' : 'Guardar'}
                </Button>
              </PermissionGate>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxonomias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {taxonomyGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-sm font-medium">{group.label}</p>
                  <div className="max-h-40 space-y-2 overflow-auto rounded-lg border p-2">
                    {group.items.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Vazio</p>
                    ) : (
                      group.items.map((item) => {
                        const checked = group.selected.includes(item.id)
                        return (
                          <label
                            key={item.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                group.setSelected((prev) =>
                                  value
                                    ? [...prev, item.id]
                                    : prev.filter((id) => id !== item.id),
                                )
                              }}
                            />
                            {item.name}
                          </label>
                        )
                      })
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function MediaSlot({
  label,
  url,
  onFile,
}: {
  label: string
  url?: string
  onFile: (file: File) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {url ? (
        <img
          src={url}
          alt={label}
          className="aspect-video w-full rounded-lg border object-cover"
        />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
          Sem imagem
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
      />
    </div>
  )
}
