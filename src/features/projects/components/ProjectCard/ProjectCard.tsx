import type { Project } from '@/features/projects/types/project'
import { Link } from '@/components/ui/Link'
import { cn } from '@/lib/utils/cn'

type ProjectCardProps = {
  project: Project
  className?: string
  onHover?: (project: Project | null) => void
}

export function ProjectCard({ project, className, onHover }: ProjectCardProps) {
  return (
    <article
      className={cn(
        'group border-b border-border py-8 transition-colors',
        className,
      )}
      onMouseEnter={() => onHover?.(project)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
        <div>
          <p className="caption text-muted-foreground">{project.year}</p>
          <h3 className="heading-2 mt-1">
            {project.url ? (
              <Link href={project.url} className="no-underline hover:no-underline">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          <p className="body mt-2 max-w-xl text-muted-foreground">
            {project.description}
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="caption rounded-md border border-border px-2 py-1 text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
