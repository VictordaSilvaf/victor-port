import { About } from '@/features/home/components/About'
import { Contact } from '@/features/home/components/Contact'
import { Experience } from '@/features/home/components/Experience'
import { Hero } from '@/features/home/components/Hero'
import { SelectedWorks } from '@/features/home/components/SelectedWorks'

export function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWorks />
      <About />
      <Experience />
      <Contact />
    </>
  )
}
