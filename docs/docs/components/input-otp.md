---
title: InputOtp
description: A one-time password input for verification codes and secure authentication
links:
  source: input-otp/InputOtp.vue
  styles: input-otp/theme.ts
  heroui: input-otp
---

## Usage

```vue
<script setup lang="ts">
import { InputOtp } from '@hareui/vue'
</script>
```

<ComponentPreview name="input-otp/basic" />

## Anatomy

The OTP box is built on the [input-otp](https://github.com/guilhermerodz/input-otp) library. A single real `<input>` overlays a row of decorative slots. It is invisible but fully interactive. So typing, <kbd>Backspace</kbd>, arrow keys and paste behave like any browser text field.

`InputOtp` bundles that box with a label, a description and a `FieldError`. It follows the same field convention as [SearchField](/docs/components/search-field) and [NumberField](/docs/components/number-field).

Lay out the slots with `groups`, an array of slot counts per visual group. A separator is rendered between groups.

```vue
<template>
  <InputOtp v-model="code" :length="6" :groups="[3, 3]" label="…" description="…" error-message="…">
    <template #label />
    <!-- Label content -->
    <template #description />
    <!-- Description content -->
    <template #error="{ validationErrors }" />
    <!-- FieldError content, rendered while invalid -->
  </InputOtp>
</template>
```

| `ui` key    | `data-slot`            | Element                                                                                                        |
| ----------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`      | —                      | root `<div>` (HareUI-only), stacks label/box/description/error                                                 |
| —           | `label`                | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `root`      | —                      | the box (`<div data-input-otp-container>`)                                                                     |
| `group`     | `input-otp-group`      | one `<div>` per entry in `groups`                                                                              |
| `slot`      | `input-otp-slot`       | one `<div>` per character                                                                                      |
| `slotValue` | `input-otp-slot-value` | the character inside a filled slot                                                                             |
| `caret`     | `input-otp-caret`      | blinking fake caret in the active, empty slot                                                                  |
| `separator` | `input-otp-separator`  | `<div>` between groups                                                                                         |
| `input`     | `input-otp`            | the real, invisible `<input>` that receives focus, typing and paste; carries `data-disabled` / `data-invalid`  |
| —           | `description`          | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —           | `field-error`          | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

## Examples

### Variants

The InputOtp component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in Surface components

<ComponentPreview name="input-otp/variants" />

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="input-otp/on-surface" />

### Disabled State

<ComponentPreview name="input-otp/disabled" />

### Four Digits

A single group (the default when `groups` isn't set) renders with no separator.

<ComponentPreview name="input-otp/four-digits" />

### Controlled

Control the value with `v-model` to synchronize with state, clear the input, or implement custom validation.

<ComponentPreview name="input-otp/controlled" />

### On Complete

Use the `@complete` event to trigger actions when every slot has just become filled.

<ComponentPreview name="input-otp/on-complete" />

### Form Example

A complete two-factor authentication form with validation and submission.

<ComponentPreview name="input-otp/form-example" />

### With Pattern

Use the `pattern` prop to restrict input to specific characters. It takes `'digits'`, `'chars'` or `'alphanumeric'`.

<ComponentPreview name="input-otp/with-pattern" />

### With Validation

Use `invalid` together with `error-message` to surface errors.

<ComponentPreview name="input-otp/with-validation" />

## Customization

### Tailwind CSS

<ComponentPreview name="input-otp/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { inputOtp: { slots: { slot: 'size-12 rounded-xl border-2 font-bold' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → root `<div>` — HareUI-only flex-col wrapper around the label, box, description and error
- `root` → `[data-input-otp-container]` — the box (`relative flex w-full items-center gap-2`)
- `group` → `[data-slot="input-otp-group"]` — one per entry in `groups`
- `slot` → `[data-slot="input-otp-slot"]` — a single character cell
- `slotValue` → `[data-slot="input-otp-slot-value"]` — the rendered character
- `caret` → `[data-slot="input-otp-caret"]` — the blinking fake caret
- `separator` → `[data-slot="input-otp-separator"]` — the dash between groups
- `input` → `[data-slot="input-otp"]` — the real, invisible `<input>`

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The InputOtp component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/input-otp/input-otp.css)):

#### Base Classes

- `.h-input-otp-field` - HareUI's wrapper around the label, box, description and error
- `.h-input-otp` - The box that holds the groups
- `.h-input-otp__group` - Group of slots
- `.h-input-otp__slot` - Individual input slot
- `.h-input-otp__slot-value` - The character inside a slot
- `.h-input-otp__caret` - Blinking caret indicator
- `.h-input-otp__separator` - Visual separator between groups
- `.h-input-otp__input` - The real, invisible `<input>` over the box

#### Variant Classes

- `.h-input-otp--secondary` - Secondary variant without shadow, suitable for use in surfaces

The default `primary` variant adds no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- **Active**: `[data-active="true"]` on the slot that currently owns the (hidden) selection
- **Filled**: `[data-filled="true"]` on a slot with a character
- **Disabled**: `[data-disabled="true"]` on the input and every slot
- **Invalid**: `[data-invalid="true"]` on the input and every slot

## API Reference

### Props

<ApiTable component="InputOtp" kind="props" />

### Slots

<ApiTable component="InputOtp" kind="slots" />

### Emits

<ApiTable component="InputOtp" kind="emits" />

`@focus` and `@blur` listeners go to the input, so they fire when the code field gains and loses focus.

## Theme

<ApiTheme component="InputOtp" />

## Accessibility

- A single native `<input>` carries focus, typing, selection and paste. Standard text-editing shortcuts work without extra wiring: <kbd>Backspace</kbd>, arrow keys, <kbd>Home</kbd>/<kbd>End</kbd> and select-and-retype
- As in input-otp, moving the caret onto a filled slot selects its character, so typing or pasting replaces it. On a full field, that is the last slot
- `autocomplete="one-time-code"` lets browsers and password managers offer SMS-delivered codes
- `label` is associated with the input through `for`/`id`. `description` and `error-message` are wired through `aria-describedby`
- With `name`, the input submits its value with a form like any text field
- `required` and `pattern` participate in native HTML5 constraint validation alongside `validate`

## Related Components

<RelatedComponents :components="['search-field', 'number-field', 'form']" />
