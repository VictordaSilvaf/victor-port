import { Container } from '@/components/layout/Container'
import { Link } from '@/components/ui/Link'
import { siteConfig } from '@/lib/constants/site'

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="caption text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex gap-5">
          {siteConfig.socials.map((social) => (
            <Link
              key={social.href}
              href={social.href}
              className="caption text-muted-foreground hover:text-foreground"
            >
              {social.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  )
}
