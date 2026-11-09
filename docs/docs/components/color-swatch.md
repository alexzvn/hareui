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

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key | `data-slot`    | Description                                                   |
| -------- | -------------- | ------------------------------------------------------------- |
| `base`   | `color-swatch` | Base swatch styles with checkered background for transparency |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The ColorSwatch component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/color-swatch/color-swatch.css)):

#### Base Classes

- `.h-color-swatch` - Base swatch styles with checkered background for transparency

#### Shape Classes

- `.h-color-swatch--circle` - Circular shape (default)
- `.h-color-swatch--square` - Square shape with rounded corners

#### Size Classes

- `.h-color-swatch--xs` - Extra small (16px)
- `.h-color-swatch--sm` - Small (24px)
- `.h-color-swatch--lg` - Large (36px)
- `.h-color-swatch--xl` - Extra large (40px)

The `md` size (32px) is the default and emits no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="ColorSwatch" kind="props" />

### Slots

<ApiTable component="ColorSwatch" kind="slots" />

## Theme

<ApiTheme component="ColorSwatch" />

## Related Components

<RelatedComponents :components="['color-swatch-picker']" />
