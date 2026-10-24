---
title: Composition
description: Build flexible UI with named slots, scoped slot props, and the as prop.
---

HareUI replaces HeroUI's compound-component pattern (`Card.Header`, `Alert.Icon`, …) with named template slots on a single component, plus a `:ui` prop for per-slot classes and an `as` prop to change the rendered element. This page covers the three composition tools you'll use across every component.

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

Compare to HeroUI's compound parts:

::: code-group

```tsx [HeroUI (React)]
import { Card } from '@heroui/react'

;<Card>
  <Card.Header>
    <Card.Title>Settings</Card.Title>
  </Card.Header>
  <Card.Content>Body</Card.Content>
  <Card.Footer>
    <Card.Footer.Action>Save</Card.Footer.Action>
  </Card.Footer>
</Card>
```

```vue [HareUI (Vue)]
<template>
  <Card title="Settings">
    Body
    <template #footer>
      <Button>Save</Button>
    </template>
  </Card>
</template>
```

:::

## Scoped Slot Props

Some slots expose internal state as scoped slot props, so you can render different content depending on what the component is doing — no render-prop wrapper needed. `Button`'s `leading`, `default`, and `trailing` slots all receive `{ pending }`:

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

By default the `leading` slot renders a `Spinner` while `pending` is true — overriding the slot replaces that default entirely, so check `pending` yourself if you still want a loading indicator.

## The `as` Prop

Components with a non-interactive root (`Button`, `Card`, `Chip`) accept an `as` prop to change the rendered element while keeping the same classes and `data-slot` attributes:

```vue
<template>
  <!-- Renders an <a> styled as a primary button -->
  <Button as="a" href="/dashboard" variant="primary"> Go to Dashboard </Button>
</template>
```

When `as` is not `"button"`, `Button` swaps the native `disabled` attribute for `aria-disabled="true"` + `tabindex="-1"` so the element stays accessible as a link.

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

## Custom Variants

Extend a component's exported theme config with `tv()` to add variants the original doesn't have, instead of forking the component:

<ComponentPreview name="button/custom-variants" />

See [Styling → Extending Component Themes](/docs/getting-started/styling#extending-component-themes) for how the resolved class merges with the `class` prop.

## Next Steps

- Learn about [Styling](/docs/getting-started/styling) with `class` and `:ui`
- Explore [Animation](/docs/getting-started/animation) with `data-state` selectors
- Browse [Component](/docs/components/button) anatomy sections for each component's slot list
