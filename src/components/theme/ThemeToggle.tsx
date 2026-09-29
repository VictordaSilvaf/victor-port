import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/app/providers/useTheme'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

type ThemeToggleProps = {
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
}

export function ThemeToggle({
  className,
  size = 'icon',
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className={cn('shrink-0', className)}
    >
      <span className="relative size-4">
        <SunIcon
          className={cn(
            'absolute inset-0 size-4 transition-all duration-300',
            isDark
              ? 'scale-0 rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <MoonIcon
          className={cn(
            'absolute inset-0 size-4 transition-all duration-300',
            isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0',
          )}
        />
      </span>
    </Button>
  )
}
