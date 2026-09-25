import {
  copyFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')
const shellPath = join(distDir, 'index.shell.html')
const routes = ['/', '/sobre', '/contato']

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

copyFileSync(join(distDir, 'index.html'), shellPath)

function resolveDistFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0])
  const hasExt = Boolean(extname(clean))

  // During crawl, always serve the Vite shell for document navigations
  // so React Router can render the correct route.
  if (!hasExt || clean.endsWith('.html')) {
    return shellPath
  }

  const direct = join(distDir, clean)
  if (existsSync(direct)) return direct

  return shellPath
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = req.url || '/'
    const filePath = resolveDistFile(urlPath)
    const data = await readFile(filePath)
    const type = MIME[extname(filePath)] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': type })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
const { port } = server.address()
const origin = `http://127.0.0.1:${port}`

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

try {
  for (const route of routes) {
    const page = await browser.newPage()
    await page.goto(`${origin}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 90000,
    })
    await page.waitForSelector('#root', { timeout: 30000 })
    await page.waitForFunction(
      () => document.querySelector('#root')?.childElementCount > 0,
      { timeout: 30000 },
    )
    await new Promise((r) => setTimeout(r, 1200))

    const html = await page.evaluate(() => {
      const head = document.head

      const byKey = new Map()
      for (const el of [
        ...head.querySelectorAll(
          'meta[name], meta[property], link[rel="canonical"]',
        ),
      ]) {
        const key =
          el.getAttribute('property') ||
          el.getAttribute('name') ||
          `${el.tagName}:${el.getAttribute('rel')}`
        if (!key) continue
        if (byKey.has(key)) {
          const prev = byKey.get(key)
          const preferCurrent =
            el.hasAttribute('data-rh') || !prev.hasAttribute('data-rh')
          if (preferCurrent) {
            prev.remove()
            byKey.set(key, el)
          } else {
            el.remove()
          }
        } else {
          byKey.set(key, el)
        }
      }

      const ogTitle = head
        .querySelector('meta[property="og:title"]')
        ?.getAttribute('content')
      head.querySelectorAll('title').forEach((el) => el.remove())
      if (ogTitle) {
        const titleEl = document.createElement('title')
        titleEl.textContent = ogTitle
        head.insertBefore(titleEl, head.firstChild)
        document.title = ogTitle
      }

      return `<!doctype html>\n${document.documentElement.outerHTML}`
    })

    const out =
      route === '/'
        ? join(distDir, 'index.html')
        : join(distDir, route.slice(1), 'index.html')

    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, html)
    console.log(`[prerender] ${route} -> ${out}`)
    await page.close()
  }
} finally {
  await browser.close()
  server.close()
  if (existsSync(shellPath)) unlinkSync(shellPath)
}

console.log('[prerender] Done')
