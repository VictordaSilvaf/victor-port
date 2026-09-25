import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { ExperienceList } from '@/features/experience/components/ExperienceList'

export function Experience() {
  return (
    <section id="experience" className="py-[var(--space-section)]">
      <Container>
        <Reveal>
          <h2 className="heading-1">Experience</h2>
          <p className="body mt-3 max-w-xl text-muted-foreground">
            Roles and collaborations across product and brand teams.
          </p>
        </Reveal>
        <div className="mt-10">
          <ExperienceList />
        </div>
      </Container>
    </section>
  )
}
