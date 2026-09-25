import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/layout/Container'
import { aboutContent, type AboutSkill } from '@/features/about/data/about'
import { cn } from '@/lib/utils/cn'

function SkillLevel({ level }: { level: AboutSkill['level'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider uppercase',
        level === 'Pro' && 'bg-foreground/8 text-foreground',
        level === 'Noob' && 'bg-foreground/8 text-foreground/70',
        level === 'Hobby' && 'bg-foreground/8 text-foreground/70',
      )}
    >
      {level}
    </span>
  )
}

export function AboutSkills() {
  const { skillsTitle, skills } = aboutContent

  return (
    <section className="py-[var(--space-section)]">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:gap-16 lg:gap-24">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-none font-extrabold tracking-tight uppercase">
              {skillsTitle}
            </h2>
          </Reveal>

          <ul className="min-w-0">
            {skills.map((skill, index) => (
              <Reveal key={skill.title} delay={index * 0.05}>
                <li
                  className={cn(
                    'border-t border-foreground/10 py-8 first:border-t-0 first:pt-0 md:py-10',
                    index === skills.length - 1 && 'border-b border-foreground/10',
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold tracking-tight uppercase md:text-xl">
                      {skill.title}
                    </h3>
                    <SkillLevel level={skill.level} />
                  </div>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    {skill.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
