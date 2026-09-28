import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { Seo } from '@/components/seo'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/Link'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type ErrorPageProps = {
  /** Force a not-found presentation (catch-all route). */
  notFound?: boolean
}

export function ErrorPage({ notFound = false }: ErrorPageProps) {
  const error = useRouteError()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()

  const status =
    notFound
      ? 404
      : isRouteErrorResponse(error)
        ? error.status
        : 500

  const is404 = status === 404

  const title = is404 ? 'Página não encontrada' : 'Algo deu errado'
  const code = String(status)
  const message = is404
    ? 'Esse caminho não existe — ou foi movido. Volta ao início e continua a explorar.'
    : isRouteErrorResponse(error) && error.statusText
      ? error.statusText
      : error instanceof Error
        ? error.message
        : 'Ocorreu um erro inesperado. Tenta de novo em instantes.'

  return (
    <>
      <Seo title={title} description={message} noIndex />

      <section className="relative isolate flex min-h-[70dvh] flex-1 items-center overflow-hidden py-28 md:min-h-[78dvh] md:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.92_0_0)_0%,transparent_55%)]"
        />

        <Container className="relative text-center">
          <motion.p
            className="text-xs font-bold tracking-[0.2em] text-foreground/45 uppercase md:text-sm"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            Erro {code}
          </motion.p>

          <motion.h1
            className="mt-4 text-[clamp(3.5rem,14vw,9rem)] leading-[0.85] font-extrabold tracking-tight uppercase"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
          >
            {is404 ? 'Perdido?' : 'Falha'}
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-foreground/55 md:text-lg"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE_OUT }}
          >
            {message}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: EASE_OUT }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/" className="no-underline hover:no-underline">
                <span
                  aria-hidden="true"
                  className="mr-2 inline-flex origin-center transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:-translate-x-1"
                >
                  <ArrowLeftIcon className="size-5" />
                </span>
                <span className="text-base font-medium tracking-widest uppercase">
                  Voltar ao início
                </span>
              </Link>
            </Button>

            {!is404 ? (
              <button
                type="button"
                data-cursor="interactive"
                className="text-sm font-bold tracking-[0.08em] text-foreground/55 uppercase transition-colors hover:text-foreground"
                onClick={() => navigate(0)}
              >
                Tentar de novo
              </button>
            ) : (
              <Link
                href="/#work"
                className="text-sm font-bold tracking-[0.08em] text-foreground/55 uppercase transition-colors hover:text-foreground"
              >
                Ver trabalhos
              </Link>
            )}
          </motion.div>
        </Container>
      </section>
    </>
  )
}

export function NotFoundPage() {
  return <ErrorPage notFound />
}
