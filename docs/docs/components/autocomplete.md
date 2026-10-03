---
title: Autocomplete
description: An autocomplete combines a select with filtering, allowing users to search and select from a list of options
links:
  reka: listbox
  source: autocomplete/Autocomplete.vue
  styles: autocomplete/theme.ts
  heroui: autocomplete
---

## Usage

```vue
<script setup lang="ts">
import { Autocomplete } from '@hareui/vue'
</script>
```

<ComponentPreview name="autocomplete/default" />

## Anatomy

Autocomplete is a [Select](/docs/components/select) whose popover starts with a search field that filters the options. It renders a [Label](/docs/components/label), a trigger showing the selected value, a popover holding a [SearchField](/docs/components/search-field)-styled input and a [ListBox](/docs/components/list-box)-styled option list, and an optional [Description](/docs/components/description) / [FieldError](/docs/components/field-error). Options use ListBox's `items` format, including sections and separators.

```vue
<template>
  <Autocomplete label="State" :items="items" clearable>
    <template #label />                                  <!-- Label content -->
    <template #value="{ selectedItems, isPlaceholder, text }" /> <!-- trigger value -->
    <template #clear />                                  <!-- clear button content (with `clearable`) -->
    <template #indicator="{ open }" />                   <!-- trigger indicator (default: chevron) -->
    <template #description />                            <!-- Description content -->
    <template #error="validation" />                     <!-- FieldError content -->
    <template #search-trailing="{ inputValue }" />       <!-- after the search input -->
    <template #item-leading="{ item, selected }" />      <!-- ListBox item slots -->
    <template #item-indicator="{ selected }" />          <!-- option checkmark -->
    <template #section-label="{ section }" />            <!-- section header -->
    <template #empty />                                  <!-- no matching option -->
    <template #loading />                                <!-- with `loading`: after the last option -->
  </Autocomplete>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `autocomplete` | root `<div>` |
| `label` | `label` | Label |
| `trigger` | `autocomplete-trigger` | `<div role="group">` holding the value, clear button and indicator button |
| `value` | `autocomplete-value` | `<span>` inside the trigger |
| `clearButton` | `autocomplete-clear-button` | `<button>` (with `clearable`) |
| `indicator` | `autocomplete-indicator` / `autocomplete-default-indicator` | chevron |
| `popover` | `autocomplete-popover` | popover |
| `searchField`, `searchGroup`, `searchIcon`, `searchInput`, `searchClearButton` | `search-field*` | the search field (with `search`) |
| `listBox` | `list-box` | the option list |

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

The Autocomplete component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in Surface components

<ComponentPreview name="autocomplete/variants" />

### Full Width

<ComponentPreview name="autocomplete/full-width" />

### With Description

<ComponentPreview name="autocomplete/with-description" />

### Required

<ComponentPreview name="autocomplete/required" />

### Disabled

<ComponentPreview name="autocomplete/disabled" />

### With Disabled Options

<ComponentPreview name="autocomplete/with-disabled-options" />

### Allows Empty Collection

The `allows-empty-collection` prop enables the autocomplete to function even when there are no items in the collection. This is useful for scenarios where the list might be empty initially or when all items are filtered out.

<ComponentPreview name="autocomplete/allows-empty-collection" />

### With Sections

<ComponentPreview name="autocomplete/with-sections" />

### Multiple Select

In multiple mode the trigger lists the selected labels as text by default. For richer layouts such as removable tags, render your own content from `selectedItems` in the `#value` slot, as shown below.

<ComponentPreview name="autocomplete/multiple-select" />

### Controlled

<ComponentPreview name="autocomplete/controlled" />

### Controlled Multiple

<ComponentPreview name="autocomplete/controlled-multiple" />

### Controlled Open State

<ComponentPreview name="autocomplete/controlled-open-state" />

### Asynchronous Filtering

Bind `v-model:input-value` to fetch on every search and set `:filter="false"` so the fetched `items` are shown as they are. The `#search-trailing` slot holds the spinner.

<ComponentPreview name="autocomplete/asynchronous-filtering" />

### Custom Indicator

<ComponentPreview name="autocomplete/custom-indicator" />

### Custom Value

You can customize the displayed value with the `#value` slot:

<ComponentPreview name="autocomplete/custom-value" />

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="autocomplete/on-surface" />

### Virtualization

Set `virtualize` to render only the rows in view, for efficient rendering of large datasets. Pass `{ estimateSize }` with the row height in pixels (default 50); sections and separators aren't rendered in this mode. Here the 1,000 users are filtered on name or email with `:filter="false"` and `v-model:input-value`.

<ComponentPreview name="autocomplete/virtualization" />

## Advanced Examples

### User Selection

<ComponentPreview name="autocomplete/user-selection" />

### User Selection Multiple

<ComponentPreview name="autocomplete/user-selection-multiple" />

### Location Search

<ComponentPreview name="autocomplete/location-search" />

### Tag Group Selection

Set `:search="false"` to drop the search field; the list then takes focus as in [Select](/docs/components/select).

<ComponentPreview name="autocomplete/tag-group-selection" />

### Email Recipients

<ComponentPreview name="autocomplete/email-recipients" />

## Customization

### Tailwind CSS

<ComponentPreview name="autocomplete/custom-styles" />

### Global Configuration

```ts
app.use(createHareUI({
  ui: {
    autocomplete: {
      slots: {
        trigger: 'rounded-lg border border-border bg-surface p-2',
        value: 'text-current',
        clearButton: 'text-muted hover:text-foreground',
        indicator: 'text-muted',
        popover: 'rounded-lg border border-border bg-surface p-2',
      },
    },
  },
}))
```

## Styling Reference

### Interactive States

- **Hover**: `:hover` or `[data-hovered="true"]` on the trigger
- **Focus**: `[data-focus-visible="true"]` on the trigger
- **Disabled**: `[data-disabled="true"]` on the autocomplete and the trigger
- **Invalid**: `[data-invalid="true"]` on the autocomplete
- **Placeholder**: `[data-placeholder="true"]` on the value
- **Empty**: `[data-empty="true"]` on the clear button when nothing is selected
- **Open**: `[data-open="true"]` on the autocomplete and the indicator

## API Reference

### Props

<ApiTable component="Autocomplete" kind="props" />

### Slots

<ApiTable component="Autocomplete" kind="slots" />

### Emits

<ApiTable component="Autocomplete" kind="emits" />

### Theme

<ApiTheme component="Autocomplete" />

## Accessibility

Autocomplete follows the ARIA select-only pattern with a filter field:

- The trigger button opens the popover with click, Enter, Space or the arrow keys; a mouse press opens on press start, so you can drag onto an option and release to select it. Typing on the closed trigger selects the next matching option
- Focus moves into the search field; the arrow keys, Home / End and Page Up / Page Down move a virtual focus through the options (`aria-activedescendant`), Enter selects
- Escape clears the search text first, then closes the popover and returns focus to the trigger
- The clear button is excluded from the tab order; with `clearable`, Backspace / Delete on the trigger also clears
- A hidden native `<select>` carries `name`, form data and native `required` validation

## Related Components

<RelatedComponents :components="['list-box', 'popover', 'input']" />
