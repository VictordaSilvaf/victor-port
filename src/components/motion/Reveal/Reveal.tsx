import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { fadeUp } from '@/lib/animations/presets'
import { cn } from '@/lib/utils/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
} & Omit<HTMLMotionProps<'div'>, 'children'>

export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
