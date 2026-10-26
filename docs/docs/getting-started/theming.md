---
title: Theming
description: Customize HareUI's design system with CSS variables and app-level theme overrides.
---

HareUI uses CSS variables for color/spacing tokens and [tailwind-variants](https://tailwind-variants.org/) slot themes for component styles. Customize everything from colors to individual component slots with standard CSS or an app-level config object — no BEM classes required.

## How It Works

HareUI's theming system is built on [Tailwind CSS v4](https://tailwindcss.com/docs/theme). The `@hareui/vue` stylesheet declares semantic CSS variables (`--accent`, `--surface`, `--radius`, …) for light and dark themes, maps them to Tailwind's `@theme inline` tokens, and each component's `.vue` file consumes them through a tailwind-variants slot object.

**Naming pattern:**

- Colors without a suffix are backgrounds (e.g. `--accent`)
- Colors with `-foreground` are for text on that background (e.g. `--accent-foreground`)

## Two Ways to Customize

| Layer                  | Scope                                                 | Mechanism                     |
| ---------------------- | ----------------------------------------------------- | ----------------------------- |
| CSS variables          | Global, affects every component that reads the token  | Override in `:root` / `.dark` |
| `createHareUI({ ui })` | Global, affects one component's slot classes/variants | App-level Vue plugin config   |
| `:ui` prop             | Single instance                                       | Prop on the component         |
| `class` prop           | Single instance, root slot only                       | Prop on the component         |

## Overriding CSS Variables

Add overrides after the `@hareui/vue` import:

```css
/* src/style.css */
@import 'tailwindcss';
@import '@hareui/vue';

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

## Overriding Components with `createHareUI`

Pass a `ui` config to `createHareUI()` to override a component's slot classes, variant classes, or default variants app-wide. Keys match the component's theme name (`button`, `card`, `checkbox`, …); values follow the same `slots` / `variants` / `defaultVariants` shape as the component's internal theme file.

```ts
import { createHareUI } from '@hareui/vue'
// main.ts
import { createApp } from 'vue'

import App from './App.vue'

createApp(App)
  .use(
    createHareUI({
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
    }),
  )
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
  <Button :ui="{ base: 'uppercase', spinner: 'text-white' }"> Shout </Button>
</template>
```

## Precedence

When the same slot is targeted at multiple layers, HareUI resolves conflicts with [tailwind-merge](https://github.com/dcastil/tailwind-merge) — the last applied class wins. Layers are applied in this order, lowest to highest priority:

1. **Theme file** — the component's built-in default (`src/components/<name>/theme.ts`)
2. **`hareui({ ui })`** — build-time config from the [Vite plugin](/docs/getting-started/frameworks#vite-plugin-optional)
3. **`createHareUI({ ui })`** — app-level config
4. **Variant props** — `variant`, `size`, `color`, …
5. **`:ui` slot classes** — per-instance, per-slot
6. **`class` prop** — per-instance, root slot only, highest priority

```vue
<template>
  <Button :ui="{ base: 'px-2' }" class="px-3">Click me</Button>
</template>

<script setup lang="ts">
// Theme default: 'px-4'. App config sets 'px-1'. :ui sets 'px-2'. class sets 'px-3'.
// Final root class: 'px-3' — class wins over everything else via tailwind-merge.
</script>
```

## Adding Custom Colors

Add your own semantic colors to the theme:

```css
/* Define in both light and dark themes */
:root,
[data-theme='light'] {
  --info: oklch(0.6 0.15 210);
  --info-foreground: oklch(0.98 0 0);
}

.dark,
[data-theme='dark'] {
  --info: oklch(0.7 0.12 210);
  --info-foreground: oklch(0.15 0 0);
}

/* Make the color available to Tailwind */
@theme inline {
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
}
```

Now use it in your components:

```vue
<template>
  <div class="bg-info text-info-foreground">Info message</div>
</template>
```

## Variables Reference

HareUI defines three types of variables in `packages/vue/src/styles/variables.css`:

1. **Base Variables** — Non-changing values like `--white`, `--black`, spacing, and typography
2. **Theme Variables** — Colors that change between light/dark themes, plus scrollbar tokens (`--scrollbar-thumb`, `--scrollbar-width`, etc.)
3. **Calculated Variables** — Hover states, soft variants, and border/separator levels (derived with `color-mix()`)

For a complete reference, see [Colors](/docs/getting-started/colors) and `packages/vue/src/styles/variables.css`.

**Tailwind theme bridge (`@theme inline`):**

`packages/vue/src/styles/theme.css` maps semantic variables to Tailwind tokens (`--color-*`, `--radius-*`, `--ease-*`). Calculated colors reference underlying vars (e.g. `--surface-hover`, `--accent-soft`) from `variables.css` — they are not inlined with `color-mix()` in this file:

<CollapsibleCode lang="css" title="theme.css" :code="`@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-foreground: var(--surface-foreground);
  --color-surface-hover: var(--surface-hover);
  --color-surface-secondary: var(--surface-secondary);
  --color-surface-secondary-foreground: var(--surface-secondary-foreground);
  --color-surface-tertiary: var(--surface-tertiary);
  --color-surface-tertiary-foreground: var(--surface-tertiary-foreground);
  --color-overlay: var(--overlay);
  --color-overlay-foreground: var(--overlay-foreground);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-segment: var(--segment);
  --color-segment-foreground: var(--segment-foreground);
  --color-border: var(--border);
  --color-separator: var(--separator);
  --color-focus: var(--focus);
  --color-link: var(--link);
  --color-default: var(--default);
  --color-default-foreground: var(--default-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-danger: var(--danger);
  --color-danger-foreground: var(--danger-foreground);
  --color-backdrop: var(--backdrop);
  --shadow-surface: var(--surface-shadow);
  --shadow-overlay: var(--overlay-shadow);
  --shadow-field: var(--field-shadow);
  /* Form Field Tokens */
  --color-field: var(--field-background, var(--default));
  --color-field-hover: var(--field-hover);
  --color-field-foreground: var(--field-foreground, var(--foreground));
  --color-field-placeholder: var(--field-placeholder, var(--muted));
  --color-field-border: var(--field-border, var(--border));
  --radius-field: var(--field-radius, calc(var(--radius) * 1.5));
  --border-width-field: var(--field-border-width, var(--border-width));
  /* Color Tokens */
  --color-background-secondary: var(--background-secondary);
  --color-background-tertiary: var(--background-tertiary);
  --color-background-inverse: var(--background-inverse);
  --color-default-hover: var(--default-hover);
  --color-accent-hover: var(--accent-hover);
  --color-success-hover: var(--success-hover);
  --color-warning-hover: var(--warning-hover);
  --color-danger-hover: var(--danger-hover);
  /* Form Field Colors */
  --color-field-focus: var(--field-focus);
  --color-field-border-hover: var(--field-border-hover);
  --color-field-border-focus: var(--field-border-focus);
  /* Soft Colors */
  --color-default-soft: var(--default-soft);
  --color-default-soft-foreground: var(--default-soft-foreground);
  --color-default-soft-hover: var(--default-soft-hover);
  --color-accent-soft: var(--accent-soft);
  --color-accent-soft-foreground: var(--accent-soft-foreground);
  --color-accent-soft-hover: var(--accent-soft-hover);
  --color-danger-soft: var(--danger-soft);
  --color-danger-soft-foreground: var(--danger-soft-foreground);
  --color-danger-soft-hover: var(--danger-soft-hover);
  --color-warning-soft: var(--warning-soft);
  --color-warning-soft-foreground: var(--warning-soft-foreground);
  --color-warning-soft-hover: var(--warning-soft-hover);
  --color-success-soft: var(--success-soft);
  --color-success-soft-foreground: var(--success-soft-foreground);
  --color-success-soft-hover: var(--success-soft-hover);
  /* Separator Colors - Levels */
  --color-separator-secondary: var(--separator-secondary);
  --color-separator-tertiary: var(--separator-tertiary);
  /* Border Colors - Levels */
  --color-border-secondary: var(--border-secondary);
  --color-border-tertiary: var(--border-tertiary);
  /* Radius and default sizes - defaults can change by just changing the --radius */
  --radius-xs: calc(var(--radius) * 0.25); /* 0.125rem (2px) */
  --radius-sm: calc(var(--radius) * 0.5); /* 0.25rem (4px) */
  --radius-md: calc(var(--radius) * 0.75); /* 0.375rem (6px) */
  --radius-lg: calc(var(--radius) * 1); /* 0.5rem (8px) */
  --radius-xl: calc(var(--radius) * 1.5); /* 0.75rem (12px) */
  --radius-2xl: calc(var(--radius) * 2); /* 1rem (16px) */
  --radius-3xl: calc(var(--radius) * 3); /* 1.5rem (24px) */
  --radius-4xl: calc(var(--radius) * 4); /* 2rem (32px) */
  /* Transition Timing Functions  */
  --ease-smooth: ease; /* same as transition: ease; */
  /* These custom curves are made by https://twitter.com/bdc */
  /* From smoother to faster */
  --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  --ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  --ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
  --ease-in-circ: cubic-bezier(0.6, 0.04, 0.98, 0.335);
  /* From slower to faster */
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
  /* Custom smooth-out curve: fast start, smooth stop - Apple style */
  --ease-out-fluid: cubic-bezier(0.32, 0.72, 0, 1);
  /* From slower to faster */
  --ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
  --ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
  --ease-in-out-circ: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  /* Linear */
  --ease-linear: linear;
  /* Animations */
  --animate-spin-fast: spin 0.75s linear infinite;
  --animate-skeleton: skeleton 2s linear infinite;
  --animate-caret-blink: caret-blink 1.2s ease-out infinite;
  @keyframes skeleton {
    100% { transform: translateX(200%); }
  }
  @keyframes caret-blink {
    0%, 70%, 100% { opacity: 1; }
    20%, 50% { opacity: 0; }
  }
}
`" />

Form controls rely on `--field-*` theme variables. Hover, focus, and border variants are calculated in `variables.css` and mapped to Tailwind in `theme.css` (e.g. `--color-field-hover: var(--field-hover)`). Override `--field-background`, `--field-hover`, and related tokens in your theme to restyle `Input`, `TextField`, `Checkbox`, `Switch`, and `RadioGroup` without affecting surfaces like `Card` or `Button`.

## Scrollbars

HareUI applies a shared scrollbar style to component scroll areas (currently `Modal`'s body). Scrollbars use standard CSS properties (`scrollbar-width`, `scrollbar-color`, `scrollbar-gutter`) — no `::-webkit-scrollbar` overrides.

**Modes** — set `data-scrollbar` on `<html>`, a component root, or a scroll slot:

| Mode         | `data-scrollbar`    | Behavior                                       |
| ------------ | ------------------- | ---------------------------------------------- |
| HareUI thin  | _(unset)_ or `thin` | Thin thumb from theme tokens                   |
| OS / browser | `default`           | Native scrollbars (`auto`)                     |
| Hidden       | `none`              | No visible scrollbar (`scrollbar-width: none`) |

```html
<!-- Native scrollbars everywhere -->
<html data-scrollbar="default">
  <!-- Hide scrollbars in one subtree -->
  <div data-scrollbar="none">...</div>
</html>
```

**Theme variables** — defined in the light and dark theme blocks in `variables.css`:

| Variable             | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `--scrollbar-thumb`  | Thumb color (default: 15% `--foreground` via `color-mix`) |
| `--scrollbar-track`  | Track color (default: `transparent`)                      |
| `--scrollbar-gutter` | Gutter (default: `auto`)                                  |
| `--scrollbar-width`  | `scrollbar-width` (default: `thin`)                       |
| `--scrollbar-color`  | `scrollbar-color` (default: thumb + track)                |
| `--scrollbar`        | Legacy alias of `--scrollbar-thumb`                       |

**Customize globally:**

```css
/* src/style.css */
:root {
  --scrollbar-thumb: color-mix(in oklch, var(--accent) 30%, transparent);
}
```

**Custom overflow areas** — use the `scrollbar`, `scrollbar-thin`, `scrollbar-default`, or `scrollbar-none` utility classes on your own elements:

```vue
<template>
  <div class="scrollbar h-64 overflow-y-auto">
    <!-- long content -->
  </div>
</template>
```

## Vibrant Palette

By default, HareUI uses accessible soft foreground colors that mix the semantic color with the foreground for better contrast. If you prefer more saturated, vibrant soft foreground colors, add the `data-vibrant-palette` attribute to your root element:

```html
<html data-vibrant-palette="true"></html>
```

This switches all `*-soft-foreground` variables (accent, success, warning, danger) to use 92% of the semantic color with only 8% foreground mixed in — closer to the raw color but with a slight contrast boost.

| Mode            | Accessible (default)                         | Vibrant                               |
| --------------- | -------------------------------------------- | ------------------------------------- |
| Soft foreground | `color-mix(color 70-80%, foreground 30-40%)` | `color-mix(color 92%, foreground 8%)` |

:::: warning
The vibrant palette prioritizes visual saturation over contrast. It may not meet WCAG accessibility guidelines for some color combinations, especially with lighter accent colors.
::::

## Resources

- [Colors Documentation](/docs/getting-started/colors)
- [Styling Guide](/docs/getting-started/styling)
- [Tailwind CSS v4 Theming](https://tailwindcss.com/docs/theme)
