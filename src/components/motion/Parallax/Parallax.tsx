import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { cn } from '@/lib/utils/cn'

type ParallaxProps = {
  children: ReactNode
  className?: string
  speed?: number
}

export function Parallax({
  children,
  className,
  speed = 0.2,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}%`, `${speed * 100}%`],
  )

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
