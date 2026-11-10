import { resolveProjectImage } from '@/lib/api/media'
import type { ProjectDetail, ProjectImage, ProjectSummary } from '@/lib/api/types'
import type {
  Project,
  ProjectGalleryImage,
} from '@/features/projects/types/project'

function yearFromPublishedAt(value: string | null | undefined): number {
  if (!value) return new Date().getFullYear()
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return new Date().getFullYear()
  return new Date(parsed).getFullYear()
}

function taxonomyNames(
  ...lists: Array<Array<{ name: string }> | undefined>
): string[] {
  const names = lists.flatMap((list) => list?.map((item) => item.name) ?? [])
  return [...new Set(names.filter(Boolean))]
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

export function mapProjectGallery(
  images: ProjectImage[] | undefined,
): ProjectGalleryImage[] {
  if (!images?.length) return []

  return [...images]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .flatMap((image) => {
      const src =
        (image.url && isAbsoluteUrl(image.url) ? image.url : undefined) ||
        (image.thumbnail_url && isAbsoluteUrl(image.thumbnail_url)
          ? image.thumbnail_url
          : undefined)
      if (!src) return []

      const thumb =
        image.thumbnail_url && isAbsoluteUrl(image.thumbnail_url)
          ? image.thumbnail_url
          : undefined

      return [
        {
          id: image.id,
          src,
          thumb,
          caption: image.caption?.trim() || undefined,
          order: image.order ?? 0,
        },
      ]
    })
}

export function mapProjectSummary(project: ProjectSummary): Project {
  return {
    slug: project.slug,
    title: project.title,
    description: project.description ?? '',
    year: yearFromPublishedAt(project.published_at),
    tags: [],
    image: resolveProjectImage(project),
  }
}

export function mapProjectDetail(project: ProjectDetail): Project {
  return {
    slug: project.slug,
    title: project.title,
    description: project.description ?? '',
    overview: project.content ?? project.description ?? undefined,
    year: yearFromPublishedAt(project.published_at),
    tags: taxonomyNames(project.technologies, project.tags, project.categories),
    image: resolveProjectImage(project),
    url: project.demo_url ?? project.repository_url ?? undefined,
    gallery: mapProjectGallery(project.images),
  }
}
