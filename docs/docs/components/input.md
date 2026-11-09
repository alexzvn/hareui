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

Attributes and listeners that aren't props fall through to the `<input>`. Examples are `aria-label`, `min` and `autocomplete`.

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

### Model Modifiers

`v-model` takes these modifiers. They combine, for example `v-model.trim.nullable`.

| Modifier   | Effect                                               |
| ---------- | ---------------------------------------------------- |
| `trim`     | Removes spaces at the start and end                  |
| `number`   | Turns the value into a number when it reads as one   |
| `lazy`     | Updates when the input loses focus, not on every key |
| `nullable` | An emptied input is `null`                           |
| `optional` | An emptied input is `undefined`                      |

`nullable` wins when both are set. `0` counts as a value, not as empty.

<ComponentPreview name="input/model-modifiers" />

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

The input reads these field tokens:

- `--field-border`, `--field-border-hover` and `--field-border-focus`
- `--field-focus`
- `--border-width-field`

The `secondary` variant adds the `--input-bg` token and its hover and focus versions.

## Styling Reference

### Slots

- `base` → `[data-slot="input"]` – native input element styling

### CSS classes

The root carries `.h-input` plus `.h-input--secondary` and `.h-input--full-width` from the matching props. They live in `@layer components`, so any utility from `class` or `ui` wins over them.

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

> For labels, descriptions and error messages, use **[TextField](/docs/components/text-field)**. An `Input` placed in its default slot inherits from the field:
>
> - the id and `aria-describedby`
> - `invalid`, `disabled` and `required`
> - `variant` and `fullWidth`

## Theme

<ApiTheme component="Input" />

## Related Components

<RelatedComponents :components="['text-field', 'label', 'description']" />
