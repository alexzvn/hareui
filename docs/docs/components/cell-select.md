---
title: CellSelect
description: 'A select that fits in one settings row: the label at the start, the value at the end.'
links:
  reka: popover
  source: cell-select/CellSelect.vue
  styles: cell-select/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { CellSelect } from '@hareui/vue'
</script>
```

<ComponentPreview name="cell-select/basic" />

## Anatomy

CellSelect is a [Select](/docs/components/select) laid out as one row: the label at the start, the value and a chevrons icon at the end. The popover opens below the row, aligned to its end. It takes Select's `items`, `v-model`, form and popover props and its item slots. The row label replaces `#leading`.

```vue
<template>
  <CellSelect label="…" :items="…">
    <template #label />
    <!-- row label content -->
    <template #value />
    <!-- value content (receives selectedItems, isPlaceholder, text) -->
    <template #indicator />
    <!-- indicator content (default: chevrons icon) -->
  </CellSelect>
</template>
```

| `ui` key    | `data-slot`         | Element                                                  |
| ----------- | ------------------- | -------------------------------------------------------- |
| `base`      | `cell-select`       | `<div>` root                                             |
| `trigger`   | `select-trigger`    | `<button>` row                                           |
| `label`     | `cell-select-label` | `<span>` row label (when `label` or `#label` is set)     |
| `value`     | `select-value`      | `<span>` selected value                                  |
| `indicator` | `select-indicator`  | `<span>` chevrons icon                                   |
| `popover`   | `select-popover`    | popover holding the [ListBox](/docs/components/list-box) |

## Examples

### Controlled

Bind the selection with `v-model` and use it elsewhere. Here the footer converts a fare into the chosen currency.

<ComponentPreview name="cell-select/controlled" />

### Custom Value

Use the `#value` slot to render more than the option text, here an icon for the shipping method. `#item-leading` adds the same icon to each option. Hide the chevrons with `ui.indicator` when the value carries its own marker.

<ComponentPreview name="cell-select/custom-value" />

### Disabled

`disabled` locks the row and keeps it from opening.

<ComponentPreview name="cell-select/disabled" />

### Font Family

Render the value and each option in its own font with the `#value` and `#item` slots. The code sample below follows the selection.

<ComponentPreview name="cell-select/font-family" />

### Settings Group

Give each row its own setting and stack them in a card. The rows use `secondary` because they sit on a surface.

<ComponentPreview name="cell-select/settings-group" />

### Variants

`default` has a field background and shadow for the page. Use `secondary` on surfaces such as cards.

<ComponentPreview name="cell-select/variants" />

## Customization

### Tailwind CSS

Pass classes per part with `ui`:

```vue
<template>
  <CellSelect
    :items="items"
    label="Tab size"
    :ui="{ trigger: 'rounded-full', value: 'text-accent' }"
  />
</template>
```

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { cellSelect: { slots: { trigger: 'h-10', label: 'font-semibold' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="cell-select"]`: root container
- `trigger` → `[data-slot="select-trigger"]`: the row (`h-9`, `rounded-field`, `px-3`, `gap-3`)
- `label` → `[data-slot="cell-select-label"]`: leading text, truncated when long
- `value` → `[data-slot="select-value"]`: selected value in `text-muted`; shares the row width with the label and truncates
- `indicator` → `[data-slot="select-indicator"]`: 12px chevrons icon; it doesn't rotate when open
- `popover` → `[data-slot="select-popover"]`: at least as wide as the row

The root is named `cell-select`; the other parts keep the [Select](/docs/components/select) names, and their classes are merged over the Select theme. The row background follows `--cell-bg-current`, so a plain `bg-*` class in `ui.trigger` wins in every state. The `secondary` variant sets `--cell-bg` and `--cell-bg-focus`.

### Interactive States

- **Open**: `[data-open="true"]` on the root and the indicator, `[data-pressed="true"]` on the row
- **Disabled**: `[data-disabled="true"]` on the root and the row
- **Invalid**: `[data-invalid="true"]` on the root
- **Hovered**: `[data-hovered="true"]` on the row
- **Focus Visible**: `[data-focus-visible="true"]` on the row

## API Reference

### Props

<ApiTable component="CellSelect" kind="props" />

### Slots

<ApiTable component="CellSelect" kind="slots" />

### Emits

<ApiTable component="CellSelect" kind="emits" />

### Theme

<ApiTheme component="CellSelect" />

## Accessibility

- The row is a `<button>` with `aria-haspopup="listbox"`; its name is the row label followed by the value
- The listbox is labelled by the row label
- Keyboard: <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>↓</kbd> and <kbd>↑</kbd> open the popover, typing on the closed row selects the matching option, <kbd>Escape</kbd> closes and returns focus to the row
- A hidden native `<select>` carries `name` and `required` for forms

## Related Components

<RelatedComponents :components="['select', 'cell-switch', 'cell-slider', 'cell-color-picker']" />
