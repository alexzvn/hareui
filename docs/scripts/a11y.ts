import type { Browser, Page } from 'puppeteer'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

interface AxeNode { html: string, target: string, reason?: string, data?: { fgColor?: string, bgColor?: string, contrastRatio?: number, expectedContrastRatio?: string } }
interface AxeViolation { id: string, impact: string | null, help: string, nodes: AxeNode[] }
type State = 'idle' | 'open'
interface Audit { violations: AxeViolation[], accepted: AxeViolation[] }
interface Result extends Audit { demo: string, component: string, state: State, trigger?: string, error?: string }
interface Accepted { rule: string, selector: string, demos?: string[], reason: string }

declare global {
  interface Window { axe: { run: (context: Document, options: object) => Promise<{ violations: Array<{ id: string, impact?: string | null, help: string, nodes: Array<{ html: string, target: unknown[], element: Element, any: Array<{ data?: unknown }> }> }> }> } }
}

const INTERNATIONAL_CALENDARS = ['calendar', 'date-picker', 'date-range-picker', 'range-calendar'].map(c => `${c}/international-calendar`)
const SCROLL_BODIES = ['modal-body', 'drawer-body', 'alert-dialog-body', 'scroll-shadow', 'rich-table'].map(s => `[data-slot="${s}"]`).join(', ')

const ACCEPTED: Accepted[] = [
  { rule: 'aria-allowed-attr', selector: '[data-slot="meter"][role="meter progressbar"]', reason: 'role="meter progressbar" fallback, matches HeroUI (React Aria useMeter)' },
  { rule: 'landmark-no-duplicate-banner', selector: '[data-slot="header"]', demos: ['header/title', 'header/to'], reason: 'demo shows two Headers side by side' },
  { rule: 'landmark-unique', selector: '[data-slot="header"]', demos: ['header/title', 'header/to'], reason: 'demo shows two Headers side by side' },
  { rule: 'label-content-name-mismatch', selector: '[data-slot="list-box-item"][role="option"][aria-labelledby][aria-describedby]', reason: 'option named by its label, description in aria-describedby, as React Aria useOption' },
  { rule: 'label-content-name-mismatch', selector: '[data-slot="menu-item"][role^="menuitem"][aria-labelledby][aria-describedby]', reason: 'menu item named by its label, description in aria-describedby, as React Aria useMenuItem' },
  { rule: 'label-content-name-mismatch', selector: '[data-slot="calendar-cell"], [data-slot="range-calendar-cell"]', demos: INTERNATIONAL_CALENDARS, reason: 'cell named with the full date, visible day uses the calendar\'s numbering, as React Aria useCalendarCell' },
  { rule: 'label-content-name-mismatch', selector: '[data-slot="cell-select"] [data-slot="select-trigger"]', reason: 'named by label + value ids like RAC Select; axe joins the adjacent label and value text without a space' },
  { rule: 'target-size', selector: '[data-slot="date-input-group-segment"][role="spinbutton"]', reason: 'DateField segment size is HeroUI\'s (pixel parity)' },
  { rule: 'scrollable-region-focusable', selector: SCROLL_BODIES, reason: 'scroll body stays out of the Tab order, as React Aria FocusScope; HeroUI ScrollShadow is a plain div' },
]

const DEMOS = fileURLToPath(new URL('../demos/', import.meta.url))
const AXE_SOURCE = readFileSync(join(dirname(createRequire(new URL('../../packages/vue/package.json', import.meta.url)).resolve('axe-core')), 'axe.min.js'), 'utf8')
const AXE_OPTIONS = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
  rules: { 'region': { enabled: false }, 'landmark-one-main': { enabled: false }, 'page-has-heading-one': { enabled: false } },
  resultTypes: ['violations'],
  elementRef: true,
}
const TRIGGER = '[aria-haspopup]:not([aria-expanded="true"]), [aria-expanded="false"]'

const args = process.argv.slice(2)
function flag(name: string): string | undefined {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}

const base = (flag('base') ?? 'http://localhost:5299').replace(/\/$/, '')
const concurrency = Math.min(3, Math.max(1, Number(flag('concurrency') ?? 2)))

const nextFrames = (page: Page) => page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))

async function audit(page: Page, demo: string): Promise<Audit> {
  const accepted = ACCEPTED.filter(a => !a.demos || a.demos.includes(demo))
  return page.evaluate(async (options, accepted) => {
    const { violations } = await window.axe.run(document, options)
    const out: Audit = { violations: [], accepted: [] }
    for (const v of violations) {
      const nodes = v.nodes.map(n => ({
        node: { html: n.html, target: n.target.map(String).join(' '), data: n.any.find(c => c.data)?.data as AxeNode['data'] },
        accepted: accepted.find(a => a.rule === v.id && n.element?.matches(a.selector))?.reason,
      }))
      for (const [list, keep] of [[out.violations, false], [out.accepted, true]] as const) {
        const kept = nodes.filter(n => !!n.accepted === keep).map(n => keep ? { ...n.node, reason: n.accepted } : n.node)
        if (kept.length)
          list.push({ id: v.id, impact: v.impact ?? null, help: v.help, nodes: kept })
      }
    }
    return out
  }, AXE_OPTIONS, accepted)
}

async function load(page: Page, demo: string) {
  await page.goto(`${base}/preview/${demo}`, { waitUntil: 'load', timeout: 60000 })
  await page.waitForFunction(() => {
    const app = document.querySelector('#app')
    const shown = app?.querySelector('.min-h-dvh')?.firstElementChild
    return !!app && '__vue_app__' in app && !!document.title && !!document.documentElement.lang
      && !!shown && (shown.childElementCount > 0 || shown.matches('.text-danger'))
  }, { timeout: 15000 })
  if (await page.$('#app .min-h-dvh > p.text-danger'))
    throw new Error('demo not found')
  await page.waitForNetworkIdle({ idleTime: 100, timeout: 5000 }).catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await nextFrames(page)
  if (!await page.evaluate(() => 'axe' in window))
    await page.evaluate(AXE_SOURCE)
}

async function open(page: Page): Promise<string | undefined> {
  const handle = await page.evaluateHandle((selector) => {
    return [...document.querySelectorAll<HTMLElement>(selector)].find((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
        && !el.matches(':disabled, [aria-disabled="true"], [data-disabled]')
    }) ?? null
  }, TRIGGER)
  const el = handle.asElement()
  if (!el)
    return undefined
  const label = await el.evaluate(e => `<${e.tagName.toLowerCase()}${e.getAttribute('data-slot') ? ` data-slot="${e.getAttribute('data-slot')}"` : ''} aria-haspopup="${e.getAttribute('aria-haspopup') ?? ''}"> ${(e.getAttribute('aria-label') ?? e.textContent ?? '').trim().slice(0, 40)}`)
  await el.click()
  await Bun.sleep(400)
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      if (a.effect?.getComputedTiming().iterations !== Infinity)
        a.finish()
    }
  })
  await nextFrames(page)
  return label
}

interface Tab { page: Page, loads: number }

let browser: Browser | undefined

async function newTab(): Promise<Tab> {
  const page = await browser!.newPage()
  page.setDefaultTimeout(30000)
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  const tab = { page, loads: 0 }
  page.on('domcontentloaded', () => tab.loads++)
  page.on('dialog', dialog => void dialog.dismiss().catch(() => {}))
  return tab
}

async function auditDemo(tab: Tab, demo: string): Promise<Result[] | undefined> {
  const component = demo.split('/')[0]!
  await load(tab.page, demo)
  const loaded = tab.loads
  const results: Result[] = [{ demo, component, state: 'idle', ...await audit(tab.page, demo) }]
  const trigger = await open(tab.page)
  if (trigger)
    results.push({ demo, component, state: 'open', trigger, ...await audit(tab.page, demo) })
  return tab.loads === loaded ? results : undefined
}

const DEMO_TIMEOUT = 120_000
const FAIL_FAST = 6

async function run(tab: Tab, demo: string): Promise<{ tab: Tab, results: Result[] }> {
  const failed = (error: string) => ({ tab, results: [{ demo, component: demo.split('/')[0]!, state: 'idle' as const, violations: [], accepted: [], error }] })
  for (let attempt = 1; attempt <= 3; attempt++) {
    let timer: Timer | undefined
    try {
      const results = await Promise.race([
        auditDemo(tab, demo),
        new Promise<never>((_, reject) => timer = setTimeout(() => reject(new Error(`timed out after ${DEMO_TIMEOUT / 1000}s`)), DEMO_TIMEOUT)),
      ])
      if (results)
        return { tab, results }
      if (attempt === 3)
        return failed('page kept reloading during the audit')
    }
    catch (e) {
      if (String(e).includes('timed out after')) {
        await tab.page.close().catch(() => {})
        tab = await newTab()
      }
      if (attempt === 3)
        return failed(String((e as Error).message ?? e))
    }
    finally {
      clearTimeout(timer)
    }
  }
  return failed('unreachable')
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    Promise.allSettled([browser?.close()]).finally(() => process.exit(130))
  })
}

const short = (html: string) => html.length > 160 ? `${html.slice(0, 157)}...` : html

function report(results: Result[]): number {
  const failing = (r: Result) => r.violations.filter(v => v.id !== 'color-contrast')
  console.log('\nPer demo:')
  for (const r of results) {
    const v = failing(r)
    if (r.error)
      console.log(`  ✗ ${r.demo} [${r.state}] error: ${r.error}`)
    if (!v.length)
      continue
    console.log(`  ✗ ${r.demo} [${r.state}]${r.trigger ? ` after ${r.trigger}` : ''}`)
    for (const x of v) {
      for (const n of x.nodes)
        console.log(`      ${x.id}: ${short(n.html)}`)
    }
  }

  const byRule = new Map<string, { nodes: number, components: Set<string>, help: string }>()
  for (const r of results) {
    for (const v of failing(r)) {
      const entry = byRule.get(v.id) ?? { nodes: 0, components: new Set(), help: v.help }
      entry.nodes += v.nodes.length
      entry.components.add(r.component)
      byRule.set(v.id, entry)
    }
  }
  if (byRule.size) {
    console.log('\nViolations by rule (rule → nodes → components):')
    for (const [id, e] of [...byRule].sort((a, b) => b[1].nodes - a[1].nodes))
      console.log(`  ${id} → ${e.nodes} → ${[...e.components].sort().join(', ')}\n    ${e.help}`)
  }

  const contrast = results.flatMap(r => r.violations.filter(v => v.id === 'color-contrast').flatMap(v => v.nodes.map(n => ({ r, n }))))
  if (contrast.length) {
    console.log(`\nColour contrast (report only, ${contrast.length} nodes):`)
    for (const { r, n } of contrast) {
      const d = n.data ?? {}
      console.log(`  ${r.demo} [${r.state}] fg ${d.fgColor} bg ${d.bgColor} ratio ${d.contrastRatio} (needs ${d.expectedContrastRatio})\n    ${short(n.html)}`)
    }
  }

  const accepted = results.flatMap(r => r.accepted.flatMap(v => v.nodes.map(n => ({ r, v, n }))))
  if (accepted.length) {
    console.log(`\nAccepted (not counted, ${accepted.length} nodes):`)
    for (const { r, v, n } of accepted)
      console.log(`  ${r.demo} [${r.state}] ${v.id}: ${n.reason}\n    ${short(n.html)}`)
  }

  const audited = results.filter(r => !r.error)
  const demos = new Set(results.map(r => r.demo)).size
  const errors = results.filter(r => r.error).length
  const failed = results.filter(r => failing(r).length).length
  console.log(`\n${demos} demos, ${audited.length} states audited, ${failed} states with violations, ${errors} errors, ${contrast.length} contrast nodes, ${accepted.length} accepted nodes`)
  return failed + errors
}

async function main() {
  try {
    await fetch(base)
  }
  catch {
    console.error(`no docs server at ${base}: build the docs (\`bun run docs:build\`) and serve them (\`bunx vitepress preview --port 5299 --strictPort\` in docs/), or run \`bun run docs:dev -- --port 5299 --strictPort\``)
    process.exit(1)
  }
  const only = flag('demo')
  const component = flag('component')
  const demos = readdirSync(DEMOS, { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.vue') && !file.startsWith('_shared'))
    .map(file => file.slice(0, -'.vue'.length).replaceAll('\\', '/'))
    .filter(name => (!only || name === only) && (!component || name.split('/')[0] === component))
    .sort()
  if (!demos.length) {
    console.error('no matching demos')
    process.exit(1)
  }

  const json = flag('json')
  const results: Result[] = []
  let failures = 0
  const started = performance.now()
  try {
    browser = await puppeteer.launch({ headless: true })
    let next = 0
    let done = 0
    await Promise.all(Array.from({ length: Math.min(concurrency, demos.length) }, async () => {
      let tab = await newTab()
      while (next < demos.length) {
        const demo = demos[next++]!
        const t = performance.now()
        const outcome = await run(tab, demo)
        tab = outcome.tab
        results.push(...outcome.results)
        const status = outcome.results.map(r => r.error ? `${r.state}: error ${r.error}` : `${r.state}: ${r.violations.filter(v => v.id !== 'color-contrast').map(v => v.id).join(', ') || 'ok'}`).join(' | ')
        console.log(`[${++done}/${demos.length}] ${demo} ${((performance.now() - t) / 1000).toFixed(1)}s ${status}`)
        if (done === FAIL_FAST && results.every(r => r.error))
          throw new Error(`the first ${FAIL_FAST} demos all failed (${results[0]!.error}): is ${base} serving the current docs build? Restart \`vitepress preview\` after every \`docs:build\`.`)
        if (json && done % 50 === 0)
          writeFileSync(json, JSON.stringify(results, null, 2))
      }
      await tab.page.close()
    }))
    results.sort((a, b) => a.demo.localeCompare(b.demo) || a.state.localeCompare(b.state))
    failures = report(results)
    console.log(`total ${((performance.now() - started) / 1000).toFixed(1)}s`)
    if (json)
      writeFileSync(json, JSON.stringify(results, null, 2))
  }
  catch (e) {
    console.error(String((e as Error).message ?? e))
    failures = 1
  }
  finally {
    await browser?.close()
  }
  process.exit(failures ? 1 : 0)
}

main()
