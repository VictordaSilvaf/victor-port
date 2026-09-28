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
    overview:
      'Produto mobile de carteira cripto onde a prioridade era reduzir atrito: fluxos claros, feedback imediato e motion que explica o estado sem poluir a interface.',
    year: 2025,
    role: 'Product Frontend',
    tags: ['React Native', 'Motion', 'Fintech'],
    image: img1,
    url: '#',
  },
  {
    slug: 'northline',
    title: 'Northline',
    description: 'Gamificação de consumo de energia com badges e ranking.',
    overview:
      'App de utilidades com gamificação de consumo: badges, ranking e loops de hábito pensados para engajar sem parecer um jogo genérico.',
    year: 2024,
    role: 'Frontend & Design System',
    tags: ['TypeScript', 'Design System', 'Mobile'],
    image: img2,
    url: '#',
  },
  {
    slug: 'signal',
    title: 'Signal',
    description: 'Monitoramento de dados móveis em tempo real.',
    overview:
      'Dashboard e experiência mobile para monitoramento de dados em tempo real — hierarquia visual forte e leitura rápida sob pressão.',
    year: 2024,
    role: 'Frontend',
    tags: ['Android', 'Data Viz', 'UX'],
    image: img3,
    url: '#',
  },
  {
    slug: 'prepay',
    title: 'Prepay',
    description: 'Gestão de saldo e pacotes para operadora de telefonia.',
    overview:
      'Fluxos de recarga e gestão de pacotes para operadora: estados críticos, confirmações claras e UI que aguenta volume de uso diário.',
    year: 2023,
    role: 'Mobile UI',
    tags: ['iOS', 'Payments', 'UI'],
    image: img4,
    url: '#',
  },
  {
    slug: 'gridline',
    title: 'Gridline',
    description: 'Consulta de consumo e agenda de manutenção elétrica.',
    overview:
      'Ferramenta para consulta de consumo e agenda de manutenção — gráficos legíveis e navegação objetiva para times de campo e backoffice.',
    year: 2023,
    role: 'Frontend',
    tags: ['React', 'Charts', 'Utilities'],
    image: img5,
    url: '#',
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug) ?? null
}

export function getProjectIndex(slug: string) {
  return projects.findIndex((project) => project.slug === slug)
}

export function getAdjacentProjects(slug: string) {
  const index = getProjectIndex(slug)
  if (index < 0) return { prev: null, next: null, index: -1 }

  return {
    index,
    prev: index > 0 ? projects[index - 1]! : null,
    next: index < projects.length - 1 ? projects[index + 1]! : null,
  }
}
