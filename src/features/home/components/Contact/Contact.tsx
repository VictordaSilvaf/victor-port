import { ArrowRightIcon } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/Link'
import { siteConfig } from '@/lib/constants/site'

export function Contact() {
  return (
    <section id="contact" className="py-[var(--space-section)]">
      <Container className="text-center">
        <Reveal>
          <h2 className="text-[clamp(2.75rem,10vw,7rem)] leading-[0.9] font-extrabold tracking-tight uppercase">
            Bora conversar?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-foreground/55 md:text-lg">
            Aberto a produtos fullstack — Laravel, React, React Native e
            sistemas que aguentam crescer.
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Button variant="outline" size="lg" asChild>
              <Link href="/contato" className="no-underline hover:no-underline">
                <span className="text-base font-medium tracking-widest uppercase">
                  Entrar em contato
                </span>
                <ArrowRightIcon className="size-5" />
              </Link>
            </Button>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="caption text-muted-foreground"
            >
              {siteConfig.email}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
