import { Helmet } from 'react-helmet-async'
import { absoluteUrl, siteConfig } from '@/lib/constants/site'

export function JsonLd() {
  const sameAs = siteConfig.socials
    .filter((social) => social.href.startsWith('http'))
    .map((social) => social.href)

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
    image: absoluteUrl(siteConfig.ogImage),
    sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    description: siteConfig.description,
    publisher: {
      '@type': 'Person',
      name: siteConfig.name,
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(person)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  )
}
