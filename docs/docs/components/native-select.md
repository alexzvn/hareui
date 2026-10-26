---
title: NativeSelect
description: "The browser's `<select>`, themed, keeping native keyboard and mobile pickers."
links:
  source: native-select/NativeSelect.vue
  styles: native-select/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'
</script>
```

<ComponentPreview name="native-select/basic" />

Use NativeSelect when the platform picker is the better fit: on mobile, in long forms, or where a custom popover is too heavy. For a styled dropdown list, use [Select](/docs/components/select).

## Anatomy

NativeSelect renders a [Label](/docs/components/label), a trigger holding the `<select>` and a chevron, then a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error). Options come from the `items` prop, the default slot, or both.

```vue
<template>
  <NativeSelect label="…" description="…" error-message="…" placeholder="…" :items="…">
    <option value="…">…</option>
    <!-- extra options, after `items` -->
    <optgroup label="…">…</optgroup>
    <template #label />
    <!-- Label content -->
    <template #indicator />
    <!-- icon at the end (default: chevron) -->
    <template #description />
    <!-- Description content -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
  </NativeSelect>
</template>
```

| `ui` key    | `data-slot`               | Element                                                                                                        |
| ----------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`      | `native-select`           | `<div>` root                                                                                                   |
| —           | `label`                   | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `trigger`   | `native-select-trigger`   | `<div>` positioning the select and indicator                                                                   |
| `select`    | `native-select-select`    | `<select>`                                                                                                     |
| `indicator` | `native-select-indicator` | `<span aria-hidden>` holding the icon                                                                          |
| —           | `description`             | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —           | `field-error`             | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

An item is a string, an option object `{ value, label?, disabled? }`, or a group `{ label, items, disabled? }` rendered as an `<optgroup>`. `placeholder` adds a first option with an empty value.

## Examples

### Controlled

Bind the selected value with `v-model`. The value is always a string; the placeholder option sets it to `''`.

<ComponentPreview name="native-select/controlled" />

### Custom Indicator

Replace the chevron with the `#indicator` slot.

<ComponentPreview name="native-select/custom-indicator" />

### Disabled Select

<ComponentPreview name="native-select/disabled" />

### Form Example

The `<select>` takes part in native form submission under its `name`. With `required`, submitting while the placeholder is selected blocks the form and shows the error.

<ComponentPreview name="native-select/form-example" />

### Full Width

`full-width` stretches the select to its container.

<ComponentPreview name="native-select/full-width" />

### Invalid State

Set `invalid` with `error-message` to control the state yourself, or validate with `required`, a `validate` function, or a surrounding [Form](/docs/components/form). The description is hidden while the error shows.

<ComponentPreview name="native-select/invalid" />

### Variants

- **`primary`** (default): field background with a shadow.
- **`secondary`**: default background without a shadow. Use it on surfaces.

<ComponentPreview name="native-select/variants" />

### With Description

<ComponentPreview name="native-select/with-description" />

### With Disabled Options

Disable an option with `disabled` on its item, or write `<option disabled>` in the default slot.

<ComponentPreview name="native-select/with-disabled-options" />

### With Groups

Pass groups in `items` to render `<optgroup>` sections.

<ComponentPreview name="native-select/with-groups" />

### With Label

<ComponentPreview name="native-select/with-label" />

## Customization

### Tailwind CSS

<ComponentPreview name="native-select/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { nativeSelect: { slots: { select: 'rounded-full', indicator: 'text-accent' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="native-select"]` – root container (`inline-flex flex-col gap-1`)
- `trigger` → `[data-slot="native-select-trigger"]` – relative wrapper around the select and indicator
- `select` → `[data-slot="native-select-select"]` – the `<select>` with field styling
- `indicator` → `[data-slot="native-select-indicator"]` – the icon, absolutely positioned at the end

The select's background follows `--native-select-bg-current`, so a plain `bg-*` class in `ui.select` wins in every state. The `secondary` variant reads `--native-select-bg`, `--native-select-bg-hover` and `--native-select-bg-focus`.

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes.

### Interactive States

- **Hover**: `:hover` on the select
- **Focus visible**: `:focus-visible` on the select shows the focus ring
- **Placeholder**: `[data-placeholder="true"]` on the select while the value is `''`
- **Invalid**: `[data-invalid="true"]` on the root, `[aria-invalid="true"]` on the select. Hides the description.
- **Disabled**: `[data-disabled="true"]` on the root, `:disabled` on the select
- **Required**: `[data-required="true"]` on the root. Shows the label's asterisk.

## API Reference

### Props

<ApiTable component="NativeSelect" kind="props" />

### Slots

<ApiTable component="NativeSelect" kind="slots" />

### Emits

<ApiTable component="NativeSelect" kind="emits" />

### Theme

<ApiTheme component="NativeSelect" />

## Accessibility

- The control is a real `<select>`, so the browser and screen readers handle keyboard, typeahead and announcements
- The label's `for` points to the select id (generated unless `id` is set)
- `aria-describedby` lists the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the select; the error is announced via `role="alert"`
- Without a visible label, pass `aria-label`; it lands on the `<select>`
- The indicator is decorative (`aria-hidden`)

## Related Components

<RelatedComponents :components="['select', 'combo-box', 'label', 'field-error']" />
