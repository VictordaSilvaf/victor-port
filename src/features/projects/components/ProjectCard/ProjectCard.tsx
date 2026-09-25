import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'
import { ParallaxImage } from '@/components/motion/Parallax'

type ProjectCardProps = {
  project: Project
  index: number
  className?: string
}

export function ProjectCard({ project, index, className }: ProjectCardProps) {
  return (
    <section
      className={cn(
        'relative isolate h-dvh min-h-[560px] overflow-hidden bg-neutral-950 text-white',
        className,
      )}
      data-cursor={`button[href="#project"]`}
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

      <div className="flex h-full flex-col justify-center px-6 pb-[10dvh] md:px-[4vw]">
        <p className="text-xs font-medium tracking-widest text-white/60 tabular-nums md:text-sm">
          {String(index + 1).padStart(2, '0')} — {project.year}
        </p>
        <h2 className="mt-3 text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] font-bold uppercase tracking-tight">
          {project.title}
        </h2>
        <p className="mt-4 max-w-[30ch] text-lg leading-snug text-white/85 md:mt-6 md:text-2xl">
          {project.description}
        </p>
      </div>
    </section>
  )
}
