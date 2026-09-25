import { Seo } from '@/components/seo'
import { About } from '@/features/home/components/About'
import { Contact } from '@/features/home/components/Contact'
import { Experience } from '@/features/home/components/Experience'
import { Hero } from '@/features/home/components/Hero'
import { SelectedWorks } from '@/features/home/components/SelectedWorks'
import { siteConfig } from '@/lib/constants/site'

export function HomePage() {
  const { home } = siteConfig.routes

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
