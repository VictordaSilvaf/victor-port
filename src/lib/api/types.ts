export type TaxonomyItem = {
  id: string
  name: string
  slug: string
}

export type ProjectImage = {
  id: string
  upload_id: string
  caption: string | null
  order: number
  url: string | null
  path: string | null
}

export type ProjectSummary = {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  featured: boolean
  sort_order?: number
  order?: number
  thumbnail: string | null
  cover: string | null
  thumbnail_url?: string | null
  cover_url?: string | null
  published_at: string | null
  views?: number
  created_at?: string
  updated_at?: string
}

export type ProjectDetail = ProjectSummary & {
  content: string | null
  repository_url: string | null
  demo_url: string | null
  categories: TaxonomyItem[]
  technologies: TaxonomyItem[]
  tags: TaxonomyItem[]
  images: ProjectImage[]
}

export type Paginated<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    per_page: number
  }
}

export type SiteContact = {
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: {
    line1?: string | null
    city?: string | null
    country?: string | null
  } | null
  notification_email?: string | null
}

export type SiteSeo = {
  site_name?: string | null
  default_meta_description?: string | null
  default_og_image_id?: string | null
  twitter_site?: string | null
  google_site_verification?: string | null
  locale?: string | null
}

export type SiteNavItem = {
  label?: string
  href?: string
  [key: string]: unknown
}

export type SiteSettings = {
  nav: SiteNavItem[] | Record<string, unknown> | unknown[]
  footer: unknown
  social: Record<string, string> | unknown[] | null
  branding: unknown
  seo: SiteSeo | null
  contact: SiteContact | null
  updated_at?: string | null
}

export type SiteSettingsResponse = {
  data: SiteSettings
}

export type ProjectDetailResponse = {
  data: ProjectDetail
}

export type RelatedProjectsResponse = {
  data: ProjectSummary[]
}

export type ContactSubmitBody = {
  name: string
  email: string
  message: string
  subject?: string | null
  website?: string
  cf_turnstile_response?: string
}

export type ContactSubmitResponse = {
  message: string
}
