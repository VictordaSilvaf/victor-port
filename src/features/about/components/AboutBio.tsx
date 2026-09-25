import { ArrowRightIcon } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/Link'
import { Container } from '@/components/layout/Container'
import { aboutContent } from '@/features/about/data/about'

export function AboutBio() {
  const { bio } = aboutContent

  return (
    <section className="pb-[var(--space-section)]">
      <Container className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-[clamp(1.15rem,2.4vw,1.85rem)] leading-snug font-bold tracking-tight uppercase">
            {bio.lead}
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {bio.support}
          </p>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href={bio.resumeHref} className="no-underline hover:no-underline">
                <span className="text-base font-medium tracking-widest uppercase">
                  {bio.resumeLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-2 inline-flex origin-center transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:translate-x-1"
                >
                  <ArrowRightIcon className="size-5" />
                </span>
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
