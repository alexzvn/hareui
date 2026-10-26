---
title: ColorField
description: Color input field with labels, descriptions, and validation
links:
  reka: color-field
  source: color-field/ColorField.vue
  styles: color-field/theme.ts
  heroui: color-field
---

## Usage

```vue
<script setup lang="ts">
import { ColorField, parseColor } from '@hareui/vue'
</script>
```

<ComponentPreview name="color-field/basic" />

## Anatomy

ColorField renders a [Label](/docs/components/label), a group holding an optional prefix (e.g. a [ColorSwatch](/docs/components/color-swatch)), the input and an optional suffix, then a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error). The text parts come from props; each can be replaced with a slot.

```vue
<template>
  <ColorField label="…" description="…" error-message="…" :invalid="…">
    <template #label />
    <!-- Label content -->
    <template #prefix />
    <!-- content rendered before the input, e.g. a ColorSwatch -->
    <template #suffix />
    <!-- content rendered after the input -->
    <template #description />
    <!-- Description content -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
  </ColorField>
</template>
```

| `ui` key | `data-slot`                | Element                                                                                                        |
| -------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`   | `color-field`              | `<div>` root                                                                                                   |
| —        | `label`                    | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `group`  | `color-input-group`        | `<div role="group">` holding the prefix, input and suffix                                                      |
| `prefix` | `color-input-group-prefix` | `<span>` (iff `#prefix`)                                                                                       |
| `input`  | `color-input-group-input`  | `<input>`                                                                                                      |
| `suffix` | `color-input-group-suffix` | `<span>` (iff `#suffix`)                                                                                       |
| —        | `description`              | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —        | `field-error`              | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

> **ColorField** combines a label, color input, description, and error into a single accessible component. It accepts a hex string or a `Color` object (from `parseColor`) and always commits a `Color` object.

## Examples

### Variants

The ColorField component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in surfaces

<ComponentPreview name="color-field/variants" />

### On Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="color-field/on-surface" />

### With Description

<ComponentPreview name="color-field/with-description" />

### Required Field

<ComponentPreview name="color-field/required" />

::: warning Empty value and forms
Without `v-model`/`default-value`, or with a `null` model, the input is empty and shows its `placeholder`, as in HeroUI. Reka's ColorField always holds a colour internally, so an empty field still **submits `#000000`** as its form value, and `required` can't block submitting an empty field. Validate with `validate` or check for a `null` model if you need to tell them apart.
:::

### Disabled State

<ComponentPreview name="color-field/disabled" />

### Full Width

<ComponentPreview name="color-field/full-width" />

### Validation

Set `invalid` with `error-message` to control the state yourself, or validate with `required`, a `validate` function, or a surrounding [Form](/docs/components/form).

<ComponentPreview name="color-field/invalid" />

### Channel Editing

ColorField supports editing individual color channels (hue, saturation, lightness, red, green, blue, alpha) by setting the `colorSpace` and `channel` props.

<ComponentPreview name="color-field/channel-editing" />

### Controlled

Bind the value with `v-model` to synchronize with other components or state management. The committed value is a `Color` object, or `null` when the input is cleared (set the model to `null` to clear it). Use `colorToString(color, 'hex')` to read it as a string.

<ComponentPreview name="color-field/controlled" />

### Form Example

Complete form example with validation and submission handling.

<ComponentPreview name="color-field/form-example" />

### Render Function

HeroUI's `render` prop replaces the root element. In Vue, attributes you pass to `ColorField` (other than `aria-label` / `aria-labelledby`, which go to the input) fall through to the root `div`.

<ComponentPreview name="color-field/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="color-field/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { colorField: { slots: { group: 'rounded-xl', input: 'font-mono' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="color-field"]` – root container (`flex flex-col gap-1`)
- `group` → `[data-slot="color-input-group"]` – container for the prefix, input and suffix, with border and background styling
- `prefix` → `[data-slot="color-input-group-prefix"]` – content before the input, e.g. a `ColorSwatch`
- `input` → `[data-slot="color-input-group-input"]` – the text input
- `suffix` → `[data-slot="color-input-group-suffix"]` – content after the input

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options.

### Interactive States

ColorField sets these data attributes:

- **Invalid**: `[data-invalid="true"]` on the root and the group - Automatically hides the description when invalid
- **Disabled**: `[data-disabled="true"]` on the root, `[data-disabled]` on the group and input
- **Required**: `[data-required="true"]` on the root - Shows the label's required asterisk
- **Read Only**: `[data-readonly="true"]` on the root, `[data-readonly]` on the group and input
- **Focus Within**: `[data-focus-within="true"]` on the group - Applied when the input is focused
- **Focus Visible**: `[data-focus-visible="true"]` on the group - Applied when focus is visible (keyboard navigation)

## API Reference

### Props

<ApiTable component="ColorField" kind="props" />

### Slots

<ApiTable component="ColorField" kind="slots" />

### Emits

<ApiTable component="ColorField" kind="emits" />

### Theme

<ApiTheme component="ColorField" />

## Accessibility

- The label's `for` points to the input id (auto-generated with `useId()` unless `id` is set)
- The input's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the input; the error is announced via `role="alert"`
- Keyboard: <kbd>↑</kbd>/<kbd>↓</kbd> (and <kbd>PageUp</kbd>/<kbd>PageDown</kbd>) step the hex value or the active channel by one step, <kbd>Home</kbd>/<kbd>End</kbd> jump a channel to its minimum/maximum, <kbd>Enter</kbd> commits typed text and then submits an enclosing form, mouse wheel steps the value unless `disableWheelChange` is set
- Channel values show their unit (`213°`, `50%`) and are clamped to the channel range on commit
- `name` submits the lowercase hex (`#0485f7`; HeroUI submits it uppercase), or the channel value in channel mode (alpha on a 0–1 scale)

## Related Components

<RelatedComponents :components="['label', 'description', 'field-error', 'color-swatch', 'color-picker']" />
