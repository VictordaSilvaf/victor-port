import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSiteConfig } from '@/app/providers/site-settings-context'
import { absoluteUrl, resolveOgImage } from '@/lib/constants/site'

type SeoProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function Seo({
  title,
  description,
  path = '/',
  image,
  noIndex = false,
}: SeoProps) {
  const site = useSiteConfig()
  const resolvedDescription = description ?? site.description
  const isRootTitle = !title || title === site.title
  const fullTitle = isRootTitle
    ? site.title
    : site.titleTemplate.replace('%s', title)
  const canonical = absoluteUrl(path, site.url)
  const ogImage = image?.startsWith('http')
    ? image
    : resolveOgImage(image, site.url)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  return (
    <Helmet>
      <html lang={site.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta
        property="og:image:alt"
        content={`${site.name} — ${site.role}`}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
