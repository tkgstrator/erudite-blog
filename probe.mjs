import { chromium } from 'playwright'

const BASE = 'http://localhost:1234'
const target = '/blog/2026/03/claude_code'

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { height: 800, width: 1280 } })
const page = await ctx.newPage()

const log = []
const t0Wrapper = { value: 0 }
const rel = () => Date.now() - t0Wrapper.value

page.on('request', (r) => {
  const u = new URL(r.url())
  if (u.host !== 'localhost:1234') return
  if (['image', 'stylesheet', 'font', 'script'].includes(r.resourceType())) return
  log.push({ kind: 'req', method: r.method(), t: rel(), type: r.resourceType(), url: u.pathname })
})
page.on('response', (r) => {
  const u = new URL(r.url())
  if (u.host !== 'localhost:1234') return
  if (['image', 'stylesheet', 'font', 'script'].includes(r.request().resourceType())) return
  log.push({ kind: 'res', status: r.status(), t: rel(), url: u.pathname })
})
page.on('framenavigated', (f) => {
  if (f === page.mainFrame()) log.push({ kind: 'nav', t: rel(), url: f.url() })
})
page.on('load', () => log.push({ kind: 'load', t: rel() }))
page.on('domcontentloaded', () => log.push({ kind: 'domcontentloaded', t: rel() }))

await page.exposeFunction('__plog', (kind, data) => log.push({ kind, t: rel(), ...data }))

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })

const swupInfo = await page.evaluate(() => {
  const w = window
  const out = { hasSwup: !!w.swup, plugins: [], visitKeys: [] }
  if (w.swup) {
    out.plugins = (w.swup.plugins || []).map((p) => p.name)
    out.visitKeys = Object.keys(w.swup)
    const events = [
      'enable',
      'disable',
      'link:click',
      'animation:out:start',
      'animation:out:end',
      'content:replace',
      'animation:in:start',
      'animation:in:end',
      'page:view',
      'history:popstate',
      'visit:start',
      'visit:end',
      'fetch:request',
      'fetch:response',
      'page:load',
      'cache:set',
      'cache:hit'
    ]
    for (const e of events) {
      try {
        w.swup.hooks.on(e, () => w.__plog('swup', { event: e }))
      } catch (_) {}
    }
  }
  return out
})
console.log('swup info:', JSON.stringify(swupInfo, null, 2))

await page.waitForSelector(`a[href="${target}"]`)

log.length = 0
t0Wrapper.value = Date.now()
log.push({ kind: 'click:start', t: 0 })
await page.click(`a[href="${target}"]`)

await page.waitForURL(`**${target}*`, { timeout: 10000 })
await page.waitForLoadState('networkidle')
await new Promise((r) => setTimeout(r, 1500))
log.push({ kind: 'settled', t: rel() })

for (const e of log) {
  const tag = `+${e.t}ms`.padStart(9)
  const { t, ...rest } = e
  console.log(tag, JSON.stringify(rest))
}

await browser.close()
