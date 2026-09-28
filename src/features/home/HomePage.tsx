import { Seo } from '@/components/seo'
import { About } from '@/features/home/components/About'
import { Contact } from '@/features/home/components/Contact'
import { Experience } from '@/features/home/components/Experience'
import { Hero } from '@/features/home/components/Hero'
import { SelectedWorks } from '@/features/home/components/SelectedWorks'
import { useSiteConfig } from '@/app/providers/site-settings-context'

export function HomePage() {
  const site = useSiteConfig()
  const { home } = site.routes

  return (
    <>
      <Seo title={home.title} description={home.description} path={home.path} />
      <Hero />
      <SelectedWorks />
      <About />
      <Experience />
      <Contact />
    </>
  )
}
