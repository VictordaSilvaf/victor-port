import { brandingImageUrl } from '@/lib/api/branding'
import {
  aboutContent as defaultAboutContent,
  type AboutEducation,
  type AboutJob,
  type AboutSkill,
} from '@/features/about/data/about'

export type AboutPageContent = {
  hero: { line1: string; line2: string }
  portrait: { src: string; alt: string; id?: string | null }
  bio: {
    lead: string
    support: string
    resumeHref: string
    resumeLabel: string
  }
  skillsTitle: string
  skills: AboutSkill[]
  experienceTitle: string
  experienceTitleAccent: string
  jobs: AboutJob[]
  education: AboutEducation[]
  closing: { line1: string; line2: string }
  cta: { title: string; button: string; href: string }
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  return value
}

function asSkillLevel(value: unknown): AboutSkill['level'] {
  if (value === 'Advanced' || value === 'Working' || value === 'Learning') {
    return value
  }
  return 'Working'
}

function parseSkills(value: unknown, fallback: AboutSkill[]): AboutSkill[] {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value.map((item, index) => {
    const row = (item && typeof item === 'object' ? item : {}) as Record<
      string,
      unknown
    >
    const base = fallback[index] ?? fallback[0]!
    return {
      title: asString(row.title, base.title),
      level: asSkillLevel(row.level ?? base.level),
      description: asString(row.description, base.description),
    }
  })
}

function parseJobs(value: unknown, fallback: AboutJob[]): AboutJob[] {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value.map((item, index) => {
    const row = (item && typeof item === 'object' ? item : {}) as Record<
      string,
      unknown
    >
    const base = fallback[index] ?? fallback[0]!
    const paragraphs = Array.isArray(row.paragraphs)
      ? row.paragraphs.map((p) => asString(p)).filter(Boolean)
      : base.paragraphs
    return {
      company: asString(row.company, base.company),
      location: asString(row.location, base.location),
      role: asString(row.role, base.role),
      period: asString(row.period, base.period),
      paragraphs: paragraphs.length > 0 ? paragraphs : base.paragraphs,
    }
  })
}

function parseEducation(
  value: unknown,
  fallback: AboutEducation[],
): AboutEducation[] {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value.map((item, index) => {
    const row = (item && typeof item === 'object' ? item : {}) as Record<
      string,
      unknown
    >
    const base = fallback[index] ?? fallback[0]!
    return {
      school: asString(row.school, base.school),
      degree: asString(row.degree, base.degree),
      period: asString(row.period, base.period),
      description: asString(row.description, base.description),
    }
  })
}

export function defaultAboutPageContent(): AboutPageContent {
  return {
    hero: { ...defaultAboutContent.hero },
    portrait: { ...defaultAboutContent.portrait },
    bio: { ...defaultAboutContent.bio },
    skillsTitle: defaultAboutContent.skillsTitle,
    skills: defaultAboutContent.skills.map((skill) => ({ ...skill })),
    experienceTitle: defaultAboutContent.experienceTitle,
    experienceTitleAccent: defaultAboutContent.experienceTitleAccent,
    jobs: defaultAboutContent.jobs.map((job) => ({
      ...job,
      paragraphs: [...job.paragraphs],
    })),
    education: defaultAboutContent.education.map((item) => ({ ...item })),
    closing: { ...defaultAboutContent.closing },
    cta: { ...defaultAboutContent.cta },
  }
}

/** Merge API `branding.about` over static defaults. */
export function mergeAboutPageContent(raw: unknown): AboutPageContent {
  const defaults = defaultAboutPageContent()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return defaults

  const data = raw as Record<string, unknown>
  const hero = (data.hero && typeof data.hero === 'object'
    ? data.hero
    : {}) as Record<string, unknown>
  const portrait = (data.portrait && typeof data.portrait === 'object'
    ? data.portrait
    : {}) as Record<string, unknown>
  const bio = (data.bio && typeof data.bio === 'object'
    ? data.bio
    : {}) as Record<string, unknown>
  const closing = (data.closing && typeof data.closing === 'object'
    ? data.closing
    : {}) as Record<string, unknown>
  const cta = (data.cta && typeof data.cta === 'object'
    ? data.cta
    : {}) as Record<string, unknown>

  const portraitSrc =
    brandingImageUrl(asString(portrait.src)) ||
    asString(portrait.src, defaults.portrait.src)

  return {
    hero: {
      line1: asString(hero.line1, defaults.hero.line1),
      line2: asString(hero.line2, defaults.hero.line2),
    },
    portrait: {
      src: portraitSrc || defaults.portrait.src,
      alt: asString(portrait.alt, defaults.portrait.alt),
      id: asString(portrait.id) || null,
    },
    bio: {
      lead: asString(bio.lead, defaults.bio.lead),
      support: asString(bio.support, defaults.bio.support),
      resumeHref: asString(bio.resumeHref, defaults.bio.resumeHref),
      resumeLabel: asString(bio.resumeLabel, defaults.bio.resumeLabel),
    },
    skillsTitle: asString(data.skillsTitle, defaults.skillsTitle),
    skills: parseSkills(data.skills, defaults.skills),
    experienceTitle: asString(data.experienceTitle, defaults.experienceTitle),
    experienceTitleAccent: asString(
      data.experienceTitleAccent,
      defaults.experienceTitleAccent,
    ),
    jobs: parseJobs(data.jobs, defaults.jobs),
    education: parseEducation(data.education, defaults.education),
    closing: {
      line1: asString(closing.line1, defaults.closing.line1),
      line2: asString(closing.line2, defaults.closing.line2),
    },
    cta: {
      title: asString(cta.title, defaults.cta.title),
      button: asString(cta.button, defaults.cta.button),
      href: asString(cta.href, defaults.cta.href),
    },
  }
}
