/**
 * Component thumbnails for the All Components page and the Related Components cards.
 * Screenshots the first demo of every component page from a running docs server, light and dark,
 * into public/related-components/{light,dark}-<slug>.png: 874x594 transparent PNGs with the demo
 * centred, the size and layout of HeroUI's docs thumbnails.
 *
 * Usage: bun scripts/gen-thumbnails.ts [--base http://localhost:5183] [slug ...]
 * (start the docs server first: `bun run dev -- --port 5183`)
 */
import type { Page } from 'puppeteer'
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'
import puppeteer from 'puppeteer'

const WIDTH = 874
const HEIGHT = 594
// Largest area the demo may cover, and the largest zoom: HeroUI's thumbnails leave about a quarter
// of the width and half the height as margin, and show small components at roughly 2.4x.
const MAX_CONTENT = { width: 620, height: 300 }
const MAX_SCALE = 2.4

const PAGES = fileURLToPath(new URL('../docs/components/', import.meta.url))
const OUT = fileURLToPath(new URL('../public/related-components/', import.meta.url))

const args = process.argv.slice(2)
const baseIndex = args.indexOf('--base')
const base = baseIndex >= 0 ? args.splice(baseIndex, 2)[1]! : 'http://localhost:5183'
const slugs = args.length
  ? args
  : readdirSync(PAGES).filter(f => f.endsWith('.md') && f !== 'index.md').map(f => f.slice(0, -3)).sort()

// Only the first demo stays visible, on a transparent page.
const ISOLATE = `
  html, body { background: transparent !important; }
  body * { visibility: hidden !important; transition: none !important; }
  [data-thumbnail], [data-thumbnail] * { visibility: visible !important; }
`

interface Box { x: number, y: number, width: number, height: number }

/** Bounding box of the non-transparent pixels in a PNG, in its own pixels. */
function inkBox(png: PNG): Box | null {
  let [x0, y0, x1, y1] = [png.width, png.height, -1, -1]
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      if (png.data[(y * png.width + x) * 4 + 3]! > 0) {
        x0 = Math.min(x0, x)
        y0 = Math.min(y0, y)
        x1 = Math.max(x1, x)
        y1 = Math.max(y1, y)
      }
    }
  }
  return x1 < 0 ? null : { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }
}

/** Centres `src` on a transparent WIDTH x HEIGHT canvas, cropping it if it is larger. */
function centre(src: PNG): PNG {
  const out = new PNG({ width: WIDTH, height: HEIGHT })
  const dx = Math.round((WIDTH - src.width) / 2)
  const dy = Math.round((HEIGHT - src.height) / 2)
  for (let y = Math.max(0, dy); y < Math.min(HEIGHT, dy + src.height); y++) {
    const from = ((y - dy) * src.width + Math.max(0, -dx)) * 4
    const to = (y * WIDTH + Math.max(0, dx)) * 4
    const len = (Math.min(WIDTH, dx + src.width) - Math.max(0, dx)) * 4
    src.data.copy(out.data, to, from, from + len)
  }
  return out
}

async function shoot(page: Page, clip: Box): Promise<PNG> {
  return PNG.sync.read(Buffer.from(await page.screenshot({ clip, omitBackground: true, captureBeyondViewport: true })))
}

async function thumbnail(page: Page, slug: string, theme: 'light' | 'dark'): Promise<PNG> {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto(`${base}/docs/components/${slug}`, { waitUntil: 'networkidle0', timeout: 120_000 })
  const found = await page.evaluate((theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    const demo = document.querySelector('.preview > div')
    demo?.setAttribute('data-thumbnail', '')
    return !!demo
  }, theme)
  if (!found)
    throw new Error('no demo on the page')
  await page.addStyleTag({ content: ISOLATE })
  await page.evaluate(() => document.fonts.ready)
  await sleep(300)

  const rect = await page.$eval('[data-thumbnail]', (el) => {
    const r = el.getBoundingClientRect()
    const x = Math.floor(r.x + scrollX)
    const y = Math.floor(r.y + scrollY)
    return { x, y, width: Math.ceil(r.right + scrollX) - x, height: Math.ceil(r.bottom + scrollY) - y }
  })
  // Pass 1 at 1x finds the demo's ink; pass 2 shoots just that box at the thumbnail's zoom.
  const ink = inkBox(await shoot(page, rect))
  if (!ink)
    throw new Error('demo renders nothing')
  // 2px of padding keeps antialiased edges that only appear at the higher zoom.
  const box = { x: rect.x + ink.x - 2, y: rect.y + ink.y - 2, width: ink.width + 4, height: ink.height + 4 }
  const scale = Math.min(MAX_SCALE, MAX_CONTENT.width / box.width, MAX_CONTENT.height / box.height)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: scale })
  return centre(await shoot(page, box))
}

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ headless: true })
const failed: string[] = []
try {
  const page = await browser.newPage()
  for (const slug of slugs) {
    for (const theme of ['light', 'dark'] as const) {
      try {
        writeFileSync(`${OUT}${theme}-${slug}.png`, PNG.sync.write(await thumbnail(page, slug, theme)))
      }
      catch (error) {
        failed.push(`${theme}-${slug}: ${(error as Error).message}`)
      }
    }
    console.log(slug)
  }
}
finally {
  await browser.close()
}
if (failed.length) {
  console.error(`failed:\n  ${failed.join('\n  ')}`)
  process.exit(1)
}
