---
title: Introduction
description: A Vue 3 port of HeroUI v3, built on Reka UI and Tailwind CSS v4 with a slot-based component API.
---

HareUI is a Vue 3 component library that ports [HeroUI v3](https://heroui.com) (React, Tailwind CSS v4, React Aria Components) to Vue. Instead of wrapping React Aria, HareUI is rebuilt on [Reka UI](https://reka-ui.com) for headless behavior, with the exact same visual design as HeroUI — verified with an automated computed-style and screenshot diff against `@heroui/react`.

The component API itself follows Nuxt UI conventions rather than HeroUI's compound components: named template slots instead of `Card.Header`, a `:ui` prop for per-slot class overrides, a `class` prop merged into the root element, and an optional app-level `createHareUI()` config for global theme overrides.

## Why HareUI?

**Visually identical to HeroUI** — Every component's computed styles and rendered pixels are diffed against `@heroui/react` so the two stay in sync.

**Accessible** — Built on [Reka UI](https://reka-ui.com) primitives with focus management, keyboard navigation, and screen reader support.

**Flexible** — Each component exposes named slots and a `:ui` prop. Change what you need, leave the rest.

**Vue-native** — `<script setup lang="ts">` components, `v-model`, native `@click`-style events, and fully typed props — no adapter layer over a React library.

**Lightweight** — Tree-shaken Vue SFCs. Only the components you import go into your bundle.

**Built for Tailwind CSS v4** — Themes are [tailwind-variants](https://tailwind-variants.org/) slot objects, so every class is a plain Tailwind utility.

## A Living Library, Not Copy-Paste

Copy-paste code works until it breaks. You're left maintaining outdated dependencies that stop evolving.

HareUI is different. It's a library you install and update, not a folder of snippets you own:
- Component themes stay in sync with upstream HeroUI changes
- Deep customization through CSS variables and the `:ui` prop, not shallow theme tweaks
- Predictable, typed props designed for AI-assisted code generation

HareUI is not a snapshot of HeroUI v3 — it tracks the source library as it evolves. 🌱

## How HareUI Differs from HeroUI

HareUI is a hand-translated port, not a wrapper around `@heroui/react`. Each component is rebuilt from scratch in Vue:

- **Headless foundation**: [Reka UI](https://reka-ui.com) instead of React Aria Components.
- **API shape**: named slots and `:ui` overrides instead of HeroUI's `Card.Header`-style compound components.
- **Styling**: component themes are [tailwind-variants](https://tailwind-variants.org/) objects translated by hand from HeroUI's CSS, not an import of `@heroui/styles`.
- **Tokens**: CSS variables (`--accent`, `--surface`, `--radius`, …) are copied verbatim from HeroUI, so existing HeroUI theme overrides apply unchanged.

See [Design Principles](/docs/getting-started/design-principles) for the full list of naming and API conventions.

## FAQ

<Faq>

<FaqItem question="Is HareUI free?">

Yes — HareUI is MIT licensed and open source.

</FaqItem>

<FaqItem question="Is it production-ready?">

HareUI is in early development (`0.1.x`). The component API is stable for the components that exist, but coverage of HeroUI's full component set is incomplete and the API may still change before a 1.0 release.

</FaqItem>

<FaqItem question="Does it work with TypeScript?">

Fully typed. Every component exports its props, slots, and `ui` slot-key types.

</FaqItem>

<FaqItem question="Can I customize the components?">

Yes. Use Tailwind utilities through the `class` prop, per-slot classes through `:ui`, CSS variables, or an app-wide `createHareUI({ ui })` config. See [Theming](/docs/getting-started/theming) and [Styling](/docs/getting-started/styling).

</FaqItem>

<FaqItem question="What about accessibility?">

Built on [Reka UI](https://reka-ui.com) primitives for keyboard navigation, focus management, and ARIA attributes.

</FaqItem>

<FaqItem question="Can I use HareUI without Vue?">

No. Unlike HeroUI, which separates `@heroui/styles` (framework-agnostic BEM classes) from `@heroui/react` (behavior), HareUI's styles live inside each Vue single-file component's tailwind-variants theme and are not published as a standalone CSS package.

</FaqItem>

<FaqItem question="Where do I start?">

Head to [Quick Start](/docs/getting-started/quick-start) to install HareUI and render your first component.

</FaqItem>

</Faq>
