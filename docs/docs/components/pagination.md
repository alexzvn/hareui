---
title: Pagination
description: Page navigation with composable page links, previous/next buttons, and ellipsis indicators
links:
  source: Pagination.vue
  styles: pagination.ts
  heroui: pagination
---

## Usage

```vue
<script setup lang="ts">
import { Pagination } from 'herouse'
</script>
```

<ComponentPreview name="pagination/basic" />

## Anatomy

HeroUI composes `Pagination.Summary`, `Pagination.Content`, `Pagination.Item`, `Pagination.Link`,
`Pagination.Previous` / `Pagination.Next` (with `PreviousIcon` / `NextIcon`) and
`Pagination.Ellipsis` by hand. herouse renders the same markup from `total` and `v-model:page`:

```vue
<template>
  <Pagination v-model:page="page" :total="10" ellipsis>
    <template #summary="{ page, total }">Showing 1-10 of 100 results</template>
    <template #link="{ page, active }" />  <!-- replaces a page number -->
    <template #prevIcon />                 <!-- Pagination.PreviousIcon children -->
    <template #nextIcon />                 <!-- Pagination.NextIcon children -->
  </Pagination>
</template>
```

- `ellipsis` collapses distant pages (first, last, current ± 1), the pattern HeroUI's demos build;
  `pages` takes any exact list of numbers and `'ellipsis'` entries.
- `prev-label` / `next-label` set the button text (empty = icon only); `prev-disabled` /
  `next-disabled` override the first/last-page defaults.

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `pagination` | `<nav>` root |
| `summary` | `pagination-summary` | info text (only with `#summary`) |
| `content` | `pagination-content` | `<ul>` of items |
| `item` | `pagination-item` | `<li>` per entry |
| `link` | `pagination-link`, `pagination-previous`, `pagination-next` | page and previous/next buttons |
| `nav` | `pagination-previous`, `pagination-next` | extra classes for previous/next (HeroUI's `pagination__link--nav`) |
| `icon` | `pagination-previous-icon`, `pagination-next-icon` | icon wrappers |
| `ellipsis` | `pagination-ellipsis` | ellipsis indicator |

## Examples

### Sizes

<ComponentPreview name="pagination/sizes" />

### Disabled

<ComponentPreview name="pagination/disabled" />

### Simple (Previous / Next)

<ComponentPreview name="pagination/simple-prev-next" />

### Controlled

<ComponentPreview name="pagination/controlled" />

### With Ellipsis

<ComponentPreview name="pagination/with-ellipsis" />

### With Summary

<ComponentPreview name="pagination/with-summary" />

### Custom Icons

You can replace the default chevron icons with the `#prevIcon` and `#nextIcon` slots.

<ComponentPreview name="pagination/custom-icons" />

## Customization

### Tailwind CSS

<ComponentPreview name="pagination/custom-styles" />

### Global Configuration

To customize the Pagination classes for the whole app, extend the `pagination` theme in `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    pagination: {
      slots: {
        base: 'gap-8',
        link: 'rounded-md',
        summary: 'text-xs font-semibold',
      },
    },
  },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="pagination"]` – root navigation container with flex layout
- `summary` → `[data-slot="pagination-summary"]` – left-side info text container
- `content` → `[data-slot="pagination-content"]` – container for pagination items
- `item` → `[data-slot="pagination-item"]` – individual item wrapper
- `link` → `[data-slot="pagination-link"]` – page number button (ghost button style)
- `nav` → `[data-slot="pagination-previous"]`, `[data-slot="pagination-next"]` – navigation button modifier
- `ellipsis` → `[data-slot="pagination-ellipsis"]` – ellipsis indicator

#### Variants

- `size="sm"` – small size variant
- `size="md"` – medium size variant (default)
- `size="lg"` – large size variant

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Active page**: `[data-active="true"]` or `[aria-current="page"]`
- **Hover**: `:hover`
- **Focus**: `:focus-visible`
- **Disabled**: `:disabled` or `[data-disabled="true"]`
- **Pressed**: `:active`

## API Reference

### Props

<ApiTable component="Pagination" kind="props" />

### Slots

<ApiTable component="Pagination" kind="slots" />

### Emits

<ApiTable component="Pagination" kind="emits" />

## Accessibility

- Semantic `<nav>` element with `aria-label="pagination"` and `role="navigation"`
- Active page indicated via `aria-current="page"` on the current link
- Keyboard navigation via Tab key through all interactive elements
- Focus ring on keyboard navigation via `:focus-visible`
- Ellipsis marked with `aria-hidden="true"` to avoid screen reader confusion
- Icon-only previous/next buttons get an `aria-label`
- Disabled buttons use the native `disabled` attribute

## Related Components

<RelatedComponents :components="['button', 'link']" />
