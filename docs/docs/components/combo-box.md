---
title: ComboBox
description: A combo box combines a text input with a listbox, allowing users to filter a list of options to items matching a query
links:
  reka: combobox
  source: combo-box/ComboBox.vue
  styles: combo-box/theme.ts
  heroui: combo-box
---

## Usage

```vue
<script setup lang="ts">
import { ComboBox } from '@hareui/vue'
</script>
```

<ComponentPreview name="combo-box/default" />

## Anatomy

ComboBox renders a [Label](/docs/components/label), an input group (an [Input](/docs/components/input) and a trigger button), a popover holding a [ListBox](/docs/components/list-box)-styled option list, and an optional [Description](/docs/components/description) / [FieldError](/docs/components/field-error). Options use ListBox's `items` format, including sections and separators.

```vue
<template>
  <ComboBox label="Animal" :items="items">
    <template #label />
    <!-- Label content -->
    <template #indicator="{ open }" />
    <!-- trigger button content (default: chevron) -->
    <!-- Displays the selected values, primarily used for multiple selection -->
    <template #value="{ selectedItems, isPlaceholder, text }" />
    <template #description />
    <!-- Description content -->
    <template #error="validation" />
    <!-- FieldError content -->
    <template #item-leading="{ item, selected }" />
    <!-- ListBox item slots -->
    <template #item-indicator="{ selected }" />
    <!-- option checkmark -->
    <template #section-label="{ section }" />
    <!-- section header -->
    <template #empty />
    <!-- with `allows-empty-collection` -->
    <template #loading />
    <!-- with `loading`: after the last option -->
  </ComboBox>
</template>
```

| `ui` key     | `data-slot`             | Element                                           |
| ------------ | ----------------------- | ------------------------------------------------- |
| `base`       | `combo-box`             | root `<div>`                                      |
| `label`      | `label`                 | Label                                             |
| `inputGroup` | `combo-box-input-group` | `<div role="group">` around the input and trigger |
| `input`      | `input`                 | `<input role="combobox">` (Input styles)          |
| `trigger`    | `combo-box-trigger`     | `<button>` opening the popover                    |
| `value`      | `combo-box-value`       | selected values (multiple mode or `#value`)       |
| `popover`    | `combo-box-popover`     | popover holding the list                          |

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

### Full Width

<ComponentPreview name="combo-box/full-width" />

### With Description

<ComponentPreview name="combo-box/with-description" />

### Required

<ComponentPreview name="combo-box/required" />

### Disabled

<ComponentPreview name="combo-box/disabled" />

### With Disabled Options

<ComponentPreview name="combo-box/with-disabled-options" />

### With Sections

<ComponentPreview name="combo-box/with-sections" />

### Controlled

<ComponentPreview name="combo-box/controlled" />

### Controlled Input Value

Bind `v-model:input-value` to read or set the text in the input.

<ComponentPreview name="combo-box/controlled-input-value" />

### Asynchronous Loading

Bind `v-model:input-value` to refetch as the user types and set `:filter="false"` so the fetched `items` are shown as they are. Bind `loading` and listen to `load-more`: it fires whenever the end of the list scrolls into view while `loading` is false. The `#loading` slot shows after the last option while loading.

<ComponentPreview name="combo-box/asynchronous-loading" />

### Default Selected Key

<ComponentPreview name="combo-box/default-selected-key" />

### Allows Custom Value

<ComponentPreview name="combo-box/allows-custom-value" />

### Custom Indicator

<ComponentPreview name="combo-box/custom-indicator" />

### Custom Value

<ComponentPreview name="combo-box/custom-value" />

### Custom Filtering

Pass `filter` to replace the default case- and accent-insensitive "contains" match.

<ComponentPreview name="combo-box/custom-filtering" />

### Render Function

HeroUI's `render` prop has no HareUI equivalent; attributes such as `data-custom` fall through to the root.

<ComponentPreview name="combo-box/render-function" />

### Menu Trigger

Use the `menu-trigger` prop to control when the popover opens:

- `focus` (default): popover opens when the user focuses the input
- `input`: popover opens when the user edits the input text
- `manual`: popover only opens when the user presses the trigger button or uses the arrow keys

<ComponentPreview name="combo-box/menu-trigger" />

### Form Value

Use the `form-value` prop to control whether the selected item's value or text is submitted in forms. `key` is the default. When `allows-custom-value` is set, the text is always submitted.

<ComponentPreview name="combo-box/form-value" />

### Validation Behavior

Use the `validation-behavior` prop to control how validation is displayed:

- `native` (default): blocks form submission when the value is missing or invalid
- `aria`: shows errors in realtime and does not block submission

<ComponentPreview name="combo-box/validation-behavior" />

### Custom Validation

Use the `validate` prop to return an error message when the value is invalid, or `true` when it is valid. It receives `{ inputValue, value, selectedKey }`.

<ComponentPreview name="combo-box/custom-validation" />

### Read Only

Use the `readonly` prop to make the ComboBox read-only. The selected value can be focused, but it cannot be changed.

<ComponentPreview name="combo-box/read-only" />

### Multiple Selection

Set `selection-mode="multiple"` to allow selecting more than one option. `v-model` is then an array, and the selected values are listed below the input (`value-placeholder` while empty; customize with `#value`).

<ComponentPreview name="combo-box/multiple-selection" />

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="combo-box/on-surface" />

## Customization

### Tailwind CSS

<ComponentPreview name="combo-box/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: {
      comboBox: {
        slots: {
          inputGroup: 'rounded-lg',
          trigger: 'text-muted',
          popover: 'rounded-lg border border-border bg-surface p-2',
        },
      },
    },
  }),
)
```

## Styling Reference

### Interactive States

- **Hover**: `:hover` or `[data-hovered="true"]` on the trigger
- **Focus**: `:focus` on the input, `[data-focus-visible="true"]` on the input group
- **Disabled**: `:disabled` or `[data-disabled="true"]` on the combo box and the trigger
- **Invalid**: `[data-invalid="true"]` on the combo box
- **Open**: `[data-open="true"]` on the combo box and the trigger

## API Reference

### Props

<ApiTable component="ComboBox" kind="props" />

### Slots

<ApiTable component="ComboBox" kind="slots" />

### Emits

<ApiTable component="ComboBox" kind="emits" />

## Theme

<ApiTheme component="ComboBox" />

## Accessibility

ComboBox follows the ARIA combobox pattern:

- Focus stays in the input; the arrow keys, Home / End and Page Up / Page Down move a virtual focus through the options (`aria-activedescendant`), Enter selects, Escape reverts the text and closes
- Typing filters the options; on blur, text that matches no option reverts to the selected option (unless `allows-custom-value`). Clearing the text clears the selection
- The trigger button is not in the tab order and keeps focus in the input
- The label, description and error are linked to the input with `aria-labelledby` / `aria-describedby`
- With `name`, the selected value (or text) is submitted with forms; `required` uses native validation

## Related Components

<RelatedComponents :components="['list-box', 'popover', 'input']" />
