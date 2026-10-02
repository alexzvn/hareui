---
title: DisclosureGroup
description: Container that manages multiple Disclosure items with coordinated expanded states
links:
  source: DisclosureGroup.vue
  styles: disclosureGroup.ts
  heroui: disclosure-group
---

## Usage

```vue
<script setup lang="ts">
import { DisclosureGroup } from 'herouse'
</script>
```

<ComponentPreview name="disclosure-group/basic" minHeight="580px" />

## Anatomy

```vue
<template>
  <DisclosureGroup v-model="expanded">
    <Disclosure value="item1" title="…">
      <!-- optional: <template #trigger="{ open, indicator }" /> -->
      …
    </Disclosure>
  </DisclosureGroup>
</template>
```

Each `Disclosure` inside the group is identified by its `value` (HeroUI's `id`); the group's
`v-model` holds the expanded values. Anything else can sit between the disclosures (e.g. a
`Separator`).

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `disclosure-group` | root element |

## Examples

### Controlled

You can control which disclosures are expanded with external navigation controls using `v-model`
and the `useDisclosureGroupNavigation` composable.

<ComponentPreview name="disclosure-group/controlled" minHeight="580px" />

## Customization

### Tailwind CSS

<ComponentPreview name="disclosure-group/custom-styles" />

### Global Configuration

To customize the DisclosureGroup classes for the whole app, extend the `disclosureGroup` theme in `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    disclosureGroup: {
      slots: {
        base: 'w-full [contain:layout_style]',
      },
    },
  },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="disclosure-group"]` – base container styles with layout containment

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Disabled**: `[data-disabled="true"]` on the group; every child Disclosure's trigger gets `:disabled`
- **Expanded Management**: Automatically manages `[data-expanded]` states on child Disclosure items

## API Reference

### Props

<ApiTable component="DisclosureGroup" kind="props" />

### Slots

<ApiTable component="DisclosureGroup" kind="slots" />

### Emits

<ApiTable component="DisclosureGroup" kind="emits" />

### useDisclosureGroupNavigation

| Option | Type | Default | Description |
|------|------|---------|-------------|
| `expandedKeys` | `MaybeRefOrGetter<ExpandedValue[]>` | - | The current `v-model` value |
| `itemIds` | `MaybeRefOrGetter<ExpandedValue[]>` | - | Every disclosure's `value`, in display order |
| `onExpandedChange` | `(keys: ExpandedValue[]) => void` | - | Called with the new expanded values |
| `multiple` | `MaybeRefOrGetter<boolean>` | `false` | Keep previously expanded disclosures open while navigating |

Returns `currentIndex`, `isPrevDisabled`, `isNextDisabled` (computed refs) and `onPrevious`, `onNext`.

## Related Components

- [Accordion](/docs/components/accordion)
- [Disclosure](/docs/components/disclosure)
- [Button](/docs/components/button)
- [Separator](/docs/components/separator)
