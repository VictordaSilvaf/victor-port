import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link as RouterLink, useLocation } from 'react-router'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { ArrowUpRightIcon } from 'lucide-react'
import { useSiteConfig } from '@/app/providers/site-settings-context'
import { Container } from '@/components/layout/Container'
import { getLenis } from '@/lib/animations/lenis'
import { cn } from '@/lib/utils/cn'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

type MenuMatch = 'home' | 'projects' | 'about' | 'contact' | 'other'

type MenuLink = {
  label: string
  href: string
  match: MenuMatch
}

type MenuContentProps = {
  open: boolean
  onClose: () => void
}

function matchFromHref(href: string): MenuMatch {
  if (href === '/') return 'home'
  if (href.includes('#work') || href.includes('/projetos')) return 'projects'
  if (href.startsWith('/sobre')) return 'about'
  if (href.startsWith('/contato')) return 'contact'
  return 'other'
}

const panelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
}

function isActive(pathname: string, match: MenuMatch) {
  switch (match) {
    case 'home':
      return pathname === '/'
    case 'projects':
      return pathname.startsWith('/projetos/')
    case 'about':
      return pathname === '/sobre' || pathname.startsWith('/sobre/')
    case 'contact':
      return pathname === '/contato' || pathname.startsWith('/contato/')
    default:
      return false
  }
}

export default function MenuContent({ open, onClose }: MenuContentProps) {
  const reducedMotion = useReducedMotion()
  const { pathname } = useLocation()
  const site = useSiteConfig()
  const menuLinks: MenuLink[] = site.navItems.map((item) => ({
    ...item,
    match: matchFromHref(item.href),
  }))

  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      lenis?.start()
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          id="site-menu"
          className="fixed inset-0 z-[45] flex flex-col bg-[oklch(0.96_0_0)] text-foreground"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          variants={reducedMotion ? undefined : panelVariants}
          initial={reducedMotion ? { opacity: 0 } : 'hidden'}
          animate={reducedMotion ? { opacity: 1 } : 'visible'}
          exit={reducedMotion ? { opacity: 0 } : 'exit'}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.92_0_0)_0%,transparent_55%)]" />

          <nav className="relative flex flex-1 items-center justify-center px-6">
            <motion.ul
              className="flex flex-col items-center gap-1 md:gap-2"
              variants={reducedMotion ? undefined : listVariants}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
            >
              {menuLinks.map((item, index) => {
                const active = isActive(pathname, item.match)
                const internal =
                  item.href.startsWith('/') && !item.href.startsWith('/#')
                const className = cn(
                  'group relative inline-flex items-baseline gap-2 font-extrabold uppercase tracking-[-0.03em]',
                  'text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.95] transition-colors duration-300',
                  active
                    ? 'text-foreground'
                    : 'text-foreground/35 hover:text-foreground/70',
                )

                const content = (
                  <>
                    <span
                      className={cn(
                        'pointer-events-none absolute top-[0.18em] right-[calc(100%+0.18em)] font-semibold text-[0.2em] tracking-normal transition-opacity duration-300',
                        active
                          ? 'text-foreground/70 opacity-100'
                          : 'text-foreground/40 opacity-0 group-hover:opacity-50',
                      )}
                      aria-hidden="true"
                    >
                      ({index + 1})
                    </span>
                    <span className="relative">
                      {item.label}
                      <span
                        className={cn(
                          'absolute inset-x-0 -bottom-[0.08em] h-[0.06em] origin-left bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          active
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </span>
                  </>
                )

                return (
                  <motion.li
                    key={item.href}
                    variants={reducedMotion ? undefined : itemVariants}
                    className="text-center text-balance"
                  >
                    {internal ? (
                      <RouterLink
                        to={item.href}
                        className={className}
                        data-cursor="interactive"
                        data-active={active || undefined}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                      >
                        {content}
                      </RouterLink>
                    ) : (
                      <a
                        href={item.href}
                        className={className}
                        data-cursor="interactive"
                        data-active={active || undefined}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                      >
                        {content}
                      </a>
                    )}
                  </motion.li>
                )
              })}
            </motion.ul>
          </nav>

          <motion.div
            className="relative pt-4 pb-8"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
          >
            <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs font-bold tracking-[0.08em] text-foreground/55 uppercase md:text-sm">
                ©{new Date().getFullYear()} All rights reserved
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
                {site.socials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="interactive"
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-foreground/70 uppercase transition-colors duration-300 hover:text-foreground md:text-sm"
                  >
                    {social.label}
                    <ArrowUpRightIcon className="size-3.5 opacity-70" />
                  </a>
                ))}
              </div>
            </Container>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
