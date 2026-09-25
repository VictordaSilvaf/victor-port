import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/animations/gsap'
import { cn } from '@/lib/utils/cn'

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({
  children,
  className,
  strength = 0.35,
}: MagneticProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const content = contentRef.current
      if (!root || !content) return

      const xTo = gsap.quickTo(content, 'x', {
        duration: 0.4,
        ease: 'power3.out',
      })
      const yTo = gsap.quickTo(content, 'y', {
        duration: 0.4,
        ease: 'power3.out',
      })

      const onMove = (event: MouseEvent) => {
        const rect = root.getBoundingClientRect()
        const offsetX = event.clientX - (rect.left + rect.width / 2)
        const offsetY = event.clientY - (rect.top + rect.height / 2)
        xTo(offsetX * strength)
        yTo(offsetY * strength)
      }

      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      root.addEventListener('mousemove', onMove)
      root.addEventListener('mouseleave', onLeave)

      return () => {
        root.removeEventListener('mousemove', onMove)
        root.removeEventListener('mouseleave', onLeave)
      }
    },
    { dependencies: [strength] },
  )

  return (
    <div ref={rootRef} className={cn('inline-block', className)}>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
