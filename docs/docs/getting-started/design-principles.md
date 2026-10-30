---
title: Design Principles
description: Core principles that guide HareUI's design and API.
---

HareUI's design principles, built around Vue's component model and a slot-based API.

## Core Principles

### 1. Semantic Intent Over Visual Style

Use semantic naming (primary, secondary, tertiary) instead of visual descriptions (solid, flat, bordered). Inspired by [Uber's Base design system](https://base.uber.com/6d2425e9f/p/756216-button), HareUI names variants by their role in the hierarchy:

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

### 2. Accessibility as Foundation

HareUI is built on Vue-native headless primitives, so WCAG-conscious behavior — focus management, keyboard navigation, screen reader support — comes built in. Components also expose their own state through props and data attributes without any extra wiring:

```vue
<template>
  <!-- pending renders a Spinner, sets aria-busy/data-pending, and
       suppresses the click handler while true -->
  <Button variant="primary" :pending="isSaving" @click="isSaving = true"> Save </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@hareui/vue'

const isSaving = ref(false)
</script>
```

### 3. Composition Over Configuration — Slots Over Compound Components

HareUI uses named template slots on a single component instead of compound components — rearrange, customize, or omit parts with standard Vue syntax:

```vue
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

Most slots also have a shorthand prop (`title`, `description`, …) for the common case — see each component's Anatomy section.

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

HareUI separates behavior from styles: each component's theme is a [tailwind-variants](https://tailwind-variants.org/) slot object — overridden per-instance with `:ui`, or globally with `createHareUI`:

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

Clear APIs, descriptive prop types, IntelliSense, and stable `data-slot` attributes (`[data-slot=button]`, `[data-slot=card-header]`, …) to target from your own CSS.

### 9. Complete Customization — Design Tokens

Beautiful defaults out of the box. Transform the entire look with CSS variables (`--accent`, `--radius`, `--surface`, …):

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
