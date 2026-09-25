export const siteConfig = {
  name: 'Victor Fernandes',
  role: 'Software Engineer',
  email: 'victordasilvafernandes@gmail.com',
  description:
  'Software engineer focado em arquitetura, sistemas distribuídos e construção de produtos digitais.',
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
} as const

export type SiteConfig = typeof siteConfig
