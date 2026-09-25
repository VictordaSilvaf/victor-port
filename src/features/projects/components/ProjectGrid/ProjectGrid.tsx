import { useState } from 'react'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectModal } from '@/features/projects/components/ProjectModal'
import { projects } from '@/features/projects/data/projects'
import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'

type ProjectGridProps = {
  className?: string
  items?: Project[]
}

export function ProjectGrid({ className, items = projects }: ProjectGridProps) {
  // The slug outlives `open` so the modal keeps its content during the exit animation.
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const activeIndex = items.findIndex((project) => project.slug === activeSlug)
  const activeProject = activeIndex >= 0 ? items[activeIndex]! : null

  return (
    <div className={cn('relative', className)}>
      {items.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={index}
          onOpen={() => {
            setActiveSlug(project.slug)
            setOpen(true)
          }}
        />
      ))}

      <ProjectModal
        project={activeProject}
        index={activeIndex}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  )
}
