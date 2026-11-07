export type ProjectGalleryImage = {
  id: string
  src: string
  thumb?: string
  caption?: string
  order: number
}

export interface Project {
  slug: string
  title: string
  description: string
  /** Longer case-study copy shown on the project page */
  overview?: string
  year: number
  tags: string[]
  image?: string
  url?: string
  role?: string
  /** Project gallery frames from the API (ordered). */
  gallery?: ProjectGalleryImage[]
}
