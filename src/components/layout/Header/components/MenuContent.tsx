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
import { Container } from '@/components/layout/Container'
import { getLenis } from '@/lib/animations/lenis'
import { siteConfig } from '@/lib/constants/site'
import { cn } from '@/lib/utils/cn'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const MENU_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Trabalhos', href: '/#work' },
  { label: 'Sobre mim', href: '/sobre' },
  { label: 'Contato', href: '/#contact' },
] as const

type MenuContentProps = {
  open: boolean
  onClose: () => void
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

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href.startsWith('/#')) return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function MenuContent({ open, onClose }: MenuContentProps) {
  const reducedMotion = useReducedMotion()
  const { pathname } = useLocation()

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
              {MENU_LINKS.map((item, index) => {
                const active = isActive(pathname, item.href)
                const internal = item.href.startsWith('/') && !item.href.startsWith('/#')
                const className = cn(
                  'group relative inline-flex items-baseline gap-2 font-extrabold uppercase tracking-[-0.03em]',
                  'text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.95] text-foreground/90',
                  'transition-colors duration-300 hover:text-foreground',
                )

                const content = (
                  <>
                    <span
                      className="pointer-events-none absolute top-[0.18em] right-[calc(100%+0.18em)] font-semibold text-[0.2em] tracking-normal text-foreground/65 opacity-0 transition-opacity duration-300 group-hover:opacity-50 group-data-[active=true]:opacity-100"
                      aria-hidden="true"
                    >
                      ({index + 1})
                    </span>
                    <span className="relative">
                      {item.label}
                      <span className="absolute inset-x-0 -bottom-[0.08em] h-[0.06em] origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
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
            className="relative pb-8 pt-4"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
          >
            <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs font-bold tracking-[0.08em] text-foreground/55 uppercase md:text-sm">
                ©{new Date().getFullYear()} All rights reserved
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
                {siteConfig.socials.map((social) => (
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
