import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useMousePosition } from '@/hooks/useMousePosition'
import { cn } from '@/lib/utils/cn'

type CursorProps = {
  className?: string
}

export function Cursor({ className }: CursorProps) {
  const { x, y } = useMousePosition()
  const isFinePointer = useMediaQuery('(pointer: fine)')

  if (!isFinePointer) return null

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground mix-blend-difference',
        className,
      )}
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    />
  )
}
