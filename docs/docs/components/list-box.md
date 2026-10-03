---
title: ListBox
description: A listbox displays a list of options and allows a user to select one or more of them
links:
  reka: listbox
  source: list-box/ListBox.vue
  styles: list-box/theme.ts
  heroui: list-box
---

## Usage

```vue
<script setup lang="ts">
import { ListBox } from '@hareui/vue'
</script>
```

<ComponentPreview name="list-box/default" />

## Anatomy

ListBox takes an `items` array. Each entry is an item (`{ value, label, description, disabled, variant, textValue, class }`), a section (`{ type: 'section', label, items }`) or a separator (`{ type: 'separator' }`). Each item renders a [Label](/docs/components/label), a [Description](/docs/components/description) and a checkmark indicator; slots replace any part.

```vue
<template>
  <ListBox :items="items">
    <template #item-leading="{ item, selected }" />      <!-- before the text (avatar, icon) -->
    <template #item-label="{ item }" />                  <!-- Label content -->
    <template #item-description="{ item }" />            <!-- Description content -->
    <template #item-trailing="{ item }" />               <!-- after the text (shortcut) -->
    <template #indicator="{ selected }" />               <!-- indicator content (default: checkmark) -->
    <template #item="{ item, index, selected, disabled }" /> <!-- whole item content -->
    <template #section-label="{ section }" />            <!-- section header -->
    <template #empty />                                  <!-- shown when items is empty -->
  </ListBox>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `list-box` | `<div role="listbox">` root |
| `item` | `list-box-item` | `<div role="option">` |
| `indicator` | `list-box-item-indicator` | checkmark wrapper |
| `section` | — | `<section>` per section |
| `header` | `header` | `<header>` section label |
| `separator` | `separator` | `<hr>` |
| `emptyState` | `empty-state` | `<div>` (iff `items` is empty and `#empty` given) |

### Typing items

`items` takes the exported `ListBoxItem` type (`ListBoxEntry` when it mixes in sections and separators). Extra fields are kept: extend the type, and the slots receive your type, so no casts are needed.

```ts
import type { ListBoxItem } from '@hareui/vue'

interface MyItem extends ListBoxItem {
  icon: string
}

const items: MyItem[] = [/* ... */]
// <template #item-leading="{ item }"> — item.icon is a string
```

## Examples

### With Disabled Items

<ComponentPreview name="list-box/with-disabled-items" />

### With Sections

<ComponentPreview name="list-box/with-sections" />

### Multi Select

<ComponentPreview name="list-box/multi-select" />

### Controlled

<ComponentPreview name="list-box/controlled" />

### Virtualization

`virtualize` renders only the visible rows through Reka's `ListboxVirtualizer`. The root must scroll (give it a height and `overflow-y-auto`), and `items` must be flat. Pass `{ estimateSize, overscan }` to tune the row height estimate.

<ComponentPreview name="list-box/virtualization" />

### Custom Check Icon

<ComponentPreview name="list-box/custom-check-icon" />

### Render Function

HeroUI's `render` prop has no HareUI equivalent; attributes such as `data-custom` fall through to the root.

<ComponentPreview name="list-box/render-function" />

### Scrollbar Modes

<ComponentPreview name="list-box/release-scrollbar-modes" />

## Customization

### Tailwind CSS

<ComponentPreview name="list-box/custom-styles" />

### Global Configuration

```ts
app.use(createHareUI({
  ui: { listBox: { slots: { base: 'rounded-lg border border-border p-2', item: 'rounded px-2 py-1' } } },
}))
```

## Styling Reference

### Interactive States

- **Hover**: `:hover` or `[data-hovered="true"]` on the item
- **Focus**: `:focus-visible` or `[data-focus-visible="true"]` on the item
- **Selected**: `[data-selected="true"]` on the item
- **Disabled**: `[data-disabled]` on the item
- **Danger**: `variant: 'danger'` on an item

## API Reference

### Props

<ApiTable component="ListBox" kind="props" />

### Slots

<ApiTable component="ListBox" kind="slots" />

### Emits

<ApiTable component="ListBox" kind="emits" />

### Theme

<ApiTheme component="ListBox" />

## Accessibility

Built on Reka's Listbox, which implements the ARIA listbox pattern:

- Arrow keys, Home/End, PageUp/PageDown and typeahead navigation (Space continues a typeahead search)
- In `multiple` mode, Shift+Arrow/Home/End/Space and Shift+click select a range from the last selected item, and Meta/Ctrl+A selects every enabled item
- Escape clears the selection; set `escape-key-behavior="none"` to leave Escape to a surrounding popover
- `highlight-on-hover` makes the hovered option the focused one, as in Select's popover
- `aria-selected` on selectable options, `aria-multiselectable` in multiple mode
- Disabled items are skipped by keyboard navigation

## Related Components

<RelatedComponents :components="['label', 'description', 'surface', 'separator']" />
