---
title: FieldError
description: Displays validation error messages for form fields
links:
  source: field-error/FieldError.vue
  styles: field-error/theme.ts
  heroui: field-error
---

## Usage

```vue
<script setup lang="ts">
import { FieldError } from '@hareui/vue'
</script>
```

<ComponentPreview name="field-error/basic" />

The FieldError component displays validation error messages for form fields. Fields render it automatically while they are invalid: from the `error-message` prop or `#error` slot, or else from their validation errors (native constraints, `validate`, or a [Form](/docs/components/form)'s `validation-errors`).

## Anatomy

| `ui` key | `data-slot`   | Element               |
| -------- | ------------- | --------------------- |
| `base`   | `field-error` | `<span role="alert">` |

## Examples

### Basic Validation

```vue
<template>
  <TextField
    v-model="value"
    class="w-64"
    label="Username"
    placeholder="Enter username"
    :invalid="invalid"
    error-message="Username must be at least 3 characters"
  />
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
import { computed, ref } from 'vue'

const value = ref('')
const invalid = computed(() => value.value.length > 0 && value.value.length < 3)
</script>
```

### With Dynamic Messages

```vue
<TextField :invalid="errors.length > 0" label="Password" type="password">
  <template #error>
    {{ errors.join(', ') }}
  </template>
</TextField>
```

### Custom Validation Logic

```vue
<template>
  <TextField
    v-model="email"
    type="email"
    label="Email"
    :invalid="invalid"
    error-message="Email must include @ symbol"
  />
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
import { computed, ref } from 'vue'

const email = ref('')
const invalid = computed(() => email.value.length > 0 && !email.value.includes('@'))
</script>
```

### Multiple Error Messages

```vue
<TextField :invalid="hasErrors" label="Username">
  <template #error>
    <div v-for="error in errors" :key="error">
      {{ error }}
    </div>
  </template>
</TextField>
```

## Customization

### Tailwind CSS

<ComponentPreview name="field-error/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { fieldError: { slots: { base: 'font-medium text-danger' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="field-error"]` — danger color, collapsed (`h-0 opacity-0`) unless `[data-visible]` is present (always set by HareUI)

Inside toggle fields (`[data-slot="checkbox"]`, `[data-slot="switch"]`, `[data-slot="radio"]`) the error is stacked like a description without the collapse transition.

## API Reference

### Props

<ApiTable component="FieldError" kind="props" />

### Slots

<ApiTable component="FieldError" kind="slots" />

### Theme

<ApiTheme component="FieldError" />

## Accessibility

The FieldError component ensures accessibility by:

- Using `role="alert"` so the message is announced when it appears
- Being referenced from the input's `aria-describedby` inside TextField
- Providing visual and programmatic error indication (`aria-invalid` on the input)
- Automatically managing visibility based on validation state (rendered only while the field is invalid)

## Related Components

<RelatedComponents :components="['text-field', 'description', 'label']" />
