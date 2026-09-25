import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { projects } from '@/features/projects/data/projects'
import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'

type ProjectGridProps = {
  className?: string
  items?: Project[]
}

export function ProjectGrid({ className, items = projects }: ProjectGridProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  )
}
