import { ArrowUpRightIcon } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/components/ui/Link'
import { contactContent } from '@/features/contact/data/contact'
import { siteConfig } from '@/lib/constants/site'

export function ContactInfo() {
  const { location, phone, email } = contactContent

  const columns = [
    {
      key: 'social',
      label: 'Social',
      content: (
        <ul className="mt-4 flex flex-col gap-2">
          {siteConfig.socials.map((social) => (
            <li key={social.label}>
              <Link
                href={social.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold tracking-[0.06em] text-foreground uppercase no-underline hover:no-underline"
              >
                {social.label}
                <ArrowUpRightIcon className="size-3.5 opacity-60" />
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'location',
      label: location.label,
      content: (
        <p className="mt-4 text-sm font-bold tracking-[0.06em] whitespace-pre-line text-foreground uppercase">
          {location.value}
        </p>
      ),
    },
    {
      key: 'phone',
      label: phone.label,
      content: (
        <Link
          href={phone.href}
          className="mt-4 inline-block text-sm font-bold tracking-[0.06em] text-foreground uppercase no-underline hover:no-underline"
        >
          {phone.value}
        </Link>
      ),
    },
    {
      key: 'email',
      label: 'E-mail',
      content: (
        <Link
          href={`mailto:${email}`}
          className="mt-4 inline-block text-sm font-bold tracking-[0.06em] text-foreground uppercase underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground"
        >
          {email}
        </Link>
      ),
    },
  ] as const

  return (
    <section className="border-t border-border/70 py-16 md:py-24">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {columns.map((column, index) => (
            <Reveal key={column.key} delay={index * 0.07} amount={0.3}>
              <p className="text-xs font-bold tracking-[0.12em] text-foreground/45 uppercase">
                {column.label}
              </p>
              {column.content}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
