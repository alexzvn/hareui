---
title: Description
description: Provides supplementary text for form fields and other components
links:
  source: description/Description.vue
  styles: description/theme.ts
  heroui: description
---

## Usage

```vue
<script setup lang="ts">
import { Description } from '@hareui/vue'
</script>
```

<ComponentPreview name="description/basic" />

## Anatomy

| `ui` key | `data-slot`   | Element  |
| -------- | ------------- | -------- |
| `base`   | `description` | `<span>` |

## Examples

### With Form Fields

```vue
<div class="flex flex-col gap-1">
  <Label for="password">Password</Label>
  <Input id="password" type="password" aria-describedby="password-description" />
  <Description id="password-description">
    Must be at least 8 characters with one uppercase letter
  </Description>
</div>
```

### Integration with TextField

```vue
<template>
  <TextField
    type="email"
    label="Email"
    placeholder="Enter your email"
    description="We'll never share your email"
  />
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
</script>
```

When using the [TextField](/docs/components/text-field) component, the description id and the input's `aria-describedby` are wired automatically.

## Customization

### Tailwind CSS

<ComponentPreview name="description/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { description: { slots: { base: 'text-muted' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="description"]` — `text-xs text-muted`, wraps long words

Inside a [TextField](/docs/components/text-field) with `[data-invalid="true"]`, the description is hidden.

## API Reference

### Props

<ApiTable component="Description" kind="props" />

### Slots

<ApiTable component="Description" kind="slots" />

## Theme

<ApiTheme component="Description" />

## Accessibility

The Description component enhances accessibility by:

- Using semantic HTML that screen readers can identify
- Exposing an `id` to reference from the control's `aria-describedby` (automatic inside TextField)
- Supporting proper text contrast ratios

## Related Components

<RelatedComponents :components="['text-field', 'label', 'field-error']" />
