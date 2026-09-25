export type ExperienceEntry = {
  id: string
  company: string
  role: string
  period: string
  description: string
}

export const experience: ExperienceEntry[] = [
  {
    id: 'tradeup',
    company: 'TradeUp Group',
    role: 'Desenvolvedor Full-Stack 2',
    period: 'Abr 2026 — Presente',
    description:
      'Plataforma de telecom em alta escala com Laravel, Slim, DDD e React/React Native.',
  },
  {
    id: 'noweb',
    company: 'Noweb Publicidade',
    role: 'Desenvolvedor Full Stack',
    period: 'Jul 2023 — Ago 2025',
    description:
      'SaaS imobiliário com +5k imóveis e +2k corretores — Laravel, React e React Native.',
  },
  {
    id: 'lampada',
    company: 'Lampada Global',
    role: 'Programador de sistemas',
    period: 'Mar 2023 — Abr 2023',
    description:
      'Funcionalidades e migrações em CRM legado (SugarCRM) com PHP puro.',
  },
  {
    id: 'desicon',
    company: 'Desicon Ferragens',
    role: 'Desenvolvedor Web',
    period: 'Jul 2021 — Abr 2023',
    description:
      'PDV B2B/B2C com Laravel, integrações ERP, e-commerce, pagamento e logística.',
  },
]
