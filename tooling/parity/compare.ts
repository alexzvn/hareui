/**
 * Visual parity check: HareUI playground vs @heroui/react reference.
 * Compares computed styles of every [data-slot] element and pixel screenshots.
 * Builds both apps into private temp dirs and serves them on ephemeral ports, so no dev servers are needed
 * and concurrent runs don't collide.
 *
 * Cases: parity/cases/<component>.json + playground/src/parity/cases/<component>.ts + reference/src/cases/<component>.tsx
 * Usage: bun parity/compare.ts [--component <name>] [--case <id>] [--concurrency <n>]
 */
import type { ElementHandle, Page } from 'puppeteer'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import puppeteer from 'puppeteer'

type Case = {
  id: string
  component: string
  actions: Array<'hover' | 'focus' | 'press' | 'open'>
  ignoreSlots?: string[]
  ignoreProps?: string[]
  reason?: string
  target?: string
  overlay?: boolean
  maxDiffRatio?: number
}

type State = 'idle' | Case['actions'][number]
type Theme = 'light' | 'dark'

type SlotSnapshot = { slot: string, tag: string, styles: Record<string, string> }

type App = { name: 'vue' | 'react', url: string }

const TOOLING = fileURLToPath(new URL('../', import.meta.url))
const OUT = fileURLToPath(new URL('./out/', import.meta.url))
const CASES_DIR = fileURLToPath(new URL('./cases/', import.meta.url))
const caseList: Case[] = readdirSync(CASES_DIR).filter(f => f.endsWith('.json')).sort().flatMap(f => JSON.parse(readFileSync(CASES_DIR + f, 'utf8')))

const PROPS = [
  'display', 'position', 'box-sizing', 'width', 'height',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'gap',
  'color', 'background-color', 'background-image',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'box-shadow', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  'opacity', 'transform', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'text-align', 'text-transform', 'cursor', 'transition-duration', 'transition-property',
]
const PSEUDO_PROPS = ['content', 'width', 'height', 'background-color']

const args = process.argv.slice(2)
function flag(name: string): string | undefined {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}

const tempDirs: string[] = []
process.on('exit', () => tempDirs.forEach(d => rmSync(d, { recursive: true, force: true })))

// Bundled builds instead of the dev servers: a dev-server page load fetches ~800 unbundled library modules,
// a bundled one a handful of cached files, and parity reloads the page for every case/state/theme.
async function serveApp(name: App['name'], dir: string, buildArgs: string[], entry: string): Promise<App> {
  const outDir = mkdtempSync(join(tmpdir(), `parity-${name}-`))
  tempDirs.push(outDir)
  const build = Bun.spawn(['bun', 'x', 'vite', 'build', ...buildArgs, '--outDir', outDir, '--logLevel', 'error'], { cwd: join(TOOLING, dir), stdout: 'pipe', stderr: 'pipe' })
  if (await build.exited !== 0) {
    console.error(`${name} build failed:\n${await new Response(build.stdout).text()}${await new Response(build.stderr).text()}`)
    process.exit(1)
  }
  const server = Bun.serve({
    port: 0,
    async fetch(req) {
      const file = Bun.file(join(outDir, new URL(req.url).pathname))
      if (new URL(req.url).pathname.startsWith('/assets/') && await file.exists())
        return new Response(file, { headers: { 'cache-control': 'public, max-age=31536000, immutable' } })
      return new Response(Bun.file(join(outDir, entry)))
    },
  })
  return { name, url: server.url.origin }
}

async function load(page: Page, app: App, c: Case, theme: Theme) {
  await page.goto(`${app.url}/parity/${encodeURIComponent(c.id)}${theme === 'dark' ? '?theme=dark' : ''}`, { waitUntil: 'load' })
  await page.waitForSelector('#case, #case-missing')
  if (await page.$('#case-missing'))
    throw new Error(`case missing in ${app.name} app`)
  await page.waitForSelector('#case')
  await page.evaluate(() => document.fonts.ready)
  await sleep(300)
}

const sleep = (ms: number) => Bun.sleep(ms)
const debug = (...m: unknown[]) => process.env.PARITY_DEBUG && console.log('[debug]', ...m)

async function target(page: Page, c: Case): Promise<ElementHandle<Element>> {
  const el = await page.$(c.target ?? '#case [data-slot]')
  if (!el)
    throw new Error(`target ${c.target ?? '#case [data-slot]'} not found`)
  return el
}

async function act(page: Page, c: Case, state: State) {
  if (state === 'idle' || state === 'open')
    return
  const el = await target(page, c)
  if (state === 'hover') {
    await el.hover()
  }
  else if (state === 'focus') {
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      if (await el.evaluate(e => e.contains(document.activeElement)))
        break
    }
  }
  else if (state === 'press') {
    const box = await el.boundingBox()
    if (!box)
      throw new Error('press target has no box')
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
  }
  await sleep(300)
}

async function snapshot(page: Page, c: Case): Promise<SlotSnapshot[]> {
  return page.evaluate((overlay, props, pseudoProps) => {
    const root: ParentNode = overlay ? document : document.querySelector('#case')!
    const canvas = document.createElement('canvas').getContext('2d')!
    const norm = (prop: string, value: string) => {
      // Tailwind shadow utilities compose ring/inset layers that stay transparent and zero-sized; they
      // paint nothing, so drop them to compare `shadow-*` against HeroUI's plain `box-shadow` values.
      if (prop === 'box-shadow')
        return value.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px( inset)?(, |$)/g, '').replace(/, $/, '') || 'none'
      if (!prop.includes('color'))
        return value
      canvas.fillStyle = '#010203'
      canvas.fillStyle = value
      return canvas.fillStyle === '#010203' && value !== 'rgb(1, 2, 3)' ? value : String(canvas.fillStyle)
    }
    // Overlay cases: position of every slot relative to the trigger area (#case), so offset bugs
    // (e.g. arrow height added to sideOffset) fail even when styles match.
    const origin = overlay ? document.querySelector('#case')!.getBoundingClientRect() : null
    return [...root.querySelectorAll('[data-slot]')].map((el) => {
      const cs = getComputedStyle(el)
      const styles: Record<string, string> = {}
      for (const p of props)
        styles[p] = norm(p, cs.getPropertyValue(p))
      for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(el, pseudo)
        for (const p of pseudoProps)
          styles[`${pseudo}${p}`] = norm(p, ps.getPropertyValue(p))
      }
      if (origin) {
        const r = el.getBoundingClientRect()
        styles['@rect.x'] = String(r.left - origin.left)
        styles['@rect.y'] = String(r.top - origin.top)
        styles['@rect.width'] = String(r.width)
        styles['@rect.height'] = String(r.height)
      }
      return { slot: el.getAttribute('data-slot')!, tag: el.tagName.toLowerCase(), styles }
    })
  }, !!c.overlay, PROPS, PSEUDO_PROPS)
}

async function screenshot(page: Page, c: Case): Promise<Buffer> {
  if (c.overlay)
    return Buffer.from(await page.screenshot())
  const el = await page.$('#case')
  return Buffer.from(await el!.screenshot())
}

function diffSnapshots(c: Case, react: SlotSnapshot[], vue: SlotSnapshot[]): string[] {
  const ignore = new Set(c.ignoreSlots ?? [])
  const ignoreProps = new Set(c.ignoreProps ?? [])
  const r = react.filter(s => !ignore.has(s.slot))
  const v = vue.filter(s => !ignore.has(s.slot))
  const errors: string[] = []
  const rs = r.map(s => s.slot).join(',')
  const vs = v.map(s => s.slot).join(',')
  if (rs !== vs) {
    errors.push(`slot sequence differs\n    react=[${rs}]\n    vue  =[${vs}]`)
    return errors
  }
  const seen: Record<string, number> = {}
  r.forEach((rEl, i) => {
    const vEl = v[i]!
    const idx = (seen[rEl.slot] = (seen[rEl.slot] ?? -1) + 1)
    for (const prop of Object.keys(rEl.styles)) {
      if (ignoreProps.has(prop))
        continue
      // Rects: Reka positions on integer pixels while RAC uses fractional ones; allow 1px.
      if (prop.startsWith('@rect.')
        ? Math.abs(Number(rEl.styles[prop]) - Number(vEl.styles[prop])) > 1
        : rEl.styles[prop] !== vEl.styles[prop])
        errors.push(`${rEl.slot}[${idx}].${prop}: react=${rEl.styles[prop]} vue=${vEl.styles[prop]}`)
    }
  })
  return errors
}

function diffImages(c: Case, a: Buffer, b: Buffer, name: string): string | null {
  if (a.equals(b))
    return null
  const ra = PNG.sync.read(a)
  const vb = PNG.sync.read(b)
  const save = (diff?: PNG) => {
    mkdirSync(OUT, { recursive: true })
    writeFileSync(`${OUT}${name}-react.png`, a)
    writeFileSync(`${OUT}${name}-vue.png`, b)
    if (diff)
      writeFileSync(`${OUT}${name}-diff.png`, PNG.sync.write(diff))
  }
  if (ra.width !== vb.width || ra.height !== vb.height) {
    save()
    return `screenshot size differs: react=${ra.width}x${ra.height} vue=${vb.width}x${vb.height}`
  }
  const diff = new PNG({ width: ra.width, height: ra.height })
  const n = pixelmatch(ra.data, vb.data, diff.data, ra.width, ra.height, { threshold: 0.1 })
  const ratio = n / (ra.width * ra.height)
  if (ratio > (c.maxDiffRatio ?? 0.001)) {
    save(diff)
    return `screenshot differs: ${n} px (${(ratio * 100).toFixed(2)}%)`
  }
  return null
}

async function capture(page: Page, app: App, c: Case, state: State, theme: Theme) {
  debug(c.id, state, theme, app.name)
  await load(page, app, c, theme)
  await act(page, c, state)
  // Sheets enter by smooth scrolling, and their backdrop follows the scroll: wait until every sheet scroller rests.
  await page.waitForFunction(() => {
    const w = window as unknown as { __sheetScroll?: string, __sheetStable?: number }
    const now = [...document.querySelectorAll('[data-sheet-scroll]')].map(e => `${e.scrollLeft},${e.scrollTop}`).join(';')
    w.__sheetStable = now === w.__sheetScroll ? (w.__sheetStable ?? 0) + 1 : 0
    w.__sheetScroll = now
    if (!now)
      return true
    return w.__sheetStable >= 10 && !document.querySelector('[data-entering]')
  }, { polling: 'raf', timeout: 5000 }).catch(() => {})
  // Infinite animations (spinners) are pinned to t=0; finite ones (enter transitions) are finished.
  // Scroll/view-timeline animations (e.g. HeroUI ScrollShadow fades) reflect real scroll state: leave them alone.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      if (!(a.timeline instanceof DocumentTimeline))
        continue
      if (a.effect?.getComputedTiming().iterations === Infinity) {
        a.pause()
        a.currentTime = 0
      }
      else {
        a.finish()
      }
    }
  })
  const snap = await snapshot(page, c)
  const shot = await screenshot(page, c)
  await page.mouse.up().catch(() => {})
  return { snap, shot }
}

async function runOne(page: Page, apps: { vue: App, react: App }, job: { c: Case, state: State, theme: Theme }): Promise<string[]> {
  const { c, state, theme } = job
  try {
    const r = await capture(page, apps.react, c, state, theme)
    const v = await capture(page, apps.vue, c, state, theme)
    const errors = diffSnapshots(c, r.snap, v.snap)
    const img = diffImages(c, r.shot, v.shot, `${c.id}-${state}-${theme}`)
    if (img)
      errors.push(img)
    return errors
  }
  catch (e) {
    return [String((e as Error).message ?? e)]
  }
}

let closeBrowser: (() => Promise<void>) | undefined

// Close the browser on Ctrl-C / kill so no orphaned Chrome processes are left behind.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    Promise.allSettled([closeBrowser?.()]).finally(() => process.exit(130))
  })
}

async function main() {
  const component = flag('component')
  const only = flag('case')
  const concurrency = Number(flag('concurrency') ?? 2)
  const cases = caseList.filter(c => (!component || c.component === component) && (!only || c.id === only))
  if (!cases.length) {
    console.error('no matching cases')
    process.exit(1)
  }

  const jobs: Array<{ c: Case, state: State, theme: Theme }> = []
  for (const c of cases) {
    for (const state of ['idle', ...c.actions.filter(a => a !== 'open')] as State[]) {
      for (const theme of ['light', 'dark'] as Theme[])
        jobs.push({ c, state, theme })
    }
  }
  // Clear only this run's PNGs: out/ is shared with parity runs for other components.
  for (const { c, state, theme } of jobs) {
    for (const side of ['react', 'vue', 'diff'])
      rmSync(`${OUT}${c.id}-${state}-${theme}-${side}.png`, { force: true })
  }

  const apps = await Promise.all([
    serveApp('vue', 'playground', ['--mode', 'parity'], 'parity.html'),
    serveApp('react', 'reference', [], 'index.html'),
  ]).then(([vue, react]) => ({ vue, react }))
  // One browser; each worker gets its own isolated context instead of a whole Chrome instance. The headless
  // shell renders both apps with the same engine and costs about a third less CPU than full headless Chrome.
  const browser = await puppeteer.launch({ headless: 'shell' })
  closeBrowser = () => browser.close()

  const failures = new Map<string, string[]>()
  let next = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    const page = await (await browser.createBrowserContext()).newPage()
    page.setDefaultTimeout(15000)
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
    while (next < jobs.length) {
      const job = jobs[next++]!
      const errors = await runOne(page, apps, job)
      if (errors.length) {
        const list = failures.get(job.c.id) ?? []
        list.push(...errors.map(e => `${job.state}/${job.theme}: ${e}`))
        failures.set(job.c.id, list)
      }
    }
  }))
  await browser.close()

  for (const c of cases) {
    const errors = failures.get(c.id)
    if (!errors)
      continue
    console.log(`\n✗ ${c.id}`)
    for (const e of errors.slice(0, 40))
      console.log(`  ${e}`)
    if (errors.length > 40)
      console.log(`  … ${errors.length - 40} more`)
  }
  console.log(`\n${cases.length - failures.size}/${cases.length} cases passed`)
  process.exit(failures.size ? 1 : 0)
}

main()
