/**
 * Visual parity check: herouse playground (:5173) vs @heroui/react reference (:5174).
 * Compares computed styles of every [data-slot] element and pixel screenshots.
 *
 * Cases: parity/cases/<component>.json + playground/src/parity/cases/<component>.ts + reference/src/cases/<component>.tsx
 * Usage: bun parity/compare.ts [--component <name>] [--case <id>] [--concurrency <n>]
 */
import type { Browser, ElementHandle, Page } from 'puppeteer'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import puppeteer from 'puppeteer'

interface Case {
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

interface SlotSnapshot { slot: string, tag: string, styles: Record<string, string> }

const VUE = 'http://localhost:5173'
const REACT = 'http://localhost:5174'
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

async function ensureServers() {
  for (const url of [VUE, REACT]) {
    try {
      await fetch(url)
    }
    catch {
      console.error('start playground (bun run dev) and reference (bun run reference) first')
      process.exit(1)
    }
  }
}

async function load(page: Page, base: string, c: Case, theme: Theme) {
  await page.goto(`${base}/parity/${encodeURIComponent(c.id)}${theme === 'dark' ? '?theme=dark' : ''}`, { waitUntil: 'load' })
  await page.waitForSelector('#case, #case-missing')
  if (await page.$('#case-missing'))
    throw new Error(`case missing in ${base === VUE ? 'vue' : 'react'} app`)
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
  const errors: string[] = []
  const rs = r.map(s => s.slot).join(',')
  const vs = vue.map(s => s.slot).join(',')
  if (rs !== vs) {
    errors.push(`slot sequence differs\n    react=[${rs}]\n    vue  =[${vs}]`)
    return errors
  }
  const seen: Record<string, number> = {}
  r.forEach((rEl, i) => {
    const vEl = vue[i]!
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

async function capture(page: Page, base: string, c: Case, state: State, theme: Theme) {
  debug(c.id, state, theme, base)
  await load(page, base, c, theme)
  await act(page, c, state)
  // Infinite animations (spinners) are pinned to t=0; finite ones (enter transitions) are finished.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
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

async function runOne(page: Page, c: Case, state: State, theme: Theme): Promise<string[]> {
  try {
    const r = await capture(page, REACT, c, state, theme)
    const v = await capture(page, VUE, c, state, theme)
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

const liveBrowsers = new Set<Browser>()

// Close every worker browser on Ctrl-C / kill so no orphaned Chrome processes are left behind.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    Promise.allSettled([...liveBrowsers].map(b => b.close())).finally(() => process.exit(130))
  })
}

async function newWorkerPage(): Promise<{ browser: Browser, page: Page }> {
  const browser = await puppeteer.launch({ headless: true })
  liveBrowsers.add(browser)
  const page = await browser.newPage()
  page.setDefaultTimeout(15000)
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  return { browser, page }
}

async function main() {
  await ensureServers()
  rmSync(OUT, { recursive: true, force: true })
  const component = flag('component')
  const only = flag('case')
  const concurrency = Number(flag('concurrency') ?? 4)
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

  const failures = new Map<string, string[]>()
  let next = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    const { browser, page } = await newWorkerPage()
    while (next < jobs.length) {
      const { c, state, theme } = jobs[next++]!
      const errors = await runOne(page, c, state, theme)
      if (errors.length) {
        const list = failures.get(c.id) ?? []
        list.push(...errors.map(e => `${state}/${theme}: ${e}`))
        failures.set(c.id, list)
      }
    }
    await browser.close()
    liveBrowsers.delete(browser)
  }))

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
