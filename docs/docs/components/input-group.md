---
title: InputGroup
description: Group related input controls with prefix and suffix elements for enhanced form fields
links:
  source: input-group/InputGroup.vue
  styles: input-group/theme.ts
  heroui: input-group
---

## Usage

```vue
<script setup lang="ts">
import { InputGroup } from '@hareui/vue'
</script>
```

<ComponentPreview name="input-group/default" />

## Anatomy

InputGroup wraps an input with optional prefix and suffix elements in one visually cohesive group. It's typically placed in the default slot of a [TextField](/docs/components/text-field), replacing the field's own input, to add icons, text, buttons or other elements before or after the input. Set `textarea` for multiline input.

```vue
<template>
  <TextField label="…">
    <InputGroup prefix="…" suffix="…">
      <template #prefix />  <!-- content before the input; replaces `prefix` -->
      <template #suffix />  <!-- content after the input; replaces `suffix` -->
    </InputGroup>
  </TextField>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `input-group` | `<div role="group">` root |
| `prefix` | `input-group-prefix` | `<div>` (iff `prefix` / `#prefix`) |
| `input` | `input-group-input` | `<input>` |
| `input` | `input-group-textarea` | `<textarea>` (instead of the input, iff `textarea`) |
| `suffix` | `input-group-suffix` | `<div>` (iff `suffix` / `#suffix`) |

Inside a TextField, the group takes the field's id, name, type, value, `variant`, `fullWidth` and its disabled, invalid, required and read-only states. Its own props win when set. Clicking anywhere in the group outside the input focuses the input, except on interactive content such as a suffix button, which keeps focus.

## Examples

### Variants

The InputGroup component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in surfaces

<ComponentPreview name="input-group/variants" />

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="input-group/on-surface" />

### Loading State

Show a loading spinner in the suffix to indicate processing.

<ComponentPreview name="input-group/with-loading-suffix" />

### Required Field

InputGroup respects the required state from its parent TextField.

<ComponentPreview name="input-group/required" />

### Disabled State

InputGroup respects the disabled state from its parent TextField.

<ComponentPreview name="input-group/disabled" />

### Full Width

<ComponentPreview name="input-group/full-width" />

### Text Prefix

Use text as a prefix, such as currency symbols or protocol prefixes.

<ComponentPreview name="input-group/with-text-prefix" />

### Text Suffix

Use text as a suffix, such as domain extensions or units.

<ComponentPreview name="input-group/with-text-suffix" />

### Icon Prefix and Text Suffix

Combine an icon prefix with a text suffix.

<ComponentPreview name="input-group/with-icon-prefix-and-text-suffix" />

### Copy Button Suffix

Add an interactive button in the suffix, such as a copy button. `:ui="{ suffix: 'pe-0' }"` lets the button sit flush with the edge.

<ComponentPreview name="input-group/with-copy-suffix" />

### Icon Prefix and Copy Button

Combine an icon prefix with an interactive button suffix.

<ComponentPreview name="input-group/with-icon-prefix-and-copy-suffix" />

### Password Toggle

Use a button in the suffix to toggle password visibility.

<ComponentPreview name="input-group/password-with-toggle" />

### Keyboard Shortcut

Display keyboard shortcuts using the [Kbd](/docs/components/kbd) component.

<ComponentPreview name="input-group/with-keyboard-shortcut" />

### Badge Suffix

Add a badge or chip in the suffix to show status or labels.

<ComponentPreview name="input-group/with-badge-suffix" />

### Validation

InputGroup automatically reflects invalid state from its parent TextField.

<ComponentPreview name="input-group/invalid" />

### With Prefix Icon

Add an icon before the input field.

<ComponentPreview name="input-group/with-prefix-icon" />

### With Suffix Icon

Add an icon after the input field.

<ComponentPreview name="input-group/with-suffix-icon" />

### With Prefix and Suffix

Combine both prefix and suffix elements.

<ComponentPreview name="input-group/with-prefix-and-suffix" />

### With TextArea

Set `textarea` (with `rows`) for multiline text input with prefix and suffix elements. When a textarea is present, the container adjusts its height to the content and aligns the prefix and suffix to the top.

<ComponentPreview name="input-group/with-textarea" />

### TextArea Usage Example

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { InputGroup, TextField } from '@hareui/vue'
import { ref } from 'vue'

const feedback = ref('')
</script>

<template>
  <TextField
    v-model="feedback"
    full-width
    name="feedback"
    label="Your Feedback"
    :invalid="feedback.length > 500"
    error-message="Feedback must be less than 500 characters"
  >
    <InputGroup
      textarea
      full-width
      :rows="5"
      :ui="{ input: 'resize-none' }"
      placeholder="Share your thoughts, suggestions, or issues..."
    >
      <template #prefix>
        <Icon icon="gravity-ui:envelope" class="size-4 text-muted" />
      </template>
    </InputGroup>
    <template #description>
      <span class="flex w-full items-center justify-between px-1">
        <span>Maximum 500 characters.</span>
        <span class="ml-auto">{{ feedback.length }}/500</span>
      </span>
    </template>
  </TextField>
</template>
```

## Customization

### Tailwind CSS

<ComponentPreview name="input-group/custom-styles" />

### Global Configuration

```ts
app.use(createHareUI({
  ui: { inputGroup: { slots: { prefix: 'px-2', suffix: 'px-2' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="input-group"]` – root container with border, background and flex layout. Uses `min-h-9` and `items-center`, switching to `items-start` with auto height when a textarea is present.
- `input` → `[data-slot="input-group-input"]` / `[data-slot="input-group-textarea"]` – the input (or textarea) with a transparent background and no border. The textarea adds a minimum height and vertical resize.
- `prefix` → `[data-slot="input-group-prefix"]` – prefix container with the start-side radius. Aligns to the top with a textarea.
- `suffix` → `[data-slot="input-group-suffix"]` – suffix container with the end-side radius. Aligns to the top with a textarea.

### Variants

- `variant: 'primary'` – with shadow (default)
- `variant: 'secondary'` – without shadow, `bg-default`, for use in surfaces
- `fullWidth: true` – `w-full`

### Interactive States

- **Hover**: `:hover` while the input isn't focused
- **Focus**: `:has([data-slot="input-group-input"]:focus)` – focus ring follows the input or textarea only, not a prefix/suffix button
- **Invalid**: `[data-invalid="true"]` – from the `invalid` prop or the parent TextField
- **Disabled**: `[data-disabled="true"]` or `[aria-disabled="true"]` – from the `disabled` prop or the parent TextField

## API Reference

### Props

<ApiTable component="InputGroup" kind="props" />

### Slots

<ApiTable component="InputGroup" kind="slots" />

### Emits

<ApiTable component="InputGroup" kind="emits" />

### Theme

<ApiTheme component="InputGroup" />

## Related Components

<RelatedComponents :components="['text-field', 'input', 'search-field']" />
