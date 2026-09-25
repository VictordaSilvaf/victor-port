import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import puppeteer from 'puppeteer-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'public/og.png')

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Geist:wght@500;800&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1200px;
        height: 630px;
        font-family: Geist, ui-sans-serif, system-ui, sans-serif;
        background: #0a0a0a;
        color: #f5f5f5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 72px 80px;
      }
      .eyebrow {
        font-size: 22px;
        font-weight: 500;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #a3a3a3;
      }
      h1 {
        font-size: 84px;
        line-height: 0.95;
        font-weight: 800;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        max-width: 14ch;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 24px;
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #d4d4d4;
      }
      .bar {
        width: 120px;
        height: 4px;
        background: #f5f5f5;
        margin-bottom: 28px;
      }
    </style>
  </head>
  <body>
    <div>
      <div class="bar"></div>
      <p class="eyebrow">Portfolio</p>
    </div>
    <h1>Victor Fernandes</h1>
    <div class="footer">
      <span>Software Engineer</span>
      <span>Laravel · React · React Native</span>
    </div>
  </body>
</html>`

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(html)
})

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
const { port } = server.address()

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.goto(`http://127.0.0.1:${port}/`, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  })
  await new Promise((r) => setTimeout(r, 800))
  mkdirSync(dirname(outPath), { recursive: true })
  const buffer = await page.screenshot({ type: 'png' })
  writeFileSync(outPath, buffer)
  console.log(`[seo] Wrote ${outPath}`)
} finally {
  await browser.close()
  server.close()
}
