import { useRef, type ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { cn } from '@/lib/utils/cn'

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Fraction of the element height travelled across the viewport. Negative inverts. */
  speed?: number
  /** Clip content that moves outside the wrapper. */
  clip?: boolean
}

export function Parallax({
  children,
  className,
  speed = 0.2,
  clip = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const distance = reducedMotion ? 0 : speed * 100
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-distance}%`, `${distance}%`],
  )

  return (
    <div ref={ref} className={cn(clip && 'overflow-hidden', className)}>
      <motion.div className="will-change-transform" style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
