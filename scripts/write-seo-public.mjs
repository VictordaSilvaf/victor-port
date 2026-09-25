import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const siteUrl = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(
  /\/$/,
  '',
)

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
  { path: '/contato', priority: '0.7', changefreq: 'monthly' },
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

console.log(`[seo] Wrote robots.txt + sitemap.xml for ${siteUrl}`)
