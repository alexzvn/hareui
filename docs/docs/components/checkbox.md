---
title: Checkbox
description: Checkboxes allow users to select multiple items from a list, or mark one individual item as selected.
links:
  source: Checkbox.vue
  styles: checkbox.ts
  heroui: checkbox
---

## Usage

```vue
<script setup lang="ts">
import { Checkbox } from 'herouse'
</script>
```

<ComponentPreview name="checkbox/basic" />

## Anatomy

Checkbox renders a Reka UI [`CheckboxRoot`](https://reka-ui.com/docs/components/checkbox), a control, an indicator and optional [Description](/docs/components/description) / [FieldError](/docs/components/field-error) — composed through props or slots.

```vue
<template>
  <Checkbox label="…" description="…" error-message="…" :invalid="…">
    <template #label="{ state }" />       <!-- replaces the label text -->
    <template #description />             <!-- Description content -->
    <template #error />                   <!-- FieldError content, rendered when invalid -->
    <template #indicator="{ state }" />   <!-- replaces the default checkmark / dash icons -->
  </Checkbox>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `checkbox` | `<div>` root |
| `content` | `checkbox-content` | Reka `CheckboxRoot` (clickable label + control) |
| `control` | `checkbox-control` | Control box |
| `indicator` | `checkbox-indicator` | Checkmark / dash indicator |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |
| — | `field-error` | [FieldError](/docs/components/field-error) (iff `invalid` and `error-message` / `#error`) |

## Examples

### Variants

The Checkbox component supports two visual variants:

- **`primary`** (default) - Standard styling with default background, suitable for most use cases
- **`secondary`** - Lower emphasis variant, suitable for use on surface components

<ComponentPreview name="checkbox/variants" />

### Full Rounded

<ComponentPreview name="checkbox/full-rounded" />

### Disabled

<ComponentPreview name="checkbox/disabled" />

### External Label

<ComponentPreview name="checkbox/external-label" />

### With Description

<ComponentPreview name="checkbox/with-description" />

### Default Selected

<ComponentPreview name="checkbox/default-selected" />

### Invalid

<ComponentPreview name="checkbox/invalid" />

### Controlled

<ComponentPreview name="checkbox/controlled" />

### Indeterminate

<ComponentPreview name="checkbox/indeterminate" />

### Form Integration

<ComponentPreview name="checkbox/form" />

### Render Props

The `#label`, `#description` and `#indicator` slots receive `{ state }` (`'checked' | 'unchecked' | 'indeterminate'`):

<ComponentPreview name="checkbox/render-props" />

### Custom Indicator

<ComponentPreview name="checkbox/custom-indicator" />

## Customization

### Tailwind CSS

<ComponentPreview name="checkbox/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { checkbox: { slots: { control: 'rounded-full' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="checkbox"]` – root container
- `content` → `[data-slot="checkbox-content"]` – clickable label wrapping the control and label text
- `control` → `[data-slot="checkbox-control"]` – control box
- `indicator` → `[data-slot="checkbox-indicator"]` – checkmark / indeterminate dash

> **Note:** The optional [Description](/docs/components/description) and [FieldError](/docs/components/field-error) children have their own themes. See their respective pages for customization options.

### Interactive States

Checkbox sets these data attributes on its root:

- **Selected**: `[data-selected="true"]`
- **Indeterminate**: `[data-indeterminate="true"]`
- **Invalid**: `[data-invalid="true"]`
- **Disabled**: `[data-disabled="true"]` - also applies a disabled style to the description/error text
- **Read only**: `[data-readonly="true"]` on the root, `aria-readonly="true"` on the control button
- **Required**: `[data-required="true"]`
- **Hover / Focus / Active**: standard pseudo-classes apply on `[data-slot="checkbox-control"]`

## API Reference

### Props

<ApiTable component="Checkbox" kind="props" />

### Slots

<ApiTable component="Checkbox" kind="slots" />

### Emits

<ApiTable component="Checkbox" kind="emits" />

## Accessibility

- The clickable label (`[data-slot="checkbox-content"]`) is a native `<button role="checkbox">` rendered by Reka UI, keyboard-operable with <kbd>Space</kbd>
- `invalid` sets `aria-invalid="true"`; `aria-describedby` lists the description (`<id>-description`) and error (`<id>-error`) ids
- `required` and `disabled` set the matching native/ARIA attributes
- For a checkbox without a visible label, pass an `aria-label` via `$attrs`

## Related Components

- [RadioGroup](/docs/components/radio-group)
- [Switch](/docs/components/switch)
- [Description](/docs/components/description)
- [FieldError](/docs/components/field-error)
