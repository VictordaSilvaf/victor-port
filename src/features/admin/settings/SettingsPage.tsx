import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from '@/lib/api/admin-pages'
import { uploadFile } from '@/lib/api/admin-uploads'
import {
  brandingImageUrl,
  brandingUrlFromUpload,
  parseSiteBranding,
} from '@/lib/api/branding'
import { ApiError } from '@/lib/api/client'
import type { SiteBranding, SiteSettings } from '@/lib/api/types'
import { AdminImageSlot } from '@/features/admin/shared/AdminImageSlot'
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

type BrandingSlot = 'home_cta' | 'contact'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['admin', 'site-settings'],
    queryFn: getAdminSiteSettings,
  })

  const [homePreview, setHomePreview] = useState<string | undefined>()
  const [contactPreview, setContactPreview] = useState<string | undefined>()
  const [uploadingSlot, setUploadingSlot] = useState<BrandingSlot | null>(null)

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

  const branding = parseSiteBranding(query.data?.branding)
  const homeUrl =
    homePreview || brandingImageUrl(branding.home_cta_image_url ?? undefined)
  const contactUrl =
    contactPreview || brandingImageUrl(branding.contact_image_url ?? undefined)

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

  const imageMutation = useMutation({
    mutationFn: async ({
      file,
      slot,
    }: {
      file: File
      slot: BrandingSlot
    }) => {
      const localPreview = URL.createObjectURL(file)
      if (slot === 'home_cta') {
        setHomePreview((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
          return localPreview
        })
      } else {
        setContactPreview((prev) => {
          if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
          return localPreview
        })
      }

      setUploadingSlot(slot)
      try {
        const uploaded = await uploadFile(file)
        // Persist durable .jpg CDN URL — do not store premature .webp.
        const remote =
          brandingUrlFromUpload(uploaded) ||
          brandingImageUrl(uploaded.display_url || uploaded.url || undefined)

        if (!remote) {
          throw new Error('Upload sem URL pública')
        }

        const current = parseSiteBranding(
          queryClient.getQueryData<SiteSettings>(['admin', 'site-settings'])
            ?.branding ?? query.data?.branding,
        )

        const nextBranding: SiteBranding = {
          ...current,
          ...(slot === 'home_cta'
            ? {
                home_cta_image_id: uploaded.id,
                home_cta_image_url: remote,
              }
            : {
                contact_image_id: uploaded.id,
                contact_image_url: remote,
              }),
        }

        await updateAdminSiteSettings({ branding: nextBranding })
        return { slot, localPreview, remote }
      } finally {
        setUploadingSlot(null)
      }
    },
    onSuccess: async (result) => {
      toast.success(
        result.slot === 'home_cta'
          ? 'Imagem da home atualizada'
          : 'Imagem de contacto atualizada',
      )
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'site-settings'],
      })
      // Keep blob until next selection; remote is already in branding after refetch.
      if (result.slot === 'home_cta') {
        URL.revokeObjectURL(result.localPreview)
        setHomePreview(undefined)
      } else {
        URL.revokeObjectURL(result.localPreview)
        setContactPreview(undefined)
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Falha no upload da imagem',
      )
    },
  })

  if (query.isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="SEO, contacto, social, imagens e navegação global. Conteúdo da página Sobre fica em Dashboard → Sobre mim."
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Imagens do site</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <AdminImageSlot
              id="home-cta-image"
              label="Home — secção inferior"
              description="Retrato / imagem da secção “Vamos conversar” na home."
              url={homeUrl}
              uploading={uploadingSlot === 'home_cta'}
              onFile={(file) =>
                imageMutation.mutate({ file, slot: 'home_cta' })
              }
            />
            <AdminImageSlot
              id="contact-image"
              label="Página de contacto"
              description="Imagem lateral da tela de contacto."
              url={contactUrl}
              uploading={uploadingSlot === 'contact'}
              onFile={(file) =>
                imageMutation.mutate({ file, slot: 'contact' })
              }
            />
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
