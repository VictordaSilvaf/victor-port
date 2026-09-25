import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectGrid } from '@/features/projects/components/ProjectGrid'

export function SelectedWorks() {
  return (
    <section id="work" className="py-[var(--space-section)]">
      <Container>
        <Reveal>
          <h2 className="heading-1">Selected works</h2>
          <p className="body mt-3 max-w-xl text-muted-foreground">
            A short selection of recent product and brand interfaces.
          </p>
        </Reveal>
        <div className="mt-10">
          <ProjectGrid />
        </div>
      </Container>
    </section>
  )
}
