---
title: Form
description: Wrapper component for form validation and submission handling
links:
  source: form/Form.vue
  heroui: form
---

## Usage

```vue
<script setup lang="ts">
import { Form } from '@hareui/vue'
</script>
```

<ComponentPreview name="form/basic" />

## Anatomy

```vue
<template>
  <Form>
    <!-- Form fields go here -->
    <Button type="submit" />
    <Button type="reset" />
  </Form>
</template>

<script setup lang="ts">
import { Button, Form } from '@hareui/vue'
</script>
```

## Examples

### Render Function

<ComponentPreview name="form/render-function" />

Attributes and listeners such as `action`, `method`, `@reset` and `data-*` fall through to the native `<form>` element. Without `state`, `schema` or `validate`, `@submit` receives the native submit event (see [Form Submission](#form-submission)).

### Schema Validation

<ComponentPreview name="form/schema" />

Bind each field to a reactive `state` object with `v-model` and give it the matching `name`. Pass the object to `state` and a schema to `schema`. The form accepts any [Standard Schema](https://standardschema.dev) (Zod, Valibot, ArkType, Yup, Effect Schema, …) or a Superstruct struct, with no adapter:

| Library        | Usage                             |
| -------------- | --------------------------------- |
| Zod (3.24+, 4) | `z.object({ … })`                 |
| Valibot (1+)   | `v.object({ … })`                 |
| ArkType        | `type({ … })`                     |
| Yup (1.7+)     | the schema object                 |
| Effect Schema  | `Schema.standardSchemaV1(schema)` |
| Superstruct    | `object({ … })`                   |

Each issue is shown by the field whose `name` matches the issue's path (dotted for nested values, e.g. `address.city`) through its built-in [FieldError](/docs/components/field-error). Issues without a matching field are listed in the default slot's `errors`.

A field the user hasn't filled in holds `undefined` in the state, and a text field typed in and then cleared holds `''`. Give both cases a message, such as `z.string('Name is required').min(1, 'Name is required')` in Zod; otherwise the library's defaults (`Invalid input: expected string, received undefined`) are shown.

`@submit` fires only once validation passes. `event.data` holds the schema's output, with its transformations and defaults; set `:transform="false"` to receive the state as is.

### Custom Validation

<ComponentPreview name="form/custom-validate" />

Use `validate` for rules a schema can't express, or instead of one. It receives the state and returns a list of `FormError` (`{ name, message }`), synchronously or as a promise. With both `schema` and `validate`, the errors of both are shown.

### Error Reporting

An error is shown by the field whose `name` equals the error's `name`. To show errors of several paths on one field, such as the items of an array, set `error-pattern` on it:

```vue
<TextField v-model="state.tags" name="tags" :error-pattern="/^tags\..+/" label="Tags" />
```

Errors no field claims stay available through the default slot and the exposed `errors`:

```vue
<Form :schema="schema" :state="state">
  <template #default="{ errors }">
    <!-- fields -->
    <p v-for="error in errors.filter(e => !e.name)" :key="error.message">
      {{ error.message }}
    </p>
  </template>
</Form>
```

### Input Events

A field is validated when the user interacts with it, on the events listed in `validate-on` (default `['input', 'blur', 'change']`; `focus` is also available). The whole form is always validated on submit.

- Input validation starts only after the field is first left, so errors don't show while the user is still typing for the first time. Set `eager-validation` on a field to validate it on input right away.
- Input validation is debounced by `validate-on-input-delay` (300 ms). Override it per field with the field's `validate-on-input-delay`.

```vue
<Form :schema="schema" :state="state" :validate-on="['blur']">
  <TextField v-model="state.username" name="username" label="Username" eager-validation :validate-on-input-delay="0" />
</Form>
```

### Error Event

<ComponentPreview name="form/error-event" />

`@error` fires when submission is blocked by `schema` or `validate` errors. `event.errors` lists them with the `id` of each field's control, so the handler can focus or scroll to the first one.

### Submitting Programmatically

Call `submit()` on the form ref to submit from outside the `<form>`. It runs native constraint validation first, then submits like a submit button.

```vue
<template>
  <Form ref="form" :schema="schema" :state="state" @submit="onSubmit">
    <!-- fields -->
  </Form>
  <Button @click="form?.submit()"> Save </Button>
</template>

<script setup lang="ts">
import type { FormInstance } from '@hareui/vue'
import { useTemplateRef } from 'vue'

const form = useTemplateRef<FormInstance<typeof schema>>('form')
</script>
```

### Nesting Forms

<ComponentPreview name="form/nested" />

A `Form` with `nested` attaches to its parent form and renders a `<div>`. It reads its parent's `state` (or the part of it at its `name` path), and its `schema` / `validate` run along with the parent's, so its fields block the parent's submission. Render it conditionally to validate a section only when it applies.

### Disabled and Loading

`disabled` disables every field inside. While an async `@submit` handler runs, the fields are disabled too and the default slot's `loading` is `true`; set `:loading-auto="false"` to keep them enabled.

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

### Emits

<ApiTable component="Form" kind="emits" />

### Slots

<ApiTable component="Form" kind="slots" />

### Expose

Access the form instance through a template ref typed with `FormInstance`:

```ts
import type { FormInstance } from '@hareui/vue'
import { useTemplateRef } from 'vue'

const form = useTemplateRef<FormInstance<typeof schema>>('form')
```

| Name                       | Type                                                                         | Description                                                                                                                                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate(opts?)`          | `(opts?: { name?, silent?, nested?, transform? }) => Promise<data \| false>` | Validates the state and shows the errors. Resolves to the state (the schema's output with `transform: true`). Throws a `FormValidationException` when invalid, or resolves to `false` with `silent: true`. `name` limits validation to some fields; `nested` includes nested forms. |
| `clear(path?)`             | `(path?: string \| RegExp) => void`                                          | Clears the errors of a field (by name or pattern), or all errors.                                                                                                                                                                                                                   |
| `getErrors(path?)`         | `(path?: string \| RegExp) => FormErrorWithId[]`                             | The errors of a field (by name or pattern), or all errors.                                                                                                                                                                                                                          |
| `setErrors(errors, path?)` | `(errors: FormError[], path?: string \| RegExp) => void`                     | Replaces the errors of a field (by name or pattern), or all errors.                                                                                                                                                                                                                 |
| `submit()`                 | `() => Promise<void>`                                                        | Runs native constraint validation, then submits like a submit button.                                                                                                                                                                                                               |
| `errors`                   | `FormErrorWithId[]`                                                          | The current `schema` / `validate` errors.                                                                                                                                                                                                                                           |
| `disabled`                 | `boolean`                                                                    | Whether the fields are disabled: the `disabled` prop, or a submission in progress with `loading-auto`.                                                                                                                                                                              |
| `loading`                  | `boolean`                                                                    | Whether a submission is in progress.                                                                                                                                                                                                                                                |
| `dirty`                    | `boolean`                                                                    | Whether the user changed a field since the last successful submission.                                                                                                                                                                                                              |
| `dirtyFields`              | `ReadonlySet<string>`                                                        | Fields the user changed.                                                                                                                                                                                                                                                            |
| `touchedFields`            | `ReadonlySet<string>`                                                        | Fields the user focused, changed or left.                                                                                                                                                                                                                                           |
| `blurredFields`            | `ReadonlySet<string>`                                                        | Fields the user left.                                                                                                                                                                                                                                                               |

### Field Props

Every field that takes a `name` (TextField, Input, NumberField, Checkbox, Select, …) also accepts:

| Prop                      | Type      | Description                                                                                         |
| ------------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `error-pattern`           | `RegExp`  | Also shows form errors whose name matches this pattern.                                             |
| `eager-validation`        | `boolean` | Validates on input right away, instead of after the field is first left. Defaults to `false`.       |
| `validate-on-input-delay` | `number`  | Delay in milliseconds before validating on input. Defaults to the form's `validate-on-input-delay`. |

### Form Validation

Fields inside a `Form` support:

- Built-in HTML validation attributes (`required`, `minlength`, `pattern`, `min`, `max`, …)
- A custom `validate` function on [TextField](/docs/components/text-field), [Input](/docs/components/input), [NumberField](/docs/components/number-field), [Checkbox](/docs/components/checkbox), [Switch](/docs/components/switch) and [RadioGroup](/docs/components/radio-group). It returns an error message (or an array of them) when the value is invalid, and `true`, `null` or `undefined` when it is valid.
- Server-side errors through the `validation.errors` prop, keyed by field `name`. They show immediately and clear once the user changes that field.
- The form's `schema` and `validate` (see [Schema Validation](#schema-validation) and [Custom Validation](#custom-validation)).
- Error display through each field's built-in [FieldError](/docs/components/field-error). The `#error` slot receives `{ isInvalid, validationErrors, validationDetails }`.

A field's `invalid` prop, when set, overrides all of the above.

#### Validation Behavior

The `validation.behavior` prop controls how native constraints, a field's `validate` and `validation.errors` are displayed:

- **`native`** (default): native constraint validation. Submission is blocked while a field is invalid, and errors show once the user commits a value (on `change`, on blur, or on submit). The first invalid field is focused.
- **`aria`**: errors show in realtime as the user types, are exposed through `aria-invalid`, and never block submission. The `<form>` gets `novalidate`.

Set it on the form, or override it with a field's own `validation-behavior` prop. `schema` and `validate` errors don't depend on it: they show on the `validate-on` events and on submit, and block `@submit` without blocking native constraint validation.

### Form Submission

Forms can be submitted in several ways:

- **Traditional submission**: set the `action` attribute to submit to a URL
- **JavaScript handling**: listen to `@submit` and process the data. Without `state`, `schema` or `validate`, it receives the native submit event.
- **With `state` / `schema` / `validate`**: native submission is always prevented. `@submit` fires once validation passes, with the validated state as `event.data`; `@error` fires with `event.errors` when it fails.
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

## Theme

`Form` renders a plain `<form>` (a `<div>` when nested) with no theme classes; style it with `class`.

## Accessibility

- Native `<form>` element semantics
- Form landmark with `aria-label` or `aria-labelledby`
- Focus moves to the first invalid field when native validation blocks submission
- `schema` / `validate` errors don't move focus; handle `@error` and focus `event.errors[0].id` (see [Error Event](#error-event))
- `aria-invalid` and `aria-describedby` (pointing to the error) on each invalid control

## Related Components

<RelatedComponents :components="['text-field', 'checkbox', 'radio-group', 'switch', 'button']" />
