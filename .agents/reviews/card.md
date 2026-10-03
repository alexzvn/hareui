# Card — docs fidelity review

## Status

**~99.9% after fixes.** All 7 demos are pixel-identical to heroui.com at 1440×900 in light and dark mode, except with-images. Its remaining diff (0.054% light, 0.101% dark) is heroui.com's sticky "Releases / Migration" header and a floating button overlapping the capture, not the card. Every HeroUI API value is covered: `variant` with `transparent | default | secondary | tertiary`, all 5 parts, and `className` (as `class` plus `ui`). Section order matches the mdx. The one remaining gap is structural: a title or description inside a custom wrapper has to be written as plain markup (see below).

Screenshots were taken with `/tmp/herouse-review/v-shots.ts` (port 5185). It uses a fresh profile with the vibrant palette off, hides `position:fixed` elements such as the chat widget, and runs pixelmatch at threshold 0.1.

| demo | before (peer -8sP15N, chat widget included) | after (light / dark) |
|---|---|---|
| default | 2.245% (wrong icon/link, wrong order) | 0 / 0 px |
| variants | 0.4–0.7% | 0 / 0 px |
| horizontal | 9.130% (stacked vertically) | 0 / 0 px |
| with-avatar | 0.882% / 1.140% | 0 / 0 px |
| with-images | size mismatch 1031×1177 vs 1031×1031; NEO header text hidden | 458 / 852 px, heroui.com page chrome only |
| with-form | 0.8–1.1% | 0 / 0 px |
| custom-styles | size mismatch 351 vs 350 | 0 / 0 px |

## Fixed

- **`packages/herouse/src/components/Card.vue`: new `#leading` slot** (option-A extension; nothing renamed or removed). It renders its children directly inside the root, before the header, with no wrapper. This is the Vue equivalent of the plain children HeroUI places before `Card.Header`: the icon in default, the image in with-avatar, the full-bleed background `<img>` in with-images, and the decorative blobs in custom-styles. Because the DOM order now matches HeroUI's, the NEO cards' `z-10` header and footer stack above the background image. (They are flex items, so `z-index` applies even when `position` is static. That is why heroui.com shows the text; the previous `isolate` workaround was unnecessary.)
  - Test: `test/card.spec.ts` gained "#leading renders unwrapped root children before the header" (5/5 pass).
  - Parity: new cases `card-leading` (icon before header) and `card-horizontal` (`#leading` + `ui.content: 'gap-3'` on a `flex-row` card, against React `Card.Content className="gap-3"`). Result: `bun parity/compare.ts --component card --concurrency 2` → **7/7 cases passed**.
- **`docs/demos/card/default.vue`**: icon in `#leading` (no colour: HeroUI's `text-primary` is an undefined utility, so the icon inherits the foreground colour), `title`/`description` props, and a footer link that reproduces HeroUI's `Link` + `Link.Icon` markup. That markup uses link.css classes, the real `ExternalLinkIcon` SVG, and the hover/active underline with the icon going to `opacity-100` on hover.
- **`docs/demos/card/horizontal.vue`**: the image goes in `#leading` and the right column goes in the default slot with `:ui="{ content: 'gap-3' }"`. The content wrapper takes the place of HeroUI's `flex flex-1 flex-col gap-3` div, so `md:flex-row` gets two children. I removed a stray `relative` that the earlier port had put on the header wrapper; it anchored the CloseButton to the column instead of the card.
- **`docs/demos/card/with-avatar.vue`**: the image goes in `#leading`, title and description become props, and the footer uses `:ui="{ footer: 'flex gap-2' }"` with the avatar and text as direct children. The extra wrapper div used to drop the footer's `items-center`. The fallback gets `text-xs` via `ui`, as in HeroUI.
- **`docs/demos/card/with-images.vue`**:
  - Row 1 now follows the horizontal pattern.
  - PAYMENT card: the CloseButton goes in `#leading` and the header uses `gap-3`.
  - Indie/AI cards: `ui.content: 'mt-1'`, and `ui.footer` replaces the wrapper div.
  - NEO cards: background image in `#leading`, with `ui.header`, `ui.title`, `ui.description` and `ui.footer` set to HeroUI's className strings.
  - The 3 event cards: image in `#leading`, title and description as props, `ui.header: 'flex-1 justify-center gap-1'` (header stands in for the wrapper div), and `ui.title: 'text-sm'`. This also fixes the missing `leading-6` on the titles.
- **`docs/demos/card/with-form.vue`**: footer gets `items-center`. The "Forgot password?" link uses HeroUI's Link styling (`text-link font-medium …`); it used to be `text-accent`. Header comes from props.
- **`docs/demos/card/custom-styles.vue`**:
  - Blobs moved to `#leading`; in the default slot they had been positioned relative to the content wrapper.
  - Added `ui.header: 'relative gap-3'`; the missing `gap-3` caused the 1px height mismatch.
  - Added `ui.content: 'relative'`.
  - `ui.footer: 'relative flex-col gap-2 sm:flex-row'` replaces the wrapper div.
- **`docs/demos/card/variants.vue`**: uses the `title`/`description` props instead of hand-written `h3`/`p`. Pixels are unchanged; this is now the idiomatic form.
- **`docs/docs/components/card.md`**:
  - Anatomy documents every slot, including `#leading`.
  - Restored HeroUI's sentence "This allows themes to interpret them differently".
  - Horizontal Layout now explains the pattern.
  - Added the missing **API Reference** section (`ApiTable` props + slots).
  - The Styling Reference uses HeroUI's per-slot descriptions and maps variants to modifier classes.
  - The global override example mirrors HeroUI's Global CSS example.
  - Accessibility now has the "interactive card" example using `tv(themes.card)().base()`, the herouse equivalent of `cardVariants().base()`. I ran `tv(themes.card)().title()` in bun and it returns the theme string.
- Docs API JSON regenerated (`bun run --cwd docs api` → Card: 5 props, 6 slots).

## Remaining gaps → decisions needed

### 1. missing-component: `Link` (+ `Link.Icon`)
- **HeroUI:** `default.tsx:21-29`, `with-images.tsx:66-69` and `with-form.tsx:52-54` use `<Link>` (react-aria `Link`) and `<Link.Icon>`. Sources: `packages/react/src/components/link/link.tsx`, `packages/styles/components/link.css`.
- **We:** ship a hand-ported `<a>` with link.css translated to utilities and an inline `ExternalLinkIcon`, in 3 demos. It is visually identical, including hover, but users can't import it, and press/focus states are CSS-only (no `data-pressed` / `data-focus-visible`).
- **Options:**
  - (a) Add `Link.vue` (props `href`, `target`, `rel`, `disabled`, `as`; slot `#icon` defaulting to the ExternalLinkIcon; theme from link.css). Then replace the 3 demo snippets. Cost: one more component plus parity cases.
  - (b) Keep the markup in demos. Zero cost, but users copy ~400 characters of classes.
  - (c) Expose only a `themes.link` theme and not the component. Cheap, but inconsistent with every other component.
- **Recommend (a).**

### 2. API-design: a title or description inside a custom wrapper loses `data-slot` and theme coupling
- **HeroUI:**
  - `horizontal.tsx:15-23` and `with-images.tsx:18-26` put `Card.Header` inside a plain `<div className="flex flex-1 flex-col gap-3">` next to an image.
  - `with-images.tsx:51-58` and `custom-styles.tsx:31-36` put `Card.Title`/`Card.Description` inside nested divs within the header.
- **We:** the visual result is identical. The title and description there are plain `<h3 class="text-sm leading-6 font-medium text-foreground">` and `<p class="text-sm leading-5 text-muted">`. They carry no `data-slot="card-title"`, and a global theme override (`createHeroUse({ ui: { card: { slots: { title } } } })`) does not reach them.
- **Why:** option A has no free-standing title/description parts, and Vue can't nest named slots.
- **Options:**
  - (a) Status quo plus docs: recommend `const card = tv(themes.card)()` and `:class="card.title()"`. This is HeroUI's own `cardVariants` escape hatch, already documented in Accessibility. It still ignores app-level overrides, and `data-slot` is manual.
  - (b) Export a `useCardUI()` composable that returns the resolved slot class functions (`useComponentUI('card', …)`), so wrapped markup follows global overrides. Small, but a new public API.
  - (c) Allow free-standing `CardTitle`/`CardDescription`. Exact parity, but it contradicts the user's "no compound parts" decision.
- **Recommend (a) now, (b) if app-level theming of wrapped titles matters.**

### 3. other: HeroUI's Variants prose has wrong tokens
- **HeroUI** (`card.mdx:57-60`) says `default` is "(surface-secondary)" and `secondary` is "(surface-tertiary)". Its own card.css uses `bg-surface` / `bg-surface-secondary` / `bg-surface-tertiary`.
- **We:** copied the sentences and corrected the tokens. If byte-identical prose matters more than accuracy, revert the parentheticals.

### 4. other: render order is fixed (`#leading` → header → content → footer)
- **HeroUI** allows any order: content before the header, several headers, a footer in the middle. None of the 7 official demos needs anything that `#leading` + `ui` can't express, so this is only an API note.
- **If a future demo needs it:** add a `#trailing` slot (after the footer, unwrapped), the mirror of `#leading`. Nothing renamed.

## Screenshots

`/tmp/herouse-review/card/{default,variants,horizontal,with-avatar,with-images,with-form,custom-styles}-{heroui,ours}-{light,dark}.png`. Diffs are in `with-images-diff-{light,dark}.png`.
