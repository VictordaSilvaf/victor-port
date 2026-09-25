import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { cn } from '@/lib/utils/cn'

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  /**
   * How much the image lags behind the scroll (0 = scrolls with the page,
   * 1 = fixed). The offset is zero when the container top meets the viewport
   * top, so containers at least as tall as the viewport never reveal edges.
   */
  speed?: number
  /** Scale at the moment the container enters the viewport. */
  zoomFrom?: number
  /** Scale at the moment the container leaves the viewport. */
  zoomTo?: number
  loading?: 'lazy' | 'eager'
}

export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  speed = 0.36,
  zoomFrom = 1.02,
  zoomTo = 1.14,
  loading = 'lazy',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Container top goes from 100dvh (p = 0) to -100% of its height (p = 1);
  // the image is shifted by -speed * top.
  const transform = useTransform(scrollYProgress, (p) => {
    if (reducedMotion) return 'none'
    const viewportShift = -speed * (1 - p) * 100
    const selfShift = speed * p * 100
    const scale = zoomFrom + (zoomTo - zoomFrom) * p
    return `translate3d(0, calc(${viewportShift}dvh + ${selfShift}%), 0) scale(${scale})`
  })

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ transform }}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          draggable={false}
          className={cn('size-full select-none object-cover', imageClassName)}
        />
      </motion.div>
    </div>
  )
}
