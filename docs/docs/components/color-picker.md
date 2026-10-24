---
title: ColorPicker
description: A composable color picker that synchronizes color value between multiple color components
links:
  reka: popover
  source: color-picker/ColorPicker.vue
  styles: color-picker/theme.ts
  heroui: color-picker
---

## Usage

```vue
<script setup lang="ts">
import { ColorArea, ColorPicker, ColorSlider, ColorSwatch, Label } from '@hareui/vue'
</script>
```

<ComponentPreview name="color-picker/basic" />

## Anatomy

ColorPicker renders a trigger button and a popover. The `trigger` slot holds the button content, and the default slot holds the popover content. Color components placed in either slot without their own `v-model` read and write the picker's color.

```vue
<ColorPicker default-value="#0485F7">
  <template #trigger>
    <ColorSwatch />
    <Label>Pick a color</Label>
  </template>
  <ColorArea color-space="hsb" x-channel="saturation" y-channel="brightness" />
  <ColorSlider channel="hue" color-space="hsb" />
</ColorPicker>
```

## Examples

### Controlled

`v-model` accepts a hex string or a `Color` object and emits a `Color`. `v-model:open` controls the popover.

<ComponentPreview name="color-picker/controlled" />

### With Swatches

<ComponentPreview name="color-picker/with-swatches" />

### With Fields

Use `ColorField` to edit individual channels, with a `Select` to switch between color spaces.

<ComponentPreview name="color-picker/with-fields" />

### With Sliders

Use several `ColorSlider` components to adjust each channel.

<ComponentPreview name="color-picker/with-sliders" />

## Customization

### Tailwind CSS

<ComponentPreview name="color-picker/custom-styles" />

### Global CSS

```ts
app.use(
  createHareUI({
    ui: {
      colorPicker: {
        slots: {
          trigger: 'gap-4 rounded-lg',
          popover: 'rounded-xl p-4',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key  | `data-slot`            | Description                             |
| --------- | ---------------------- | --------------------------------------- |
| `base`    | `color-picker`         | Wrapper (inline-flex)                   |
| `trigger` | `color-picker-trigger` | Trigger button                          |
| `popover` | `color-picker-popover` | Popover container (portalled to `body`) |

### Interactive States

- **Focus**: `:focus-visible` or `data-focus-visible="true"`
- **Disabled**: `:disabled` or `data-disabled="true"`

## API Reference

### Props

<ApiTable component="ColorPicker" kind="props" />

### Slots

<ApiTable component="ColorPicker" kind="slots" />

### Emits

<ApiTable component="ColorPicker" kind="emits" />

### Theme

<ApiTheme component="ColorPicker" />

## Related Components

<RelatedComponents :components="['color-area', 'color-slider', 'color-field', 'color-swatch', 'color-swatch-picker']" />
