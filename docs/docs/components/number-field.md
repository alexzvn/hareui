---
title: NumberField
description: Number input fields with increment/decrement buttons, validation, and internationalized formatting
links:
  reka: number-field
  source: NumberField.vue
  styles: numberField.ts
  heroui: number-field
---

## Usage

```vue
<script setup lang="ts">
import { NumberField } from 'herouse'
</script>
```

<ComponentPreview name="number-field/basic" />

## Anatomy

NumberField renders a [Label](/docs/components/label), a group holding the decrement button, the input and the increment button, then a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error). The text parts come from props; each can be replaced with a slot.

```vue
<template>
  <NumberField label="…" description="…" error-message="…" :invalid="…">
    <template #label />        <!-- Label content -->
    <template #decrement />    <!-- decrement button content (default: minus icon) -->
    <template #increment />    <!-- increment button content (default: plus icon) -->
    <template #description />  <!-- Description content -->
    <template #error />        <!-- FieldError content, rendered when invalid -->
  </NumberField>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `number-field` | `<div>` root |
| — | `label` | [Label](/docs/components/label) (iff `label` / `#label`) |
| `group` | `number-field-group` | `<div role="group">` holding the buttons and input |
| `decrementButton` | `number-field-decrement-button` | `<button>` (iff `decrement`) |
| `input` | `number-field-input` | `<input role="spinbutton">` |
| `incrementButton` | `number-field-increment-button` | `<button>` (iff `increment`) |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |
| — | `field-error` | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

> **NumberField** allows users to enter numeric values with optional increment/decrement buttons. It supports internationalized formatting, validation, and keyboard navigation.

## Examples

### Variants

The NumberField component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in surfaces

<ComponentPreview name="number-field/variants" />

### In Surface

When used inside a surface (HeroUI's [Surface](https://heroui.com/en/docs/react/components/surface), here a `bg-surface` container), use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="number-field/on-surface" />

### With Description

<ComponentPreview name="number-field/with-description" />

### Required Field

<ComponentPreview name="number-field/required" />

### Disabled State

<ComponentPreview name="number-field/disabled" />

### Full Width

<ComponentPreview name="number-field/full-width" />

### Validation

Set `invalid` with `error-message` to control the state yourself, or validate with `required`, a `validate` function, or a surrounding [Form](/docs/components/form). `validate` receives the committed number (`NaN` while empty). `min` / `max` clamp the value rather than reporting an error.

<ComponentPreview name="number-field/validation" />

### Controlled

Bind the value with `v-model` to synchronize with other components or perform custom formatting. The value is `undefined` while the input is empty.

<ComponentPreview name="number-field/controlled" />

### Step Values

Configure increment/decrement step values for precise control.

<ComponentPreview name="number-field/with-step" />

### Format Options

Format numbers as currency, percentages, decimals, or units with internationalization support. Pass `locale` to override the `ConfigProvider` locale.

<ComponentPreview name="number-field/with-format-options" />

### Form Example

Complete form integration with validation and submission handling.

<ComponentPreview name="number-field/form-example" />

### With Validation

Implement custom validation logic with controlled values.

<ComponentPreview name="number-field/with-validation" />

### Custom Icons

Customize the increment and decrement button icons with the `#increment` and `#decrement` slots.

<ComponentPreview name="number-field/custom-icons" />

### With Chevrons

Use chevron icons in a vertical layout for a different visual style. HeroUI wraps the buttons in an extra `<div>`; here the `ui` classes place them in the group's grid.

<ComponentPreview name="number-field/with-chevrons" />

### Render Function

HeroUI's `render` prop replaces the root element. In Vue, attributes you pass to `NumberField` (other than `aria-label` / `aria-labelledby`, which go to the input) fall through to the root `div`.

<ComponentPreview name="number-field/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="number-field/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { numberField: { slots: { group: 'rounded-xl', input: 'text-center' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="number-field"]` – root container (`flex flex-col gap-1`)
- `group` → `[data-slot="number-field-group"]` – container for the input and buttons, with border and background styling
- `input` → `[data-slot="number-field-input"]` – the numeric input
- `incrementButton` → `[data-slot="number-field-increment-button"]` – button that increments the value
- `decrementButton` → `[data-slot="number-field-decrement-button"]` – button that decrements the value

The group's background follows `--number-field-group-bg-current`, so a plain `bg-*` class in `ui.group` wins in every state. The `secondary` variant reads `--number-field-group-bg`, `--number-field-group-bg-hover` and `--number-field-group-bg-focus`.

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options.

### Interactive States

NumberField sets these data attributes:

- **Invalid**: `[data-invalid="true"]` on the root and the group - Automatically hides the description when invalid
- **Disabled**: `[data-disabled="true"]` on the root, `[data-disabled]` on the group, input and buttons
- **Required**: `[data-required="true"]` on the root - Shows the label's required asterisk
- **Read Only**: `[data-readonly="true"]` on the root, `[data-readonly]` on the group and input
- **Focus Within**: `[data-focus-within="true"]` on the group - Applied when the input or buttons are focused
- **Focus Visible**: `[data-focus-visible="true"]` on the group - Applied when focus is visible (keyboard navigation)
- **Pressed**: `[data-pressed="true"]` on a button while it's held

## API Reference

### Props

<ApiTable component="NumberField" kind="props" />

### Slots

<ApiTable component="NumberField" kind="slots" />

### Emits

<ApiTable component="NumberField" kind="emits" />

## Accessibility

- The input has `role="spinbutton"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
- The label's `for` points to the input id (auto-generated with `useId()` unless `id` is set)
- The input's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the input; the error is announced via `role="alert"`
- Keyboard: <kbd>↑</kbd>/<kbd>↓</kbd> step by `step`, <kbd>PageUp</kbd>/<kbd>PageDown</kbd> by 10 steps, <kbd>Home</kbd>/<kbd>End</kbd> jump to `min`/`max`, <kbd>Enter</kbd> commits typed text
- The buttons are labelled "Increase"/"Decrease", aren't in the tab order, and repeat while held

## Related Components

<RelatedComponents :components="['label', 'description', 'field-error', 'text-field']" />
