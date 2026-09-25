import { Container } from '@/components/layout/Container'
import { Typewriter } from '@/components/motion/Typewriter'
import { useEffect, useState } from 'react'
import MenuButton from './components/MenuButton'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Header() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  const [country, setCountry] = useState('Brasil')

  useEffect(() => {
    const fetchCountry = async () => {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      setCountry(data.country_name)
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
    <header className="absolute top-0 z-40 w-screen">
      <Container className="flex items-center justify-between py-8 flex-row">
        <div className="flex flex-1 select-none cursor-default">
          <h3 className="font-medium tracking-tight gap-3 flex items-center text-lg uppercase">
            <span className="text-foreground/60">{country}</span>{' '}
            <span className="text-foreground/90 tabular-nums">
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
          </h3>
        </div>

        <Magnetic>
          <MenuButton />
        </Magnetic>

        <div className="flex flex-1 justify-end">
          <Button
            variant="outline"
            size="lg"
            className="text-lg cursor-interference"
          >
            <span className="uppercase text-lg">Entrar em contato</span>
            <ArrowRightIcon className="w-6 h-6" />
          </Button>
        </div>
      </Container>
    </header>
  )
}
