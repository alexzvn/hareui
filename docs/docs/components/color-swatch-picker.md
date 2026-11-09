---
title: ColorSwatchPicker
description: A list of color swatches that allows users to select a color from a predefined palette.
links:
  reka: color-swatch-picker
  source: color-swatch-picker/ColorSwatchPicker.vue
  styles: color-swatch-picker/theme.ts
  heroui: color-swatch-picker
---

## Usage

```vue
<script setup lang="ts">
import { ColorSwatchPicker } from '@hareui/vue'
</script>
```

<ComponentPreview name="color-swatch-picker/basic" />

## Items

Pass the swatches as `items`. Each one is a hex or CSS color string. Use an object `{ value, label?, disabled? }` to give a swatch an accessible name or disable it. Each item renders a [ColorSwatch](/docs/components/color-swatch) plus a check indicator. Selection is matched by color, so `#8b5cf6` and `#8B5CF6` are the same item.

```vue
<ColorSwatchPicker v-model="color" :items="['#F43F5E', { value: '#3B82F6', label: 'Sky' }]" />
```

## Examples

### Variants

<ComponentPreview name="color-swatch-picker/variants" />

### Sizes

<ComponentPreview name="color-swatch-picker/sizes" />

### Disabled

<ComponentPreview name="color-swatch-picker/disabled" />

### Stack Layout

<ComponentPreview name="color-swatch-picker/stack-layout" />

### Default Value

<ComponentPreview name="color-swatch-picker/default-value" />

### Controlled

`v-model` accepts a hex string or a `Color` object. When it is a `Color`, updates emit a `Color`.

<ComponentPreview name="color-swatch-picker/controlled" />

### Custom Indicator

The `indicator` slot replaces the check icon. The `default` slot replaces the whole item content and receives `{ value, label, selected }`.

<ComponentPreview name="color-swatch-picker/custom-indicator" />

### Render Function

Use `as` (or `as-child`) to change the root element.

<ComponentPreview name="color-swatch-picker/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="color-swatch-picker/custom-styles" />

### Global CSS

```ts
app.use(
  createHareUI({
    ui: {
      colorSwatchPicker: {
        slots: {
          base: 'gap-4',
          item: 'shadow-md',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key    | `data-slot`                     | Description                                         |
| ----------- | ------------------------------- | --------------------------------------------------- |
| `base`      | `color-swatch-picker`           | Container (flex, wraps)                             |
| `item`      | `color-swatch-picker-item`      | One selectable swatch; ring when selected           |
| `swatch`    | `color-swatch-picker-swatch`    | The ColorSwatch inside the item                     |
| `indicator` | `color-swatch-picker-indicator` | Check icon wrapper, shown on the selected item only |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The ColorSwatchPicker component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/color-swatch-picker/color-swatch-picker.css)):

#### Base Classes

- `.h-color-swatch-picker` - Base container (flex layout)
- `.h-color-swatch-picker__item` - Individual swatch item wrapper
- `.h-color-swatch-picker__swatch` - The colour swatch visual element
- `.h-color-swatch-picker__indicator` - Checkmark shown on the selected item

#### Size Classes

- `.h-color-swatch-picker--xs` - Extra small (16px)
- `.h-color-swatch-picker--sm` - Small (24px)
- `.h-color-swatch-picker--lg` - Large (36px)
- `.h-color-swatch-picker--xl` - Extra large (40px)

The `md` size (32px) is the default and emits no class.

#### Variant Classes

- `.h-color-swatch-picker--square` - Square shape with rounded corners

The `circle` variant is the default and emits no class.

#### Layout Classes

- `.h-color-swatch-picker--stack` - Vertical stacked layout

The `grid` layout (horizontal wrapping) is the default and emits no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- **Hover**: swatch scales to 1.1 (not while selected)
- **Focus**: `:focus-visible` focus ring
- **Selected**: `data-state="checked"`: border in the swatch color, swatch shrinks to reveal a gap
- **Disabled**: `data-disabled`: reduced opacity

## API Reference

### Props

<ApiTable component="ColorSwatchPicker" kind="props" />

### Slots

<ApiTable component="ColorSwatchPicker" kind="slots" />

### Emits

<ApiTable component="ColorSwatchPicker" kind="emits" />

## Theme

<ApiTheme component="ColorSwatchPicker" />

## Related Components

<RelatedComponents :components="['color-swatch', 'color-picker']" />
