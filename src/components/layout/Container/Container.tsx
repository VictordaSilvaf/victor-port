import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'main' | 'header' | 'footer'
}

export function Container({
  children,
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[var(--container-max)] px-6 md:px-8',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
