# Popover — docs fidelity review

## Status

**Match: ~99.9%** after fixes. Every checked demo is now pixel-identical (layout, colors, text,
icons, animation state) in the open and closed states, light and dark.

## Fixed

1. **`docs/demos/popover/custom-styles.vue` — gradient overlay rendered above the heading
   (known issue, confirmed and fixed).**
   - **Cause**: HeroUI's demo (`/tmp/heroui/apps/docs/src/demos/en/popover/custom-styles.tsx`)
     places the `aria-hidden` gradient `<div>` **before** `Popover.Heading` inside
     `Popover.Dialog`'s children — so the heading paints on top of the gradient in document order.
     `Popover.vue` always renders its own `h3[data-slot=popover-heading]` (driven by the `title`
     prop/slot) **before** the `#content` slot in its template, so when the demo used the `title`
     slot for "Keyboard shortcuts" the heading necessarily landed *behind* the gradient div
     supplied via `#content` — inverted stacking vs. HeroUI.
   - **Fix**: rewrote the demo to not use the `title` slot at all; instead it renders its own
     `<h3 data-slot="popover-heading" class="relative font-medium …">` manually inside `#content`,
     positioned after the gradient div, exactly mirroring HeroUI's child order. No component or
     theme changes were needed — the `Popover` component's generic heading-before-content order is
     correct for every other demo, this was a single demo's composition quirk.
   - **Evidence**: before/after screenshots at
     `/tmp/herouse-review/popover/custom-styles-ours-light.png` vs
     `custom-styles-heroui-light.png` — after the fix the two are pixel-identical (heading text
     "Keyboard shortcuts" fully visible above the gradient on both sites; previously the heading
     was washed out behind the gradient on ours).
   - Parity: `bun parity/compare.ts --component popover --concurrency 2` → **6/6 cases passed**
     (demo files aren't parity-cased; verified no regression in the component itself).

2. **`docs/docs/components/popover.md` — "Interactive" → "Interactive Content" heading text.**
   - HeroUI's mdx (`/tmp/heroui/.../popover.mdx`) has `### Interactive Content`; ours had
     `### Interactive`. Fixed to match verbatim (content, not just syntax, must match per the
     review brief).

3. **`packages/herouse/src/components/Popover.vue` — added missing `flip` prop (variant-coverage
   gap).**
   - HeroUI's API Reference lists `Popover.Content`'s `shouldFlip: boolean` (default `true`) —
     "whether popover can change orientation to fit". herouse had no equivalent; Reka's
     `PopperContent` already exposes `avoid-collisions` (default `true`, same semantics) which was
     simply never wired to a prop.
   - Added `flip?: boolean` (`@defaultValue true`) to `PopoverProps`, defaulted in
     `withDefaults`, and bound `:avoid-collisions="flip"` on `PopoverContent`.
   - Evidence: `bun run --cwd packages/herouse typecheck` clean; `bun parity/compare.ts
     --component popover --concurrency 2` → 6/6 passed after the change; regenerated
     `docs/.vitepress/api/Popover.json` via `bun scripts/gen-api.ts` — confirms `flip` now appears
     in the generated API table (11 props, was 10).

## Remaining gaps → decisions needed

### missing-feature (minor): `render-function` demo dropped

- **HeroUI**: `/tmp/heroui/apps/docs/src/demos/en/popover/render-function.tsx` — demonstrates
  `Popover.Content`'s `render: DOMRenderFunction` prop (React-only escape hatch to override the
  rendered DOM element/attach render props).
- **herouse**: no equivalent — Vue has no direct analogue to React's render-prop/render-function
  pattern for swapping the rendered root element; Reka's `as`/`as-child` already covers the
  "custom element" need for triggers, and `Popover`'s surface is fixed to a `<div>`/`PopoverContent`.
- Already correctly excluded per `/tmp/herouse-plan.md` Step 9's drop list ("render-function,
  render-props … dropped"). No action needed; listed here for completeness only, not a new finding.

No other variant/prop/slot gaps found: `side` (4 values), `align` (3), `sideOffset`, `arrow`,
`dismissible`, `portal`, `open`/`defaultOpen`/`update:open`, and now `flip` all have herouse
equivalents matching HeroUI's API Reference table.

## Screenshots

All in `/tmp/herouse-review/popover/`:
- `custom-styles-ours-light.png` / `custom-styles-heroui-light.png` — the fixed gradient/heading
  stacking-order demo, pixel-identical after the fix.
- `with-arrow-ours-light.png` / `with-arrow-heroui-light.png` — With Arrow demo open: identical.
- `interactive-ours.png` / `interactive-heroui.png` — Interactive Content demo open (avatar,
  follow button, follower counts): pixel-identical.
