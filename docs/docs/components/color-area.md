---
title: ColorArea
description: A 2D color picker that allows users to select colors from a gradient area
links:
  reka: color-area
  source: color-area/ColorArea.vue
  styles: color-area/theme.ts
  heroui: color-area
---

## Usage

```vue
<script setup lang="ts">
import { ColorArea } from '@hareui/vue'
</script>
```

<ComponentPreview name="color-area/basic" />

## Anatomy

ColorArea renders the gradient area with its draggable thumb built in (HeroUI's `ColorArea.Thumb` child). Style the parts with `class` and `ui`.

```vue
<template>
  <ColorArea />
</template>
```

| `ui` key | `data-slot`        | Element                                  |
| -------- | ------------------ | ---------------------------------------- |
| `base`   | `color-area`       | `<div role="application">` gradient area |
| `thumb`  | `color-area-thumb` | `<div role="slider">` thumb              |

## Examples

### With Dots

<ComponentPreview name="color-area/with-dots" />

### Color Space & Channels

Use `color-space` to set the color space (RGB, HSL, HSB) and the `channel` of `x` / `y` to choose which channels are shown on each axis.

<ComponentPreview name="color-area/space-and-channels" />

### Disabled

<ComponentPreview name="color-area/disabled" />

### Controlled

Bind the value with `v-model`. The committed value is always a `Color` object; use `colorToString(color, 'hex')` to read it as a string. Inside a ColorPicker the area reads and writes the picker's colour instead.

<ComponentPreview name="color-area/controlled" />

### Render Function

HeroUI's `render` prop replaces the root element. In Vue, attributes you pass to `ColorArea` fall through to the root element.

<ComponentPreview name="color-area/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="color-area/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { colorArea: { slots: { base: 'rounded-3xl', thumb: 'size-5 border-4' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="color-area"]` – gradient area with inner shadow
- `thumb` → `[data-slot="color-area-thumb"]` – draggable thumb

### Variants

- `showDots` – adds a dot grid overlay for precision picking

### Interactive States

- **Disabled**: `[data-disabled]` on the area and thumb
- **Focus Visible**: `:focus-visible` on the thumb
- **Dragging**: `[data-dragging="true"]` on the thumb

## API Reference

### Props

<ApiTable component="ColorArea" kind="props" />

### Emits

<ApiTable component="ColorArea" kind="emits" />

### Theme

<ApiTheme component="ColorArea" />

## Accessibility

- The area is `role="application"` and the thumb a `role="slider"` with an `aria-valuetext` describing both channels
- Keyboard: arrow keys move the thumb on both axes, <kbd>PageUp</kbd>/<kbd>PageDown</kbd>/<kbd>Home</kbd>/<kbd>End</kbd> take larger steps

## Related Components

<RelatedComponents :components="['color-swatch', 'color-field']" />
