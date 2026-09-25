import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/components/layout/Container'
import { aboutContent } from '@/features/about/data/about'

/** Turns `**word**` markers into bold spans. */
function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(
      <strong key={key++} className="font-semibold text-foreground">
        {match[1]}
      </strong>,
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

export function AboutExperience() {
  const {
    experienceTitle,
    experienceTitleAccent,
    jobs,
    education,
    closing,
  } = aboutContent

  return (
    <section className="py-[var(--space-section)]">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:gap-16 lg:gap-24">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] font-extrabold tracking-tight uppercase">
              <span className="block">{experienceTitle}</span>
              <span className="block text-foreground/55">{experienceTitleAccent}</span>
            </h2>
          </Reveal>

          <div className="min-w-0">
            {jobs.map((job, index) => (
              <Reveal key={`${job.company}-${job.period}`} delay={index * 0.04}>
                <article className="border-t border-foreground/10 py-10 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-bold tracking-tight uppercase md:text-xl">
                    {job.company}
                    {job.location ? (
                      <span className="text-foreground/50">, {job.location}</span>
                    ) : null}
                  </h3>
                  <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <p className="text-sm font-bold tracking-wider uppercase md:text-base">
                      {job.role}
                    </p>
                    <p className="shrink-0 text-xs font-bold tracking-widest text-foreground/55 uppercase tabular-nums md:text-sm">
                      {job.period}
                    </p>
                  </div>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {job.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>
                        <RichText text={paragraph} />
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}

            {education.map((item) => (
              <Reveal key={item.school}>
                <article className="border-t border-foreground/10 py-10">
                  <h3 className="text-lg font-bold tracking-tight uppercase md:text-xl">
                    {item.school}
                  </h3>
                  <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <p className="text-sm font-bold tracking-wider uppercase md:text-base">
                      {item.degree}
                    </p>
                    <p className="shrink-0 text-xs font-bold tracking-widest text-foreground/55 uppercase tabular-nums md:text-sm">
                      {item.period}
                    </p>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}

            <Reveal>
              <div className="border-t border-foreground/10 pt-10">
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {closing.line1}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {closing.line2}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
