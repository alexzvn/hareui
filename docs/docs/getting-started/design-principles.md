---
title: Design Principles
description: Core principles that guide HareUI's design and API.
---

HareUI follows the same design principles as HeroUI v3, adapted to Vue's component model with a slot-based API.

## Core Principles

### 1. Semantic Intent Over Visual Style

Use semantic naming (primary, secondary, tertiary) instead of visual descriptions (solid, flat, bordered). Inspired by [Uber's Base design system](https://base.uber.com/6d2425e9f/p/756216-button), HareUI keeps the same variant names and values as HeroUI, so the hierarchy is unchanged:

```vue
<!-- ✅ Semantic variants communicate hierarchy -->
<Button variant="primary">Save</Button>
<Button variant="secondary">Edit</Button>
<Button variant="tertiary">Cancel</Button>
```

| Variant       | Purpose                           | Usage            |
| ------------- | --------------------------------- | ---------------- |
| **Primary**   | Main action to move forward       | 1 per context    |
| **Secondary** | Alternative actions               | Multiple allowed |
| **Tertiary**  | Dismissive actions (cancel, skip) | Sparingly        |
| **Danger**    | Destructive actions               | When needed      |

### 2. Accessibility as Foundation — Reka UI

HareUI is built on [Reka UI](https://reka-ui.com) instead of React Aria Components, so the same WCAG-conscious behavior — focus management, keyboard navigation, screen reader support — comes from Vue-native headless primitives. Components also expose their own state through props and data attributes without any extra wiring:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@hareui/vue'

const isSaving = ref(false)
</script>

<template>
  <!-- pending renders a Spinner, sets aria-busy/data-pending, and
       suppresses the click handler while true -->
  <Button variant="primary" :pending="isSaving" @click="isSaving = true"> Save </Button>
</template>
```

### 3. Composition Over Configuration — Slots Over Compound Components

HeroUI exposes compound parts like `Card.Header` / `Card.Title`. HareUI replaces compound components with named template slots on a single component — rearrange, customize, or omit parts with standard Vue syntax:

::: code-group

```tsx [HeroUI (React)]
import { Card } from '@heroui/react'

;<Card>
  <Card.Header>
    <Card.Title>Settings</Card.Title>
    <Card.Description>Manage your preferences</Card.Description>
  </Card.Header>
  <Card.Content>Body content</Card.Content>
</Card>
```

```vue [HareUI (Vue)]
<template>
  <Card>
    <template #header>
      <h3>Settings</h3>
      <p>Manage your preferences</p>
    </template>
    Body content
  </Card>
</template>
```

:::

Most compound parts also have a shorthand prop (`title`, `description`, …) for the common case — see each component's Anatomy section.

### 4. Progressive Disclosure

Start simple, add complexity only when needed. Components work with minimal props and scale up as requirements grow.

```vue
<!-- Level 1: Minimal -->
<Button>Click me</Button>

<!-- Level 2: Enhanced -->
<Button variant="primary" size="lg">
  Submit
</Button>

<!-- Level 3: Advanced -->
<Button variant="primary" :pending="isSaving">
  Submit
</Button>
```

### 5. Predictable Behavior

Consistent patterns across all components: sizes (`sm`, `md`, `lg`), variants, a `class` prop, and `data-slot` attributes. Same API, same behavior, every component:

```vue
<Button size="lg" variant="primary" class="custom" />
<Chip size="lg" color="success" class="custom" />
<Avatar size="lg" class="custom" />
```

### 6. Type Safety First

Full TypeScript support with IntelliSense, auto-completion, and compile-time error detection. Component prop, slot, and `ui`-key types are exported alongside each component:

```ts
import type { ButtonProps } from '@hareui/vue'

// Type-safe props
const props: ButtonProps = {
  variant: 'primary', // Autocomplete: primary | secondary | tertiary | ghost | outline | danger | danger-soft
  size: 'md', // Type checked: sm | md | lg
}
```

### 7. Semantic Styling — tv Slots + `:ui`

HeroUI separates logic (`@heroui/react`) from BEM-class styles (`@heroui/styles`). HareUI keeps the same separation of concerns, but each component's theme is a [tailwind-variants](https://tailwind-variants.org/) slot object instead of BEM classes — overridden per-instance with `:ui`, or globally with `createHareUI`:

```vue
<!-- Per-instance override -->
<Button :ui="{ base: 'uppercase tracking-wider' }">Click me</Button>
```

```ts
// Global override (main.ts)
createHareUI({
  ui: {
    button: { slots: { base: 'uppercase tracking-wider' } },
  },
})
```

### 8. Developer Experience Excellence

Clear APIs, descriptive prop types, IntelliSense, and `data-slot` attributes that mirror HeroUI's — so existing HeroUI selector knowledge (`[data-slot=button]`, `[data-slot=card-header]`, …) carries over directly.

### 9. Complete Customization — HeroUI's Own Tokens

Beautiful defaults out of the box. Transform the entire look with CSS variables, exactly like HeroUI — HareUI copies HeroUI's token names and values verbatim, so existing HeroUI theme CSS (`--accent`, `--radius`, `--surface`, …) applies unchanged:

```css
/* Theme-wide changes with variables */
:root {
  --accent: oklch(0.7 0.25 260);
  --radius: 0.375rem;
}
```

See [Colors](/docs/getting-started/colors) for the full token reference.

### 10. Open and Extensible

Override any slot, any variant, at any scope — per instance with `:ui`, or app-wide with `createHareUI`. Precedence (lowest to highest): theme file → `createHareUI({ ui })` → variant props → `:ui` → `class` (root only). See [Theming](/docs/getting-started/theming) for the full precedence rules.

## Differences from HeroUI React

| HeroUI (React)                                       | HareUI (Vue)                                       |
| ---------------------------------------------------- | -------------------------------------------------- |
| Compound parts (`Card.Header`, `Card.Title`)         | Named slots (`#header`, `#title`)                  |
| `isDisabled`, `isPending`, `isInvalid`, `isIconOnly` | `disabled`, `pending`, `invalid`, `iconOnly`       |
| `onPress`                                            | `@click` (native DOM events)                       |
| `onChange` / `isSelected` / `isOpen`                 | `v-model` / `v-model:open`                         |
| `className`                                          | `class` (root, tailwind-merged) / `:ui` (per-slot) |
| `@heroui/styles` BEM classes                         | tailwind-variants slot theme per component         |
