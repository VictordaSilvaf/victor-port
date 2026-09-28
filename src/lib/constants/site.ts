const rawSiteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ||
  'http://localhost:5173'

export const siteUrl = rawSiteUrl.replace(/\/$/, '')

export type SiteSocial = {
  label: string
  href: string
}

export type SiteNavItem = {
  label: string
  href: string
}

export type SiteConfig = {
  name: string
  role: string
  email: string
  phone?: string
  phoneHref?: string
  whatsapp?: string
  url: string
  locale: string
  language: string
  title: string
  titleTemplate: string
  description: string
  ogImage: string
  location: {
    city: string
    region: string
    country: string
  }
  socials: SiteSocial[]
  navItems: SiteNavItem[]
  routes: {
    home: { path: string; title: string; description: string }
    about: { path: string; title: string; description: string }
    contact: { path: string; title: string; description: string }
  }
}

export const siteConfig: SiteConfig = {
  name: 'Victor Fernandes',
  role: 'Software Engineer',
  email: 'victordasilvafernandes@gmail.com',
  phone: '+55 11 96911-5001',
  phoneHref: 'tel:+5511969115001',
  url: siteUrl,
  locale: 'pt_BR',
  language: 'pt-BR',
  title: 'Victor Fernandes | Software Engineer',
  titleTemplate: '%s | Victor Fernandes',
  description:
    'Software engineer fullstack em São Paulo — Laravel, React e React Native. Arquitetura, sistemas distribuídos e produtos digitais do backend ao app nas stores.',
  ogImage: '/og.png',
  location: {
    city: 'São Paulo',
    region: 'SP',
    country: 'BR',
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/victordasilvaf' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/victordasilvafernandes/',
    },
    { label: 'Email', href: 'mailto:victordasilvafernandes@gmail.com' },
  ],
  navItems: [
    { label: 'Início', href: '/' },
    { label: 'Trabalhos', href: '/#work' },
    { label: 'Sobre mim', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ],
  routes: {
    home: {
      path: '/',
      title: 'Victor Fernandes | Software Engineer',
      description:
        'Portfólio de Victor Fernandes, software engineer fullstack em São Paulo. Laravel, React, React Native, arquitetura e produtos digitais.',
    },
    about: {
      path: '/sobre',
      title: 'Sobre mim',
      description:
        'Conheça Victor Fernandes — software engineer focado em arquitetura, DDD, Laravel, React e apps React Native publicados nas stores.',
    },
    contact: {
      path: '/contato',
      title: 'Contato',
      description:
        'Fale com Victor Fernandes para projetos fullstack, arquitetura de software, Laravel, React e React Native.',
    },
  },
}

const SOCIAL_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'Twitter',
  x: 'X',
  youtube: 'YouTube',
  email: 'Email',
  mail: 'Email',
}

function phoneToHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : undefined
}

function normalizeSocials(
  social: unknown,
  fallback: SiteSocial[],
  email: string,
): SiteSocial[] {
  if (!social) return fallback

  if (Array.isArray(social)) {
    const fromArray = social
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const record = item as Record<string, unknown>
        const label = String(record.label ?? record.name ?? '').trim()
        const href = String(record.href ?? record.url ?? '').trim()
        if (!label || !href) return null
        return { label, href }
      })
      .filter((item): item is SiteSocial => Boolean(item))

    return fromArray.length > 0 ? fromArray : fallback
  }

  if (typeof social === 'object') {
    const fromObject = Object.entries(social as Record<string, unknown>)
      .map(([key, value]) => {
        const href = typeof value === 'string' ? value.trim() : ''
        if (!href) return null
        const label =
          SOCIAL_LABELS[key.toLowerCase()] ??
          key.charAt(0).toUpperCase() + key.slice(1)
        return { label, href }
      })
      .filter((item): item is SiteSocial => Boolean(item))

    if (fromObject.length === 0) return fallback

    const hasEmail = fromObject.some((item) => item.href.startsWith('mailto:'))
    if (!hasEmail && email) {
      fromObject.push({ label: 'Email', href: `mailto:${email}` })
    }
    return fromObject
  }

  return fallback
}

function normalizeNav(
  nav: unknown,
  fallback: SiteNavItem[],
): SiteNavItem[] {
  if (!Array.isArray(nav) || nav.length === 0) return fallback

  const items = nav
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      const label = String(record.label ?? '').trim()
      const href = String(record.href ?? '').trim()
      if (!label || !href) return null
      return { label, href }
    })
    .filter((item): item is SiteNavItem => Boolean(item))

  return items.length > 0 ? items : fallback
}

export function mergeSiteSettings(
  defaults: SiteConfig,
  settings: {
    seo?: {
      site_name?: string | null
      default_meta_description?: string | null
      locale?: string | null
    } | null
    contact?: {
      email?: string | null
      phone?: string | null
      whatsapp?: string | null
      address?: {
        city?: string | null
        country?: string | null
      } | null
    } | null
    social?: unknown
    nav?: unknown
  } | null,
): SiteConfig {
  if (!settings) return defaults

  const email = settings.contact?.email?.trim() || defaults.email
  const phone = settings.contact?.phone?.trim() || defaults.phone
  const name = settings.seo?.site_name?.trim() || defaults.name
  const description =
    settings.seo?.default_meta_description?.trim() || defaults.description
  const locale = settings.seo?.locale?.trim() || defaults.locale
  const city = settings.contact?.address?.city?.trim() || defaults.location.city
  const country =
    settings.contact?.address?.country?.trim() || defaults.location.country

  return {
    ...defaults,
    name,
    email,
    phone,
    phoneHref: phone ? phoneToHref(phone) : defaults.phoneHref,
    whatsapp: settings.contact?.whatsapp?.trim() || defaults.whatsapp,
    description,
    locale,
    language: locale.replace('_', '-'),
    title: `${name} | ${defaults.role}`,
    titleTemplate: `%s | ${name}`,
    location: {
      ...defaults.location,
      city,
      country,
    },
    socials: normalizeSocials(settings.social, defaults.socials, email),
    navItems: normalizeNav(settings.nav, defaults.navItems),
    routes: {
      home: {
        ...defaults.routes.home,
        title: `${name} | ${defaults.role}`,
        description,
      },
      about: defaults.routes.about,
      contact: defaults.routes.contact,
    },
  }
}

export function absoluteUrl(pathname = '/', baseUrl = siteConfig.url) {
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return pathname
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${baseUrl}${path === '/' ? '' : path}` || baseUrl
}

export function resolveOgImage(
  image: string = siteConfig.ogImage,
  baseUrl = siteConfig.url,
) {
  return absoluteUrl(image, baseUrl)
}
