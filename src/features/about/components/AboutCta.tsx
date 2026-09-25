import { ArrowRightIcon } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/Link'
import { Container } from '@/components/layout/Container'
import { aboutContent } from '@/features/about/data/about'
import { siteConfig } from '@/lib/constants/site'

export function AboutCta() {
  const { cta } = aboutContent

  return (
    <section className="py-[var(--space-section)]">
      <Container className="text-center">
        <Reveal>
          <h2 className="text-[clamp(2.75rem,10vw,7rem)] leading-[0.9] font-extrabold tracking-tight uppercase">
            {cta.title}
          </h2>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Button variant="outline" size="lg" asChild>
              <Link href={cta.href} className="no-underline hover:no-underline">
                <span className="text-base font-medium tracking-widest uppercase">
                  {cta.button}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-2 inline-flex origin-center transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:translate-x-1"
                >
                  <ArrowRightIcon className="size-5" />
                </span>
              </Link>
            </Button>
            <ul className="flex flex-wrap items-center justify-center gap-6">
              {siteConfig.socials.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    className="text-sm font-medium tracking-widest text-muted-foreground uppercase no-underline hover:text-foreground hover:no-underline"
                  >
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
