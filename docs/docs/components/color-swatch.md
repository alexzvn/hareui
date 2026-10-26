---
title: ColorSwatch
description: A visual preview of a color value with accessibility support
links:
  reka: color-swatch
  source: color-swatch/ColorSwatch.vue
  styles: color-swatch/theme.ts
  heroui: color-swatch
---

## Usage

```vue
<script setup lang="ts">
import { ColorSwatch } from '@hareui/vue'
</script>
```

<ComponentPreview name="color-swatch/basic" />

## Examples

### Sizes

<ComponentPreview name="color-swatch/sizes" />

### Shapes

<ComponentPreview name="color-swatch/shapes" />

### Transparency

<ComponentPreview name="color-swatch/transparency" />

### Render Function

The default slot gives you the resolved color (as a CSS string) and its alpha channel to build custom visual effects.

<ComponentPreview name="color-swatch/render-function" />

### Accessibility

Use `colorName` to provide a custom accessible name for the color, and `aria-label` to add context about how the color is used.

<ComponentPreview name="color-swatch/accessibility" />

## Customization

### Tailwind CSS

<ComponentPreview name="color-swatch/custom-styles" />

### Global CSS

To customize the ColorSwatch component classes app-wide, override the `colorSwatch` theme with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      colorSwatch: {
        slots: {
          base: 'border-2 border-white',
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot`    | Description                                                   |
| -------- | -------------- | ------------------------------------------------------------- |
| `base`   | `color-swatch` | Base swatch styles with checkered background for transparency |

## API Reference

### Props

<ApiTable component="ColorSwatch" kind="props" />

### Slots

<ApiTable component="ColorSwatch" kind="slots" />

### Theme

<ApiTheme component="ColorSwatch" />

## Related Components

<RelatedComponents :components="['color-swatch-picker']" />
