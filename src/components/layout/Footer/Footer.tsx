import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/components/ui/Link'
import { useSiteConfig } from '@/app/providers/site-settings-context'

export function Footer() {
  const site = useSiteConfig()

  return (
    <footer className="border-t border-border/60 py-10">
      <Container>
        <Reveal
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          amount={0.4}
        >
          <p className="caption text-muted-foreground">
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex gap-5">
            {site.socials.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                className="caption text-muted-foreground hover:text-foreground"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </footer>
  )
}
