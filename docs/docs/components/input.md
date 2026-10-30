---
title: Input
description: Primitive single-line text input component that accepts standard HTML attributes
links:
  source: input/Input.vue
  styles: input/theme.ts
  heroui: input
---

## Usage

```vue
<script setup lang="ts">
import { Input } from '@hareui/vue'
</script>
```

<ComponentPreview name="input/basic" />

::: tip
For validation, labels, and error messages, see **[TextField](/docs/components/text-field)**.
:::

## Anatomy

| `ui` key | `data-slot` | Element   |
| -------- | ----------- | --------- |
| `base`   | `input`     | `<input>` |

Attributes not declared as props (`aria-label`, `min`, `max`, `autocomplete`, listeners…) fall through to the `<input>`.

## Examples

### Variants

The Input component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use on surface backgrounds

<ComponentPreview name="input/variants" />

### In Surface

When used on a surface background (such as a `bg-surface` container), use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="input/on-surface" />

### Full Width

<ComponentPreview name="input/full-width" />

### Input Types

<ComponentPreview name="input/types" />

### Controlled

Bind the value with `v-model`.

<ComponentPreview name="input/controlled" />

## Customization

### Tailwind CSS

<ComponentPreview name="input/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: {
      input: {
        slots: { base: 'rounded-lg px-4' },
        defaultVariants: { variant: 'secondary' },
      },
    },
  }),
)
```

### CSS Variables

The input reads the field tokens `--field-border`, `--field-border-hover`, `--field-border-focus`, `--field-focus` and `--border-width-field`; the `secondary` variant adds `--input-bg`, `--input-bg-hover` and `--input-bg-focus`.

## Styling Reference

### Slots

- `base` → `[data-slot="input"]` – native input element styling

### Interactive States

- **Hover**: `:hover` (when not focused)
- **Focus Visible**: `:focus` (focus styles apply on any focus)
- **Invalid**: `[data-invalid="true"]` (set with `aria-invalid` by the `invalid` prop)
- **Disabled**: `:disabled`, `[data-disabled="true"]` or `[aria-disabled="true"]`
- **Read Only**: `[readonly]` (set by the `readonly` prop)

## API Reference

### Props

<ApiTable component="Input" kind="props" />

### Emits

<ApiTable component="Input" kind="emits" />

> For labels, descriptions and error messages, use **[TextField](/docs/components/text-field)**; an `Input` placed in its default slot inherits the field's id, `aria-describedby`, `invalid`, `disabled`, `required`, `variant` and `fullWidth`.

## Theme

<ApiTheme component="Input" />

## Related Components

<RelatedComponents :components="['text-field', 'label', 'description']" />
