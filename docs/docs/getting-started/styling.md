---
title: Styling
description: Style HareUI components with the class prop, the ui prop, and data attribute selectors.
---

Every HareUI component accepts a `class` prop for the root element and a `:ui` prop for per-slot overrides. The Tailwind utilities you pass win over the component's built-in styles, and [tailwind-merge](https://github.com/dcastil/tailwind-merge) resolves conflicts between utilities, so they replace each other instead of stacking.

## The `class` Prop

`class` targets the root slot (always named `base` internally) and wins over everything below it in the precedence order:

```vue
<template>
  <Button class="bg-purple-500 hover:bg-purple-600"> Custom Button </Button>
</template>
```

Button's own styles are the `h-button` classes of a stylesheet in Tailwind's `components` layer. Your utilities sit in the later `utilities` layer, so `bg-purple-500` beats the button's background whatever the selectors. That includes the button's state styles: without `hover:bg-purple-600`, the button stays purple on hover.

## The `:ui` Prop

`:ui` targets any slot by name, not just the root. Each component documents its slot keys on its own page's Anatomy section:

```vue
<template>
  <Button :ui="{ base: 'uppercase tracking-wider', spinner: 'text-white' }" :pending="true">
    Submit
  </Button>
</template>
```

## Scrollbars

Component scroll areas, such as a modal's body, use the `scrollbar` utility. It reads the theme's `--scrollbar-*` variables. Use the same utilities from `@hareui/vue` on your own overflow containers:

```vue
<template>
  <div class="scrollbar h-64 overflow-y-auto">
    <!-- long content -->
  </div>
</template>
```

| Utility             | Effect                                               |
| ------------------- | ---------------------------------------------------- |
| `scrollbar`         | HareUI thumb (reads theme `--scrollbar-*` variables) |
| `scrollbar-thin`    | HareUI themed thin scrollbar                         |
| `scrollbar-default` | OS / browser scrollbars                              |
| `scrollbar-none`    | Hidden scrollbar                                     |

Global and per-subtree control uses `data-scrollbar` on an ancestor. See [Theming](/docs/getting-started/theming#scrollbars) for tokens and modes.

## How Overrides Win

Two mechanisms decide which class wins.

**CSS layers.** The most used components, such as Button, the form fields, Select, ListBox, Table, Tabs and Calendar, style themselves with short [BEM](https://getbem.com/) classes like `h-button` and `h-button--primary`, defined in `@layer components`. Every Tailwind utility lives in `@layer utilities`, which comes later, so any utility from `class`, `:ui` or `createHareUI({ ui })` wins over them. Each of these components lists its classes in the **CSS classes** section of its page.

```vue
<!-- The h-button class sets rounded-3xl; the utility wins over it -->
<Button class="rounded-none">Square corners</Button>
```

**tailwind-merge.** Utilities are combined in this order, and later layers win when they set the same CSS property: theme file → `hareui({ ui })` → `createHareUI({ ui })` → variant props → `:ui` → `class` (root only). This decides between your own utilities, and between yours and the themes of components that style themselves with utilities. See [Theming](/docs/getting-started/theming#precedence) for the full precedence list.

```vue
<!-- Card's theme sets p-4; tailwind-merge drops it for p-6 -->
<Card class="p-6">Roomy card</Card>
```

### Focus and Invalid Rings

The keyboard focus ring and the invalid-field ring of the BEM components are the exception. They live in `@layer utilities`, after Tailwind's own utilities, so a plain ring utility such as `ring-1` styles the resting state and the focus ring still shows on keyboard focus. A state utility such as `focus-visible:ring-4` replaces the ring. This relies on importing `tailwindcss` before `@hareui/vue`, as in [Quick Start](/docs/getting-started/quick-start).

## State-Based Styling

HareUI components expose their state through `data-slot` and state data attributes:

```css
/* Target component state */
[data-slot='button'][data-pending='true'] {
  cursor: progress;
}

[data-slot='checkbox-control'][data-state='checked'] {
  background: var(--accent);
}

[data-slot='modal-dialog'][data-state='open'] {
  animation: fade-in 150ms var(--ease-out);
}
```

Common attributes:

| Attribute                                    | Meaning                                                 |
| -------------------------------------------- | ------------------------------------------------------- |
| `data-slot="<name>"`                         | Identifies the rendered part                            |
| `data-state="checked\|open\|closed\|active"` | Component state (checkbox/switch/radio, overlays, tabs) |
| `data-disabled`                              | Present when the part is disabled                       |
| `data-pending="true"`                        | Button is in a pending state                            |
| `data-invalid="true"`                        | Form field failed validation                            |
| `data-side="top\|right\|bottom\|left"`       | Floating content placement (popover, tooltip)           |

See [Animation](/docs/getting-started/animation) for the full `data-state` → Tailwind variant mapping used in transitions.

## Native `:hover`/`:active`/`:focus-visible`

HareUI components are plain DOM elements, so native pseudo-classes work directly — no `data-hovered`/`data-pressed` attributes to match:

```css
[data-slot='button']:hover {
  background: var(--accent-hover);
}

[data-slot='button']:active {
  transform: scale(0.97);
}

[data-slot='button']:focus-visible {
  outline: 2px solid var(--focus);
}
```

## Extending Component Themes

Every component's theme config is exported from the `themes` namespace of `@hareui/vue`, for example `themes.button`. Each one has the shape `tv()` expects.

To add a variant the component doesn't have:

1. Extend its theme with the new variant.
2. Resolve it with `tv()`.
3. Apply the resolved class through the `class` prop.

<ComponentPreview name="button/custom-variants" />

The extension's classes are utilities, so they win over Button's `h-button` classes, and tailwind-merge resolves conflicts between them and the original theme's utilities. The original `button` theme file stays untouched.

## Responsive Design

`class` and `:ui` accept any Tailwind utility, including responsive variants:

```vue
<template>
  <Button class="text-sm md:text-base lg:text-lg px-3 md:px-4 lg:px-6"> Responsive Button </Button>
</template>
```

## CSS Modules

Vue's `<style module>` works the same way as any other `class` value — bind the generated identifier instead of a literal string:

```vue
<template>
  <Button :class="$style.button">Scoped Button</Button>
</template>

<!-- GradientButton.vue -->
<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>

<style module>
.button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
</style>
```

## Next Steps

- Learn about [Animation](/docs/getting-started/animation) techniques
- Explore the [Theming](/docs/getting-started/theming) system
- Browse [Component](/docs/components/button) examples
