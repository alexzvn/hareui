---
title: Breadcrumbs
description: Navigation breadcrumbs showing the current page's location within a hierarchy
links:
  source: Breadcrumbs.vue
  styles: breadcrumbs.ts
  heroui: breadcrumbs
---

## Usage

```vue
<script setup lang="ts">
import { Breadcrumbs } from '@hareui/vue'
</script>
```

<ComponentPreview name="breadcrumbs/basic" />

## Anatomy

HeroUI's `Breadcrumbs.Item` children become an `items` array. The last item is the current page.

```vue
<script setup lang="ts">
import { Breadcrumbs } from '@hareui/vue'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Category', href: '#' },
  { label: 'Current Page' },
]
</script>

<template>
  <Breadcrumbs :items="items">
    <template #item="{ item, index, current }" />  <!-- replaces an item's label -->
    <template #separator="{ item, index }" />      <!-- replaces the chevron -->
  </Breadcrumbs>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `breadcrumbs` | `<ol>` root |
| `item` | `breadcrumbs-item` | `<li>` per item (an item's `class` is merged here) |
| `link` | `link` | the item's [Link](/docs/components/link) |
| `separator` | `breadcrumbs-separator` | separator icon between items |

## Examples

### Navigation Levels

<ComponentPreview name="breadcrumbs/level-2" />

<ComponentPreview name="breadcrumbs/level-3" />

### Disabled State

<ComponentPreview name="breadcrumbs/disabled" />

### Custom Separator

A single root element in `#separator` receives the separator classes, like HeroUI's `separator` element.

<ComponentPreview name="breadcrumbs/custom-separator" />

## Customization

### Tailwind CSS

<ComponentPreview name="breadcrumbs/custom-styles" />

### Global Configuration

To customize the Breadcrumbs classes for the whole app, extend the `breadcrumbs` theme in `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    breadcrumbs: {
      slots: {
        base: 'gap-4 text-lg',
        link: 'font-semibold',
        separator: 'text-blue-500',
      },
    },
  },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="breadcrumbs"]` – base breadcrumbs container
- `item` → `[data-slot="breadcrumbs-item"]` – individual breadcrumb item wrapper
- `link` → `[data-slot="breadcrumbs-item"] [data-slot="link"]` – breadcrumb link element
- `separator` → `[data-slot="breadcrumbs-separator"]` – separator icon between items

#### State Attributes

- `[data-slot="link"][data-current="true"]` – current page indicator (not a link)

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Current**: `[data-current="true"]` on link (indicates current page)
- **Hover**: Link elements support standard hover states
- **Disabled**: `disabled` prop disables all links

## API Reference

### Props

<ApiTable component="Breadcrumbs" kind="props" />

### Slots

<ApiTable component="Breadcrumbs" kind="slots" />

## Accessibility

- The root is an `<ol>` labelled "Breadcrumbs"; every item is an `<li>`.
- The current page (the last item) is a non-interactive `role="link"` element with `aria-current="page"`.
- Disabled links render without `href` and with `aria-disabled="true"`.

## Related Components

<RelatedComponents :components="['link', 'separator', 'tabs']" />
