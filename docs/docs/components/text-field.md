---
title: TextField
description: Composition-friendly text fields with labels, descriptions, and inline validation
links:
  source: text-field/TextField.vue
  styles: text-field/theme.ts
  heroui: text-field
---

## Usage

```vue
<script setup lang="ts">
import { TextField } from '@hareui/vue'
</script>
```

<ComponentPreview name="textfield/basic" />

## Anatomy

TextField renders a [Label](/docs/components/label), an [Input](/docs/components/input), a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error) from props; each part can be replaced with a slot.

```vue
<template>
  <TextField label="…" description="…" error-message="…" :invalid="…">
    <template #label />
    <!-- Label content -->
    <template
      #default="{
        id,
        describedBy,
        invalid,
        disabled,
        required,
        readonly,
        focusWithin,
        focusVisible,
      }"
    />
    <!-- replaces the Input -->
    <template #description />
    <!-- Description content -->
    <template #error="{ isInvalid, validationErrors, validationDetails }" />
    <!-- FieldError content, rendered while invalid -->
  </TextField>
</template>
```

| `ui` key | `data-slot`   | Element                                                                                                        |
| -------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`   | `textfield`   | `<div>` root                                                                                                   |
| —        | `label`       | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| —        | `input`       | [Input](/docs/components/input) (default slot)                                                                 |
| —        | `description` | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —        | `field-error` | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

> **TextField** combines label, input, description, and error into a single accessible component.
> For standalone inputs, use **[Input](/docs/components/input)**.

## Examples

### In Surface

When used inside a surface ([Surface](/docs/components/surface) or another `bg-surface` container), use `variant="secondary"` on the TextField or its Input to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="textfield/on-surface" />

### With Description

<ComponentPreview name="textfield/with-description" />

### Required Field

<ComponentPreview name="textfield/required" />

### Disabled State

<ComponentPreview name="textfield/disabled" />

### Full Width

<ComponentPreview name="textfield/full-width" />

### Validation

Use `invalid` together with `error-message` to control the state yourself, or let the field validate: native attributes (`required`, `minlength`, `pattern`, …) and a `validate` function, inside a [Form](/docs/components/form) or on their own. Without `error-message`, the field shows the validation errors.

<ComponentPreview name="textfield/validation" />

### Controlled

Bind the value with `v-model` to synchronize counters, previews, or formatting.

<ComponentPreview name="textfield/controlled" />

### Error Message

<ComponentPreview name="textfield/with-error" />

### TextArea

Use [TextArea](/docs/components/text-area) instead of [Input](/docs/components/input) for multiline content.

<ComponentPreview name="textfield/textarea" />

### Input Types

<ComponentPreview name="textfield/input-types" />

### Render Function

Input attributes you pass to `TextField` (`aria-label`, `aria-labelledby`, `autocomplete`, `maxlength`, `inputmode`, …) go to the input, and `aria-describedby` is added to the input's description and error ids. Everything else falls through to the root `div`; render your own markup through the default slot.

<ComponentPreview name="textfield/render-function" />

## Customization

### Tailwind CSS

Use the default slot to render your own `Label` and `Input` with custom classes; `Input`s inside the slot still read the field's id and state.

<ComponentPreview name="textfield/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { textField: { slots: { base: 'gap-2' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="textfield"]` – root container (`flex flex-col gap-1`)

> **Note:** The child components ([Label](/docs/components/label), [Input](/docs/components/input), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options.

### Interactive States

TextField sets these data attributes on its root:

- **Invalid**: `[data-invalid="true"]` - Automatically hides the description when invalid
- **Disabled**: `[data-disabled="true"]`
- **Required**: `[data-required="true"]` - Shows the label's required asterisk
- **Read Only**: `[data-readonly="true"]` - Applied when `readonly` is true
- **Focus Within**: `[data-focus-within="true"]` - Applied when any child input is focused
- **Focus Visible**: `[data-focus-visible="true"]` - Applied when focus is visible (keyboard navigation)

## API Reference

### Props

<ApiTable component="TextField" kind="props" />

### Slots

<ApiTable component="TextField" kind="slots" />

### Emits

<ApiTable component="TextField" kind="emits" />

### Render Props

The default slot receives the field state:

| Prop           | Type                  | Description                                     |
| -------------- | --------------------- | ----------------------------------------------- |
| `id`           | `string`              | Id of the field's input.                        |
| `describedBy`  | `string \| undefined` | Ids of the rendered description and error.      |
| `disabled`     | `boolean`             | Whether the field is disabled.                  |
| `invalid`      | `boolean`             | Whether the field is currently invalid.         |
| `readonly`     | `boolean`             | Whether the field is read-only.                 |
| `required`     | `boolean`             | Whether the field is required.                  |
| `focusWithin`  | `boolean`             | Whether any child element is focused.           |
| `focusVisible` | `boolean`             | Whether focus is visible (keyboard navigation). |

## Theme

<ApiTheme component="TextField" />

## Accessibility

- The label's `for` points to the input id (auto-generated with `useId()` unless `id` is set)
- The input's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the input; the error is announced via `role="alert"`
- `required` and `disabled` set the native attributes on the input

## Related Components

<RelatedComponents :components="['input', 'label', 'description', 'field-error']" />
