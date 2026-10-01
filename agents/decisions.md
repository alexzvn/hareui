# Decisions (user-confirmed)

Newest first. These override `plan.md` where they conflict.
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
