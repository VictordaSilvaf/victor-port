import { Helmet } from 'react-helmet-async'
import { useSiteConfig } from '@/app/providers/site-settings-context'
import { absoluteUrl } from '@/lib/constants/site'

export function JsonLd() {
  const site = useSiteConfig()
  const sameAs = site.socials
    .filter((social) => social.href.startsWith('http'))
    .map((social) => social.href)

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    email: site.email,
    description: site.description,
    image: absoluteUrl(site.ogImage, site.url),
    sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.city,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: site.language,
    description: site.description,
    publisher: {
      '@type': 'Person',
      name: site.name,
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(person)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  )
}
