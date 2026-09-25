import type { ElementType, ReactNode } from 'react'
import { motion } from 'motion/react'
import { fadeUp } from '@/lib/animations/presets'
import { cn } from '@/lib/utils/cn'

type RevealTag = 'div' | 'li' | 'section' | 'article' | 'header' | 'footer'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: RevealTag
  /** Viewport amount required to trigger (0–1). */
  amount?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  amount = 0.2,
}: RevealProps) {
  const Comp = motion.create(as as ElementType)

  return (
    <Comp
      className={cn(className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  )
}
