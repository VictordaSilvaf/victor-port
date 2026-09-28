import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from '@/lib/api/admin-pages'
import { ApiError } from '@/lib/api/client'
import type { SiteSettings } from '@/lib/api/types'
import { PageHeader } from '@/features/admin/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type SettingsForm = {
  site_name: string
  default_meta_description: string
  locale: string
  email: string
  phone: string
  whatsapp: string
  github: string
  linkedin: string
  instagram: string
  nav_json: string
}

export function SettingsPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['admin', 'site-settings'],
    queryFn: getAdminSiteSettings,
  })

  const form = useForm<SettingsForm>({
    defaultValues: {
      site_name: '',
      default_meta_description: '',
      locale: 'pt_BR',
      email: '',
      phone: '',
      whatsapp: '',
      github: '',
      linkedin: '',
      instagram: '',
      nav_json: '[]',
    },
  })

  useEffect(() => {
    const data = query.data
    if (!data) return
    const social =
      data.social && !Array.isArray(data.social)
        ? (data.social as Record<string, string>)
        : {}
    form.reset({
      site_name: data.seo?.site_name ?? '',
      default_meta_description: data.seo?.default_meta_description ?? '',
      locale: data.seo?.locale ?? 'pt_BR',
      email: data.contact?.email ?? '',
      phone: data.contact?.phone ?? '',
      whatsapp: data.contact?.whatsapp ?? '',
      github: social.github ?? '',
      linkedin: social.linkedin ?? '',
      instagram: social.instagram ?? '',
      nav_json: JSON.stringify(data.nav ?? [], null, 2),
    })
  }, [query.data, form])

  const mutation = useMutation({
    mutationFn: async (values: SettingsForm) => {
      let nav: SiteSettings['nav']
      try {
        nav = JSON.parse(values.nav_json) as SiteSettings['nav']
      } catch {
        throw new Error('Nav JSON inválido')
      }
      return updateAdminSiteSettings({
        seo: {
          site_name: values.site_name || null,
          default_meta_description: values.default_meta_description || null,
          locale: values.locale || null,
        },
        contact: {
          email: values.email || null,
          phone: values.phone || null,
          whatsapp: values.whatsapp || null,
        },
        social: {
          ...(values.github ? { github: values.github } : {}),
          ...(values.linkedin ? { linkedin: values.linkedin } : {}),
          ...(values.instagram ? { instagram: values.instagram } : {}),
        },
        nav,
      })
    },
    onSuccess: async () => {
      toast.success('Settings guardados')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'site-settings'] })
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Falha ao guardar',
      )
    },
  })

  if (query.isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="SEO, contacto, social e navegação global."
      />
      <form
        className="grid gap-4 lg:grid-cols-2"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Site name">
              <Input {...form.register('site_name')} />
            </Field>
            <Field label="Default meta description">
              <Textarea rows={3} {...form.register('default_meta_description')} />
            </Field>
            <Field label="Locale">
              <Input {...form.register('locale')} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Email">
              <Input {...form.register('email')} />
            </Field>
            <Field label="Phone">
              <Input {...form.register('phone')} />
            </Field>
            <Field label="WhatsApp URL">
              <Input {...form.register('whatsapp')} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="GitHub">
              <Input {...form.register('github')} />
            </Field>
            <Field label="LinkedIn">
              <Input {...form.register('linkedin')} />
            </Field>
            <Field label="Instagram">
              <Input {...form.register('instagram')} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nav JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea rows={10} className="font-mono text-xs" {...form.register('nav_json')} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'A guardar…' : 'Guardar settings'}
          </Button>
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
