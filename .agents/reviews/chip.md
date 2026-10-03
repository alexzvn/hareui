# Chip — docs fidelity review

## Status

**~99.9% after fixes.** The 5 docs demos and the ported `release-vibrant-palette` demo are pixel-identical to heroui.com in light and dark mode. The variants demo still shows a 0.065% diff, which is heroui.com's sticky page header overlapping the tall capture, not the chips. HeroUI's API is fully covered: `color` (5 values), `variant` (primary / secondary / tertiary / soft), `size` (sm / md / lg), all 9 compound variants, and `Chip.Label` (as the `label` prop, default slot and `ui.label`). Plain-text auto-wrapping is the same. The component is unchanged.

Comparisons used a fresh profile with the vibrant palette off and fixed elements hidden (`/tmp/herouse-review/v-shots.ts`, port 5185).

| demo | before (light / dark) | after |
|---|---|---|
| basic | 0 / 0 px | 0 / 0 px |
| variants | 4441 / 6010 px (0.67% / 0.91%) | 432 / 428 px, heroui.com sticky header only |
| statuses | 0 / 0 px | 0 / 0 px |
| with-icon | 0 / 0 px | 0 / 0 px |
| custom-styles | 0 / 0 px | 0 / 0 px |
| release-vibrant-palette (new) | missing | 0 / 0 px, compared against `release-chip-vibrant-palette` on heroui.com/en/docs/react/releases/v3-1-0 |

## Fixed

- **`docs/demos/chip/variants.vue`**: the `circle-dashed` icons rendered at 1em (12px or 14px). `@gravity-ui/icons` defaults to 16×16, so I set `width="16" height="16"`. That fixes every chip's width and the misaligned rows.
- **`docs/demos/chip/release-vibrant-palette.vue`** (new): ports `release-vibrant-palette.tsx`. It renders the default and vibrant matrices, with `data-vibrant-palette="true"` on the second wrapper and `:ui="{ label: 'capitalize' }"` in place of `<Chip.Label className="capitalize">`. Our `variables.css` already supports the attribute. Use it with `<ComponentPreview name="chip/release-vibrant-palette" />`; the theming / release page belongs to another peer and is not wired by me.
- **`docs/docs/components/chip.md`**:
  - Customization intros now say which `ui` key does what.
  - The global override example mirrors HeroUI's Global CSS example (`rounded-full text-xs`, label `font-medium`, an accent `compoundVariants` entry). I checked it with bun: the merged classes come out as intended.
  - The Styling Reference now covers HeroUI's colour / variant / size modifier lists and both compound-variant groups (primary and soft).
- No component or theme change, so no parity rerun was needed.

## Remaining gaps → decisions needed

### 1. missing-component: `Separator`
- **HeroUI:** `variants.tsx:47` and `release-vibrant-palette.tsx:44` use `<Separator />` (separator.css: `h-px w-full shrink-0 rounded-sm bg-separator`). The Avatar variants demo uses it too.
- **We:** use `<hr class="border-separator">`, which is pixel-identical here (1px, same token). The `secondary` / `tertiary` colours and the vertical orientation have no equivalent.
- **Options:**
  - (a) Add `Separator.vue` on Reka's `Separator` primitive, with `orientation` and `variant` props. Small effort.
  - (b) Keep `<hr>` in demos. Free, but no vertical or colour variants.
- **Recommend (a).**

No API-design or Reka gaps.

## Screenshots

`/tmp/herouse-review/chip/{basic,variants,statuses,with-icon,custom-styles,release-vibrant-palette}-{heroui,ours}-{light,dark}.png`. The diff is in `variants-diff-{light,dark}.png`.
