import { useId } from 'react'
import { useTheme } from '@/app/providers/useTheme'
import { cn } from '@/lib/utils/cn'

type ThemeToggleProps = {
  className?: string
}

const RAYS = [
  { x1: 12, y1: 1.6, x2: 12, y2: 4.2 },
  { x1: 12, y1: 19.8, x2: 12, y2: 22.4 },
  { x1: 1.6, y1: 12, x2: 4.2, y2: 12 },
  { x1: 19.8, y1: 12, x2: 22.4, y2: 12 },
  { x1: 4.55, y1: 4.55, x2: 6.4, y2: 6.4 },
  { x1: 17.6, y1: 17.6, x2: 19.45, y2: 19.45 },
  { x1: 4.55, y1: 19.45, x2: 6.4, y2: 17.6 },
  { x1: 17.6, y1: 6.4, x2: 19.45, y2: 4.55 },
] as const

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const maskId = `theme-mask-${useId().replaceAll(':', '')}`

  return (
    <button
      type="button"
      data-cursor="interactive"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className={cn(
        'relative flex size-11 items-center justify-center rounded-full text-foreground/75 transition-colors duration-300 hover:text-foreground md:size-12',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[55%] overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle
              cx="12"
              cy="12"
              r="5"
              fill="black"
              style={{
                transformOrigin: '12px 12px',
                transform: isDark
                  ? 'translate(5px, -5px)'
                  : 'translate(14px, -14px)',
                transition:
                  'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </mask>
        </defs>

        <g
          style={{
            transformOrigin: '12px 12px',
            transform: isDark ? 'rotate(-30deg)' : 'rotate(90deg)',
            transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="5"
            mask={`url(#${maskId})`}
            className="fill-current"
            style={{
              transformOrigin: '12px 12px',
              transform: isDark ? 'scale(1.18)' : 'scale(1)',
              transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />

          {RAYS.map((ray, index) => (
            <line
              key={`${ray.x1}-${ray.y1}`}
              {...ray}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              style={{
                transformOrigin: '12px 12px',
                opacity: isDark ? 0 : 1,
                transform: isDark ? 'scale(0.4)' : 'scale(1)',
                transition: `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)`,
                transitionDelay: isDark
                  ? `${30 * (RAYS.length - index - 1)}ms`
                  : `${80 + index * 40}ms`,
              }}
            />
          ))}
        </g>
      </svg>
    </button>
  )
}
