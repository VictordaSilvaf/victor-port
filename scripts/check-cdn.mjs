#!/usr/bin/env node
/**
 * Diagnose Cloudflare R2 / CDN image delivery for victorsf.
 *
 * Usage:
 *   node scripts/check-cdn.mjs
 *   API_URL=https://api.victorsf.com node scripts/check-cdn.mjs
 *
 * Exit codes:
 *   0 — all sampled CDN URLs return 200 with an image content-type
 *   1 — one or more URLs failed (404 object missing, 403 BIC, network, etc.)
 */
const API_URL = (process.env.API_URL || process.env.VITE_API_URL || 'https://api.victorsf.com').replace(
  /\/$/,
  '',
)

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`API ${res.status} ${url}`)
  return res.json()
}

async function probe(url) {
  const started = Date.now()
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'image/*,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (compatible; victor-port-cdn-check/1.0; +https://victorsf.com)',
      },
      redirect: 'follow',
    })
    const buf = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || ''
    const isText =
      contentType.includes('text') ||
      contentType.includes('html') ||
      contentType.includes('json')
    const bodyText = isText
      ? new TextDecoder().decode(buf.slice(0, 8000)).replace(/\s+/g, ' ')
      : ''
    let hint
    if (bodyText.includes('Object not found') || bodyText.includes('not publicly accessible')) {
      hint = 'R2 object missing or not publicly accessible'
    } else if (bodyText.includes('error code: 1010')) {
      hint = 'Cloudflare Error 1010 (Browser Integrity Check)'
    } else if (!res.ok && bodyText) {
      hint = bodyText.slice(0, 120)
    }
    return {
      url,
      ok: res.ok && contentType.startsWith('image/'),
      status: res.status,
      contentType,
      cfCache: res.headers.get('cf-cache-status'),
      cfMitigated: res.headers.get('cf-mitigated'),
      server: res.headers.get('server'),
      bytes: buf.byteLength,
      ms: Date.now() - started,
      hint,
    }
  } catch (err) {
    return {
      url,
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - started,
    }
  }
}

function collectUrls(payload) {
  const projects = Array.isArray(payload?.data) ? payload.data : []
  const urls = []
  for (const project of projects) {
    for (const key of ['cover_url', 'thumbnail_url']) {
      const value = project?.[key]
      if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
        urls.push({ slug: project.slug || project.id, field: key, url: value })
      }
    }
  }
  return urls
}

function printRow(result) {
  const status = result.ok ? 'OK ' : 'FAIL'
  const meta = [
    result.status,
    result.contentType,
    result.cfCache && `cf=${result.cfCache}`,
    result.cfMitigated && `mitigated=${result.cfMitigated}`,
    `${result.bytes ?? 0}B`,
    `${result.ms}ms`,
  ]
    .filter(Boolean)
    .join(' | ')
  console.log(`${status}  ${meta}`)
  console.log(`      ${result.url}`)
  if (result.hint) console.log(`      → ${result.hint}`)
  if (result.error) console.log(`      → ${result.error}`)
}

const payload = await fetchJson(`${API_URL}/api/v1/projects`)
const entries = collectUrls(payload)

console.log(`API: ${API_URL}`)
console.log(`Projects with CDN URLs: ${entries.length}`)
console.log('')

if (entries.length === 0) {
  console.error('No absolute cover_url / thumbnail_url fields returned by the API.')
  process.exit(1)
}

const results = []
for (const entry of entries) {
  const result = await probe(entry.url)
  results.push({ ...entry, ...result })
  printRow(result)
  console.log('')
}

const failed = results.filter((r) => !r.ok)
const r2Missing = failed.filter((r) => r.hint?.includes('R2 object missing'))
const cached404 = failed.filter((r) => r.status === 404 && r.cfCache === 'HIT')

console.log('--- Summary ---')
console.log(`Checked: ${results.length}`)
console.log(`OK:      ${results.length - failed.length}`)
console.log(`Failed:  ${failed.length}`)
if (r2Missing.length) {
  console.log('')
  console.log('Root cause signal: Cloudflare R2 custom domain is reachable,')
  console.log('but the object keys do not exist (or public access is wrong).')
  console.log('Fix in Cloudflare dashboard → R2 → bucket "victorsf":')
  console.log('  1. Confirm objects exist under prefix production/uploads/...')
  console.log('  2. Confirm custom domain cdn.victorsf.com is bound to that bucket')
  console.log('  3. Re-upload missing assets (or restore from backup)')
  console.log('  4. Purge Cache for cdn.victorsf.com (404s are cached ~4h)')
}
if (cached404.length) {
  console.log('')
  console.log(`Note: ${cached404.length} failure(s) served as cf-cache-status: HIT.`)
  console.log('After restoring objects, purge Cloudflare cache or wait for TTL.')
}

process.exit(failed.length ? 1 : 0)
