# Tabs — docs fidelity review

## Status

**Match: 100 % of ported demos at 0 px** (light) vs heroui.com, vibrant palette off. Dark: 0 px except
8 px on the preview card's rounded corners in the vertical demos. Parity: **11/11 at the default
0.001**, no ignore entries (`bun parity/compare.ts --component tabs --concurrency 2`). Spec:
`test/tabs.spec.ts` 3/3. The only Typecheck errors are in a peer's `test/toast.spec.ts`; Tabs is clean.

| Demo | light | dark |
|---|---|---|
| basic, disabled, with-separator, secondary, custom-styles | 0 px | 0 px (custom-styles 48 px, 0.017 %) |
| vertical, secondary-vertical, vertical-alignment, overflow | 0 px* | 8 px* (card corners) |
| render-function | dropped (plan Step 9: no `render` prop) | |

\* The raw diff is 0.34–0.62 %. With our shot offset by exactly 1 px vertically it's 0 px: my
whole-pixel card snap rounds the two pages 1 px apart. Element geometry relative to the card is
identical to 3 decimals (e.g. tab 156.000/105.500, 117.094×32).

## User's complaints → resolution

1. **Separators** (heroui.com shows none): `separator` prop, default `false` (DTT1wRo). It renders
   in every tab when `true`, hidden on the selected tab and the one after it (HeroUI's CSS
   rule). The new `with-separator` demo uses it. Parity: the 8 old cases have `separator: true`,
   plus `tabs-no-separator`.
2. **Vertical**: fully supported and demoed. `vertical` (primary, as HeroUI's demo),
   `secondary-vertical` (new), `vertical-alignment`, plus parity `tabs-vertical`,
   `tabs-vertical-secondary` and `tabs-overflow-vertical` (new).
3. **Custom-styles looked off**: 0 px now. Fixes: RAC's `data-[hovered]`/`data-[pressed]` were
   mapped to `hover:`/`active:`, and `opacity-100!` beats the theme's hover dimming. The
   remaining "off" look was the invisible indicator: it sat behind the list container (no
   stacking context). DTT1wRo fixed that with its own `getBoundingClientRect` indicator and
   `isolate`.

## Changes (this review, after DTT1wRo's handoff)

- **Overflow (new HeroUI demo)**: ported `Tabs.ListContainer`'s ScrollShadow fade and its
  scroll chevrons.
  - `packages/herouse/src/styles/scroll-shadow.css` (new, imported from `styles/index.css`) is a
    translation of `@heroui/styles` `scroll-shadow.css` (fade variant). It's keyed on
    `[data-slot=scroll-shadow][data-orientation][data-scroll-shadow-mode=auto]`, so a later
    ScrollShadow component can reuse it: a scroll-driven `mask-image` (`@property` +
    `animation-timeline: scroll(self)`), with the `data-*-scroll` gradients as fallback.
  - `Tabs.vue`: the scroller gets HeroUI's attributes (`data-orientation`, `data-scroll-shadow-mode`,
    `data-scroll-shadow-size=64`, size and offset vars, `data-left/right/left-right-scroll`, or
    top/bottom when vertical), measured on scroll and on resize. It also gets prev/next chevron
    `<button tabindex=-1>`s with HeroUI's icons and aria-labels, scrolling 80 % of the viewport
    with clamping (RTL-aware).
  - `theme/tabs.ts`: `scrollPrev`/`scrollNext` slots, from `tabs.css`.
  - Smoke test: scrollLeft 0 → 320 → 501 (the end, clamped) → 181. Flags go right → left-right →
    left → left-right, and the chevron `display` follows (none/flex). No DOM nodes are re-created.
  - Parity: `tabs-overflow` (w-[400px]) and `tabs-overflow-vertical` (h-[160px]) on both sides pass.
- Docs `tabs.md`: Overflow section (HeroUI order), anatomy table and Styling Reference updated for
  `scroller`, `scrollPrev`, `scrollNext`, the scroll data attributes, the separator behaviour and
  the indicator's CSS vars.
- `docs/demos/tabs/overflow.vue` (new).

## Capture note (for other reviewers)

My first diffs showed a fake left-edge fade in HeroUI's shots. The capture's "finish all
animations" step also finished **scroll-driven** animations (the ScrollShadow fade), which jumps
them to their end state. Skip animations whose `timeline` isn't a `DocumentTimeline`.

## Remaining gaps → decisions

1. **other: `render-function` demo** is dropped (plan Step 9). No action.
2. **reka-limitation: none left visible.** DTT1wRo's own indicator replaced Reka's
   `TabsIndicator`, which measured with integer offsets.

## Screenshots

`/tmp/herouse-review/tabs/{demo}-{heroui,ours,diff}-{light,dark}.png`
