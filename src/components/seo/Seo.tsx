import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  absoluteUrl,
  resolveOgImage,
  siteConfig,
} from '@/lib/constants/site'

type SeoProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function Seo({
  title,
  description = siteConfig.description,
  path = '/',
  image,
  noIndex = false,
}: SeoProps) {
  const isRootTitle = !title || title === siteConfig.title
  const fullTitle = isRootTitle
    ? siteConfig.title
    : siteConfig.titleTemplate.replace('%s', title)
  const canonical = absoluteUrl(path)
  const ogImage = resolveOgImage(image)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  return (
    <Helmet>
      <html lang={siteConfig.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${siteConfig.name} — ${siteConfig.role}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
