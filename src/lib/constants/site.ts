export const siteConfig = {
  name: 'Victor Fernandes',
  role: 'Frontend Engineer',
  email: 'hello@victorfernandes.dev',
  description:
    'Frontend engineer crafting thoughtful interfaces with motion and craft.',
  socials: [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Email', href: 'mailto:hello@victorfernandes.dev' },
  ],
  navItems: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ],
} as const

export type SiteConfig = typeof siteConfig
