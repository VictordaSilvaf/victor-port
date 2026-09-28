import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { useProjectsList } from '@/features/projects/hooks/useProjects'
import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'

type ProjectGridProps = {
  className?: string
  items?: Project[]
}

export function ProjectGrid({ className, items }: ProjectGridProps) {
  const { items: fetched } = useProjectsList()
  const projects = items ?? fetched

  return (
    <div className={cn('relative', className)}>
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  )
}
