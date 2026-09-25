import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectGrid } from '@/features/projects/components/ProjectGrid'

export function SelectedWorks() {
  return (
    <section id="work" aria-labelledby="work-heading">
      <Container className="pb-6 md:pb-10">
        <Reveal>
          <h2
            id="work-heading"
            className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold tracking-tight uppercase"
          >
            Trabalhos selecionados
          </h2>
        </Reveal>
      </Container>
      <ProjectGrid />
    </section>
  )
}
