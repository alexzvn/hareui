---
title: Composition
description: Build flexible UI with named slots, scoped slot props, and the as prop.
---

HareUI composes components with named template slots on a single component, plus a `:ui` prop for per-slot classes and an `as` prop to change the rendered element. This page covers the three composition tools you'll use across every component.

## Named Slots

Each component documents its available slots on its own Anatomy section. A slot renders only when you pass content to it (or, for some components, when a shorthand prop like `title` is set) — otherwise the wrapping element is omitted entirely.

```vue
<template>
  <Button>
    <!-- default slot = button label -->
    Save Changes
  </Button>
</template>
```

Named slots replace separate sub-components:

```vue
<template>
  <Card title="Settings">
    Body
    <template #footer>
      <Button>Save</Button>
    </template>
  </Card>
</template>
```

## Scoped Slot Props

Some slots pass internal state to your template as scoped slot props. You can render different content depending on what the component is doing, with no wrapper component.

For example, the `leading`, `default` and `trailing` slots of `Button` all receive `{ pending }`:

```vue
<template>
  <Button :pending="isSaving" @click="isSaving = true">
    <template #leading="{ pending }">
      <span v-if="!pending">✓</span>
    </template>
    {{ isSaving ? 'Saving…' : 'Save' }}
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@hareui/vue'

const isSaving = ref(false)
</script>
```

By default, the `leading` slot shows a `Spinner` while the button is pending. Your own `#leading` content replaces that spinner. Check `pending` yourself if you still want a loading indicator.

## The `as` Prop

`Button`, `Card` and `Chip` accept an `as` prop to change the rendered element. The classes and `data-slot` attributes stay the same:

```vue
<template>
  <!-- Renders an <a> styled as a primary button -->
  <Button as="a" href="/dashboard" variant="primary"> Go to Dashboard </Button>
</template>
```

When `as` is not `"button"`, a disabled `Button` has no native `disabled` attribute. It gets `aria-disabled="true"` and `tabindex="-1"` instead, so it stays accessible as a link.

## Combining Slots, `:ui`, and `as`

All three compose together — swap the element, override one slot's classes, and still use scoped slot props:

```vue
<template>
  <Button as="a" href="/export" :ui="{ base: 'gap-1' }">
    <template #trailing="{ pending }">
      <span v-if="!pending">→</span>
    </template>
    Export
  </Button>
</template>
```

## Custom Components

Compose HareUI primitives into your own components the same way you'd compose any Vue component — no variant-function glue required:

```vue
<template>
  <Tooltip :text="label">
    <Button :aria-label="label" icon-only variant="ghost">
      <slot />
    </Button>
  </Tooltip>
</template>

<!-- components/IconButton.vue -->
<script setup lang="ts">
import { Button, Tooltip } from '@hareui/vue'

defineProps<{ label: string }>()
</script>
```

```vue
<template>
  <IconButton label="Settings">
    <Icon icon="gravity-ui:gear" />
  </IconButton>
</template>
```

## Presets

`defineAlias` makes a preset: a component that renders a HareUI component with your default props, `ui` and `class`. Use it when the same props repeat across the app.

```ts [components/presets.ts]
import { Button, defineAlias } from '@hareui/vue'

export const DangerButton = defineAlias(Button, {
  props: { variant: 'danger', size: 'sm' },
  ui: { label: 'uppercase' },
  class: 'min-w-24',
})
```

```vue
<template>
  <DangerButton label="Delete" />
  <DangerButton variant="primary" label="Archive" :ui="{ label: 'normal-case' }" />
</template>
```

What you pass on the preset wins over its defaults:

- Props and attributes replace the preset's value.
- `ui` merges per slot. Your classes for a slot come after the preset's, so they win on conflicts.
- `class` adds to the preset's classes.
- A listener you pass replaces the preset's listener for the same event.

Slots, `v-model` and template refs pass through to the wrapped component.

A preset has the wrapped component's type, generics included. TypeScript doesn't know which props the preset sets, so a required prop stays required on the preset.

### Registering presets globally

Import a preset where you use it, or register it once with `createHareUI({ components })`:

```ts [main.ts]
import { createHareUI } from '@hareui/vue'
import { createApp } from 'vue'

import App from './App.vue'
import { DangerButton } from './components/presets'

createApp(App)
  .use(createHareUI({ components: { DangerButton } }))
  .mount('#app')
```

Declare the globals so templates type-check them:

```ts [components.d.ts]
import type { DangerButton } from './components/presets'

declare module 'vue' {
  interface GlobalComponents {
    DangerButton: typeof DangerButton
  }
}

export {}
```

To give a component another tag name without changing its defaults, use the Vite plugin's [`aliases`](/docs/getting-started/frameworks#vite-plugin-optional) option instead. It keeps tree-shaking and needs no registration.

## Custom Variants

Extend a component's exported theme config with `tv()` to add variants the original doesn't have, instead of forking the component:

<ComponentPreview name="button/custom-variants" />

See [Styling → Extending Component Themes](/docs/getting-started/styling#extending-component-themes) for how the resolved class merges with the `class` prop.

## Next Steps

- Learn about [Styling](/docs/getting-started/styling) with `class` and `:ui`
- Explore [Animation](/docs/getting-started/animation) with `data-state` selectors
- Browse [Component](/docs/components/button) anatomy sections for each component's slot list
