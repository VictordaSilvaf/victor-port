import { useMousePosition } from '@/hooks/useMousePosition'
import type { Project } from '@/features/projects/types/project'
import { cn } from '@/lib/utils/cn'

type ProjectPreviewProps = {
  project: Project | null
  visible: boolean
}

export function ProjectPreview({ project, visible }: ProjectPreviewProps) {
  const { x, y } = useMousePosition()

  if (!project) return null

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed z-50 hidden size-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-border bg-muted transition-opacity duration-200 md:block',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      style={{ left: x + 24, top: y + 24 }}
    >
      <div className="flex h-full items-end p-3">
        <p className="caption font-medium">{project.title}</p>
      </div>
    </div>
  )
}
