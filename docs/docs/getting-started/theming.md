---
title: Theming
description: Customize HeroUse's design system with CSS variables and app-level theme overrides.
---

HeroUse uses CSS variables for color/spacing tokens and [tailwind-variants](https://tailwind-variants.org/) slot themes for component styles. Customize everything from colors to individual component slots with standard CSS or an app-level config object — no BEM classes required.

## How It Works

HeroUse's theming system is built on [Tailwind CSS v4](https://tailwindcss.com/docs/theme). The `herouse` stylesheet declares semantic CSS variables (`--accent`, `--surface`, `--radius`, …) for light and dark themes, maps them to Tailwind's `@theme inline` tokens, and each component's `.vue` file consumes them through a tailwind-variants slot object.

**Naming pattern:**
- Colors without a suffix are backgrounds (e.g. `--accent`)
- Colors with `-foreground` are for text on that background (e.g. `--accent-foreground`)

## Two Ways to Customize

| Layer | Scope | Mechanism |
|---|---|---|
| CSS variables | Global, affects every component that reads the token | Override in `:root` / `.dark` |
| `createHeroUse({ ui })` | Global, affects one component's slot classes/variants | App-level Vue plugin config |
| `:ui` prop | Single instance | Prop on the component |
| `class` prop | Single instance, root slot only | Prop on the component |

## Overriding CSS Variables

Add overrides after the `herouse` import:

```css
/* src/style.css */
@import "tailwindcss";
@import "herouse";

:root {
  /* Override any color variable */
  --accent: oklch(0.7 0.25 260);
  --success: oklch(0.65 0.15 155);
}

.dark {
  --accent: oklch(0.8 0.18 260);
}
```

See [Colors](/docs/getting-started/colors) for the complete token reference and [Dark Mode](/docs/getting-started/dark-mode) for the `.dark` / `data-theme="dark"` switch.

## Overriding Components with `createHeroUse`

Pass a `ui` config to `createHeroUse()` to override a component's slot classes, variant classes, or default variants app-wide. Keys match the component's theme name (`button`, `card`, `checkbox`, …); values follow the same `slots` / `variants` / `defaultVariants` shape as the component's internal theme file.

```ts
// main.ts
import { createApp } from 'vue'
import { createHeroUse } from 'herouse'
import App from './App.vue'

createApp(App)
  .use(createHeroUse({
    ui: {
      button: {
        // Override the base slot class
        slots: { base: 'uppercase tracking-wider' },
        // Override one variant's class
        variants: { variant: { primary: 'shadow-lg' } },
        // Change the default variant
        defaultVariants: { size: 'lg' },
      },
    },
  }))
  .mount('#app')
```

Every component's slot keys are documented on its own page's Anatomy section (e.g. [Button](/docs/components/button), [Card](/docs/components/card)).

## Overriding a Single Instance

Use the `:ui` prop for per-slot overrides, or `class` for the root slot, on one instance:

```vue
<template>
  <!-- Root-only override, tailwind-merged into the base slot -->
  <Button class="rounded-none">Square corners</Button>

  <!-- Per-slot override -->
  <Button :ui="{ base: 'uppercase', spinner: 'text-white' }">
    Shout
  </Button>
</template>
```

## Precedence

When the same slot is targeted at multiple layers, HeroUse resolves conflicts with [tailwind-merge](https://github.com/dcastil/tailwind-merge) — the last applied class wins. Layers are applied in this order, lowest to highest priority:

1. **Theme file** — the component's built-in default (`src/theme/<name>.ts`)
2. **`createHeroUse({ ui })`** — app-level config
3. **Variant props** — `variant`, `size`, `color`, …
4. **`:ui` slot classes** — per-instance, per-slot
5. **`class` prop** — per-instance, root slot only, highest priority

```vue
<script setup lang="ts">
// Theme default: 'px-4'. App config sets 'px-1'. :ui sets 'px-2'. class sets 'px-3'.
// Final root class: 'px-3' — class wins over everything else via tailwind-merge.
</script>

<template>
  <Button :ui="{ base: 'px-2' }" class="px-3">Click me</Button>
</template>
```

## Resources

- [Colors Documentation](/docs/getting-started/colors)
- [Styling Guide](/docs/getting-started/styling)
- [Tailwind CSS v4 Theming](https://tailwindcss.com/docs/theme)
