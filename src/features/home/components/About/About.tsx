import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { siteConfig } from '@/lib/constants/site'

export function About() {
  return (
    <section id="about" className="py-[var(--space-section)]">
      <Container>
        <Reveal>
          <h2 className="heading-1">About</h2>
          <p className="body-lg mt-4 max-w-2xl text-muted-foreground">
            {siteConfig.name} is a {siteConfig.role.toLowerCase()} focused on
            clear interfaces, careful typography, and motion that supports the
            story instead of competing with it.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
