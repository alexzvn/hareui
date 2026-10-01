---
title: Styling
description: Style HeroUse components with the class prop, the ui prop, and data attribute selectors.
---

Every HeroUse component accepts a `class` prop for the root element and a `:ui` prop for per-slot overrides. Both merge on top of the component's built-in theme with [tailwind-merge](https://github.com/dcastil/tailwind-merge), so conflicting utilities resolve predictably instead of stacking.

## The `class` Prop

`class` targets the root slot (always named `base` internally) and wins over everything below it in the precedence order:

```vue
<template>
  <Button class="bg-purple-500 hover:bg-purple-600">
    Custom Button
  </Button>
</template>
```

Because HeroUse uses tailwind-merge, `bg-purple-500` replaces the theme's `bg-(--button-bg)` instead of both classes competing at the same specificity.

## The `:ui` Prop

`:ui` targets any slot by name, not just the root. Each component documents its slot keys on its own page's Anatomy section:

```vue
<template>
  <Button :ui="{ base: 'uppercase tracking-wider', spinner: 'text-white' }" :pending="true">
    Submit
  </Button>
</template>
```

## Tailwind-Merge Conflict Resolution

Classes are combined in this order — later layers win when they target the same CSS property: theme file → `createHeroUse({ ui })` → variant props → `:ui` → `class` (root only). See [Theming](/docs/getting-started/theming#precedence) for the full precedence table.

```vue
<!-- Theme default is rounded-3xl; class overrides it to rounded-none -->
<Button class="rounded-none">Square corners</Button>
```

## State-Based Styling

HeroUse components expose their state through `data-slot` and state data attributes, mirroring HeroUI's selectors:

```css
/* Target component state */
[data-slot="button"][data-pending="true"] {
  cursor: progress;
}

[data-slot="checkbox-control"][data-state="checked"] {
  background: var(--accent);
}

[data-slot="modal-dialog"][data-state="open"] {
  animation: fade-in 150ms var(--ease-out);
}
```

Common attributes:

| Attribute | Meaning |
|---|---|
| `data-slot="<name>"` | Identifies the rendered part, identical to HeroUI's `data-slot` strings |
| `data-state="checked\|open\|closed\|active"` | Reka UI state (checkbox/switch/radio, overlays, tabs) |
| `data-disabled` | Present when the part is disabled |
| `data-pending="true"` | Button is in a pending state |
| `data-invalid="true"` | Form field failed validation |
| `data-side="top\|right\|bottom\|left"` | Floating content placement (popover, tooltip) |

See [Animation](/docs/getting-started/animation) for the full `data-state` → Tailwind variant mapping used in transitions.

## Native `:hover`/`:active`/`:focus-visible`

HeroUse components are plain DOM elements, so native pseudo-classes work directly — no `data-hovered`/`data-pressed` attributes to match:

```css
[data-slot="button"]:hover {
  background: var(--accent-hover);
}

[data-slot="button"]:active {
  transform: scale(0.97);
}

[data-slot="button"]:focus-visible {
  outline: 2px solid var(--focus);
}
```

## Next Steps

- Learn about [Animation](/docs/getting-started/animation) techniques
- Explore the [Theming](/docs/getting-started/theming) system
- Browse [Component](/docs/components/button) examples
