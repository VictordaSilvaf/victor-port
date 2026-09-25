import { ExperienceItem } from '@/features/experience/components/ExperienceItem'
import {
  experience,
  type ExperienceEntry,
} from '@/features/experience/data/experience'
import { cn } from '@/lib/utils/cn'

type ExperienceListProps = {
  items?: ExperienceEntry[]
  className?: string
}

export function ExperienceList({
  items = experience,
  className,
}: ExperienceListProps) {
  return (
    <ul className={cn('list-none', className)}>
      {items.map((entry) => (
        <ExperienceItem key={entry.id} entry={entry} />
      ))}
    </ul>
  )
}
