import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/Link'
import { ArrowRightIcon } from 'lucide-react'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/victordasilvaf/',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/victordasilvaf',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/victordasilvaf/',
  },
]

export function About() {
  return (
    <section id="about" className="py-[var(--space-section)]">
      <Container className="text-center flex flex-col items-center justify-center w-full !max-w-4xl mx-auto">
        <Reveal>
          <h2 className="heading-1 !text-[4.5rem] !leading-[1.1] font-bold uppercase tracking-tight">
            Vamos conversar agora mesmo!
          </h2>

          <Button variant="outline" size="lg" className="mt-8">
            <p className='text-base font-medium uppercase tracking-widest'>Entrar em contato</p>

            <ArrowRightIcon className="size-4 ml-2" />
          </Button>

          <Link
            href="/sobre"
            data-cursor="project"
            data-cursor-label="Sobre mim"
            className="group relative mt-10 mx-auto block aspect-[5/6] w-full max-w-xl overflow-hidden rounded-[46.5%] no-underline hover:no-underline"
          >
            <img
              src="https://placehold.co/500x600"
              alt=""
              className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          </Link>

          <p className="mt-16 text-muted-foreground text-xl font-semibold">
            Se você está procurando um desenvolvedor web experiente e comprometido, estou disponível para conversar sobre suas necessidades. Vamos tirar suas ideias do papel!
          </p>

          <div className="flex flex-row justify-center items-center gap-6 mt-8">
            {SOCIAL_LINKS.map((link) => (
              <Link href={link.url} target="_blank" key={link.label}>
                <Button variant="outline" size="lg">
                  <p className="text-base font-medium uppercase tracking-widest">
                    {link.label}
                  </p>
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-flex origin-center -rotate-45 transition-[rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:rotate-0"
                  >
                    <ArrowRightIcon className="size-6" />
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
