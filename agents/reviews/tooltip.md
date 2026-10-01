# Tooltip — docs fidelity review

## Status

**Match: ~99.7%** (estimate). Static preview cards (what heroui.com shows without interaction): all
5 ported demos **0 px** diff, light and dark. Hovered demos (tooltip open): 0.06–0.33 %, all from
Reka rounding the floating position to whole pixels (≤ 0.31 px horizontal shift → anti-aliasing
on text/border). Remaining gaps are behavioural props HeroUI has and Reka can't express directly
(close delay, focus-only trigger, cross-tooltip warm-up) and are listed below.

## Fixed

1. **Arrow tooltips sat 12 px too far from the trigger** — `packages/herouse/src/components/Tooltip.vue`.
   Reka's `PopperContent` adds the measured arrow height to `sideOffset`
   (`/tmp/reka-ui/packages/core/src/Popper/PopperContent.vue:281`, `mainAxis: sideOffset + arrowHeight`);
   React Aria measures `offset` from trigger to tooltip body. The component now passes
   `sideOffset - 12` when `arrow` is on (12 = the arrow SVG's height).
   Evidence (parity page geometry, tooltip body y / x vs trigger at y=192):
   before `top` ours y=141 vs React y=153; after: top 153/153, right 194/194 (x 279/279),
   bottom 235/235, left x 88 (React 87.69). Docs `with-arrow` hover diff 1261 → 535 px (light),
   657 → 416 px (dark); `placement` hover 625 → 245 px.
   Parity: `bun parity/compare.ts --component tooltip --concurrency 2` → **6/6 cases passed**
   (before and after). ⚠ The harness passed *with* the 12 px offset error, so overlay position is
   not covered by parity — see "other" #6. No new parity case added because it couldn't catch it.
2. **Examples order** — `docs/docs/components/tooltip.md`: Placement before With Arrow (HeroUI order);
   "Global theme override" → "Global Configuration" porting HeroUI's Global CSS values
   (`rounded-xl shadow-lg`); added `### Emits` table; Related Components ordered Button, Popover
   (HeroUI's `components-registry.ts:804`).
3. **`custom-trigger` demo** — `docs/demos/tooltip/custom-trigger.vue`:
   - Avatar showed the `JD` fallback; now uses HeroUI's image `src`/`alt`.
   - Each trigger wrapped in an `inline-block` `role="button" tabindex="0"` div — the
     markup HeroUI's `Tooltip.Trigger` renders (`tooltip.tsx:197-204`, `tooltip.css .tooltip__trigger`).
     Without it the Chip sat 2 px lower (flex-centred instead of line-box-aligned).
   - The chip icon is `width="12" height="16"`, matching `@gravity-ui/icons` with only `width`.
   - The chip tooltip's `flex items-center gap-1.5` moved from an inner span to `class` on the
     content, as HeroUI's `Tooltip.Content className` does.
   - Prose updated to describe the wrapper.
   Evidence: static diff 151 px / 376 px → **0 / 0 px** (light/dark).

## Remaining gaps → decisions needed

1. **reka-limitation — `closeDelay` (HeroUI default 500 ms) is missing.** HeroUI: `tooltip.tsx:79-85`
   reads `--tooltip-close-delay` (500 ms, `styles/themes/default/variables.css:51`) and passes
   `closeDelay` to RAC, so a tooltip lingers 500 ms after the pointer leaves. Ours closes at once:
   Reka's `TooltipRoot`/`TooltipProvider` have no close delay. Options:
   (a) leave it and document it (zero risk; behaviour differs);
   (b) add `closeDelay` (default 500) to Tooltip.vue: drive `TooltipRoot` controlled, defer only
       pointer-leave closes with a timer, and close immediately on Escape, press or when another
       tooltip opens. This needs our own `pointerleave` tracking because `update:open` doesn't
       say why it closed. Medium complexity, easy to get subtly wrong;
   (c) upstream a `closeDelay` to Reka (cleanest; slow).
2. **reka-limitation — `trigger="focus"` is missing.** RAC `TooltipTrigger trigger="focus"` opens
   only on keyboard focus. Reka always opens on hover and focus (`ignoreNonKeyboardFocus` only
   filters pointer focus). Options: (a) document it as not supported; (b) add `trigger` with
   `'focus'` implemented as a controlled `open` driven by our own focus/blur listeners on the
   trigger (ignore Reka's hover opens); (c) upstream it.
3. **API-design — cross-tooltip warm-up and `shouldSkipAnimation`.** RAC shares one global warm-up:
   after one tooltip shows, moving to another shows it at once. HeroUI keeps the enter animation
   unless `shouldSkipAnimation` (`tooltip.tsx:41-54`). Each herouse Tooltip owns its own
   `TooltipProvider` (plan decision), so a second tooltip waits the full `delay` again, and
   `shouldSkipAnimation` has nothing to act on. Options: (a) a shared module-level
   `TooltipProvider` state (e.g. `provide` from `createHeroUse`, or an optional `<TooltipProvider>`
   re-export users can wrap the app with), then map `shouldSkipAnimation` to dropping the
   `data-[state=instant-open]` animate classes; (b) keep per-instance providers and document it.
4. **API-design — custom arrow content (`Tooltip.Arrow` children).** HeroUI clones a custom arrow
   child (`tooltip.tsx:149-160`). Ours always renders the built-in SVG; only its classes can be
   changed with `:ui.arrow`. Option: add an `#arrow` slot (additive) when a use-case appears; no
   HeroUI demo needs it.
5. **reka-limitation — sub-pixel floating position.** Reka's floating-ui `transform` rounds to device
   pixels (`translate(539px, 381px)`); RAC positions with fractional `left/top`
   (e.g. x 183.69 vs our 184). This causes the remaining 0.06–0.33 % hover diffs. Options: (a) accept;
   (b) fork `PopperContent` to use non-rounded `left/top` (not worth it).
6. **other — the parity harness doesn't check overlay geometry.** `tooltip-top/bottom` passed
   with the tooltip 12 px off. Suggest the integrator adds the `getBoundingClientRect` of each
   `[data-slot]` relative to the trigger (or a viewport screenshot) for `overlay: true` cases.
   This probably also hides offset bugs in Popover.
7. **other — `render-function` demo** is dropped by plan Step 9 (no `render` prop in herouse).
8. **other — no `test/tooltip.spec.ts`** exists in packages/herouse/test (the batch owner may want
   to add one).

## Screenshots

`/tmp/herouse-review/tooltip/`: `{basic,placement,with-arrow,custom-trigger,custom-styles}-{heroui,ours}-{light,dark}.png`
(static) and `*-hover-{heroui,ours}-{light,dark}.png` (first trigger hovered), with `*-diff-*.png`.
`render-function-*-heroui-*` exist only on heroui (dropped demo).
