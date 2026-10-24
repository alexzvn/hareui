/**
 * Component thumbnails for the All Components page and the Related Components cards.
 * Screenshots the first demo of every component page (or the one picked in PICKS) from a running docs server, light and dark,
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
// Crops of full-page layouts are opaque, so they may cover more of the card; they stay within the width the
// cards show (they crop the thumbnail's sides) and are framed as a rounded window.
const CROP_CONTENT = { width: 660, height: 480 }
const CROP_RADIUS = 12

// Components whose first demo is a gallery too dense to read at thumbnail size: `demo` names the
// demo to shoot instead (its ComponentPreview name, e.g. `button-group/variants`), and `select`
// keeps only the matching elements inside it (`:scope` is the demo's root element). `width` narrows
// a full-width demo (in CSS px) so it is shot at a readable zoom.
// Overlays are shot open, as HeroUI's are: `open` clicks (or, with `hover`, hovers) the demo element it
// matches, then `overlay` picks what to keep from the whole document (overlays are teleported to <body>).
// Without `select`, nothing of the demo itself is kept. `viewport` resizes the page for overlays sized by it.
// Full-page (`contain`) demos render in an iframe, so `page` shoots the demo alone from its /preview/<demo> route
// at that viewport instead, keeping either the `select` matches or the `crop` (in CSS px), and `pointer` hovers a
// point of it first. Crops are picked to show the component itself at 1x or more, not the whole page shrunk.
interface Pick {
  demo?: string
  select?: string
  width?: number
  open?: string
  hover?: boolean
  overlay?: string
  viewport?: { width: number, height: number }
  page?: { width: number, height: number }
  crop?: Box
  pointer?: { x: number, y: number }
}
const PICKS: Record<string, Pick> = {
  'alert-dialog': { open: 'button', overlay: '[data-slot="alert-dialog-dialog"]' },
  'accordion': { select: '[data-slot="accordion-item"]:nth-child(-n+3)', width: 320 },
  // App wraps a whole layout, so it shows one; DashboardGroup shows a different one.
  'app': { demo: 'dashboard-group/app-layout-with-breadcrumbs', page: { width: 1024, height: 640 }, crop: { x: 0, y: 0, width: 480, height: 220 } },
  'container': { width: 360 },
  'dashboard-group': { demo: 'dashboard-group/app-layout-default', page: { width: 1024, height: 640 }, crop: { x: 0, y: 0, width: 440, height: 240 } },
  'dashboard-navbar': { demo: 'dashboard-navbar/basic', page: { width: 320, height: 400 }, crop: { x: 0, y: 0, width: 320, height: 64 } },
  'dashboard-panel': { demo: 'dashboard-group/app-layout-inset-dashboard', page: { width: 1024, height: 640 }, crop: { x: 248, y: 0, width: 264, height: 252 } },
  'dashboard-resize-handle': { demo: 'dashboard-resize-handle/custom', page: { width: 1024, height: 640 }, crop: { x: 359, y: 270, width: 100, height: 100 }, pointer: { x: 409, y: 320 } },
  'dashboard-sidebar': { demo: 'dashboard-group/app-layout-complex', page: { width: 1024, height: 640 }, crop: { x: 0, y: 0, width: 240, height: 260 } },
  'dashboard-sidebar-collapse': { demo: 'dashboard-sidebar-collapse/basic', page: { width: 1024, height: 640 }, crop: { x: 0, y: 0, width: 240, height: 216 } },
  'dashboard-sidebar-toggle': { demo: 'dashboard-sidebar-toggle/basic', page: { width: 390, height: 640 }, crop: { x: 0, y: 0, width: 260, height: 64 } },
  'dashboard-toolbar': { demo: 'dashboard-toolbar/basic', page: { width: 1024, height: 400 }, crop: { x: 8, y: 60, width: 280, height: 61 } },
  'footer': { demo: 'footer/basic', select: ':scope > * > *', page: { width: 640, height: 400 } },
  'header': { demo: 'header/basic', page: { width: 1024, height: 640 }, crop: { x: 340, y: 0, width: 344, height: 64 } },
  'navigation-menu': { demo: 'navigation-menu/orientation' },
  'main': { width: 360 },
  'rich-table': { width: 600 },
  'alert': { select: ':scope > [data-slot="alert-root"]:nth-of-type(2)', width: 380 },
  // The basic demo pairs the zone with an empty file panel; the zone alone reads better at card size.
  'drop-zone': { select: '[data-slot="drop-zone"]' },
  // The bottom drawer, as its height fits its content; the narrow viewport keeps it from spanning 1440px.
  'drawer': { demo: 'drawer/placements', open: 'button', overlay: '[data-slot="drawer-dialog"]', viewport: { width: 560, height: 900 } },
  'button-group': { demo: 'button-group/variants', select: ':scope > :first-child [data-slot="button-group"]' },
  'modal': { open: 'button', overlay: '[data-slot="modal-dialog"]' },
  'popover': { select: 'button', open: 'button', overlay: '[data-slot="popover"]' },
  'tabs': { width: 320 },
  'toast': { open: 'button', overlay: '[data-slot="toast"]' },
  'tooltip': { select: ':scope > button:first-child', open: ':scope > button:first-child', hover: true, overlay: '[data-reka-popper-content-wrapper]' },
  'typography': { select: ':scope > :nth-child(-n+3)' },
}

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

// Capturing beyond the viewport enlarges it, which moves anything fixed to it, so open overlays are shot within it.
async function shoot(page: Page, clip: Box, captureBeyondViewport = true): Promise<PNG> {
  return PNG.sync.read(Buffer.from(await page.screenshot({ clip, omitBackground: true, captureBeyondViewport })))
}

async function thumbnail(page: Page, slug: string, theme: 'light' | 'dark'): Promise<PNG> {
  const pick = PICKS[slug] ?? {}
  const viewport = pick.page ?? pick.viewport ?? { width: 1440, height: 900 }
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 })
  if (pick.page && (!pick.demo || !pick.select === !pick.crop))
    throw new Error('`page` needs a `demo` to load from /preview, and either `select` or `crop`')
  const url = pick.page ? `${base}/preview/${pick.demo}?theme=${theme}` : `${base}/docs/components/${slug}`
  // Previews take their theme from VitePress' `isDark`, which reads the stored appearance on load.
  const appearance = await page.evaluateOnNewDocument(t => localStorage.setItem('vitepress-theme-appearance', t), theme)
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120_000 })
  await page.removeScriptToEvaluateOnNewDocument(appearance.identifier)
  let found = await page.evaluate((theme, pick) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    if (pick.page) {
      // The preview route renders the demo inside the app root's full-viewport page wrapper.
      const wrapper = document.body.firstElementChild?.firstElementChild
      const targets = !wrapper ? [] : pick.select ? [...wrapper.querySelectorAll(pick.select)] : [wrapper]
      targets.forEach(el => el.setAttribute('data-thumbnail', ''))
      return targets.length
    }
    const preview = pick.demo ? `.preview[data-name="${pick.demo.replace(/\//g, '-')}"]` : '.preview'
    const demo = document.querySelector(`${preview} > div`)
    const root = demo?.firstElementChild as HTMLElement | null | undefined
    if (root && pick.width)
      root.style.width = root.style.maxWidth = `${pick.width}px`
    // The demo's root can be the trigger itself (a Modal renders its trigger slot as its root).
    const trigger = pick.open && root && (root.matches(pick.open) ? root : root.querySelector(pick.open))
    trigger?.setAttribute('data-thumbnail-open', '')
    const targets = root && pick.select ? [...root.querySelectorAll(pick.select)] : demo && !pick.overlay ? [demo] : []
    targets.forEach(el => el.setAttribute('data-thumbnail', ''))
    return targets.length
  }, theme, pick)
  if (pick.open) {
    const trigger = await page.$('[data-thumbnail-open]')
    if (!trigger)
      throw new Error(`no ${pick.open} to open in the demo`)
    await trigger.scrollIntoView()
    await (pick.hover ? trigger.hover() : trigger.click())
    // Let the overlay's enter animation finish before the transitions are switched off.
    await sleep(800)
    found += await page.$$eval(pick.overlay!, els => els.map(el => el.setAttribute('data-thumbnail', '')).length)
  }
  if (!found)
    throw new Error(`no demo on the page${pick.demo || pick.select ? ` for ${JSON.stringify(pick)}` : ''}`)
  await page.addStyleTag({ content: ISOLATE })
  await page.evaluate(() => document.fonts.ready)
  await sleep(300)

  const rect = await page.$$eval('[data-thumbnail]', (els) => {
    const rs = els.map(el => el.getBoundingClientRect())
    const x = Math.floor(Math.min(...rs.map(r => r.left)) + scrollX)
    const y = Math.floor(Math.min(...rs.map(r => r.top)) + scrollY)
    const right = Math.ceil(Math.max(...rs.map(r => r.right)) + scrollX)
    const bottom = Math.ceil(Math.max(...rs.map(r => r.bottom)) + scrollY)
    return { x, y, width: right - x, height: bottom - y }
  })
  // Full-page demos are fixed to the viewport, which capturing beyond it would resize.
  const beyond = !pick.open && !pick.page
  let box: Box
  if (pick.crop) {
    box = pick.crop
  }
  else {
    // Pass 1 at 1x finds the demo's ink; pass 2 shoots just that box at the thumbnail's zoom.
    const ink = inkBox(await shoot(page, rect, beyond))
    if (!ink)
      throw new Error('demo renders nothing')
    // 2px of padding keeps antialiased edges that only appear at the higher zoom.
    box = { x: rect.x + ink.x - 2, y: rect.y + ink.y - 2, width: ink.width + 4, height: ink.height + 4 }
  }
  const max = pick.crop ? CROP_CONTENT : MAX_CONTENT
  const scale = Math.min(MAX_SCALE, max.width / box.width, max.height / box.height)
  await page.setViewport({ ...viewport, deviceScaleFactor: scale })
  if (pick.pointer) {
    await page.mouse.move(pick.pointer.x, pick.pointer.y)
    await sleep(300)
  }
  const shot = await shoot(page, box, beyond)
  return centre(pick.crop ? frame(shot, scale) : shot)
}

/** Rounds the corners of an opaque crop and outlines it, so it reads as a window on any card background. */
function frame(png: PNG, scale: number): PNG {
  const { width: w, height: h } = png
  const r = CROP_RADIUS * scale
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Signed distance from the pixel centre to the rounded rectangle's edge: negative inside.
      const qx = Math.abs(x + 0.5 - w / 2) - (w / 2 - r)
      const qy = Math.abs(y + 0.5 - h / 2) - (h / 2 - r)
      const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
      const i = (y * w + x) * 4
      png.data[i + 3] = Math.round(png.data[i + 3]! * Math.min(1, Math.max(0, 0.5 - d)))
      // A 1 CSS px outline, blended 30% towards grey.
      const outline = Math.min(1, Math.max(0, d + scale + 0.5)) * 0.3
      for (let c = 0; c < 3; c++)
        png.data[i + c] = Math.round(png.data[i + c]! * (1 - outline) + 128 * outline)
    }
  }
  return png
}

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ headless: true })
const failed: string[] = []
try {
  const page = await browser.newPage()
  // Charts draw in over ~1s; reduced motion renders their final geometry at once.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
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
