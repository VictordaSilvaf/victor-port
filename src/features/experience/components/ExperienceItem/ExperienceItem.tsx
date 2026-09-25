import { Reveal } from '@/components/motion/Reveal'
import type { ExperienceEntry } from '@/features/experience/data/experience'
import { cn } from '@/lib/utils/cn'

type ExperienceItemProps = {
  entry: ExperienceEntry
  index?: number
  className?: string
}

export function ExperienceItem({
  entry,
  index = 0,
  className,
}: ExperienceItemProps) {
  return (
    <Reveal
      as="li"
      delay={Math.min(index * 0.06, 0.3)}
      amount={0.35}
      className={cn(
        'grid gap-2 border-b border-border py-6 md:grid-cols-[12rem_1fr]',
        className,
      )}
    >
      <p className="caption text-muted-foreground">{entry.period}</p>
      <div>
        <h3 className="text-lg font-medium tracking-tight">
          {entry.role} · {entry.company}
        </h3>
        <p className="body mt-2 text-muted-foreground">{entry.description}</p>
      </div>
    </Reveal>
  )
}
