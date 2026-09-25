import { useEffect } from 'react'
import { Dialog } from 'radix-ui'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowUpRightIcon, XIcon } from 'lucide-react'
import type { Project } from '@/features/projects/types/project'
import { getLenis } from '@/lib/animations/lenis'

type ProjectModalProps = {
  project: Project | null
  index: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const bodyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

export function ProjectModal({
  project,
  index,
  open,
  onOpenChange,
}: ProjectModalProps) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    return () => lenis?.start()
  }, [open])

  const hasLink = Boolean(project?.url && project.url !== '#')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && project ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              />
            </Dialog.Overlay>

            <div className="pointer-events-none fixed inset-0 z-[101] flex items-end justify-center md:items-center md:p-8">
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="pointer-events-auto relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[28px] bg-neutral-950 text-white shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] outline-none md:rounded-[28px]"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 80, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    reducedMotion
                      ? { opacity: 0, transition: { duration: 0.2 } }
                      : { opacity: 0, y: 50, scale: 0.98, transition: { duration: 0.3, ease: EASE_OUT } }
                  }
                  transition={{ type: 'spring', stiffness: 240, damping: 30, mass: 0.9 }}
                >
                  <Dialog.Close
                    className="glass-pill absolute top-4 right-4 z-20 !p-3 transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none md:top-6 md:right-6"
                    aria-label="Fechar"
                  >
                    <XIcon className="size-4" />
                  </Dialog.Close>

                  <div className="overflow-y-auto overscroll-contain" data-lenis-prevent>
                    <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] md:aspect-[16/8]">
                      {project.image ? (
                        <motion.img
                          src={project.image}
                          alt={`Captura do projeto ${project.title}`}
                          className="size-full object-cover"
                          initial={reducedMotion ? false : { scale: 1.18 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 1.4, ease: EASE_OUT }}
                        />
                      ) : null}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"
                      />
                      <motion.div
                        className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-12 md:pb-10"
                        initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.12, ease: EASE_OUT }}
                      >
                        <p className="text-xs font-medium tracking-widest text-white/60 tabular-nums md:text-sm">
                          {String(index + 1).padStart(2, '0')} — {project.year}
                        </p>
                        <Dialog.Title className="mt-2 text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] font-bold tracking-tight uppercase">
                          {project.title}
                        </Dialog.Title>
                      </motion.div>
                    </div>

                    <motion.div
                      className="grid gap-10 px-6 pt-6 pb-10 md:grid-cols-[1.5fr_1fr] md:gap-16 md:px-12 md:pt-8 md:pb-14"
                      variants={bodyVariants}
                      initial={reducedMotion ? false : 'hidden'}
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <Dialog.Description className="text-xl leading-snug text-white/85 md:text-3xl">
                          {project.description}
                        </Dialog.Description>
                      </motion.div>

                      <motion.dl variants={itemVariants} className="grid content-start gap-6 text-sm">
                        <div className="grid gap-1 border-t border-white/15 pt-4">
                          <dt className="text-xs tracking-widest text-white/50 uppercase">Ano</dt>
                          <dd className="text-base tabular-nums">{project.year}</dd>
                        </div>
                        <div className="grid gap-2 border-t border-white/15 pt-4">
                          <dt className="text-xs tracking-widest text-white/50 uppercase">Stack</dt>
                          <dd>
                            <ul className="flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                <li
                                  key={tag}
                                  className="rounded-full border border-white/20 px-3 py-1 text-xs tracking-wider text-white/80 uppercase"
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                        {hasLink ? (
                          <div className="border-t border-white/15 pt-4">
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="glass-pill w-fit"
                            >
                              <span className="glass-pill__text">Visitar projeto</span>
                              <ArrowUpRightIcon className="size-4" />
                            </a>
                          </div>
                        ) : null}
                      </motion.dl>
                    </motion.div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
