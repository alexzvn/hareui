---
title: Select
description: A select displays a collapsible list of options and allows a user to select one or more of them
links:
  reka: popover
  source: select/Select.vue
  styles: select/theme.ts
  heroui: select
---

## Usage

```vue
<script setup lang="ts">
import { Select } from '@hareui/vue'
</script>
```

<ComponentPreview name="select/default" />

## Anatomy

Select renders a [Label](/docs/components/label), a trigger button showing the selected value, a popover holding a [ListBox](/docs/components/list-box), and an optional [Description](/docs/components/description) / [FieldError](/docs/components/field-error). Options use ListBox's `items` format, including sections and separators.

```vue
<template>
  <Select label="State" :items="items">
    <template #label />
    <!-- Label content -->
    <template #value="{ selectedItems, isPlaceholder, text }" />
    <!-- trigger value -->
    <template #clear />
    <!-- clear button content (with `clearable`) -->
    <template #indicator="{ open }" />
    <!-- trigger indicator (default: chevron) -->
    <template #description />
    <!-- Description content -->
    <template #error="validation" />
    <!-- FieldError content -->
    <template #item-leading="{ item, selected }" />
    <!-- ListBox item slots, forwarded -->
    <template #item-indicator="{ selected }" />
    <!-- option checkmark -->
    <template #loading />
    <!-- with `loading`: after the last option -->
  </Select>
</template>
```

| `ui` key      | `data-slot`                                     | Element                                 |
| ------------- | ----------------------------------------------- | --------------------------------------- |
| `base`        | `select`                                        | root `<div>`                            |
| `trigger`     | `select-trigger`                                | `<button>`                              |
| `value`       | `select-value`                                  | `<span>` inside the trigger             |
| `clearButton` | `select-clear-button`                           | `<span aria-hidden>` inside the trigger |
| `indicator`   | `select-indicator` / `select-default-indicator` | chevron                                 |
| `popover`     | `select-popover`                                | popover holding the ListBox             |

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

### Variants

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in Surface components

<ComponentPreview name="select/variants" />

### Full Width

<ComponentPreview name="select/full-width" />

### With Description

<ComponentPreview name="select/with-description" />

### Required

<ComponentPreview name="select/required" />

### Disabled

<ComponentPreview name="select/disabled" />

### With Disabled Options

<ComponentPreview name="select/with-disabled-options" />

### Multiple Select

<ComponentPreview name="select/multiple-select" />

### With Sections

<ComponentPreview name="select/with-sections" />

### Controlled

<ComponentPreview name="select/controlled" />

### Controlled Multiple

<ComponentPreview name="select/controlled-multiple" />

### Controlled Open State

Bind `v-model:open` to open and close the popover from outside.

<ComponentPreview name="select/controlled-open-state" />

### Asynchronous Loading

Bind `loading` and listen to `load-more`: it fires whenever the end of the list scrolls into view while `loading` is false. The `#loading` slot shows after the last option while loading.

<ComponentPreview name="select/asynchronous-loading" />

### Custom Indicator

<ComponentPreview name="select/custom-indicator" />

### With Clear Button

The trigger is a button, so the clear control can't be a nested `<button>`. With `clearable`, Select renders a non-button clear control inside the trigger that doesn't open the menu.

<ComponentPreview name="select/with-clear-button" />

Because ARIA treats the children of a button as presentational, the clear control can't take focus. It is `aria-hidden` and works with the pointer only. With `clearable`, the trigger also clears on `Backspace` or `Delete`, so keyboard and screen reader users can clear the selection. Both paths emit `clear`.

### Custom Value

<ComponentPreview name="select/custom-value" />

### Render Function

Attributes such as `data-custom` fall through to the root.

<ComponentPreview name="select/render-function" />

### In Surface

Inside a [Surface](/docs/components/surface), use `variant="secondary"` for the lower-emphasis look that suits surface backgrounds.

<ComponentPreview name="select/on-surface" />

## Customization

### Tailwind CSS

<ComponentPreview name="select/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { select: { slots: { trigger: 'rounded-lg', popover: 'rounded-lg' } } },
  }),
)
```

## Styling Reference

### Interactive States

- **Hover**: `:hover` or `[data-hovered="true"]` on the trigger
- **Focus**: `:focus-visible` or `[data-focus-visible="true"]` on the trigger
- **Disabled**: `:disabled` or `[data-disabled="true"]` on the select
- **Invalid**: `[data-invalid="true"]` on the select
- **Open**: `[data-open="true"]` on the select and the indicator

## API Reference

### Props

<ApiTable component="Select" kind="props" />

### Slots

<ApiTable component="Select" kind="slots" />

### Emits

<ApiTable component="Select" kind="emits" />

## Theme

<ApiTheme component="Select" />

## Accessibility

Select follows the ARIA listbox pattern:

- The trigger opens the list with click, Enter, Space or the arrow keys; focus moves into the list (to the selected option, else the first one, or the last one with ArrowUp). A mouse press opens on press start, so you can drag onto an option and release to select it
- Typing on the closed trigger selects the first matching option, starting from the selected one (typeahead)
- Closing returns focus to the trigger, unless an outside press moved it to another element
- `aria-labelledby` combines the label and the current value; description and error are linked with `aria-describedby`
- A hidden native `<select>` carries `name`, form data and native `required` validation

## Related Components

<RelatedComponents :components="['list-box', 'label', 'description', 'field-error']" />
