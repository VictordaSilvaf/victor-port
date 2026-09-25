import { motion } from 'motion/react'
import { stagger } from '@/lib/animations/transitions'
import { cn } from '@/lib/utils/cn'

type TextRevealProps = {
  text: string
  className?: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
}

export function TextReveal({
  text,
  className,
  as: Tag = 'p',
}: TextRevealProps) {
  const words = text.split(' ')

  return (
    <Tag className={cn('inline-flex flex-wrap gap-x-[0.3em]', className)}>
      <motion.span
        className="contents"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger.tight },
          },
        }}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '100%', opacity: 0 },
                visible: {
                  y: '0%',
                  opacity: 1,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
