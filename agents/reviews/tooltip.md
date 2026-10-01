# Tooltip — docs fidelity review

## Status

**Match: ~99.7%** (estimate). Static preview cards (what heroui.com shows without interaction): all
5 ported demos **0 px** diff, light and dark. Hovered demos (tooltip open), **light**: all
triggers of all demos captured, 0.13–0.29 %. **Dark hover: UNVERIFIED (see Addendum)**. The light diffs come from
Reka rounding the floating position to whole pixels (≤ 0.42 px shift → anti-aliasing
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

## Addendum: hovering every trigger (correction)

The hover capture now hovers every trigger in each preview, one at a time with the mouse moved
away in between, re-queries handles per shot and reloads+retries on HMR detach. Shots are clipped
to the union of preview and tooltip, so `placement` checks all 4 sides and `with-arrow` checks
the `offset={12}` button. My first per-trigger run lost `custom-trigger` triggers 2 and 3 in light
mode to a detached-node error. They were captured on the rerun.

**Light, verified:** with-arrow 0.28 / 0.20 %, custom-trigger 0.23 / 0.13 / 0.20 %,
custom-styles 0.16 %. In the earlier full run, placement and basic were also ≤ 0.3 %, and the
bottom arrow was visually correct.

**Dark, UNVERIFIED:** custom-trigger 0.98–1.09 %, with-arrow 1.06–1.14 %, custom-styles 0.20 %.
The diff pixels are on the triggers and card edges; the tooltip bodies match. What I measured
(`.probe-hover-dark-tt.ts`, dark):
- Each trigger's position relative to the card is identical on both sites (e.g. Chip 372.92, 161.5).
- Tooltip position relative to its trigger for custom-trigger 0/1/2: ours −47.92/−63.13,
  −45.92/−35.13, −144.08/−95.13 vs HeroUI −47.5/−62.77, −45.92/−34.77, −144/−94.77, so ≤ 0.42 px.
- The card's own sub-pixel y differs: ours 274.63 vs HeroUI 275.27. That puts the whole card on
  a different raster phase, which fits a 1-row shift of the trigger edges.
Not proven: I couldn't rule out the peer edits made during the run (`theme/button.ts`
and `utils/tv.ts` restarts at 1:18–1:21). with-arrow, custom-styles and placement geometry on
our side is unmeasured, because the docs app went blank (ToastProvider.vue compile error from
a peer). HeroUI reference values (dark, tooltip rect relative to trigger) for when it's back:
with-arrow −31.5/−38.95 and −19.25/−43.95; custom-styles −17.6/−28.38; placement
−3.3/−38.14 (top), −107.34/2 (left), 100.3/2 (right), −12.8/42.86 (bottom).

Probe note: RAC tooltips only open on a synthetic hover after an earlier pointer move
(`mouse.move(0,0)` first). Without it heroui.com shows no tooltip, and that's why my first probe
returned `tip: null` there.
