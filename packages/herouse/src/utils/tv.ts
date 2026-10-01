import { createTV } from 'tailwind-variants'

export type { ClassValue } from 'tailwind-variants'

/**
 * tailwind-merge configuration matching HeroUI's Tailwind theme:
 * - `text-*` must not evict an earlier `leading-*` (in Tailwind v4 the font size only sets the
 *   line-height fallback `var(--tw-leading, …)`; HeroUI relies on this, e.g. Chip sizes).
 * - HeroUI's custom theme keys (`shadow-surface`, `rounded-field`, `animate-spin-fast`, …) must
 *   conflict with the built-in ones of the same group (e.g. `shadow-none` overrides `shadow-surface`).
 */
export const tv = /* @__PURE__ */ createTV({
  twMergeConfig: {
    override: { conflictingClassGroups: { 'font-size': [] } },
    extend: {
      theme: {
        'shadow': ['surface', 'overlay', 'field'],
        'radius': ['field'],
        'animate': ['spin-fast', 'skeleton', 'caret-blink'],
        'ease': [
          'smooth',
          'linear',
          'out-fluid',
          'in-quad', 'in-cubic', 'in-quart', 'in-quint', 'in-expo', 'in-circ',
          'out-quad', 'out-cubic', 'out-quart', 'out-quint', 'out-expo', 'out-circ',
          'in-out-quad', 'in-out-cubic', 'in-out-quart', 'in-out-quint', 'in-out-expo', 'in-out-circ',
        ],
      },
      classGroups: {
        'border-w': [{ border: ['field'] }],
      },
    },
  },
})
