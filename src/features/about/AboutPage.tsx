import { AboutBio } from '@/features/about/components/AboutBio'
import { AboutCta } from '@/features/about/components/AboutCta'
import { AboutExperience } from '@/features/about/components/AboutExperience'
import { AboutHero } from '@/features/about/components/AboutHero'
import { AboutSkills } from '@/features/about/components/AboutSkills'

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutBio />
      <AboutSkills />
      <AboutExperience />
      <AboutCta />
    </>
  )
}
