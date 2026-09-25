import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRightIcon } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Typewriter } from '@/components/motion/Typewriter'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn } from '@/lib/utils/cn'
import MenuButton from './components/MenuButton'
import MenuContent from './components/MenuContent'

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Header() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  const [country, setCountry] = useState('Brasil')
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((current) => !current), [])

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        if (data?.country_name) setCountry(data.country_name)
      } catch {
        // keep default
      }
    }
    fetchCountry()
  }, [])

  useEffect(() => {
    const tick = () => {
      const next = formatTime(new Date())
      setTime((current) => (current === next ? current : next))
    }

    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <>
      <header
        className={cn(
          'top-0 z-50 w-screen transition-[color,background-color] duration-300',
          menuOpen ? 'fixed text-foreground' : 'absolute',
        )}
      >
        <Container className="flex flex-row items-center justify-between py-8">
          <div className="flex-1 cursor-default select-none hidden md:flex">
            <h3 className="items-center gap-3 text-lg font-medium tracking-tight uppercase flex">
              {menuOpen ? (
                <>
                  <span className="text-foreground/60">Local</span>
                  <span className="text-foreground/90">/</span>
                  <span className="text-foreground/80">{country}</span>
                </>
              ) : (
                <>
                  <span className="text-foreground/60">{country}</span>{' '}
                  <span className="tabular-nums text-foreground/90">
                    <Typewriter
                      words={[time]}
                      loop={false}
                      typeSpeed={42}
                      deleteSpeed={28}
                      nextWordDelay={60}
                      placeholder="00:00"
                      showCaret={false}
                    />
                  </span>
                </>
              )}
            </h3>
          </div>

          <Magnetic>
            <MenuButton open={menuOpen} onClick={toggleMenu} />
          </Magnetic>

          <div className="flex flex-1 justify-end">
            <Button
              variant="outline"
              size="lg"
              className="cursor-interference text-lg"
              asChild
            >
              <Link to="/contato" onClick={closeMenu}>
                <span className="text-lg uppercase">Entrar em contato</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </Container>
      </header>

      <MenuContent open={menuOpen} onClose={closeMenu} />
    </>
  )
}
