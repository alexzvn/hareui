# Spinner — docs fidelity review

## Status

**Match: 100% of captured pixels (0 px diff on every demo, light and dark).** No gaps found. Content, demo list/order, and every variant/prop in
HeroUI's API Reference are already fully present. No fixes were needed.

## Fixed

None required.

- **Content diff**: `docs/docs/components/spinner.md` sections (Usage, Anatomy, Examples →
  Colors/Sizes/Speed, Customization → Tailwind CSS/Global theme override, Styling Reference,
  API Reference, Related Components) match HeroUI's
  `(feedback)/spinner.mdx` order 1:1 (HeroUI has no "Anatomy" section since Spinner has no
  compound parts in React either; our extra "Anatomy" one-liner is the Vue-equivalent note the
  brief calls for and doesn't displace any HeroUI content).
- **Demo list**: HeroUI's `demos/en/spinner/index.ts` exports `Basic, Colors, CustomStyles,
  Sizes, Speed` — all five exist as `docs/demos/spinner/{basic,colors,custom-styles,sizes,speed}.vue`
  in the same order in `spinner.md`.
- **Variant/prop coverage**: `theme/spinner.ts` has `size: sm|md|lg|xl` (default `md`) and
  `color: accent|current|danger|success|warning` (default `accent`) — exact match to the mdx API
  table. `Spinner.vue` exposes `size`, `color`, `class`, `ui` — no HeroUI prop
  (`size`, `color`, `className`→`class`) is missing.
- **Visual diff** (capture tool re-run with heroui.com's fixed chat widget hidden and `animation-name: none` on both sites, so both spinners show the same frame): all 10 pairs (5 demos × light/dark) are **0 px diff (0.000%)**. Earlier non-zero numbers came from the chat widget plus the two spinners being captured at different rotation points.

## Remaining gaps → decisions needed

None.

## Screenshots

`/tmp/herouse-review/spinner/`: `{basic,colors,sizes,speed,custom-styles}-{heroui,ours}-{light,dark}.png`
No diff PNGs: every pair is 0 px.
