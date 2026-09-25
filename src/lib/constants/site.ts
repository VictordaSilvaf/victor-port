const rawSiteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ||
  'http://localhost:5173'

export const siteUrl = rawSiteUrl.replace(/\/$/, '')

export const siteConfig = {
  name: 'Victor Fernandes',
  role: 'Software Engineer',
  email: 'victordasilvafernandes@gmail.com',
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
} as const

export type SiteConfig = typeof siteConfig

export function absoluteUrl(pathname = '/') {
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return pathname
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${siteConfig.url}${path === '/' ? '' : path}` || siteConfig.url
}

export function resolveOgImage(image: string = siteConfig.ogImage) {
  return absoluteUrl(image)
}
