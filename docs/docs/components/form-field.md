---
title: FormField
description: A label, description, hint, help text and error around any form control, wired to the control's accessibility attributes and to Form errors.
links:
  source: form-field/FormField.vue
  styles: form-field/theme.ts
---

## Usage

Wrap any control in `FormField` to give it a label and helper text:

| Prop          | Shows                                 |
| ------------- | ------------------------------------- |
| `label`       | Above the control                     |
| `description` | Under the label                       |
| `hint`        | Beside the label                      |
| `help`        | Below the control                     |
| `error`       | Below the control, in place of `help` |

```ts
import { FormField } from '@hareui/vue'
```

<ComponentPreview name="form-field/basic" />

## Anatomy

```vue
<FormField label="…" description="…" hint="…" help="…" :error="…">
  <template #label="{ label }" />             <!-- optional -->
  <template #hint="{ hint }" />               <!-- optional -->
  <template #description="{ description }" /> <!-- optional -->
  <!-- the control; slot props: { id, name, labelId, describedBy, invalid, required, error } -->
  <template #help="{ help }" />               <!-- optional -->
  <template #error="{ error }" />             <!-- optional -->
</FormField>
```

A HareUI field inside, such as `TextField`, `Select` or `RadioGroup`, connects itself:

- The FormField's label names the field, and its description, hint, help and error describe it.
- The field hides its own label, description and error, unless the FormField has none.

### Hint and help

Use `hint` for a short note beside the label and `help` for guidance below the control. While an error shows, it takes the place of the help.

<ComponentPreview name="form-field/hint-help" />

### Error

Pass a message to `error` to show it and mark the control invalid. Pass `true` to mark it invalid without a message.

`:error="false"` hides every error message, including the control's own validation errors and `Form` errors.

<ComponentPreview name="form-field/error" />

### Required

`required` adds a marker to the label. It doesn't validate anything: for native validation, set `required` on the control too (it adds the marker as well), or validate with a `Form`.

<ComponentPreview name="form-field/required" />

### Size

`size` scales the text. Defaults to `md`.

| Size | Label | Hint, description, help and error |
| ---- | ----- | --------------------------------- |
| `sm` | 12px  | 12px                              |
| `md` | 14px  | 12px                              |
| `lg` | 16px  | 14px                              |

A field inside that has a `size` prop of its own, such as `Switch` or `Rating`, takes the FormField's size unless you set one on it.

<ComponentPreview name="form-field/sizes" />

## Examples

### With a Form

Inside a [Form](/docs/components/form), give the FormField a `name`. The `Form`'s errors for that name show in the FormField, and the field inside validates under that name. The field's own validation errors show there too.

These props pass down to the field inside unless it sets its own:

- `errorPattern`: also show `Form` errors whose name matches, such as `/^tags\..+/`.
- `eagerValidation`: validate on input right away, not only after the field is first left.
- `validateOnInputDelay`: wait this many milliseconds before validating on input.

<ComponentPreview name="form-field/form" />

### Groups and toggles

A group such as `RadioGroup` or `CheckboxGroup` is named by the FormField's label through `aria-labelledby`. A `Switch` or `Checkbox` keeps its own label next to the control.

<ComponentPreview name="form-field/groups" />

### A native control

For a plain HTML element, bind the default slot's props:

- `id` on the element, so the label points at it
- `name` on the element
- `describedBy` as `aria-describedby`
- `invalid` as `aria-invalid`

<ComponentPreview name="form-field/native-control" />

### A custom control

Call `useFormField()` in your own or a third-party control to connect it to the FormField around it. The picker below is a radio group: the label can't point at it, so it passes `labelTarget: () => undefined` and is named through `labelId` instead.

<ComponentPreview name="form-field/composable" />

The picker component:

<<< @/demos/form-field/components/PriorityPicker.vue

`useFormField()` returns:

| Value                                                              | What it is                                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `id`                                                               | The id to put on the control, so the label points at it                       |
| `labelId`                                                          | The label's id, for `aria-labelledby` on a control a `<label>` can't point at |
| `ariaAttrs`                                                        | `aria-describedby` and `aria-invalid`, to bind with `v-bind`                  |
| `describedBy`                                                      | Ids of the rendered description, hint, help and error                         |
| `descriptionId`                                                    | The description's id                                                          |
| `name`                                                             | The control's own `name`, else the FormField's                                |
| `size`, `required`                                                 | The FormField's `size` and `required`                                         |
| `error`                                                            | The displayed error: a message, or `true` for one without a message           |
| `invalid`                                                          | Whether the FormField has an error                                            |
| `isInFormField`                                                    | Whether a FormField wraps the control                                         |
| `emitFormBlur`, `emitFormFocus`, `emitFormChange`, `emitFormInput` | Report the control's events to a surrounding `Form`, which validates on them  |

Options:

| Option                 | What it does                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `id`, `name`           | The control's own id and name, used instead of the FormField's                       |
| `labelTarget`          | Returns the id the label points at; return `undefined` for a control it can't target |
| `validation`           | The control's validation result; its errors show in the FormField                    |
| `disabled`, `required` | Dim the label, or add the required marker                                            |

## API

### Props

<ApiTable component="FormField" kind="props" />

### Slots

<ApiTable component="FormField" kind="slots" />

## Theme

<ApiTheme component="FormField" />
