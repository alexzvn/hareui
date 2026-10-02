---
title: ColorSlider
description: A color slider allows users to adjust an individual channel of a color value
links:
  reka: color-slider
  source: ColorSlider.vue
  styles: colorSlider.ts
  heroui: color-slider
---

## Usage

```vue
<script setup lang="ts">
import { ColorSlider } from 'herouse'
</script>
```

<ComponentPreview name="color-slider/basic" />

## Anatomy

ColorSlider renders a [Label](/docs/components/label), an output with the formatted channel value, and a track with a thumb. The label comes from the `label` prop (or `#label`); the output is shown whenever there is a label (`show-output` overrides that). Without a label, pass `aria-label`.

```vue
<template>
  <ColorSlider channel="hue" label="Hue">
    <template #label />   <!-- Label content -->
    <template #output="{ channelName, channelValue, valueText }" />  <!-- Output content -->
    <template #thumb="{ channelName, channelValue, valueText }" />   <!-- Thumb content -->
  </ColorSlider>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `color-slider` | root |
| `label` | `label` | [Label](/docs/components/label) (iff `label` / `#label`) |
| `output` | `color-slider-output` | formatted channel value |
| `track` | `color-slider-track` | track with the channel gradient |
| `thumb` | `color-slider-thumb` | thumb showing the current color |

## Examples

### Disabled

<ComponentPreview name="color-slider/disabled" />

### Vertical

<ComponentPreview name="color-slider/vertical" />

### Controlled

Bind the color with `v-model`. It accepts a string or a `Color` and always commits a `Color` in the channel's colour space; use `colorToString(color, 'hsl')` to read it as a string.

<ComponentPreview name="color-slider/controlled" />

### HSL Channels

Use multiple ColorSliders to control different channels of a color value. The sliders can share the same color value to create a complete color picker.

<ComponentPreview name="color-slider/channels" />

### Alpha Channel

The alpha channel slider shows a transparency checkerboard pattern to help visualize the transparency level.

<ComponentPreview name="color-slider/alpha-channel" />

### RGB Channels

You can also use RGB color space with red, green, and blue channels.

<ComponentPreview name="color-slider/rgb-channels" />

### Render Function

HeroUI's `render` prop replaces the root element. In Vue, attributes you pass to `ColorSlider` fall through to the root element.

<ComponentPreview name="color-slider/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="color-slider/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { colorSlider: { slots: { output: 'text-muted', thumb: 'size-5' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="color-slider"]` – grid root
- `label` → `[data-slot="label"]`
- `output` → `[data-slot="color-slider-output"]`
- `track` → `[data-slot="color-slider-track"]` – gradient track; `::before` / `::after` are the edge caps
- `thumb` → `[data-slot="color-slider-thumb"]`

### Interactive States

- **Disabled**: `[data-disabled]` on the root and the thumb
- **Orientation**: `[data-orientation]` on the root, track and thumb
- **Focus Visible**: `:focus-visible` on the thumb
- **Dragging**: `:active` on the thumb

## API Reference

### Props

<ApiTable component="ColorSlider" kind="props" />

### Slots

<ApiTable component="ColorSlider" kind="slots" />

### Emits

<ApiTable component="ColorSlider" kind="emits" />

## Accessibility

- The thumb is a `role="slider"` labelled by the channel name, with a localised `aria-valuetext`
- Keyboard: arrow keys, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>PageUp</kbd> and <kbd>PageDown</kbd>
- `name` submits the colour as hex through a hidden input

## Related Components

<RelatedComponents :components="['label', 'color-swatch', 'color-picker']" />
