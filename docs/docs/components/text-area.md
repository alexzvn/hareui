---
title: TextArea
description: Primitive multiline text input component that accepts standard HTML attributes
links:
  source: TextArea.vue
  styles: textArea.ts
  heroui: text-area
---

## Usage

```ts
import { TextArea } from 'herouse'
```

<ComponentPreview name="textarea/basic" />

::: tip
For validation, labels, and error messages, see **[TextField](/docs/components/text-field)**.
:::

## Examples

### Variants

The TextArea component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in Surface components

<ComponentPreview name="textarea/variants" />

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="textarea/on-surface" />

### Full Width

<ComponentPreview name="textarea/full-width" />

### Controlled

<ComponentPreview name="textarea/controlled" />

### Rows and Resizing

<ComponentPreview name="textarea/rows" />

## Customization

### Tailwind CSS

<ComponentPreview name="textarea/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: {
    textArea: {
      slots: { base: 'rounded-xl px-4 py-3 leading-6' },
      defaultVariants: { variant: 'secondary' },
    },
  },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="textarea"]` – Underlying `<textarea>` element styling

### Interactive States

- **Hover**: `:hover` (when not focused)
- **Focus Visible**: `:focus`
- **Invalid**: `[data-invalid="true"]`
- **Disabled**: `:disabled`, `[data-disabled="true"]` or `[aria-disabled="true"]`

## API Reference

TextArea accepts all standard HTML `<textarea>` attributes (`rows`, `cols`, `maxlength`, `minlength`, `wrap`, `autocomplete`, …) plus the following:

### Props

<ApiTable component="TextArea" kind="props" />

### Emits

<ApiTable component="TextArea" kind="emits" />

> For validation props like `invalid`, `required`, and error handling, use **[TextField](/docs/components/text-field)** with TextArea in its default slot.

## Related Components

<RelatedComponents :components="['text-field', 'input', 'surface']" />
