import { Container } from '@/components/layout/Container'
import { Link } from '@/components/ui/Link'
import { siteConfig } from '@/lib/constants/site'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-medium tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-6" aria-label="Primary">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="caption text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  )
}
