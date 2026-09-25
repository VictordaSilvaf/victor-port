import { Container } from '@/components/layout/Container'

export function Hero() {
  return (
    <section id="hero" className="h-[95vh] relative">
      <Container className='flex flex-col items-center justify-center h-full px-8 md:px-0'>
        <div className="max-w-md md:max-w-xl xl:max-w-6xl w-full text-center">
          <h1 className='text-4xl md:text-6xl xl:text-[7rem] font-extrabold'>
            <span className='text-foreground/90 uppercase'>transformando complexidade em simplicidade</span>
          </h1>
          <h3 className='text-lg md:text-xl font-bold mt-5 tracking-tight'>
            <span className='text-foreground/60 uppercase'>é sobre unir código e criatividade perfeitamente, como uma mistura impecável de lógica e imaginação</span>
          </h3>
        </div>
      </Container>

      <HereFooter />
    </section>
  )
}

function HereFooter() {
  return (
    <div className='absolute bottom-5 md:bottom-12 left-0 w-full'>
      <Container className='flex md:flex-row flex-col gap-4 items-center justify-between'>
        <div className="max-w-xl text-center tracking-widest">
          <h3 className='text-sm md:text-md font-bold tracking-tight text-foreground/60 uppercase'>
            Situado em <span className='text-foreground/80'>São Paulo, Brasil</span>
          </h3>
        </div>
        <div className="max-w-xl text-center tracking-widest">
          <h3 className='text-sm md:text-lg font-bold tracking-tight text-foreground/90 uppercase'>
            Victor da Silva <span className='text-foreground/60'>| Arquiteto de Software</span>
          </h3>
        </div>
      </Container>
    </div>
  )
}