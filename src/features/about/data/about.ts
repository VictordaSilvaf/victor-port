export type AboutSkill = {
  title: string
  level: 'Pro' | 'Noob' | 'Hobby'
  description: string
}

export type AboutJob = {
  company: string
  location: string
  role: string
  period: string
  /** Paragraphs; wrap emphasis with **like this** */
  paragraphs: string[]
}

export type AboutEducation = {
  school: string
  degree: string
  period: string
  description: string
}

export const aboutContent = {
  hero: {
    line1: 'Espera.',
    line2: 'Quem é esse cara?',
  },
  portrait: {
    src: 'https://placehold.co/800x1000',
    alt: 'Victor Fernandes',
  },
  bio: {
    lead:
      'Baseado em São Paulo, sou frontend engineer com uma obsessão séria por interfaces que se sentem vivas. Especializo em React, motion e sistemas de design — basicamente, transformar ideias em algo que as pessoas usam sem precisar de um manual do tamanho de um dicionário.',
    support:
      'Estou numa missão de entender por que as pessoas usam produtos do jeito que usam, e de deixar essas experiências tão memoráveis que até a sua avó ficaria impressionada.',
    resumeHref: '/resume.pdf',
    resumeLabel: 'Baixar currículo',
  },
  skillsTitle: 'O que eu faço',
  skills: [
    {
      title: 'Product Frontend',
      level: 'Pro',
      description:
        'Transformo ideias de produto em interfaces que ninguém quer jogar o celular pela janela. Fluidas, acessíveis e tão claras que o usuário entende no primeiro toque.',
    },
    {
      title: 'Motion & interação',
      level: 'Pro',
      description:
        'Animações com propósito — física, scroll e microinterações que dão presença sem atrapalhar. Se parece mágica, o código está trabalhando quieto.',
    },
    {
      title: 'Design Systems',
      level: 'Pro',
      description:
        'Componentes, tokens e documentação pra times não reinventarem o botão toda sprint. Consistência sem matar a personalidade do produto.',
    },
    {
      title: 'Fotografia',
      level: 'Hobby',
      description:
        'Hobby? Com certeza. Embora eu ainda esteja procurando onde deixei a câmera depois do último ensaio, dois anos atrás :)',
    },
  ] satisfies AboutSkill[],
  experienceTitle: 'Experiência &',
  experienceTitleAccent: 'educação',
  jobs: [
    {
      company: 'Independente',
      location: 'São Paulo',
      role: 'Frontend Engineer',
      period: '2023 — Presente',
      paragraphs: [
        'Construo interfaces polidas e experiências de marketing com motion pra produtos e marcas. Do protótipo ao deploy: **React**, **TypeScript**, design systems e handoff com engenharia.',
        'Colaboro de perto com founders, designers e PMs — alinhando escopo, ritmo e o detalhe que faz a diferença na tela.',
      ],
    },
    {
      company: 'Studio North',
      location: 'Remoto',
      role: 'Frontend Developer',
      period: '2021 — 2023',
      paragraphs: [
        'Entreguei sites interativos e sistemas de design pra times de produto e marca em SaaS, e-commerce e fintech. Pesquisei, prototipei e implementei ponta a ponta.',
      ],
    },
  ] satisfies AboutJob[],
  education: [
    {
      school: 'Universidade / Formação',
      degree: 'Ciência da Computação',
      period: '2017 — 2021',
      description:
        'Base sólida em algoritmos, arquitetura de software e resolução de problemas — o chão que sustenta interfaces bonitas e código que aguenta crescimento.',
    },
  ] satisfies AboutEducation[],
  closing: {
    line1:
      'Com anos de frontend, já trabalhei lado a lado com founders, product leaders e empresas em SaaS, e-commerce e fintech.',
    line2:
      'Fora do emprego formal, também tenho o hábito saudável de fazer desenvolvedores suarem de vez em quando.',
  },
  cta: {
    title: 'Bora conversar?',
    button: 'Entrar em contato',
    href: 'mailto:hello@victorfernandes.dev',
  },
} as const
