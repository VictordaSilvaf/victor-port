import { ArrowRightIcon } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/Link'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/victordasilvafernandes/',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/victordasilvaf',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/victordasilvaf/',
  },
] as const

export function About() {
  return (
    <section id="about" className="py-[var(--space-section)]">
      <Container className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <Reveal className="flex w-full flex-col items-center">
          <h2 className="mx-auto max-w-[16ch] text-[clamp(1.75rem,7vw,4.5rem)] leading-[1.05] font-bold tracking-tight text-balance uppercase md:max-w-none">
            Vamos conversar agora mesmo!
          </h2>

          <Button
            variant="outline"
            size="lg"
            className="mt-6 tracking-widest uppercase md:mt-8"
            asChild
          >
            <Link href="/contato" className="no-underline hover:no-underline">
              Entrar em contato
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>

          <Link
            href="/sobre"
            data-cursor="project"
            data-cursor-label="Sobre mim"
            className="group relative mx-auto mt-8 block aspect-[5/6] w-full max-w-[16rem] overflow-hidden rounded-[46.5%] no-underline hover:no-underline sm:max-w-xs md:mt-10 md:max-w-md lg:max-w-xl"
          >
            <img
              src="https://placehold.co/500x600"
              alt="Victor Fernandes"
              className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          </Link>

          <p className="mt-10 max-w-2xl text-base leading-relaxed font-semibold text-pretty text-muted-foreground sm:text-lg md:mt-16 md:text-xl">
            Se você procura um fullstack software engineer — Laravel no backend,
            React no frontend e apps em React Native — estou disponível pra
            conversar. Vamos tirar a ideia do papel com código que escala.
          </p>

          <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 md:mt-8 md:gap-6">
            {SOCIAL_LINKS.map((link) => (
              <Button
                key={link.label}
                variant="outline"
                size="lg"
                className="h-11 px-4 tracking-widest uppercase sm:h-14 sm:px-6"
                asChild
              >
                <Link
                  href={link.url}
                  target="_blank"
                  className="no-underline hover:no-underline"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="inline-flex origin-center -rotate-45 transition-[rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:rotate-0"
                  >
                    <ArrowRightIcon className="size-4 sm:size-6" />
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
