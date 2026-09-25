export type AboutSkill = {
  title: string
  level: 'Advanced' | 'Working' | 'Learning'
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
      'Software engineer focado em arquitetura, sistemas distribuídos e construção de produtos digitais.',

    support:
      'Minha atuação vai além de implementar funcionalidades. Trabalho na definição de arquitetura, modelagem de domínio, integração entre serviços e evolução de sistemas existentes. Uso DDD, arquitetura hexagonal, SOLID, testes automatizados e princípios de engenharia para transformar problemas complexos em sistemas simples de evoluir.',

    resumeHref: '/resume.pdf',
    resumeLabel: 'Baixar currículo',
  },

  skillsTitle: 'Como eu penso software',

  skills: [
    {
      title: 'Arquitetura de software',
      level: 'Advanced',
      description:
        'Desenho sistemas pensando em domínio, responsabilidades, dependências e evolução. DDD, arquitetura hexagonal, modularização, eventos e padrões que ajudam sistemas complexos a continuarem compreensíveis.',
    },

    {
      title: 'Backend & sistemas distribuídos',
      level: 'Advanced',
      description:
        'Construção de APIs e serviços com PHP, Laravel, Slim e NestJS. Trabalho com mensageria, filas, integrações, persistência, cache e processamento assíncrono, sempre considerando consistência, observabilidade e escalabilidade.',
    },

    {
      title: 'Frontend & Mobile',
      level: 'Advanced',
      description:
        'React e React Native para construir interfaces que não sejam apenas funcionais, mas consistentes com a arquitetura e as necessidades do produto. Experiência com aplicações web, mobile e integrações com serviços backend.',
    },

    {
      title: 'Engenharia & qualidade',
      level: 'Advanced',
      description:
        'Código limpo é consequência de boas decisões de design. Trabalho com testes automatizados, TDD, code review, refatoração, padrões de projeto e práticas que reduzem o custo de mudança ao longo do tempo.',
    },

    {
      title: 'Infraestrutura & integração',
      level: 'Working',
      description:
        'Docker, Redis, RabbitMQ, PostgreSQL, Elasticsearch e ambientes distribuídos. Experiência conectando diferentes sistemas e lidando com os problemas que aparecem quando software deixa de ser apenas código.',
    },
  ] satisfies AboutSkill[],

  experienceTitle: 'Experiência &',
  experienceTitleAccent: 'evolução',

  jobs: [
    {
      company: 'TradeUp Group',
      location: 'Barueri, SP',
      role: 'Desenvolvedor Full-Stack 2',
      period: 'Abr 2026 — Presente',
      paragraphs: [
        'Atuo na evolução de plataformas de telecomunicações com foco em **arquitetura, escalabilidade, performance e confiabilidade**. Trabalho na definição e evolução de componentes de backend utilizando **Laravel** e **Slim**, aplicando **DDD**, arquitetura hexagonal e princípios de design orientados a domínio.',
        'Participo de decisões que atravessam diferentes camadas do sistema: modelagem de domínio, integrações, processamento assíncrono, persistência, SQL, APIs e fluxos críticos de negócio. Também contribuo em **React** e **React Native**, conectando decisões de arquitetura entre backend, frontend e mobile.',
        'Entre os desafios estão integrações externas, fluxos de pedidos, biometria, automações e evolução de sistemas existentes sem interromper operações. Também atuo na qualidade do software através de testes, revisão de código e definição de padrões técnicos.',
      ],
    },

    {
      company: 'Noweb Publicidade',
      location: 'São Paulo, SP',
      role: 'Desenvolvedor Full Stack',
      period: 'Jul 2023 — Ago 2025',
      paragraphs: [
        'Atuei como principal desenvolvedor de uma plataforma imobiliária SaaS utilizada por **mais de 2.000 corretores**, com um catálogo de **mais de 5.000 imóveis**. Além do desenvolvimento, participei diretamente das decisões técnicas e da evolução da arquitetura da plataforma.',
        'No backend, trabalhei principalmente com **Laravel**, filas, WebSockets, distribuição de leads e integrações. No frontend, utilizei **React.js** e Livewire, além de **React Native** no aplicativo mobile.',
        'Também conduzi refatorações de sistemas legados, code reviews e padronização técnica, buscando reduzir acoplamento e tornar a base de código mais previsível para o crescimento do produto e do time.',
      ],
    },

    {
      company: 'Lampada Global',
      location: 'São Paulo, SP',
      role: 'Programador de Sistemas de Informação',
      period: 'Mar 2023 — Abr 2023',
      paragraphs: [
        'Atuei na manutenção e evolução de um CRM legado baseado em **SugarCRM**, trabalhando com PHP e integrações existentes. Também desenvolvi scripts para migração e processamento de grandes volumes de dados.',
      ],
    },

    {
      company: 'Desicon Ferragens',
      location: 'São Paulo, SP',
      role: 'Desenvolvedor Web',
      period: 'Jul 2021 — Abr 2023',
      paragraphs: [
        'Desenvolvi de ponta a ponta uma plataforma de vendas **B2B e B2C**, conectando frontend, backend e serviços externos. A solução utilizava **Laravel** e integrações com ERP, e-commerce, gateways de pagamento e logística.',
        'Minha trajetória começou como estagiário e evoluiu para desenvolvedor em aproximadamente um ano, acompanhando o aumento da responsabilidade sobre o produto e suas decisões técnicas.',
      ],
    },
  ] satisfies AboutJob[],

  education: [
    {
      school: 'Centro Universitário Senac',
      degree: 'Sistemas para Internet — Tecnologia da Informação',
      period: '2019 — 2021',
      description:
        'Formação que construiu minha base em desenvolvimento de software, sistemas de informação, desenvolvimento web e resolução de problemas.',
    },
  ] satisfies AboutEducation[],

  closing: {
    line1:
      'Minha experiência começou escrevendo funcionalidades e evoluiu para pensar em como sistemas inteiros devem ser construídos, integrados e mantidos.',

    line2:
      'Hoje meu foco está em transformar complexidade em arquitetura compreensível: sistemas que suportam crescimento sem transformar cada nova mudança em um problema.',
  },

  cta: {
    title: 'Vamos construir algo?',
    button: 'Entrar em contato',
    href: '/contato',
  },
} as const