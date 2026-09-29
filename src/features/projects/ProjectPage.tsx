import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { MarkdownContent } from '@/components/markdown/MarkdownContent'
import { Reveal } from '@/components/motion/Reveal'
import { Seo } from '@/components/seo'
import { Button } from '@/components/ui/button'
import { useProjectPage } from '@/features/projects/hooks/useProjects'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function ProjectPage() {
  const { slug = '' } = useParams()
  const state = useProjectPage(slug)
  const reducedMotion = useReducedMotion()

  if (state.status === 'loading') {
    return (
      <div
        className="min-h-dvh bg-background"
        aria-busy="true"
        aria-label="Carregando projeto"
      />
    )
  }

  if (state.status === 'missing') {
    return <Navigate to="/#work" replace />
  }

  const { project, index, prev, next } = state
  const hasLink = Boolean(project.url && project.url !== '#')
  const overview = project.overview ?? project.description

  return (
    <>
      <Seo
        title={project.title}
        description={project.description}
        path={`/projetos/${project.slug}`}
        image={project.image}
      />

      <article>
        <section className="relative isolate min-h-[70dvh] overflow-hidden bg-neutral-950 text-white md:min-h-[85dvh]">
          {project.image ? (
            <img
              src={project.image}
              alt={`Captura do projeto ${project.title}`}
              className="absolute inset-0 -z-10 size-full object-cover"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/20"
          />

          <Container className="relative flex min-h-[70dvh] flex-col justify-end pt-28 pb-12 md:min-h-[85dvh] md:pb-16">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE_OUT }}
            >
              <Link
                to="/#work"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium tracking-widest text-white/70 uppercase no-underline transition-colors hover:text-white hover:no-underline"
              >
                <ArrowLeftIcon className="size-4" />
                Trabalhos
              </Link>

              <p className="text-xs font-medium tracking-widest text-white/60 tabular-nums md:text-sm">
                {String(index + 1).padStart(2, '0')} — {project.year}
              </p>
              <h1 className="mt-3 text-[clamp(2.75rem,9vw,7rem)] leading-[0.9] font-extrabold tracking-tight uppercase">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-snug text-white/85 md:text-2xl">
                {project.description}
              </p>
            </motion.div>
          </Container>
        </section>

        <section className="py-[var(--space-section)]">
          <Container>
            <div className="grid gap-12 md:grid-cols-[1.4fr_0.8fr] md:gap-16 lg:gap-24">
              <Reveal>
                <h2 className="text-xs font-bold tracking-[0.14em] text-foreground/45 uppercase">
                  Overview
                </h2>
                <MarkdownContent className="mt-4 max-w-3xl">
                  {overview}
                </MarkdownContent>
              </Reveal>

              <Reveal delay={0.08}>
                <dl className="grid gap-6">
                  <div className="border-t border-border pt-4">
                    <dt className="text-xs tracking-widest text-foreground/45 uppercase">
                      Ano
                    </dt>
                    <dd className="mt-1 text-base font-medium tabular-nums">
                      {project.year}
                    </dd>
                  </div>
                  {project.role ? (
                    <div className="border-t border-border pt-4">
                      <dt className="text-xs tracking-widest text-foreground/45 uppercase">
                        Papel
                      </dt>
                      <dd className="mt-1 text-base font-medium">{project.role}</dd>
                    </div>
                  ) : null}
                  {project.tags.length > 0 ? (
                    <div className="border-t border-border pt-4">
                      <dt className="text-xs tracking-widest text-foreground/45 uppercase">
                        Stack
                      </dt>
                      <dd className="mt-3">
                        <ul className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-foreground/20 px-3 py-1 text-xs tracking-wider text-foreground/80 uppercase"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                  {hasLink ? (
                    <div className="border-t border-border pt-4">
                      <Button variant="outline" size="lg" asChild>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="no-underline hover:no-underline"
                        >
                          Visitar projeto
                          <ArrowUpRightIcon className="size-4" />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </dl>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="border-t border-border/70 py-10 md:py-14">
          <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {prev ? (
              <Link
                to={`/projetos/${prev.slug}`}
                className="group inline-flex max-w-md flex-col gap-1 no-underline hover:no-underline"
              >
                <span className="text-xs tracking-widest text-foreground/45 uppercase">
                  Anterior
                </span>
                <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight uppercase transition-colors group-hover:text-foreground/70">
                  <ArrowLeftIcon className="size-4" />
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                to={`/projetos/${next.slug}`}
                className="group inline-flex max-w-md flex-col gap-1 text-right no-underline hover:no-underline sm:items-end"
              >
                <span className="text-xs tracking-widest text-foreground/45 uppercase">
                  Próximo
                </span>
                <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight uppercase transition-colors group-hover:text-foreground/70">
                  {next.title}
                  <ArrowRightIcon className="size-4" />
                </span>
              </Link>
            ) : null}
          </Container>
        </section>
      </article>
    </>
  )
}
