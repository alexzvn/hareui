---
title: Colors
description: Semantic color tokens and CSS variables that power HeroUse's design system.
---

HeroUse's color system is built around semantic intent, not visual abundance. Instead of exposing large raw palettes, it defines a small, meaningful set of color roles that cover most interface needs. The tokens below are copied verbatim from HeroUI's own `variables.css`, so any existing HeroUI theme override applies unchanged.

Most colors are derived automatically from a limited number of base values using `color-mix()`. Colors without a suffix are backgrounds (e.g. `--accent`); colors with `-foreground` are text colors meant to sit on that background (e.g. `--accent-foreground`).

## Accent

The accent color represents the primary brand or product identity — used sparingly for key actions, highlights, and emphasis.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--accent)"></span> Accent | `--accent` | `bg-accent` | `oklch(0.6204 0.195 253.83)` | `oklch(0.6204 0.195 253.83)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--accent-hover)"></span> Accent Hover | `--accent-hover` | `bg-accent-hover` | `color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--accent-foreground)"></span> Accent Foreground | `--accent-foreground` | `text-accent-foreground` | `var(--snow)` | `var(--snow)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--accent-soft)"></span> Accent Soft | `--accent-soft` | `bg-accent-soft` | `color-mix(in oklab, var(--accent) 15%, transparent)` | `color-mix(in oklab, var(--accent) 12%, transparent)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--accent-soft-hover)"></span> Accent Soft Hover | `--accent-soft-hover` | `bg-accent-soft-hover` | `color-mix(in oklab, var(--accent) 20%, transparent)` | `color-mix(in oklab, var(--accent) 16%, transparent)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--accent-soft-foreground)"></span> Accent Soft Foreground | `--accent-soft-foreground` | `text-accent-soft-foreground` | `color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%)` | `color-mix(in oklab, var(--accent) 80%, var(--foreground) 30%)` |

## Default (neutrals)

Default colors form the neutral backbone of the system, used for most non-emphasized UI elements.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--default);border:1px solid var(--border)"></span> Default | `--default` | `bg-default` | `oklch(94% 0.001 286.375)` | `oklch(27.4% 0.006 286.033)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--default-hover)"></span> Default Hover | `--default-hover` | `bg-default-hover` | `color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--default-foreground)"></span> Default Foreground | `--default-foreground` | `text-default-foreground` | `var(--eclipse)` | `var(--snow)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--default-soft)"></span> Default Soft | `--default-soft` | `bg-default-soft` | `color-mix(in oklab, var(--default) 50%, transparent)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--default-soft-hover)"></span> Default Soft Hover | `--default-soft-hover` | `bg-default-soft-hover` | `color-mix(in oklab, var(--default) 60%, transparent)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--default-soft-foreground)"></span> Default Soft Foreground | `--default-soft-foreground` | `text-default-soft-foreground` | `var(--default-foreground)` | `var(--default-foreground)` |

## Success

Success colors communicate positive outcomes, confirmations, and completed states.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--success)"></span> Success | `--success` | `bg-success` | `oklch(0.7329 0.1935 150.81)` | `oklch(0.7329 0.1935 150.81)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--success-hover)"></span> Success Hover | `--success-hover` | `bg-success-hover` | `color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--success-foreground)"></span> Success Foreground | `--success-foreground` | `text-success-foreground` | `var(--eclipse)` | `var(--eclipse)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--success-soft)"></span> Success Soft | `--success-soft` | `bg-success-soft` | `color-mix(in oklab, var(--success) 15%, transparent)` | `color-mix(in oklab, var(--success) 12%, transparent)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--success-soft-hover)"></span> Success Soft Hover | `--success-soft-hover` | `bg-success-soft-hover` | `color-mix(in oklab, var(--success) 20%, transparent)` | `color-mix(in oklab, var(--success) 16%, transparent)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--success-soft-foreground)"></span> Success Soft Foreground | `--success-soft-foreground` | `text-success-soft-foreground` | `color-mix(in oklab, var(--success) 80%, var(--foreground) 60%)` | `color-mix(in oklab, var(--success) 80%, var(--foreground) 30%)` |

## Warning

Warning colors indicate caution or actions that require attention but are not destructive.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--warning)"></span> Warning | `--warning` | `bg-warning` | `oklch(0.7819 0.1585 72.33)` | `oklch(0.8203 0.1388 76.34)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--warning-hover)"></span> Warning Hover | `--warning-hover` | `bg-warning-hover` | `color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--warning-foreground)"></span> Warning Foreground | `--warning-foreground` | `text-warning-foreground` | `var(--eclipse)` | `var(--eclipse)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--warning-soft)"></span> Warning Soft | `--warning-soft` | `bg-warning-soft` | `color-mix(in oklab, var(--warning) 15%, transparent)` | `color-mix(in oklab, var(--warning) 12%, transparent)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--warning-soft-hover)"></span> Warning Soft Hover | `--warning-soft-hover` | `bg-warning-soft-hover` | `color-mix(in oklab, var(--warning) 20%, transparent)` | `color-mix(in oklab, var(--warning) 16%, transparent)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--warning-soft-foreground)"></span> Warning Soft Foreground | `--warning-soft-foreground` | `text-warning-soft-foreground` | `color-mix(in oklab, var(--warning) 80%, var(--foreground) 70%)` | `color-mix(in oklab, var(--warning) 80%, var(--foreground) 30%)` |

## Danger

Danger colors represent destructive, irreversible, or critical actions and states.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--danger)"></span> Danger | `--danger` | `bg-danger` | `oklch(0.6532 0.2328 25.74)` | `oklch(0.594 0.1967 24.63)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--danger-hover)"></span> Danger Hover | `--danger-hover` | `bg-danger-hover` | `color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--danger-foreground)"></span> Danger Foreground | `--danger-foreground` | `text-danger-foreground` | `var(--snow)` | `var(--snow)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--danger-soft)"></span> Danger Soft | `--danger-soft` | `bg-danger-soft` | `color-mix(in oklab, var(--danger) 15%, transparent)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--danger-soft-hover)"></span> Danger Soft Hover | `--danger-soft-hover` | `bg-danger-soft-hover` | `color-mix(in oklab, var(--danger) 20%, transparent)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--danger-soft-foreground)"></span> Danger Soft Foreground | `--danger-soft-foreground` | `text-danger-soft-foreground` | `color-mix(in oklab, var(--danger) 70%, var(--foreground) 40%)` | `color-mix(in oklab, var(--danger) 80%, var(--foreground) 30%)` |

## Foreground

Text and icon colors, optimized for readability. These should never be hard-coded at the component level.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| Foreground | `--foreground` | `text-foreground` | `var(--eclipse)` | `var(--snow)` |
| Muted | `--muted` | `text-muted` | `oklch(0.5517 0.0138 285.94)` | `oklch(70.5% 0.015 286.067)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--segment);border:1px solid var(--border)"></span> Segment | `--segment` | `bg-segment` | `var(--white)` | `oklch(0.3964 0.01 285.93)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--overlay);border:1px solid var(--border)"></span> Overlay | `--overlay` | `bg-overlay` | `var(--white)` | `oklch(0.2103 0.0059 285.89)` |
| Link | `--link` | `text-link` | `var(--foreground)` | `var(--foreground)` |

## Background

The base canvas of the interface.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--background);border:1px solid var(--border)"></span> Background | `--background` | `bg-background` | `oklch(0.9702 0 0)` | `oklch(12% 0.005 285.823)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--background-secondary);border:1px solid var(--border)"></span> Secondary | `--background-secondary` | `bg-background-secondary` | `color-mix(in oklab, var(--background) 96%, var(--foreground) 4%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--background-tertiary);border:1px solid var(--border)"></span> Tertiary | `--background-tertiary` | `bg-background-tertiary` | `color-mix(in oklab, var(--background) 92%, var(--foreground) 8%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--background-inverse)"></span> Inverse | `--background-inverse` | `bg-background-inverse` | `var(--foreground)` | `var(--foreground)` |

## Surface

Surfaces sit on top of backgrounds for containers such as cards, panels, and modals.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--surface);border:1px solid var(--border)"></span> Surface | `--surface` | `bg-surface` | `var(--white)` | `oklch(0.2103 0.0059 285.89)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--surface-hover);border:1px solid var(--border)"></span> Surface Hover | `--surface-hover` | `bg-surface-hover` | `color-mix(in oklab, var(--surface) 92%, var(--surface-foreground) 8%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--surface-secondary);border:1px solid var(--border)"></span> Secondary | `--surface-secondary` | `bg-surface-secondary` | `oklch(0.9524 0.0013 286.37)` | `oklch(0.257 0.0037 286.14)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--surface-tertiary);border:1px solid var(--border)"></span> Tertiary | `--surface-tertiary` | `bg-surface-tertiary` | `oklch(0.9373 0.0013 286.37)` | `oklch(0.2721 0.0024 247.91)` |

## Form Field

Specialized tokens for inputs, controls, and interactive fields, isolated from the rest of the UI.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--field-background);border:1px solid var(--border)"></span> Field | `--field-background` | `bg-field` | `var(--white)` | `oklch(0.2103 0.0059 285.89)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--field-hover);border:1px solid var(--border)"></span> Field Hover | `--field-hover` | `bg-field-hover` | `color-mix(in oklab, var(--field-background, var(--default)) 90%, var(--field-foreground, var(--foreground)) 2%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--field-focus);border:1px solid var(--border)"></span> Field Focus | `--field-focus` | `bg-field-focus` | `var(--field-background, var(--default))` | same formula |
| Field Foreground | `--field-foreground` | `text-field-foreground` | `oklch(0.2103 0.0059 285.89)` | `var(--foreground)` |
| Field Placeholder | `--field-placeholder` | `text-field-placeholder` | `var(--muted)` | `var(--muted)` |
| Field Border | `--field-border` | `border-field` | `transparent` | `transparent` |
| Field Border Hover | `--field-border-hover` | `border-field-border-hover` | `color-mix(in oklab, var(--field-border, var(--border)) 88%, var(--field-foreground, var(--foreground)) 10%)` | same formula |
| Field Border Focus | `--field-border-focus` | `border-field-border-focus` | `color-mix(in oklab, var(--field-border, var(--border)) 74%, var(--field-foreground, var(--foreground)) 22%)` | same formula |

## Separator

Dividers and subtle boundaries. Kept low contrast and unobtrusive.

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--separator)"></span> Separator | `--separator` | `bg-separator` | `oklch(92% 0.004 286.32)` | `oklch(25% 0.006 286.033)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--separator-secondary)"></span> Secondary | `--separator-secondary` | `bg-separator-secondary` | `color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--separator-tertiary)"></span> Tertiary | `--separator-tertiary` | `bg-separator-tertiary` | `color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%)` | same formula |

## Border

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--border)"></span> Border | `--border` | `border-border` | `oklch(90% 0.004 286.32)` | `oklch(28% 0.006 286.033)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--border-secondary)"></span> Secondary | `--border-secondary` | `border-border-secondary` | `color-mix(in oklab, var(--surface) 78%, var(--surface-foreground) 22%)` | same formula |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--border-tertiary)"></span> Tertiary | `--border-tertiary` | `border-border-tertiary` | `color-mix(in oklab, var(--surface) 66%, var(--surface-foreground) 34%)` | same formula |

## Other

| Token | CSS Variable | Tailwind Utility | Light | Dark |
|---|---|---|---|---|
| Backdrop | `--backdrop` | `bg-backdrop` | `rgba(0, 0, 0, 0.5)` | `rgba(0, 0, 0, 0.6)` |
| Focus | `--focus` | `outline-focus` | `var(--accent)` | `var(--accent)` |

## Primitive

Mode-agnostic values used as foundations for semantic tokens. They do not change between light and dark themes, and are not exposed as Tailwind color utilities directly — other tokens reference them with `var()`.

| Token | CSS Variable | Value |
|---|---|---|
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--white);border:1px solid var(--border)"></span> White | `--white` | `oklch(100% 0 0)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--black)"></span> Black | `--black` | `oklch(0% 0 0)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--snow);border:1px solid var(--border)"></span> Snow | `--snow` | `oklch(0.9911 0 0)` |
| <span style="display:inline-block;width:1rem;height:1rem;border-radius:4px;background:var(--eclipse)"></span> Eclipse | `--eclipse` | `oklch(0.2103 0.0059 285.89)` |

## How to Use Colors

**In component templates:**

```vue
<template>
  <div class="bg-background text-foreground">
    <button class="bg-accent text-accent-foreground hover:bg-accent-hover">
      Click me
    </button>
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
