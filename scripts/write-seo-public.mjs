import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const FALLBACK_PROJECT_SLUGS = [
  'atelier',
  'northline',
  'signal',
  'prepay',
  'gridline',
]

function resolveSiteUrl() {
  const fromEnv = process.env.VITE_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (production) {
    return `https://${production.replace(/^https?:\/\//, '')}`.replace(
      /\/$/,
      '',
    )
  }

  const preview = process.env.VERCEL_URL?.trim()
  if (preview) {
    return `https://${preview.replace(/^https?:\/\//, '')}`.replace(/\/$/, '')
  }

  return 'http://localhost:5173'
}

function resolveApiUrl() {
  return (
    process.env.VITE_API_URL?.trim().replace(/\/$/, '') ||
    'https://api.victorsf.com'
  )
}

async function fetchProjectSlugs() {
  try {
    const apiUrl = resolveApiUrl()
    const response = await fetch(
      `${apiUrl}/api/v1/projects?per_page=100&sort=sort_order&direction=asc`,
      { headers: { Accept: 'application/json' } },
    )
    if (!response.ok) return FALLBACK_PROJECT_SLUGS
    const payload = await response.json()
    const data = Array.isArray(payload?.data) ? payload.data : []
    const slugs = data
      .map((item) =>
        item && typeof item.slug === 'string' ? item.slug.trim() : '',
      )
      .filter(Boolean)
    return slugs.length > 0 ? slugs : FALLBACK_PROJECT_SLUGS
  } catch {
    return FALLBACK_PROJECT_SLUGS
  }
}

const siteUrl = resolveSiteUrl()
const projectSlugs = await fetchProjectSlugs()

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
  { path: '/contato', priority: '0.7', changefreq: 'monthly' },
  ...projectSlugs.map((slug) => ({
    path: `/projetos/${slug}`,
    priority: '0.6',
    changefreq: 'monthly',
  })),
]

const lastmod = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.path === '/' ? '/' : route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap)
writeFileSync(resolve(root, 'public/robots.txt'), robots)

console.log(
  `[seo] Wrote robots.txt + sitemap.xml for ${siteUrl} (${projectSlugs.length} projects)`,
)
