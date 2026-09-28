import { useSiteConfig } from '@/app/providers/site-settings-context'
import { Seo } from '@/components/seo'
import { AboutBio } from '@/features/about/components/AboutBio'
import { AboutCta } from '@/features/about/components/AboutCta'
import { AboutExperience } from '@/features/about/components/AboutExperience'
import { AboutHero } from '@/features/about/components/AboutHero'
import { AboutSkills } from '@/features/about/components/AboutSkills'

export function AboutPage() {
  const site = useSiteConfig()
  const { about } = site.routes

  return (
    <>
      <Seo
        title={about.title}
        description={about.description}
        path={about.path}
      />
      <AboutHero />
      <AboutBio />
      <AboutSkills />
      <AboutExperience />
      <AboutCta />
    </>
  )
}
