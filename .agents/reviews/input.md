# Input: docs fidelity review

**Status:** 100%. All 7 demos are 0 px light and dark, including the restored `on-surface`. Content is complete.

## Content diff
Section order and prose match the HeroUI mdx. The only differences are the project-wide Vue conventions used by every herouse page: an extra `## Anatomy` section, `### Global Configuration` instead of `### Global CSS`, `### Slots` / `### State Variants` instead of `### CSS Classes`, and API tables split into Props / Slots / Emits. Before this review the page was missing `### In Surface` and its demo; it's now in place after Variants, as in HeroUI. The Variants prose now matches HeroUI ("…suitable for use on surface backgrounds"). The State Variants list now matches HeroUI's states, including Read Only.

## Variant / config coverage
HeroUI API (input.mdx): `variant`, `fullWidth`, `isOnSurface` via variant, `value` / `defaultValue` / `onChange`, `isReadOnly` through RAC, `isInvalid`, `isDisabled`, `isRequired`, `type`, `placeholder`, `name`. Before this review `defaultValue` and `readonly` were missing. Both are now added.

## Fixed
- docs/demos/input/on-surface.vue (new): port of input/on-surface.tsx. It reproduces HeroUI's `Surface` classes inline because herouse has no Surface component. 0 px vs heroui.com (light and dark); it was previously dropped.
- docs/docs/components/input.md: added the "In Surface" section, the Variants prose, and the Focus Visible / Invalid / Disabled / Read Only states.
- packages/herouse/src/components/Input.vue: new `defaultValue` prop (seeds the value when uncontrolled) and `readonly` prop. `readonly` falls back to the surrounding TextField. TextField also forwards `aria-label` / `aria-labelledby` to the input; see text-field.md.
- Parity: added `input-readonly-default-value` (React `<Input readOnly defaultValue>`), which passes 1/1. Full run: `bun parity/compare.ts --component input --concurrency 1` → 8/8 cases passed.

## Remaining gaps → decisions needed
- **missing-component: Surface.** The demo inlines `bg-surface rounded-3xl …`. When Surface exists, swap the div for `<Surface>`.

## Screenshots
- /tmp/herouse-review/input/basic-{heroui,ours}-{light,dark}.png (+ `basic-diff-*.png`)
- /tmp/herouse-review/input/variants-{heroui,ours}-{light,dark}.png (+ `variants-diff-*.png`)
- /tmp/herouse-review/input/on-surface-{heroui,ours}-{light,dark}.png (+ `on-surface-diff-*.png`)
- /tmp/herouse-review/input/full-width-{heroui,ours}-{light,dark}.png (+ `full-width-diff-*.png`)
- /tmp/herouse-review/input/types-{heroui,ours}-{light,dark}.png (+ `types-diff-*.png`)
- /tmp/herouse-review/input/controlled-{heroui,ours}-{light,dark}.png (+ `controlled-diff-*.png`)
- /tmp/herouse-review/input/custom-styles-{heroui,ours}-{light,dark}.png (+ `custom-styles-diff-*.png`)
