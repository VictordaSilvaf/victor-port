import type { Variants } from 'motion/react'
import { duration, stagger } from './transitions'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.base,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.base,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.base,
    },
  },
}

export const presets = {
  fadeUp,
  fadeIn,
  staggerContainer,
} as const
