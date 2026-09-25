import { Container } from '@/components/layout/Container'
import { Typewriter } from '@/components/motion/Typewriter'

const HERO_WORDS = [
  'simplicidade',
  'performance',
  'escalabilidade',
  'segurança',
  'usabilidade',
  'responsividade',
  'eficiência',
  'agilidade',
  'flexibilidade',
] as const

const HERO_SEO_TITLE =
  'Transformando complexidade em simplicidade, performance e escalabilidade — software engineer fullstack em São Paulo'

export function Hero() {
  return (
    <section id="hero" className="relative h-[92vh]">
      <Container className="flex h-full flex-col items-center justify-center px-8 md:px-0">
        <div className="w-full max-w-md text-center md:max-w-xl xl:max-w-6xl">
          <h1 className="text-4xl font-extrabold md:text-6xl xl:text-[7rem]">
            <span className="sr-only">{HERO_SEO_TITLE}</span>
            <span
              aria-hidden="true"
              className="text-foreground/90 uppercase"
            >
              transformando complexidade em{' '}
              <Typewriter words={HERO_WORDS} random align="center" />
            </span>
          </h1>
          <p className="mt-5 text-lg font-bold tracking-tight md:text-xl">
            <span className="text-foreground/60 uppercase">
              fullstack software engineer — laravel, react e react native, do
              backend ao app nas stores
            </span>
          </p>
        </div>
      </Container>

      <HereFooter />
    </section>
  )
}

function HereFooter() {
  return (
    <div className="absolute bottom-5 left-0 w-full md:bottom-8">
      <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="max-w-xl text-center tracking-widest">
          <p className="text-sm font-bold tracking-tight text-foreground/60 uppercase md:text-base">
            Situado em{' '}
            <span className="text-foreground/80">São Paulo, Brasil</span>
          </p>
        </div>
        <div className="max-w-xl text-center tracking-widest">
          <p className="text-sm font-bold tracking-tight text-foreground/90 uppercase md:text-lg">
            Victor Fernandes{' '}
            <span className="text-foreground/60">| Software Engineer</span>
          </p>
        </div>
      </Container>
    </div>
  )
}
