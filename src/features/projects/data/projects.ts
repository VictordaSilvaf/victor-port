import type { Project } from '@/features/projects/types/project'

export const projects: Project[] = [
  {
    slug: 'atelier',
    title: 'Atelier',
    description: 'A brand system and marketing site for a design studio.',
    year: 2025,
    tags: ['React', 'Motion', 'Design Systems'],
    url: '#',
  },
  {
    slug: 'northline',
    title: 'Northline',
    description: 'Product dashboard with real-time analytics and soft motion.',
    year: 2024,
    tags: ['TypeScript', 'Vite', 'GSAP'],
    url: '#',
  },
  {
    slug: 'signal',
    title: 'Signal',
    description: 'Portfolio experience focused on scroll storytelling.',
    year: 2024,
    tags: ['Lenis', 'Motion', 'UI'],
    url: '#',
  },
]
