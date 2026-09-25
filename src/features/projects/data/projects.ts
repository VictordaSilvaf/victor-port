import img1 from '@/assets/images/img1.webp'
import img2 from '@/assets/images/img2.webp'
import img3 from '@/assets/images/img3.webp'
import img4 from '@/assets/images/img4.webp'
import img5 from '@/assets/images/img5.webp'
import type { Project } from '@/features/projects/types/project'

export const projects: Project[] = [
  {
    slug: 'atelier',
    title: 'Atelier',
    description: 'Carteira cripto com foco em clareza e interações suaves.',
    year: 2025,
    tags: ['React Native', 'Motion', 'Fintech'],
    image: img1,
    url: '#',
  },
  {
    slug: 'northline',
    title: 'Northline',
    description: 'Gamificação de consumo de energia com badges e ranking.',
    year: 2024,
    tags: ['TypeScript', 'Design System', 'Mobile'],
    image: img2,
    url: '#',
  },
  {
    slug: 'signal',
    title: 'Signal',
    description: 'Monitoramento de dados móveis em tempo real.',
    year: 2024,
    tags: ['Android', 'Data Viz', 'UX'],
    image: img3,
    url: '#',
  },
  {
    slug: 'prepay',
    title: 'Prepay',
    description: 'Gestão de saldo e pacotes para operadora de telefonia.',
    year: 2023,
    tags: ['iOS', 'Payments', 'UI'],
    image: img4,
    url: '#',
  },
  {
    slug: 'gridline',
    title: 'Gridline',
    description: 'Consulta de consumo e agenda de manutenção elétrica.',
    year: 2023,
    tags: ['React', 'Charts', 'Utilities'],
    image: img5,
    url: '#',
  },
]
