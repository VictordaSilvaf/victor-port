import { useState } from 'react'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectPreview } from '@/features/projects/components/ProjectPreview'
import { projects } from '@/features/projects/data/projects'
import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'

type ProjectGridProps = {
  className?: string
  items?: Project[]
}

export function ProjectGrid({
  className,
  items = projects,
}: ProjectGridProps) {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <div className={cn('relative', className)}>
      <div>
        {items.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onHover={setActive}
          />
        ))}
      </div>
      <ProjectPreview project={active} visible={Boolean(active)} />
    </div>
  )
}
