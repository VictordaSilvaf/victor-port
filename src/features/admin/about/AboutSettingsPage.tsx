import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PlusIcon, Trash2Icon } from 'lucide-react'
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
import {
  defaultAboutPageContent,
  mergeAboutPageContent,
  type AboutPageContent,
} from '@/features/about/lib/merge-about'
import type {
  AboutEducation,
  AboutJob,
  AboutSkill,
} from '@/features/about/data/about'
import { AdminImageSlot } from '@/features/admin/shared/AdminImageSlot'
import { PageHeader } from '@/features/admin/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SKILL_LEVELS: AboutSkill['level'][] = ['Advanced', 'Working', 'Learning']

function emptySkill(): AboutSkill {
  return { title: '', level: 'Working', description: '' }
}

function emptyJob(): AboutJob {
  return {
    company: '',
    location: '',
    role: '',
    period: '',
    paragraphs: [''],
  }
}

function emptyEducation(): AboutEducation {
  return { school: '', degree: '', period: '', description: '' }
}

/** Persistable shape for `branding.about`. */
function serializeAbout(content: AboutPageContent) {
  return {
    hero: { ...content.hero },
    portrait: {
      src: content.portrait.src,
      alt: content.portrait.alt,
      id: content.portrait.id ?? null,
    },
    bio: { ...content.bio },
    skillsTitle: content.skillsTitle,
    skills: content.skills.map((skill) => ({ ...skill })),
    experienceTitle: content.experienceTitle,
    experienceTitleAccent: content.experienceTitleAccent,
    jobs: content.jobs.map((job) => ({
      ...job,
      paragraphs: [...job.paragraphs],
    })),
    education: content.education.map((item) => ({ ...item })),
    closing: { ...content.closing },
    cta: { ...content.cta },
  }
}

export function AboutSettingsPage() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['admin', 'site-settings'],
    queryFn: getAdminSiteSettings,
  })

  const [content, setContent] = useState<AboutPageContent>(() =>
    defaultAboutPageContent(),
  )
  const [portraitPreview, setPortraitPreview] = useState<string | undefined>()
  const [uploadingPortrait, setUploadingPortrait] = useState(false)

  useEffect(() => {
    const data = query.data
    if (!data) return
    const branding = parseSiteBranding(data.branding)
    setContent(mergeAboutPageContent(branding.about))
  }, [query.data])

  const portraitUrl =
    portraitPreview ||
    brandingImageUrl(content.portrait.src) ||
    content.portrait.src

  const saveMutation = useMutation({
    mutationFn: async (next: AboutPageContent) => {
      const current = parseSiteBranding(
        queryClient.getQueryData<SiteSettings>(['admin', 'site-settings'])
          ?.branding ?? query.data?.branding,
      )
      const nextBranding: SiteBranding = {
        ...current,
        about: serializeAbout(next),
      }
      return updateAdminSiteSettings({ branding: nextBranding })
    },
    onSuccess: async () => {
      toast.success('Página Sobre guardada')
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'site-settings'],
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Falha ao guardar',
      )
    },
  })

  const portraitMutation = useMutation({
    mutationFn: async (file: File) => {
      const localPreview = URL.createObjectURL(file)
      setPortraitPreview((prev) => {
        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
        return localPreview
      })

      setUploadingPortrait(true)
      try {
        const uploaded = await uploadFile(file)
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
        const merged = mergeAboutPageContent(current.about)
        const nextAbout: AboutPageContent = {
          ...merged,
          portrait: {
            ...merged.portrait,
            src: remote,
            id: uploaded.id,
          },
        }

        const nextBranding: SiteBranding = {
          ...current,
          about: serializeAbout(nextAbout),
        }

        await updateAdminSiteSettings({ branding: nextBranding })
        return { localPreview, nextAbout }
      } finally {
        setUploadingPortrait(false)
      }
    },
    onSuccess: async (result) => {
      toast.success('Retrato atualizado')
      setContent(result.nextAbout)
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'site-settings'],
      })
      URL.revokeObjectURL(result.localPreview)
      setPortraitPreview(undefined)
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : 'Falha no upload do retrato',
      )
    },
  })

  if (query.isLoading) return <Skeleton className="h-96 w-full" />

  return (
    <div>
      <PageHeader
        title="Sobre mim"
        description="Conteúdo completo da página /sobre — textos, retrato, skills e experiência."
      />

      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          saveMutation.mutate(content)
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hero</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label="Linha 1">
              <Input
                value={content.hero.line1}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, line1: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Linha 2">
              <Input
                value={content.hero.line2}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, line2: event.target.value },
                  }))
                }
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retrato</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_1fr]">
            <AdminImageSlot
              id="about-portrait"
              label="Imagem"
              description="Retrato circular no hero da página Sobre."
              url={portraitUrl}
              uploading={uploadingPortrait || portraitMutation.isPending}
              onFile={(file) => portraitMutation.mutate(file)}
            />
            <Field label="Alt text">
              <Input
                value={content.portrait.alt}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    portrait: { ...prev.portrait, alt: event.target.value },
                  }))
                }
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Lead">
              <Textarea
                rows={3}
                value={content.bio.lead}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    bio: { ...prev.bio, lead: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Texto de apoio">
              <Textarea
                rows={5}
                value={content.bio.support}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    bio: { ...prev.bio, support: event.target.value },
                  }))
                }
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label do currículo">
                <Input
                  value={content.bio.resumeLabel}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      bio: { ...prev.bio, resumeLabel: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="URL do currículo">
                <Input
                  value={content.bio.resumeHref}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      bio: { ...prev.bio, resumeHref: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">Skills</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  skills: [...prev.skills, emptySkill()],
                }))
              }
            >
              <PlusIcon className="size-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Título da secção">
              <Input
                value={content.skillsTitle}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    skillsTitle: event.target.value,
                  }))
                }
              />
            </Field>
            {content.skills.map((skill, index) => (
              <div
                key={`skill-${index}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">Skill {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={content.skills.length <= 1}
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                  <Field label="Título">
                    <Input
                      value={skill.title}
                      onChange={(event) =>
                        setContent((prev) => ({
                          ...prev,
                          skills: prev.skills.map((item, i) =>
                            i === index
                              ? { ...item, title: event.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Nível">
                    <select
                      className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                      value={skill.level}
                      onChange={(event) =>
                        setContent((prev) => ({
                          ...prev,
                          skills: prev.skills.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  level: event.target
                                    .value as AboutSkill['level'],
                                }
                              : item,
                          ),
                        }))
                      }
                    >
                      {SKILL_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Descrição">
                  <Textarea
                    rows={3}
                    value={skill.description}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        skills: prev.skills.map((item, i) =>
                          i === index
                            ? { ...item, description: event.target.value }
                            : item,
                        ),
                      }))
                    }
                  />
                </Field>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">Experiência</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  jobs: [...prev.jobs, emptyJob()],
                }))
              }
            >
              <PlusIcon className="size-4" />
              Adicionar cargo
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Título">
                <Input
                  value={content.experienceTitle}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      experienceTitle: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Acento do título">
                <Input
                  value={content.experienceTitleAccent}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      experienceTitleAccent: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>

            {content.jobs.map((job, index) => (
              <div
                key={`job-${index}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">Cargo {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={content.jobs.length <= 1}
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        jobs: prev.jobs.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Empresa">
                    <Input
                      value={job.company}
                      onChange={(event) =>
                        updateJob(setContent, index, {
                          company: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Local">
                    <Input
                      value={job.location}
                      onChange={(event) =>
                        updateJob(setContent, index, {
                          location: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Cargo">
                    <Input
                      value={job.role}
                      onChange={(event) =>
                        updateJob(setContent, index, {
                          role: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Período">
                    <Input
                      value={job.period}
                      onChange={(event) =>
                        updateJob(setContent, index, {
                          period: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Parágrafos (use **negrito**)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          jobs: prev.jobs.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  paragraphs: [...item.paragraphs, ''],
                                }
                              : item,
                          ),
                        }))
                      }
                    >
                      <PlusIcon className="size-4" />
                      Parágrafo
                    </Button>
                  </div>
                  {job.paragraphs.map((paragraph, pIndex) => (
                    <div key={`job-${index}-p-${pIndex}`} className="flex gap-2">
                      <Textarea
                        rows={3}
                        className="flex-1"
                        value={paragraph}
                        onChange={(event) =>
                          setContent((prev) => ({
                            ...prev,
                            jobs: prev.jobs.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    paragraphs: item.paragraphs.map(
                                      (text, ti) =>
                                        ti === pIndex
                                          ? event.target.value
                                          : text,
                                    ),
                                  }
                                : item,
                            ),
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                        disabled={job.paragraphs.length <= 1}
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            jobs: prev.jobs.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    paragraphs: item.paragraphs.filter(
                                      (_, ti) => ti !== pIndex,
                                    ),
                                  }
                                : item,
                            ),
                          }))
                        }
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">Educação</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  education: [...prev.education, emptyEducation()],
                }))
              }
            >
              <PlusIcon className="size-4" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.education.map((item, index) => (
              <div
                key={`edu-${index}`}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">Item {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={content.education.length <= 1}
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        education: prev.education.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Instituição">
                    <Input
                      value={item.school}
                      onChange={(event) =>
                        setContent((prev) => ({
                          ...prev,
                          education: prev.education.map((row, i) =>
                            i === index
                              ? { ...row, school: event.target.value }
                              : row,
                          ),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Período">
                    <Input
                      value={item.period}
                      onChange={(event) =>
                        setContent((prev) => ({
                          ...prev,
                          education: prev.education.map((row, i) =>
                            i === index
                              ? { ...row, period: event.target.value }
                              : row,
                          ),
                        }))
                      }
                    />
                  </Field>
                </div>
                <Field label="Curso / grau">
                  <Input
                    value={item.degree}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        education: prev.education.map((row, i) =>
                          i === index
                            ? { ...row, degree: event.target.value }
                            : row,
                        ),
                      }))
                    }
                  />
                </Field>
                <Field label="Descrição">
                  <Textarea
                    rows={3}
                    value={item.description}
                    onChange={(event) =>
                      setContent((prev) => ({
                        ...prev,
                        education: prev.education.map((row, i) =>
                          i === index
                            ? { ...row, description: event.target.value }
                            : row,
                        ),
                      }))
                    }
                  />
                </Field>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fecho & CTA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Fecho — linha 1">
              <Textarea
                rows={2}
                value={content.closing.line1}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    closing: { ...prev.closing, line1: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Fecho — linha 2">
              <Textarea
                rows={2}
                value={content.closing.line2}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    closing: { ...prev.closing, line2: event.target.value },
                  }))
                }
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="CTA título">
                <Input
                  value={content.cta.title}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      cta: { ...prev.cta, title: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="CTA botão">
                <Input
                  value={content.cta.button}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      cta: { ...prev.cta, button: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="CTA href">
                <Input
                  value={content.cta.href}
                  onChange={(event) =>
                    setContent((prev) => ({
                      ...prev,
                      cta: { ...prev.cta, href: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'A guardar…' : 'Guardar página Sobre'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function updateJob(
  setContent: Dispatch<SetStateAction<AboutPageContent>>,
  index: number,
  patch: Partial<AboutJob>,
) {
  setContent((prev) => ({
    ...prev,
    jobs: prev.jobs.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    ),
  }))
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
