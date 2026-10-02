# Decisions (user-confirmed)

Newest first. These override `plan.md` where they conflict.
## 2026-10-02 (afternoon)

- **Landing showcase tab bar stays removed.** heroui.com's Dashboard/Mail/Chat/Finances/CRM tabs are iframes of HeroUI Pro (paid, closed source), and heroui.pro refuses framing outside heroui.com (`frame-ancestors 'self' https://heroui.com`, `X-Frame-Options: SAMEORIGIN`). Own templates, recreated Pro screens and a Components-only bar were offered; the user chose to leave it as is.
- **Theme builder** (inferred from a bare link the user sent; not explicitly confirmed): port heroui.com/en/themes to the docs at `/themes` (assigned to vTSDGtr); "Edit theme" will point there.
- **All Components page:** port https://heroui.com/en/docs/react/components (user request; assigned to abE2Br_), with self-generated thumbnails instead of HeroUI's CDN images.

## 2026-10-02 (before overnight run)

- **New components:** Skeleton, ProgressBar, NumberField, Alert, Disclosure, Toast, Typography. Link, Separator, TextArea, Surface, SwitchGroup and ButtonGroup were not chosen.
- **Responsive sizes via CSS variables**, so a plain user utility beats the theme at every breakpoint (HeroUI `@layer components` behaviour).
- **Approved:** the review API additions, forwarding TextField input attrs to `<input>`, documenting `tv(themes.card)`, a RAC-equivalent validation layer, and the Button ripple-effect demo.
- **Overnight autonomy is full:** build, verify, commit. New decisions get parked in `status.md`.


## Process

- **Atomic commits as we go.** One logical unit per commit (a component, a component's docs, a harness change), with conventional-commit messages.
- **Fidelity bar: ≥ 99.9 % visual identity with heroui.com, for components and docs.** Every official HeroUI variant and configuration must be supported and demoed on our docs page. Content must match heroui.com except where usage syntax differs (Vue vs React). Where that is impossible, write a report with options and the user decides; don't silently approximate.
- **Every component docs page gets a review** against heroui.com, split across peer agents (see `status.md`).

## API

- **Option A, kept: props + named slots (Nuxt UI style).** No compound parts (`Card.Header`, `CardHeader`, `Tabs.Tab`), and RadioGroup/Tabs keep their `items` arrays. Notes from the analysis:
  - Nested named slots (`<template #header><template #title>`) don't compile in Vue.
  - Dot-notation parts (`<Card.Header>`) would compile in `<script setup>`, but the user chose not to add them.
  - HeroUI demos that use free composition must still look identical. Match them with `class`, `:ui`, existing slots and surrounding markup.
  - A **new** slot or prop may be added when a demo needs it; renaming or removing an existing one is not allowed. Examples already added: Card `#leading`, Avatar `#image` and native img attrs, `readonly` on Checkbox/Switch/RadioGroup/TextField/Input, `defaultValue` on Input/TextField, `invalid` on Switch.
  - Any gap left after that is reported, not solved with parts.
- Prop naming is Vue style (`disabled`, `pending`, `invalid`, `required`, `iconOnly`, `fullWidth`, `v-model`, `v-model:open`, native `@click`). HeroUI variant names and values are verbatim.
- Exported names are unprefixed (`Button`, `Card`, ...). `tv` and `themes` are exported too.

## Styling

- **Hand-translate HeroUI CSS into tailwind-variants themes** (Nuxt UI style). The user explicitly rejected depending on `@heroui/styles` BEM CSS. Identity is proven by `parity/compare.ts` against the React reference, not by construction.
- Precedence: theme < `createHeroUse({ ui })` < variant props < `:ui` < `class`. Conflicts are resolved by tailwind-merge. `utils/tv.ts` configures twMerge for HeroUI's custom theme namespaces, and stops `text-*` from evicting `leading-*`.
- Tokens, base, utilities and variants CSS are copied verbatim from `@heroui/styles` 3.2.6 (`packages/herouse/src/styles/`).

## Docs

- **VitePress with a fully custom theme** replicating fumadocs (notebook layout) and heroui.com's `global.css`. DOM ids and classes are kept verbatim. Keep **both** the docs and the playground.
- **Add heroui.com's header "Theme" selector**: 11 presets, a "Vibrant palette" switch and "Edit theme". This overrides the plan's original "theme-preset selector is not ported". Same localStorage keys and `<html>` attributes as heroui.com. "Edit theme" links to https://heroui.com/themes. Build it with herouse components.
- The playground has no `createHeroUse` overrides, so it renders the pure theme (the old `tracking-wide` demo override was removed).

## Platform

- **Web now, Lynx later.** vue-lynx 0.5.1 is pre-alpha with no DOM, so Reka can't run on it. It supports Tailwind v3 only, with no `::before`/`::after` and no oklch. Only the API contract and hex tokens could be shared. The bun workspace `packages/*` leaves room for `packages/lynx`.
- Plain Vue library only: no Nuxt module, no Vite plugin.
- Package manager is bun.

## Open-decision batch (user, 2026-10-02 16:30) — status.md items 1-20

Kept as is (document as known deviations): #1 Switch label-position CSS workaround; #2 Related Showcases not ported; #5 ProgressBar uses Reka locale; #7 Toast single `#toast` slot, flat queue; #8 landing loose ends wait for the HareUI rename; #9 `separator` prop + `items` API; #10 Select multi-value single string; #13 AvatarGroup `#count` slot; #15 search dialog without Web/Native tabs and Ask AI; #17 ColorSwatchPicker a-d; #18 ColorArea a-d; #19 ColorSlider a-d; #20 ColorPicker a-e.

Changes to make:
- **#3 Docs site:** add the header GitHub link (`https://github.com/alexzvn/hareui`). No sidebar New/Updated badges, no Get Involved / Contributing. CLI/Figma/MCP, Ask AI, language picker stay out.
- **#6 Tooltip:** add the missing options only: a close delay and a focus-only trigger. Cross-tooltip warm-up and sub-pixel position drift are accepted and documented.
- **#11 Calendar:** build a custom week view and day view grid outside Reka so those demos can be ported.
- **#12 RangeCalendar:** keep trying the anchor-date wrapper; park and document if it fails.
- **#14 TagGroup:** add an EmptyState component, then port the with-list-data demo.
- **#16 ColorField:** option A: show an empty input when there is no value/defaultValue (Reka still holds `#000000`, so the form value is `#000000`); restore the controlled demo's "Clear" button.
