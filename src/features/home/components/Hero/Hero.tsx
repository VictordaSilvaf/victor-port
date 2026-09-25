import { motion, useReducedMotion } from 'motion/react'
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

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="hero" className="relative h-[92vh]">
      <Container className="flex h-full flex-col items-center justify-center px-8 md:px-0">
        <motion.div
          className="w-full max-w-md text-center md:max-w-xl xl:max-w-6xl"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <h1 className="text-4xl font-extrabold md:text-6xl xl:text-[7rem]">
            <span className="sr-only">{HERO_SEO_TITLE}</span>
            <span aria-hidden="true" className="text-foreground/90 uppercase">
              transformando complexidade em{' '}
              <Typewriter words={HERO_WORDS} random align="center" />
            </span>
          </h1>
          <motion.p
            className="mt-5 text-lg font-bold tracking-tight md:text-xl"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
          >
            <span className="text-foreground/60 uppercase">
              software engineer — arquitetura, sistemas escaláveis e produtos digitais
            </span>
          </motion.p>
        </motion.div>
      </Container>

      <HereFooter />
    </section>
  )
}

function HereFooter() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="absolute bottom-5 left-0 w-full md:bottom-8"
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.35, ease: EASE_OUT }}
    >
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
    </motion.div>
  )
}
