import { LayoutGridIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type MenuButtonProps = {
  open: boolean
  onClick: () => void
}

export default function MenuButton({ open, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      data-cursor="interactive"
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center transition-all duration-300',
        open
          ? 'size-11 rounded-full bg-foreground text-background hover:scale-105'
          : 'rounded-full p-2 text-foreground/70 hover:rotate-45 hover:text-foreground',
      )}
    >
      <span className="relative size-6">
        <LayoutGridIcon
          className={cn(
            'absolute inset-0 size-6 transition-all duration-300',
            open
              ? 'scale-50 rotate-45 opacity-0'
              : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <XIcon
          className={cn(
            'absolute inset-0 size-6 transition-all duration-300',
            open
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-50 -rotate-45 opacity-0',
          )}
        />
      </span>
    </button>
  )
}
