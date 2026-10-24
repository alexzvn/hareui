import { fromTheme, validators } from 'tailwind-merge'
import { createTV } from 'tailwind-variants'

export type { ClassValue } from 'tailwind-variants'

/**
 * tailwind-merge configuration matching HeroUI's Tailwind theme:
 * - `text-*` must not evict an earlier `leading-*` (in Tailwind v4 the font size only sets the
 *   line-height fallback `var(--tw-leading, …)`; HeroUI relies on this, e.g. Chip sizes).
 * - HeroUI's custom theme keys (`shadow-surface`, `rounded-field`, `animate-spin-fast`, …) and HareUI's own
 *   (`shadow-sidebar-edge`) must conflict with the built-in ones of the same group (e.g. `shadow-none` overrides `shadow-surface`).
 * - An arbitrary length size (`text-[10px]`) must not evict a named size (`text-xs`) set earlier.
 *   Tailwind emits no line-height for arbitrary sizes, so HeroUI's BEM base (`.description { @apply text-xs }`
 *   in a lower layer) keeps text-xs's line-height under a `text-[10px]` override. Keeping both classes
 *   reproduces that: Tailwind sorts `text-[10px]` after `text-xs`, so its font-size wins and the
 *   line-height comes from `text-xs`. A later named size still evicts both.
 *   tailwind-merge tries arbitrary-value validators in class-group order, and `text-color` accepts any
 *   arbitrary value, so `text-color` is re-registered after `font-size-arbitrary` (an override keeps a
 *   group's position; extend appends).
 * - A user `transition-*` must evict a theme's arbitrary `[transition:…]` shorthand. In HeroUI the
 *   component's `transition` declaration sits in `@layer components`, so any utility wins; here both are
 *   plain utilities and Tailwind sorts the arbitrary property last.
 */
export const tv = /* @__PURE__ */ createTV({
  twMergeConfig: {
    override: {
      classGroups: {
        'font-size': [{ text: ['base', fromTheme('text'), validators.isArbitraryVariableLength] }],
        'text-color': [],
      },
      conflictingClassGroups: { 'font-size': ['font-size-arbitrary'] },
    },
    extend: {
      theme: {
        shadow: ['surface', 'overlay', 'field', 'sidebar-edge'],
        radius: ['field'],
        animate: ['spin-fast', 'skeleton', 'caret-blink'],
        ease: [
          'smooth',
          'linear',
          'out-fluid',
          'in-quad',
          'in-cubic',
          'in-quart',
          'in-quint',
          'in-expo',
          'in-circ',
          'out-quad',
          'out-cubic',
          'out-quart',
          'out-quint',
          'out-expo',
          'out-circ',
          'in-out-quad',
          'in-out-cubic',
          'in-out-quart',
          'in-out-quint',
          'in-out-expo',
          'in-out-circ',
        ],
      },
      classGroups: {
        'border-w': [{ border: ['field'] }],
        'font-size-arbitrary': [{ text: [validators.isArbitraryLength] }],
        'text-color-ordered': [
          {
            text: [fromTheme('color'), validators.isArbitraryVariable, validators.isArbitraryValue],
          },
        ],
      },
      conflictingClassGroups: { transition: ['arbitrary..transition'] },
    },
  },
})
