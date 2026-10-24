import type { VueWrapper } from '@vue/test-utils'
import axe from 'axe-core'
import { expect } from 'vitest'

// Rules that judge a whole page, not a component rendered on its own, plus `color-contrast`, which needs layout
// and rendered colours that happy-dom doesn't compute (the browser sweep `bun run a11y` covers contrast).
const OFF_RULES = [
  'color-contrast',
  'color-contrast-enhanced',
  'region',
  'landmark-one-main',
  'page-has-heading-one',
  'bypass',
  'document-title',
  'html-has-lang',
]

const options: axe.RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
  },
  rules: Object.fromEntries(OFF_RULES.map((id) => [id, { enabled: false }])),
  resultTypes: ['violations'],
}

/** axe violations under `target` (default `document.body`, which includes portalled overlays) as `rule: html` lines. */
export const axeViolations = async (target?: Element | VueWrapper): Promise<string[]> => {
  const context = !target
    ? document.body
    : 'element' in target
      ? (target.element as Element)
      : target
  const { violations } = await axe.run(context, options)
  return violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.html.slice(0, 160)}`))
}

/**
 * Fails with the violating rules and elements. Pass the mounted wrapper for inline content, or nothing to audit
 * `document.body` once an overlay is open (mount with `attachTo: document.body`).
 */
export const expectAccessible = async (target?: Element | VueWrapper) => {
  expect(await axeViolations(target)).toEqual([])
}
