import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { TextReveal } from '@/components/motion/TextReveal'
import { siteConfig } from '@/lib/constants/site'

export function Hero() {
  return (
    <section id="hero" className="py-[var(--space-section)]">
      <Container>
        <p className="caption text-muted-foreground">{siteConfig.role}</p>
        <h1 className="heading-display mt-4 max-w-4xl">
          <TextReveal text={siteConfig.name} as="span" />
        </h1>
        <p className="body-lg mt-6 max-w-2xl text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="mt-10">
          <Magnetic>
            <Button asChild size="lg">
              <a href="#work">View selected work</a>
            </Button>
          </Magnetic>
        </div>
      </Container>
    </section>
  )
}
