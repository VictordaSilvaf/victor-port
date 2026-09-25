import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/Button'
import { Link } from '@/components/ui/Link'
import { siteConfig } from '@/lib/constants/site'

export function Contact() {
  return (
    <section id="contact" className="py-[var(--space-section)]">
      <Container>
        <Reveal>
          <h2 className="heading-1">Contact</h2>
          <p className="body mt-3 max-w-xl text-muted-foreground">
            Open to collaborations, product work, and thoughtful frontend
            engagements.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild>
              <a href={`mailto:${siteConfig.email}`}>Start a conversation</a>
            </Button>
            <Link href={`mailto:${siteConfig.email}`} className="caption">
              {siteConfig.email}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
