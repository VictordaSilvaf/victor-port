export type ExperienceEntry = {
  id: string
  company: string
  role: string
  period: string
  description: string
}

export const experience: ExperienceEntry[] = [
  {
    id: 'freelance',
    company: 'Independent',
    role: 'Frontend Engineer',
    period: '2023 — Present',
    description:
      'Building polished product interfaces and motion-led marketing experiences.',
  },
  {
    id: 'studio',
    company: 'Studio North',
    role: 'Frontend Developer',
    period: '2021 — 2023',
    description:
      'Shipped design systems and interactive sites for product and brand teams.',
  },
]
