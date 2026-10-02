---
title: InputOtp
description: A one-time password input for verification codes and secure authentication
links:
  source: InputOtp.vue
  styles: inputOtp.ts
  heroui: input-otp
---

## Usage

```vue
<script setup lang="ts">
import { InputOtp } from 'herouse'
</script>
```

<ComponentPreview name="input-otp/basic" />

## Anatomy

HeroUI's `InputOTP` is a low-level anatomy component built on the [input-otp](https://github.com/guilhermerodz/input-otp) library: a single real `<input>` (invisible, but fully interactive) overlays a row of decorative slots, so typing, <kbd>Backspace</kbd>, arrow keys and paste are native browser text-editing behavior rather than custom per-slot focus management. `InputOtp` bundles that box together with a `Label`, `Description` and `FieldError`, following the same field convention as [SearchField](/docs/components/search-field) and [NumberField](/docs/components/number-field). Slots are laid out with `groups`, an array of slot counts per visual group; a separator is rendered between each group.

```vue
<template>
  <InputOtp v-model="code" :length="6" :groups="[3, 3]" label="…" description="…" error-message="…">
    <template #label />                       <!-- Label content -->
    <template #description />                 <!-- Description content -->
    <template #error="{ validationErrors }" /> <!-- FieldError content, rendered while invalid -->
  </InputOtp>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | — | root `<div>` (herouse-only), stacks label/box/description/error |
| — | `label` | [Label](/docs/components/label) (iff `label` / `#label`) |
| `root` | — | the box (`<div data-input-otp-container>`), HeroUI's `.input-otp` |
| `group` | `input-otp-group` | one `<div>` per entry in `groups` |
| `slot` | `input-otp-slot` | one `<div>` per character |
| `slotValue` | `input-otp-slot-value` | the character inside a filled slot |
| `caret` | `input-otp-caret` | blinking fake caret in the active, empty slot |
| `separator` | `input-otp-separator` | `<div>` between groups |
| `input` | `input-otp` | the real, invisible `<input>` that receives focus, typing and paste; carries `data-disabled` / `data-invalid` |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |
| — | `field-error` | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

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

Use the `pattern` prop to restrict input to specific characters: `'digits'`, `'chars'` or `'alphanumeric'`, mirroring HeroUI's exported `REGEXP_ONLY_DIGITS` / `REGEXP_ONLY_CHARS` / `REGEXP_ONLY_DIGITS_AND_CHARS` patterns.

<ComponentPreview name="input-otp/with-pattern" />

### With Validation

Use `invalid` together with `error-message` to surface errors.

<ComponentPreview name="input-otp/with-validation" />

## Customization

### Tailwind CSS

<ComponentPreview name="input-otp/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { inputOtp: { slots: { slot: 'size-12 rounded-xl border-2 font-bold' } } },
}))
```

## Styling Reference

### Slots

- `base` → root `<div>` — herouse-only flex-col wrapper around the label, box, description and error
- `root` → `[data-input-otp-container]` — the box; `relative flex w-full items-center gap-2`
- `group` → `[data-slot="input-otp-group"]` — one per entry in `groups`
- `slot` → `[data-slot="input-otp-slot"]` — a single character cell
- `slotValue` → `[data-slot="input-otp-slot-value"]` — the rendered character
- `caret` → `[data-slot="input-otp-caret"]` — the blinking fake caret
- `separator` → `[data-slot="input-otp-separator"]` — the dash between groups
- `input` → `[data-slot="input-otp"]` — the real, invisible `<input>` (as in HeroUI, where `input-otp` passes `data-slot` to the input)

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

## Accessibility

- A single native `<input>` carries focus, typing, selection and paste, so standard text-editing shortcuts (<kbd>Backspace</kbd>, arrow keys, <kbd>Home</kbd>/<kbd>End</kbd>, select-and-retype) work without extra wiring
- `autocomplete="one-time-code"` lets browsers and password managers offer SMS-delivered codes
- `label` associates with the input through `for`/`id`; `description` and `error-message` are wired via `aria-describedby`
- With `name`, the input submits its value with a form like any text field
- `required` and `pattern` participate in native HTML5 constraint validation alongside `validate`

## Related Components

<RelatedComponents :components="['search-field', 'number-field', 'form']" />
