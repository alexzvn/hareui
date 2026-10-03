# CloseButton — docs fidelity review

## Status

**Match: 100% of captured pixels (0 px diff on every demo, light and dark).** No gaps found. Content, demo list/order, and every variant/prop in
HeroUI's API Reference are already fully present. No fixes were needed.

## Fixed

None required.

- **Content diff**: `docs/docs/components/close-button.md` sections (Usage, Anatomy, Examples →
  Interactive/With Custom Icon, Customization → Tailwind CSS/Global theme override, Styling
  Reference, API Reference, Related Components) match HeroUI's `(buttons)/close-button.mdx`
  order 1:1 (same "no Anatomy section in HeroUI since no compound parts" note as Spinner — our
  one-liner "Anatomy" section is the Vue-equivalent addition the brief calls for).
- **Demo list**: HeroUI's `demos/en/close-button/index.ts` exports `Default, WithCustomIcon,
  Interactive, CustomStyles`. HeroUI's mdx renders them in the order Default → Interactive →
  With Custom Icon → (Customization) CustomStyles; ours matches that mdx order exactly:
  `docs/demos/close-button/{default,interactive,with-custom-icon,custom-styles}.vue`.
- **Variant/prop coverage**: HeroUI's `close-button.tsx`/`.styles.ts` only has `variant: 'default'`
  plus native Button-Aria props (`aria-label` defaulting to `"Close"`, `isDisabled`). herouse's
  `theme/closeButton.ts` has the matching single `variant: default`, and `CloseButton.vue` exposes
  `variant`, `disabled`, `ariaLabel` (default `'Close'`), `class`, `ui`, plus a default slot that
  replaces the icon (matching HeroUI's `children`/render-prop override). Nothing from the mdx API
  table is missing.
- **Visual diff** (capture tool re-run with heroui.com's fixed chat widget hidden and animations frozen): all 8 pairs (4 demos × light/dark) are **0 px diff (0.000%)**.

## Remaining gaps → decisions needed

None.

## Screenshots

`/tmp/herouse-review/close-button/`: `{default,interactive,with-custom-icon,custom-styles}-{heroui,ours}-{light,dark}.png`
No diff PNGs: every pair is 0 px.
