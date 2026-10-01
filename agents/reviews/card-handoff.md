# Card review handoff

Stopped mid-task per Main's instruction (ownership moved to another peer). Chip and Avatar
were **not started** — no files touched for those two components yet.

## 1. Files modified (all under `docs/demos/card/`, docs-only, no component/theme/parity files touched)

- `docs/demos/card/default.vue` — **done, verified**.
- `docs/demos/card/with-avatar.vue` — **done, verified**.
- `docs/demos/card/horizontal.vue` — **done, verified**.
- `docs/demos/card/with-images.vue` — **in progress, last edit NOT yet re-verified with the capture tool** (see §3).

No edits were made to `packages/herouse/src/components/Card.vue`, `packages/herouse/src/theme/card.ts`,
any parity file, `docs/docs/components/card.md`, or any Chip/Avatar file.

## 2. Findings per demo

### Root cause common to several demos
`Card.vue` always renders in fixed DOM order **header → content (default slot) → footer**,
regardless of where the user places content in the template. HeroUI's React `Card` has no such
constraint: `Card.Header`/`Card.Content`/`Card.Footer`/arbitrary children render in whatever
order the author writes them, and plain children (icons, images) are rendered as direct flex
items of the root — never auto-wrapped. This caused two distinct visible bugs, both fixed **at
the demo-authoring level only** (no component/theme change needed):

1. **Ordering bug** (`default`, `with-avatar`, with-images' PAYMENT/avatar cards): when HeroUI
   puts a plain child (icon/avatar img) *before* `Card.Header`, our port can't reproduce that
   because `content` always renders after `header`. Fix: move the leading element **into the
   `#header` slot itself**, wrapped in an inner `flex flex-col gap-{N}` div that reproduces the
   same visual gap as the original top-level flex gap (e.g. default.vue: icon + title/desc both
   inside `#header`, wrapped `flex flex-col gap-3`). No Card.vue change; pure demo restructuring.
2. **Horizontal-layout bug** (already flagged in the brief, `horizontal.vue` + with-images row-1
   + the 3 small transparent "event" cards in with-images row-3): HeroUI lays two top-level
   children (image box + content box) out with `md:flex-row`/`flex-row` on the root. Our Card
   always wraps the default slot in a `card-content` div, so the base's `flex-row` only ever
   has ONE flex item (the content wrapper) and horizontal layout can't happen.
   **Fix found and verified, no public API change**: pass `:ui="{ content: 'contents' }"` on
   that Card instance. `display:contents` on `card-content` removes its own box so its children
   (image div + content div) become direct flex items of `base`, and `md:flex-row`/`flex-row`
   on `base` now applies correctly. This is a pure demo-level fix using the existing `:ui` prop
   — confirmed via screenshot: `horizontal` dropped from **9.13% → 0.79%** diff (the residual
   0.79% is heroui.com's own sidebar gradient decoration bleeding into the screenshot crop at
   the left edge, not a component difference — same noise appears in `default`/`with-avatar`
   diffs too, visible as a blue/purple blob strip at x≈0).
   This fix is reusable and should be documented as a Card customization pattern since the
   "Horizontal Layout" doc demo itself needed it.

### `default.vue` — fixed, verified
Two bugs, both demo-port mistakes:
- Icon/link ordering (see root cause #1 above). Fixed by moving icon into `#header`.
- Demo used `text-accent` (blue) for the icon and a manually-invented `chevron-down -rotate-90`
  "Link" affordance. HeroUI's actual demo source uses `CircleDollar className="text-primary …"`
  (dead/undefined utility class on heroui.com — there is no `--color-primary` token anywhere in
  `/tmp/heroui/packages/styles` or the docs app's `global.css`, so it resolves to inherited
  foreground/black — confirmed by screenshot, icon renders dark gray, not colored) and
  `<Link>…<Link.Icon/></Link>` which renders HeroUI's `ExternalLinkIcon` (7×7 viewBox diagonal
  arrow SVG from `/tmp/heroui/packages/react/src/components/icons.tsx:85`), not a chevron.
  **herouse has no `Link` component at all** (confirmed: no `packages/herouse/src/components/Link.vue`,
  not in the plan's Step 5 component list, explicitly named in the review brief as an example of
  "missing component — report, don't fix"). Since the demo only needs to *look* right (no
  reusable export needed), I ported the Link's CSS by hand onto a plain `<a>` (translated from
  `/tmp/heroui/packages/styles/components/link.css` per the Step 4 rules: base classes, `text-link`
  color token — already present in our `theme.css`/`variables.css`, no new token needed — hover/
  active/focus states, and the `link__icon` wrapper with the real `ExternalLinkIcon` SVG inlined).
  Result: **2.245% → 0.775%** diff (light), residual is the same heroui.com sidebar-gradient noise.
- **Decision needed for the report**: herouse has no `Link` component (React `Link`/`Link.Icon`).
  Recommend reporting as missing-component per the brief's own example list.

### `with-avatar.vue` — fixed, verified
Same ordering bug as default.vue: HeroUI's `<img>` (community avatar) is a plain child *before*
`Card.Header`. Fixed by nesting `img` + a `flex flex-col` title/desc block together inside
`#header`, wrapped in `flex flex-col gap-2` (matches the original top-level `gap-2` on Card).
Result: **0.882% light / 1.140% dark** diff — remaining diff is the sidebar-gradient-blob noise
plus minor text antialiasing on "By Martha"/"By John" (sub-pixel, not a real mismatch — both
screenshots show the same black text at the same position when viewed directly).

### `horizontal.vue` — fixed, verified
Pure `:ui="{ content: 'contents' }"` fix (root cause #2). **9.130% → 0.786%** diff (light),
**9.269% → 1.045%** (dark). Residual is sidebar-gradient noise + what looks like a cursor/hover
decoration artifact near "Apply Now" on heroui.com's own screenshot (unrelated to our component).

### `with-images.vue` — IN PROGRESS, not re-verified after last edit
This is the most complex demo (9 nested Cards). Structural rewrite applied, mapping each
HeroUI sub-card to the correct herouse slot usage:
- **Row 1** (large banner card, img + content side-by-side): `:ui="{ content: 'contents' }"`
  (root cause #2). This single fix also resolved the previously-reported
  **SIZE mismatch 1031×1177 → now 1031×1039** (the extra ~146px was the banner card
  incorrectly stacking vertically instead of going side-by-side at the `sm:` breakpoint,
  exactly the horizontal-layout bug compounding over the whole page height).
- **Row 2 left-top "PAYMENT" card**: HeroUI's `Card.Header className="gap-3"` contains the
  dollar icon **directly above** (not beside!) the text block — I initially mis-read the
  screenshot as a row layout; confirmed via computed-style inspection on the live site
  (`flexDirection: column`) that it's actually a **vertical** stack, icon on top. Our previous
  port had wrongly used `flex` (row) for this pairing — fixed to pass icon+text divs as direct
  children of `#header` with `:ui="{ header: 'gap-3' }"` (header is flex-col by default in our
  theme already, matching HeroUI's default `.card__header{flex flex-col}`).
- **Row 2 left-bottom "Indie Hackers"/"AI Builders" cards**: HeroUI's structure maps 1:1 onto
  our fixed header→content→footer order already (`Card.Header` = big avatar only,
  `Card.Content` = the two `<p>` lines, `Card.Footer` = small avatar + name) — **no ordering
  trick needed**, just had to move the big avatar out of the default slot into `#header` (was
  previously incorrectly lumped into the default/content slot together with the text).
- **Row 2 right "NEO Home Robot" card** (background image + overlaid header/footer text):
  this is where I got stuck. See §3 below — **this is the half-done part**.
- **Row 3 left big NEO image card** (background image + overlaid footer text): same
  background-image-stacking issue as above, same unverified fix applied.
- **Row 3 right 3 small "transparent" event cards** (img + title/desc side-by-side,
  `flex-row` always-on, not just at a breakpoint): `:ui="{ content: 'contents' }"` applied
  (root cause #2 pattern), not yet re-verified in the latest capture (was fine in the capture
  run before the last header/footer z-index edit, since that edit didn't touch these cards).

## 3. Half-done / inconsistent state — what's unverified

**Background-image text-stacking problem** (Row 2 right "NEO" card + Row 3 left big NEO card):
HeroUI puts a plain `<img className="absolute inset-0 h-full w-full object-cover">` as the
**first** child of Card, before `Card.Header`/`Card.Footer`. Both img and header/footer are
siblings of `Card`'s root (`position:relative`). Despite the header/footer being `position:static`
with an **ineffective** `z-10` class (verified via computed-style inspection on the live site:
`position: static`, so `z-index` has no effect per spec), HeroUI's live screenshot clearly shows
the header/footer text rendered **above** the full-bleed image. I could not fully explain why from
first principles (isolated CSS-spec reproductions of plain `position:static` text over a
`position:absolute` opaque sibling consistently showed the text **hidden**, matching spec — this
contradicts the live heroui.com render, root cause not fully identified, possibly a
browser-specific quirk or something in the production bundle not reflected in the `/tmp/heroui`
source I inspected).

In herouse, because the `<img>` has no named slot, it falls into the **default/content slot**,
which our Card renders **between** header and footer (not before header like HeroUI) — this
flips the DOM order and, combined with the img being `position:absolute`/header being
`position:static` with inert `z-10`, caused the header text to render **invisible** (hidden
behind the opaque image) while the footer text (which comes after the image in DOM either way)
stayed visible. Confirmed by cropping the rendered screenshot — no trace of "NEO"/"Home Robot"
text at all, not just faint.

Attempted fixes, in order:
1. `:ui="{ header: 'isolate', footer: 'isolate' }"` (CSS `isolation: isolate`, which creates a
   stacking context treated at z-index:0 parity with the absolute img, with ties broken by DOM
   order). This worked in an **isolated** repro (text directly after the image div in DOM), but
   **failed** in the real demo for the header specifically — captured screenshot confirmed
   footer text visible, header text still invisible. Root cause: because the img lands in the
   **content** slot (between header and footer) rather than before header, `isolate`'s DOM-order
   tiebreak still puts the img **after** header (header < content > img < footer in tree
   order), so header loses to the img while footer (after the img) wins. This was diagnosed via
   a `page.evaluate` DOM inspection showing `cardChildren: ["card-header", "card-content",
   "card-footer"]`.
2. **Last edit applied, NOT YET VERIFIED**: switched from `isolate` to `:ui="{ header: 'relative
   z-10', footer: 'relative z-10' }"` on both affected cards (Row 2 right NEO card, Row 3 left
   big NEO card). `position: relative` + explicit `z-index: 10` should unambiguously win against
   the image's `position: absolute` + `z-index: auto` (≈0) **regardless of DOM order**, since
   that's an explicit z-index comparison, not a same-level DOM-order tiebreak. Verified this
   approach in an isolated repro (`/tmp/stacktest5.html` — text before AND after the image div in
   DOM both render on top when given `relative z-10`) — **but the actual `with-images.vue` demo
   file was never re-captured with the capture tool after this edit** (stopped per Main's
   instruction before running `bun .review-shot.ts card with-images` again).

**Next step for whoever picks this up**: re-run
`cd /Volumes/Workspaces/opensource/herouse && bun .review-shot.ts card with-images` and inspect
`/tmp/herouse-review/card/with-images-{heroui,ours}-{light,dark}.png` — expect the NEO/Home
Robot header text to now be visible and the SIZE line to read `816x1031` on both sides (last
run before this fix read `816x1039` ours vs `816x1031` heroui, 8px taller, likely just the
missing header line's layout still reserving its flex-col gap / or truly resolved once the
header is visible — re-measure, don't assume). If `relative z-10` still doesn't fully fix it,
the next thing to try is moving the img into the `#header` slot itself (as the first child,
before the text) instead of leaving it in the unnamed default slot — that matches HeroUI's DOM
order exactly and would make the whole isolate/z-index workaround unnecessary, at the cost of a
single extra non-semantic wrapper (header div already renders as `flex flex-col`, img inside it
with its own `absolute inset-0` would still escape up to the `.card` `position:relative`
ancestor for geometry, same as today).

## Remaining card demos not yet looked at
- `variants.vue` — not re-verified this session (no known issue flagged in the brief; original
  baseline capture showed 0.4–0.7% diff, likely fine as-is, simple case).
- `with-form.vue` — not re-verified this session (baseline 0.8–1.1%, likely fine as-is — the
  `<form>` wraps content+footer the same way HeroUI does, should already render correctly, just
  needs a confirmation screenshot).
- `custom-styles.vue` — not re-verified this session beyond the baseline SIZE mismatch (351 vs
  350, 1px). All of Card's top-level children in this demo map 1:1 onto header→content→footer
  already (the two decorative `aria-hidden` blobs are `position:absolute`, so their position in
  the default slot vs elsewhere doesn't matter visually) — the 1px delta is unexplained, likely
  rounding in a shadow/border calc; not investigated further.
- `docs/docs/components/card.md` content diff against the mdx — not done this session (only
  demos were touched).

## Chip and Avatar
Not started. No files read or modified for either component.
