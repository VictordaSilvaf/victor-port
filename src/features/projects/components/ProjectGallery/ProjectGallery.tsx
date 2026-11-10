import { useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import type { ProjectGalleryImage } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type ProjectGalleryProps = {
  title: string
  images: ProjectGalleryImage[]
}

export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const reducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeIndex === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lightboxRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeIndex])

  if (images.length === 0) return null

  const active = activeIndex !== null ? images[activeIndex] : null

  function openAt(index: number) {
    setActiveIndex(index)
  }

  function close() {
    setActiveIndex(null)
  }

  function step(delta: number) {
    setActiveIndex((current) => {
      if (current === null) return current
      return (current + delta + images.length) % images.length
    })
  }

  return (
    <section
      className="border-t border-border/70 py-[var(--space-section)]"
      aria-labelledby="project-gallery-heading"
    >
      <Container>
        <Reveal>
          <h2
            id="project-gallery-heading"
            className="text-xs font-bold tracking-[0.14em] text-foreground/45 uppercase"
          >
            Galeria
          </h2>
          <p className="mt-2 text-sm text-foreground/55">
            {images.length}{' '}
            {images.length === 1 ? 'imagem' : 'imagens'}
          </p>
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Reveal
              key={image.id}
              as="li"
              delay={Math.min(index * 0.04, 0.2)}
            >
              <button
                type="button"
                onClick={() => openAt(index)}
                className="group relative block w-full overflow-hidden bg-neutral-950 text-left focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none"
                aria-label={
                  image.caption
                    ? `Abrir imagem: ${image.caption}`
                    : `Abrir imagem ${index + 1} de ${images.length}`
                }
              >
                <img
                  src={image.thumb || image.src}
                  alt={
                    image.caption ||
                    `Captura ${index + 1} do projeto ${title}`
                  }
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    'aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out',
                    'group-hover:scale-[1.02]',
                    reducedMotion && 'transition-none group-hover:scale-100',
                  )}
                />
                {(image.caption || images.length > 1) && (
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-neutral-950/75 to-transparent p-3 text-white">
                    <span className="text-[11px] font-medium tracking-[0.14em] tabular-nums uppercase text-white/65">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {image.caption ? (
                      <span className="max-w-[75%] truncate text-right text-xs text-white/90">
                        {image.caption}
                      </span>
                    ) : null}
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </ul>
      </Container>

      <AnimatePresence>
        {active && activeIndex !== null ? (
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/92 p-4 outline-none md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Visualização da galeria"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            onKeyDown={(event) => {
              if (event.key === 'Escape') close()
              if (event.key === 'ArrowRight') step(1)
              if (event.key === 'ArrowLeft') step(-1)
            }}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Fechar"
            >
              <XIcon className="size-5" />
            </button>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    step(-1)
                  }}
                  className="absolute top-1/2 left-3 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 md:left-6"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeftIcon className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    step(1)
                  }}
                  className="absolute top-1/2 right-3 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 md:right-6"
                  aria-label="Próxima imagem"
                >
                  <ChevronRightIcon className="size-5" />
                </button>
              </>
            ) : null}

            <motion.figure
              key={active.id}
              className="relative max-h-[85dvh] w-full max-w-6xl"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={active.src}
                alt={
                  active.caption ||
                  `Captura ${activeIndex + 1} do projeto ${title}`
                }
                decoding="async"
                className="mx-auto max-h-[78dvh] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-white/75">
                <span className="tracking-[0.14em] tabular-nums uppercase">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(images.length).padStart(2, '0')}
                </span>
                {active.caption ? (
                  <span className="truncate text-right">{active.caption}</span>
                ) : null}
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
