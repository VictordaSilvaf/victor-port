import { ArrowRightIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'
import { ParallaxImage } from '@/components/motion/Parallax'
import { PROJECT_CURSOR } from '@/components/ui/Cursor'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type ProjectCardProps = {
  project: Project
  index: number
  onOpen?: () => void
  className?: string
}

export function ProjectCard({ project, index, onOpen, className }: ProjectCardProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      className={cn(
        'relative isolate h-dvh min-h-[560px] overflow-hidden bg-neutral-950 text-white',
        className,
      )}
      id={`project-${project.slug}`}
    >
      {project.image ? (
        <ParallaxImage
          src={project.image}
          alt={project.title}
          className="absolute inset-0 -z-10"
        />
      ) : null}

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />

      <motion.div
        className="flex h-full flex-col justify-center px-6 pb-[10dvh] md:px-[4vw]"
        initial={reducedMotion ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <p className="text-xs font-medium tracking-widest text-white/60 tabular-nums md:text-sm">
          {String(index + 1).padStart(2, '0')} — {project.year}
        </p>
        <h2 className="mt-3 text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] font-bold tracking-tight uppercase">
          {project.title}
        </h2>
        <p className="mt-4 max-w-[30ch] text-lg leading-snug text-white/85 md:mt-6 md:text-2xl">
          {project.description}
        </p>
        {/* Touch devices have no cursor pill, so show the call to action inline. */}
        <span
          aria-hidden="true"
          className="glass-pill mt-8 hidden w-fit pointer-coarse:inline-flex"
        >
          <span className="glass-pill__text">Ver projeto</span>
          <span className="glass-pill__icon">
            <ArrowRightIcon className="size-4" />
          </span>
        </span>
      </motion.div>

      <button
        type="button"
        onClick={onOpen}
        data-cursor={PROJECT_CURSOR}
        aria-haspopup="dialog"
        aria-label={`Ver projeto ${project.title}`}
        className="absolute inset-0 z-10 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none focus-visible:ring-inset"
      />
    </section>
  )
}
