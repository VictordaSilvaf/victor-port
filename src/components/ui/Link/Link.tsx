import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'
import { cn } from '@/lib/utils/cn'

type SharedProps = {
  children: ReactNode
  className?: string
}

type InternalLinkProps = SharedProps & {
  href: string
} & Omit<ComponentPropsWithoutRef<typeof RouterLink>, 'to' | 'className' | 'children'>

type ExternalAnchorProps = SharedProps & {
  href: string
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>

export type LinkProps = InternalLinkProps | ExternalAnchorProps

function isExternal(href: string) {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
}

export function Link({ href, className, children, ...props }: LinkProps) {
  const classes = cn(
    'underline-offset-4 transition-colors hover:underline',
    className,
  )

  if (isExternal(href) || href.startsWith('#')) {
    const external = isExternal(href)
    return (
      <a
        href={href}
        className={classes}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...(props as ComponentPropsWithoutRef<'a'>)}
      >
        {children}
      </a>
    )
  }

  return (
    <RouterLink
      to={href}
      className={classes}
      {...(props as Omit<ComponentPropsWithoutRef<typeof RouterLink>, 'to'>)}
    >
      {children}
    </RouterLink>
  )
}
