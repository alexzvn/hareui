---
title: Form
description: Wrapper component for form validation and submission handling
links:
  source: Form.vue
  heroui: form
---

## Usage

```vue
<script setup lang="ts">
import { Form } from 'herouse'
</script>
```

<ComponentPreview name="form/basic" />

## Anatomy

```vue
<script setup lang="ts">
import { Button, Form } from 'herouse'
</script>

<template>
  <Form>
    <!-- Form fields go here -->
    <Button type="submit" />
    <Button type="reset" />
  </Form>
</template>
```

## Examples

### Render Function

<ComponentPreview name="form/render-function" />

Attributes and listeners such as `action`, `method`, `@submit`, `@reset` and `data-*` fall through to the native `<form>` element.

## Customization

### Tailwind CSS

<ComponentPreview name="form/custom-styles" />

### Global CSS

`Form` renders a native `<form>` with no theme slots. Style it with `class`, or with a project-level class under `@layer components`.

```css
@layer components {
  .form-layout {
    @apply flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm;
  }
}
```

```vue
<Form class="form-layout" @submit="onSubmit">
  <!-- TextField, Input, Button, etc. -->
</Form>
```

For individual controls, see **Customization** on [TextField](/docs/components/text-field), [Input](/docs/components/input), [Label](/docs/components/label) and [FieldError](/docs/components/field-error).

## Styling Reference

`Form` has no `ui` keys and no `data-slot`. Field appearance and validation states come from child components such as `TextField`, `Input`, `Label`, `Description` and `FieldError`.

## API Reference

### Props

<ApiTable component="Form" kind="props" />

### Slots

<ApiTable component="Form" kind="slots" />

### Form Validation

Fields inside a `Form` support:

- Built-in HTML validation attributes (`required`, `minlength`, `pattern`, `min`, `max`, …)
- A custom `validate` function on [TextField](/docs/components/text-field), [Input](/docs/components/input), [NumberField](/docs/components/number-field), [Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch) and [RadioGroup](/docs/components/radio-group). It returns an error message (or an array of them) when the value is invalid, and `true`, `null` or `undefined` when it is valid.
- Server-side errors through the `validation-errors` prop, keyed by field `name`. They show immediately and clear once the user changes that field.
- Error display through each field's built-in [FieldError](/docs/components/field-error). The `#error` slot receives `{ isInvalid, validationErrors, validationDetails }`.

A field's `invalid` prop, when set, overrides all of the above.

#### Validation Behavior

The `validation-behavior` prop controls how errors are displayed:

- **`native`** (default): native constraint validation. Submission is blocked while a field is invalid, and errors show once the user commits a value (on `change`, on blur, or on submit). The first invalid field is focused.
- **`aria`**: errors show in realtime as the user types, are exposed through `aria-invalid`, and never block submission. The `<form>` gets `novalidate`.

Set it on the form, or override it on an individual field.

### Form Submission

Forms can be submitted in several ways:

- **Traditional submission**: set the `action` attribute to submit to a URL
- **JavaScript handling**: listen to `@submit` and process the data
- **FormData API**: read the values with `FormData` in the submit handler

```ts
function onSubmit(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  const data = Object.fromEntries(formData)
  console.log('Form data:', data)
}
```

A `reset` button (or `form.reset()`) restores every field's `defaultValue` and clears displayed errors.

## Accessibility

- Native `<form>` element semantics
- Form landmark with `aria-label` or `aria-labelledby`
- Focus moves to the first invalid field when submission is blocked
- `aria-invalid` and `aria-describedby` (pointing to the error) on each invalid control

## Related Components

- [TextField](/docs/components/text-field)
- [Checkbox](/docs/components/checkbox)
- [RadioGroup](/docs/components/radio-group)
- [Switch](/docs/components/switch)
- [Button](/docs/components/button)
