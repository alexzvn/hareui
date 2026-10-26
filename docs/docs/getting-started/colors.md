---
title: Colors
description: Semantic color tokens and CSS variables that power HareUI's design system.
---

HareUI's color system is built around semantic intent, not visual abundance. Instead of exposing large raw palettes, it defines a small, meaningful set of color roles that cover most interface needs. The tokens below are copied verbatim from HeroUI's own `variables.css`, so any existing HeroUI theme override applies unchanged.

Most colors are derived automatically from a limited number of base values using `color-mix()`. Colors without a suffix are backgrounds (e.g. `--accent`); colors with `-foreground` are text colors meant to sit on that background (e.g. `--accent-foreground`). Click any swatch to copy its resolved `oklch()` value.

## Accent

The accent color represents the primary brand or product identity. It is used to draw attention to key actions, highlights, and moments of emphasis.

Accent should be used intentionally and sparingly. Overuse reduces its impact and can harm visual hierarchy. In most cases, components derive multiple accent-related values (hover, subtle backgrounds, focus states) automatically from the base accent color.

<ColorSectionSideBySide
  name="Accent"
  :base="{ variable: '--accent', tooltip: '--accent: oklch(0.6204 0.195 253.83)' }"
  :hover="{ variable: '--accent-hover', tooltip: '--accent-hover: color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%)' }"
  :foreground="{ variable: '--accent-foreground', tooltip: '--accent-foreground: var(--snow)' }"
  :soft="{
    base: { variable: '--accent-soft', tooltip: '--accent-soft: color-mix(in oklab, var(--accent) 15%, transparent)' },
    hover: { variable: '--accent-soft-hover', tooltip: '--accent-soft-hover: color-mix(in oklab, var(--accent) 20%, transparent)' },
    foreground: { variable: '--accent-soft-foreground', cssValue: 'var(--accent)', tooltip: '--accent-soft-foreground: color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%)' },
  }"
/>

## Default (neutrals)

Default colors form the neutral backbone of the system. They are used for most non-emphasized UI elements.

<ColorSectionSideBySide
  name="Default"
  :base="{ variable: '--default', tooltip: '--default: oklch(94% 0.001 286.375)' }"
  :hover="{ variable: '--default-hover', tooltip: '--default-hover: color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%)' }"
  :foreground="{ variable: '--default-foreground', tooltip: '--default-foreground: var(--eclipse)' }"
/>

## Success

Success colors communicate positive outcomes, confirmations, and completed states. They are typically used in feedback components, status indicators, and validation states.

<ColorSectionSideBySide
  name="Success"
  :base="{ variable: '--success', tooltip: '--success: oklch(0.7329 0.1935 150.81)' }"
  :hover="{ variable: '--success-hover', tooltip: '--success-hover: color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%)' }"
  :foreground="{ variable: '--success-foreground', tooltip: '--success-foreground: var(--eclipse)' }"
  :soft="{
    base: { variable: '--success-soft', tooltip: '--success-soft: color-mix(in oklab, var(--success) 15%, transparent)' },
    hover: { variable: '--success-soft-hover', tooltip: '--success-soft-hover: color-mix(in oklab, var(--success) 20%, transparent)' },
    foreground: { variable: '--success-soft-foreground', cssValue: 'var(--success)', tooltip: '--success-soft-foreground: color-mix(in oklab, var(--success) 80%, var(--foreground) 60%)' },
  }"
/>

## Warning

Warning colors indicate caution, risk, or actions that require attention but are not destructive. They are commonly used for alerts, messages, and transitional states where the user should pause or review information.

<ColorSectionSideBySide
  name="Warning"
  :base="{ variable: '--warning', tooltip: '--warning: oklch(0.7819 0.1585 72.33)' }"
  :hover="{ variable: '--warning-hover', tooltip: '--warning-hover: color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%)' }"
  :foreground="{ variable: '--warning-foreground', tooltip: '--warning-foreground: var(--eclipse)' }"
  :soft="{
    base: { variable: '--warning-soft', tooltip: '--warning-soft: color-mix(in oklab, var(--warning) 15%, transparent)' },
    hover: { variable: '--warning-soft-hover', tooltip: '--warning-soft-hover: color-mix(in oklab, var(--warning) 20%, transparent)' },
    foreground: { variable: '--warning-soft-foreground', cssValue: 'var(--warning)', tooltip: '--warning-soft-foreground: color-mix(in oklab, var(--warning) 80%, var(--foreground) 70%)' },
  }"
/>

## Danger

Danger colors represent destructive, irreversible, or critical actions and states. They should be immediately recognizable and used consistently for errors, destructive buttons, and critical alerts.

<ColorSectionSideBySide
  name="Danger"
  :base="{ variable: '--danger', tooltip: '--danger: oklch(0.6532 0.2328 25.74)' }"
  :hover="{ variable: '--danger-hover', tooltip: '--danger-hover: color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%)' }"
  :foreground="{ variable: '--danger-foreground', tooltip: '--danger-foreground: var(--snow)' }"
  :soft="{
    base: { variable: '--danger-soft', tooltip: '--danger-soft: color-mix(in oklab, var(--danger) 15%, transparent)' },
    hover: { variable: '--danger-soft-hover', tooltip: '--danger-soft-hover: color-mix(in oklab, var(--danger) 20%, transparent)' },
    foreground: { variable: '--danger-soft-foreground', cssValue: 'var(--danger)', tooltip: '--danger-soft-foreground: color-mix(in oklab, var(--danger) 70%, var(--foreground) 40%)' },
  }"
/>

## Foreground

Foreground colors are used for primary content such as text and icons. These colors are optimized for readability and accessibility and adapt automatically to background and surface contexts. Foreground colors should never be hard-coded at the component level.

<ColorSectionStacked
  :lightColors="[
    { label: 'Foreground', variable: '--foreground', tooltip: '--foreground: var(--eclipse)' },
    { label: 'Muted', variable: '--muted', tooltip: '--muted: oklch(0.5517 0.0138 285.94)' },
    { label: 'Segment', variable: '--segment', tooltip: '--segment: var(--white)' },
    { label: 'Overlay', variable: '--overlay', tooltip: '--overlay: var(--white)' },
    { label: 'Link', variable: '--link', tooltip: '--link: var(--foreground)' },
  ]"
  :darkColors="[
    { label: 'Foreground', variable: '--foreground', border: true, tooltip: '--foreground: var(--snow)' },
    { label: 'Muted', variable: '--muted', border: true, tooltip: '--muted: oklch(70.5% 0.015 286.067)' },
    { label: 'Segment', variable: '--segment', border: true, tooltip: '--segment: oklch(0.3964 0.01 285.93)' },
    { label: 'Overlay', variable: '--overlay', border: true, tooltip: '--overlay: oklch(0.2103 0.0059 285.89)' },
    { label: 'Link', variable: '--link', border: true, tooltip: '--link: var(--foreground)' },
  ]"
/>

## Background

Background colors define the base canvas of the interface. They establish overall contrast and mood while staying visually quiet.

<ColorSectionStacked
  :lightColors="[
    { label: 'Background', variable: '--background', border: true, tooltip: '--background: oklch(0.9702 0 0)' },
    { label: 'Secondary', variable: '--background-secondary', border: true, tooltip: '--background-secondary: color-mix(in oklab, var(--background) 96%, var(--foreground) 4%)' },
    { label: 'Tertiary', variable: '--background-tertiary', border: true, tooltip: '--background-tertiary: color-mix(in oklab, var(--background) 92%, var(--foreground) 8%)' },
    { label: 'Inverse', variable: '--background-inverse', tooltip: '--background-inverse: var(--foreground)' },
  ]"
  :darkColors="[
    { label: 'Background', variable: '--background', border: true, tooltip: '--background: oklch(12% 0.005 285.823)' },
    { label: 'Secondary', variable: '--background-secondary', border: true, tooltip: '--background-secondary: color-mix(in oklab, var(--background) 96%, var(--foreground) 4%)' },
    { label: 'Tertiary', variable: '--background-tertiary', border: true, tooltip: '--background-tertiary: color-mix(in oklab, var(--background) 92%, var(--foreground) 8%)' },
    { label: 'Inverse', variable: '--background-inverse', border: true, tooltip: '--background-inverse: var(--foreground)' },
  ]"
/>

## Surface

Surface colors sit on top of backgrounds and are used for containers such as cards, panels, modals, and dropdowns. Surfaces help create visual separation and hierarchy through elevation, contrast, and layering rather than strong color shifts.

<ColorSectionStacked
  :lightColors="[
    { label: 'Surface', variable: '--surface', border: true, tooltip: '--surface: var(--white)' },
    { label: 'Secondary', variable: '--surface-secondary', border: true, tooltip: '--surface-secondary: oklch(0.9524 0.0013 286.37)' },
    { label: 'Tertiary', variable: '--surface-tertiary', border: true, tooltip: '--surface-tertiary: oklch(0.9373 0.0013 286.37)' },
  ]"
  :darkColors="[
    { label: 'Surface', variable: '--surface', border: true, tooltip: '--surface: oklch(0.2103 0.0059 285.89)' },
    { label: 'Secondary', variable: '--surface-secondary', border: true, tooltip: '--surface-secondary: oklch(0.257 0.0037 286.14)' },
    { label: 'Tertiary', variable: '--surface-tertiary', border: true, tooltip: '--surface-tertiary: oklch(0.2721 0.0024 247.91)' },
  ]"
/>

## Form field

Form field colors are specialized tokens used for inputs, controls, and interactive fields. They account for multiple states such as default, focus, and hover. Isolating them ensures form elements have a distinct visual language from buttons and the rest of the UI.

<ColorSectionFormField
  :colors="{
    bg: '--field-background',
    bgTooltip: '--field-background: var(--white)',
    bgHover: 'var(--field-hover)',
    bgHoverTooltip: '--field-hover: color-mix(in oklab, var(--field-background, var(--default)) 90%, var(--field-foreground, var(--foreground)) 2%)',
    bgFocusTooltip: '--field-focus: var(--field-background, var(--default))',
    placeholder: '--field-placeholder',
    placeholderTooltip: '--field-placeholder: var(--muted)',
    foreground: '--field-foreground',
    foregroundTooltip: '--field-foreground: oklch(0.2103 0.0059 285.89)',
  }"
/>

## Separator

Separator colors are used for dividers, outlines, and subtle boundaries. They exist to structure content and guide the eye without adding noise. Separator colors should remain low contrast and unobtrusive.

<ColorSectionStacked
  :lightColors="[
    { label: 'Separator', variable: '--separator', border: true, tooltip: '--separator: oklch(92% 0.004 286.32)' },
    { label: 'Secondary', variable: '--separator-secondary', border: true, tooltip: '--separator-secondary: color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%)' },
    { label: 'Tertiary', variable: '--separator-tertiary', border: true, tooltip: '--separator-tertiary: color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%)' },
  ]"
  :darkColors="[
    { label: 'Separator', variable: '--separator', border: true, tooltip: '--separator: oklch(25% 0.006 286.033)' },
    { label: 'Secondary', variable: '--separator-secondary', border: true, tooltip: '--separator-secondary: color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%)' },
    { label: 'Tertiary', variable: '--separator-tertiary', border: true, tooltip: '--separator-tertiary: color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%)' },
  ]"
/>

## Other

Other colors serve specific utility roles across the interface. They exist to structure content and guide the eye without adding noise.

<ColorSectionStacked
  :lightColors="[
    { label: 'Border', variable: '--border', tooltip: '--border: oklch(90% 0.004 286.32)' },
    { label: 'Backdrop', variable: '--backdrop', tooltip: '--backdrop: rgba(0, 0, 0, 0.5)' },
    { label: 'Overlay', variable: '--overlay', border: true, tooltip: '--overlay: var(--white)' },
    { label: 'Segment', variable: '--segment', border: true, tooltip: '--segment: var(--white)' },
  ]"
  :darkColors="[
    { label: 'Border', variable: '--border', tooltip: '--border: oklch(28% 0.006 286.033)' },
    { label: 'Backdrop', variable: '--backdrop', tooltip: '--backdrop: rgba(0, 0, 0, 0.6)' },
    { label: 'Overlay', variable: '--overlay', border: true, tooltip: '--overlay: oklch(0.2103 0.0059 285.89)' },
    { label: 'Segment', variable: '--segment', border: true, tooltip: '--segment: oklch(0.3964 0.01 285.93)' },
  ]"
/>

## Primitive

Primitive colors are mode agnostic values used as foundations for semantic color tokens. They do not change between light and dark themes.

<ColorSectionPrimitive
  :colors="[
    { label: 'White', variable: '--white', border: true, tooltip: '--white: oklch(100% 0 0)' },
    { label: 'Black', variable: '--black', tooltip: '--black: oklch(0% 0 0)' },
    { label: 'Snow', variable: '--snow', border: true, tooltip: '--snow: oklch(0.9911 0 0)' },
    { label: 'Eclipse', variable: '--eclipse', tooltip: '--eclipse: oklch(0.2103 0.0059 285.89)' },
  ]"
/>

## How to Use Colors

**In component templates:**

```vue
<template>
  <div class="bg-background text-foreground">
    <button class="bg-accent text-accent-foreground hover:bg-accent-hover">Click me</button>
  </div>
</template>
```

**In CSS files:**

```css
/* Direct CSS variables */
.my-component {
  background: var(--accent);
  color: var(--accent-foreground);
  border: 1px solid var(--border);
}
```

See [Theming](/docs/getting-started/theming) to override these tokens globally, and [Dark Mode](/docs/getting-started/dark-mode) for switching between light and dark values.

## Default Theme

The complete theme definition lives in `packages/vue/src/styles/variables.css`. It declares common tokens once, then light values on `:root` / `[data-theme="light"]` and dark values on `.dark` / `[data-theme="dark"]` — switching is a single class or attribute toggle.

<CollapsibleCode lang="css" title="variables.css" :code="`@layer base {
  :root, :host {
    /* Primitive Colors (do not change between light and dark) */
    --white: oklch(100% 0 0);
    --black: oklch(0% 0 0);
    --snow: oklch(0.9911 0 0);
    --eclipse: oklch(0.2103 0.0059 285.89);
    /* . */
    /* Spacing scale */
    --spacing: 0.25rem;
    /* . */
    /* Border */
    --border-width: 1px;
    --field-border-width: 0px;
    --disabled-opacity: 0.5;
    /* . */
    /* Ring offset - used for the focus ring */
    --ring-offset-width: 2px;
    /* . */
    /* Cursor */
    --cursor-interactive: pointer;
    --cursor-disabled: not-allowed;
    /* . */
    /* Radius */
    --radius: 0.5rem;
    --field-radius: calc(var(--radius) * 1.5);
    /* . */
    /* Accent and status hues (shared between light and dark) */
    --accent: oklch(0.6204 0.195 253.83);
    --accent-foreground: var(--snow);
    --success: oklch(0.7329 0.1935 150.81);
    --success-foreground: var(--eclipse);
    /* . */
    --field-border: transparent; /* no border by default on form fields */
    --skeleton-animation: shimmer; /* shimmer, pulse, none */
    --tooltip-delay: 1500ms;
    --tooltip-close-delay: 500ms;
  }
    /* . */
  :root,
  .light,
  .default,
  [data-theme=light],
  [data-theme=default],
  :host(.light),
  :host(.default),
  :host([data-theme=light]),
  :host([data-theme=default]) {
    color-scheme: light;
    /* . */
    /* Base Colors */
    --background: oklch(0.9702 0 0);
    --foreground: var(--eclipse);
    /* . */
    /* Surface: used for non-overlay components (cards, accordions, disclosure groups) */
    --surface: var(--white);
    --surface-foreground: var(--foreground);
    --surface-secondary: oklch(0.9524 0.0013 286.37);
    --surface-secondary-foreground: var(--foreground);
    --surface-tertiary: oklch(0.9373 0.0013 286.37);
    --surface-tertiary-foreground: var(--foreground);
    /* . */
    /* Overlay: used for floating/overlay components (tooltips, popovers, modals, menus) */
    --overlay: var(--white);
    --overlay-foreground: var(--foreground);
    /* . */
    --muted: oklch(0.5517 0.0138 285.94);
    --scrollbar: var(--scrollbar-thumb);
    --scrollbar-thumb: color-mix(in oklch, var(--foreground) 15%, transparent);
    --scrollbar-track: transparent;
    /* . */
    --default: oklch(94% 0.001 286.375);
    --default-foreground: var(--eclipse);
    /* . */
    /* Form Fields */
    --field-background: var(--white);
    --field-foreground: oklch(0.2103 0.0059 285.89);
    --field-placeholder: var(--muted);
    /* . */
    /* Status Colors */
    --warning: oklch(0.7819 0.1585 72.33);
    --warning-foreground: var(--eclipse);
    --danger: oklch(0.6532 0.2328 25.74);
    --danger-foreground: var(--snow);
    /* . */
    /* Component Colors */
    --segment: var(--white);
    --segment-foreground: var(--eclipse);
    /* . */
    /* Misc Colors */
    --border: oklch(90% 0.004 286.32);
    --separator: oklch(92% 0.004 286.32);
    --focus: var(--accent);
    --link: var(--foreground);
    --backdrop: rgba(0, 0, 0, 0.5);
    /* . */
    /* Calculated Colors */
    --surface-hover: color-mix(in oklab, var(--surface) 92%, var(--surface-foreground) 8%);
    --background-secondary: color-mix(in oklab, var(--background) 96%, var(--foreground) 4%);
    --background-tertiary: color-mix(in oklab, var(--background) 92%, var(--foreground) 8%);
    --background-inverse: var(--foreground);
    /* . */
    --default-hover: color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%);
    --accent-hover: color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%);
    --success-hover: color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%);
    --warning-hover: color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%);
    --danger-hover: color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%);
    /* . */
    --field-hover: color-mix(in oklab, var(--field-background, var(--default)) 90%, var(--field-foreground, var(--foreground)) 2%);
    --field-focus: var(--field-background, var(--default));
    --field-border-hover: color-mix(in oklab, var(--field-border, var(--border)) 88%, var(--field-foreground, var(--foreground)) 10%);
    --field-border-focus: color-mix(in oklab, var(--field-border, var(--border)) 74%, var(--field-foreground, var(--foreground)) 22%);
    /* . */
    --default-soft: color-mix(in oklab, var(--default) 50%, transparent);
    --default-soft-foreground: var(--default-foreground);
    --default-soft-hover: color-mix(in oklab, var(--default) 60%, transparent);
    /* . */
    --accent-soft: color-mix(in oklab, var(--accent) 15%, transparent);
    --accent-soft-foreground: color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%);
    --accent-soft-hover: color-mix(in oklab, var(--accent) 20%, transparent);
    /* . */
    --danger-soft: color-mix(in oklab, var(--danger) 15%, transparent);
    --danger-soft-foreground: color-mix(in oklab, var(--danger) 70%, var(--foreground) 40%);
    --danger-soft-hover: color-mix(in oklab, var(--danger) 20%, transparent);
    /* . */
    --warning-soft: color-mix(in oklab, var(--warning) 15%, transparent);
    --warning-soft-foreground: color-mix(in oklab, var(--warning) 80%, var(--foreground) 70%);
    --warning-soft-hover: color-mix(in oklab, var(--warning) 20%, transparent);
    /* . */
    --success-soft: color-mix(in oklab, var(--success) 15%, transparent);
    --success-soft-foreground: color-mix(in oklab, var(--success) 80%, var(--foreground) 60%);
    --success-soft-hover: color-mix(in oklab, var(--success) 20%, transparent);
    /* . */
    --separator-secondary: color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%);
    --separator-tertiary: color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%);
    --border-secondary: color-mix(in oklab, var(--surface) 78%, var(--surface-foreground) 22%);
    --border-tertiary: color-mix(in oklab, var(--surface) 66%, var(--surface-foreground) 34%);
    /* . */
    /* Shadows */
    --surface-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06);
    --overlay-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 -6px 12px 0 rgba(0, 0, 0, 0.03), 0 14px 28px 0 rgba(0, 0, 0, 0.08);
    --field-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 1px 0 rgba(0, 0, 0, 0.06);
  }
    /* . */
  .dark,
  [data-theme=dark],
  :host(.dark),
  :host([data-theme=dark]) {
    color-scheme: dark;
    /* . */
    /* Base Colors */
    --background: oklch(12% 0.005 285.823);
    --foreground: var(--snow);
    /* . */
    /* Surface: used for non-overlay components (cards, accordions, disclosure groups) */
    --surface: oklch(0.2103 0.0059 285.89);
    --surface-foreground: var(--foreground);
    --surface-secondary: oklch(0.257 0.0037 286.14);
    --surface-secondary-foreground: var(--foreground);
    --surface-tertiary: oklch(0.2721 0.0024 247.91);
    --surface-tertiary-foreground: var(--foreground);
    /* . */
    /* Overlay: used for floating/overlay components (tooltips, popovers, modals, menus) - lighter for contrast */
    --overlay: oklch(0.2103 0.0059 285.89);
    --overlay-foreground: var(--foreground);
    /* . */
    --muted: oklch(70.5% 0.015 286.067);
    --scrollbar: var(--scrollbar-thumb);
    --scrollbar-thumb: color-mix(in oklch, var(--foreground) 15%, transparent);
    --scrollbar-track: transparent;
    /* . */
    --default: oklch(27.4% 0.006 286.033);
    --default-foreground: var(--snow);
    /* . */
    /* Form Fields */
    --field-background: oklch(0.2103 0.0059 285.89);
    --field-foreground: var(--foreground);
    --field-placeholder: var(--muted);
    /* . */
    /* Status Colors */
    --warning: oklch(0.8203 0.1388 76.34);
    --warning-foreground: var(--eclipse);
    --danger: oklch(0.594 0.1967 24.63);
    --danger-foreground: var(--snow);
    /* . */
    /* Component Colors */
    --segment: oklch(0.3964 0.01 285.93);
    --segment-foreground: var(--foreground);
    /* . */
    /* Misc Colors */
    --border: oklch(28% 0.006 286.033);
    --separator: oklch(25% 0.006 286.033);
    --focus: var(--accent);
    --link: var(--foreground);
    --backdrop: rgba(0, 0, 0, 0.6);
    /* . */
    /* Shadows */
    --surface-shadow: 0 0 0 0 transparent inset; /* No shadow on dark mode */
    --overlay-shadow: 0 0 1px 0 rgba(255, 255, 255, 0.3) inset;
    --field-shadow: 0 0 0 0 transparent inset; /* Transparent shadow to allow ring utilities to work */
    /* . */
    /* Calculated Colors */
    --surface-hover: color-mix(in oklab, var(--surface) 92%, var(--surface-foreground) 8%);
    --background-secondary: color-mix(in oklab, var(--background) 96%, var(--foreground) 4%);
    --background-tertiary: color-mix(in oklab, var(--background) 92%, var(--foreground) 8%);
    --background-inverse: var(--foreground);
    /* . */
    --default-hover: color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%);
    --accent-hover: color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%);
    --success-hover: color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%);
    --warning-hover: color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%);
    --danger-hover: color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%);
    /* . */
    --field-hover: color-mix(in oklab, var(--field-background, var(--default)) 90%, var(--field-foreground, var(--foreground)) 2%);
    --field-focus: var(--field-background, var(--default));
    --field-border-hover: color-mix(in oklab, var(--field-border, var(--border)) 88%, var(--field-foreground, var(--foreground)) 10%);
    --field-border-focus: color-mix(in oklab, var(--field-border, var(--border)) 74%, var(--field-foreground, var(--foreground)) 22%);
    /* . */
    --default-soft: color-mix(in oklab, var(--default) 50%, transparent);
    --default-soft-foreground: var(--default-foreground);
    --default-soft-hover: color-mix(in oklab, var(--default) 60%, transparent);
    /* . */
    --accent-soft: color-mix(in oklab, var(--accent) 12%, transparent);
    --accent-soft-foreground: color-mix(in oklab, var(--accent) 80%, var(--foreground) 30%);
    --accent-soft-hover: color-mix(in oklab, var(--accent) 16%, transparent);
    /* . */
    --danger-soft: color-mix(in oklab, var(--danger) 15%, transparent);
    --danger-soft-foreground: color-mix(in oklab, var(--danger) 80%, var(--foreground) 30%);
    --danger-soft-hover: color-mix(in oklab, var(--danger) 20%, transparent);
    /* . */
    --warning-soft: color-mix(in oklab, var(--warning) 12%, transparent);
    --warning-soft-foreground: color-mix(in oklab, var(--warning) 80%, var(--foreground) 30%);
    --warning-soft-hover: color-mix(in oklab, var(--warning) 16%, transparent);
    /* . */
    --success-soft: color-mix(in oklab, var(--success) 12%, transparent);
    --success-soft-foreground: color-mix(in oklab, var(--success) 80%, var(--foreground) 30%);
    --success-soft-hover: color-mix(in oklab, var(--success) 16%, transparent);
    /* . */
    --separator-secondary: color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%);
    --separator-tertiary: color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%);
    --border-secondary: color-mix(in oklab, var(--surface) 78%, var(--surface-foreground) 22%);
    --border-tertiary: color-mix(in oklab, var(--surface) 66%, var(--surface-foreground) 34%);
  }
}
`" />

## Customizing Colors

**Override existing colors:**

```css
/* src/style.css */
@import 'tailwindcss';
@import '@hareui/vue';

:root {
  /* Override any color variable */
  --accent: oklch(0.7 0.15 250);
  --success: oklch(0.65 0.15 155);
}

.dark {
  /* Override dark theme colors */
  --accent: oklch(0.8 0.12 250);
  --success: oklch(0.75 0.12 155);
}
```

**Tip:** Convert colors at [oklch.com](https://oklch.com).

**Add your own colors:**

```css
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

Now you can use it:

```vue
<template>
  <div class="bg-info text-info-foreground">Info message</div>
</template>
```

> **Note**: To learn more about theme variables and how they work in Tailwind CSS v4, see the [Tailwind CSS Theme documentation](https://tailwindcss.com/docs/theme).

See [Theming](/docs/getting-started/theming) for the `createHareUI({ ui })` app-level override API, which is the Vue-idiomatic equivalent of a custom stylesheet for component-level (not just color) overrides.
