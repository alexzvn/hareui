---
title: Spinner
description: A loading indicator component to show pending states
links:
  source: spinner/Spinner.vue
  styles: spinner/theme.ts
  heroui: spinner
---

## Usage

```ts
import { Spinner } from '@hareui/vue'
```

<ComponentPreview name="spinner/basic" />

## Anatomy

Spinner is a single component with one slot.

`ui` keys: `base`.

## Examples

### Colors

<ComponentPreview name="spinner/colors" />

### Sizes

<ComponentPreview name="spinner/sizes" />

### Speed

Apply an animation utility via the `class` prop to change how fast a single spinner
rotates. Pair it with `motion-reduce:animate-none` so it stays still for users who
prefer reduced motion.

<ComponentPreview name="spinner/speed" />

## Customization

### Tailwind CSS

<ComponentPreview name="spinner/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      spinner: {
        defaultVariants: { color: 'current' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot` | Description                     |
| -------- | ----------- | ------------------------------- |
| `base`   | `spinner`   | The root `<span role="status">` |

## API Reference

### Props

<ApiTable component="Spinner" kind="props" />

## Theme

<ApiTheme component="Spinner" />

## Related Components

<RelatedComponents :components="['button']" />
