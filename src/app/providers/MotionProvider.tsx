import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import '@/lib/animations/gsap'

type MotionProviderProps = {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  )
}
