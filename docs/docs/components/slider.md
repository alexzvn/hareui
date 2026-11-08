---
title: Slider
description: A slider allows a user to select one or more values within a range
links:
  source: slider/Slider.vue
  styles: slider/theme.ts
  heroui: slider
---

## Usage

```vue
<script setup lang="ts">
import { Slider } from '@hareui/vue'
</script>
```

<ComponentPreview name="slider/default" />

## Anatomy

Slider renders a [Label](/docs/components/label), an output showing the formatted value, and a track holding the fill and one thumb per value. A number value renders one thumb. An array renders one thumb per entry, so a two-element array makes a range slider.

```vue
<template>
  <Slider label="…" :default-value="[25, 75]">
    <template #label />
    <!-- Label content -->
    <template #output="{ values, formatted }" />
    <!-- output content (default: formatted values joined by ' – ') -->
  </Slider>
</template>
```

| `ui` key | `data-slot`     | Element                                                  |
| -------- | --------------- | -------------------------------------------------------- |
| `base`   | `slider`        | `<div>` root                                             |
| `label`  | `label`         | [Label](/docs/components/label) (iff `label` / `#label`) |
| `output` | `slider-output` | `<output>`                                               |
| `track`  | `slider-track`  | `<span>`                                                 |
| `fill`   | `slider-fill`   | `<span>`                                                 |
| `thumb`  | `slider-thumb`  | `<span role="slider">`, one per value                    |

## Examples

### Disabled

<ComponentPreview name="slider/disabled" />

### Vertical

<ComponentPreview name="slider/vertical" />

### Range

<ComponentPreview name="slider/range" />

### Controlled Value

Control the value with `v-model`. `change-end` fires with the final value when a drag or key press commits it.

<ComponentPreview name="slider/controlled" />

### Custom Value Formatting

Use `format-options` to format the displayed value. This example formats it as USD.

<ComponentPreview name="slider/custom-value-formatting" />

### Custom Output

Use the `#output` slot to control how the selected values are shown.

<ComponentPreview name="slider/custom-output" />

### Render Function

<ComponentPreview name="slider/render-function" />

Attributes such as `data-*` fall through to the root element.

## Customization

### Tailwind CSS

<ComponentPreview name="slider/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { slider: { slots: { output: 'text-muted', thumb: 'rounded-full' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="slider"]` – grid with the label and output on the first row and the track below (vertical: output, track, label stacked)
- `output` → `[data-slot="slider-output"]` – formatted value(s)
- `track` → `[data-slot="slider-track"]` – track. Transparent borders leave room for the thumb at the edges
- `fill` → `[data-slot="slider-fill"]` – selected part of the track
- `thumb` → `[data-slot="slider-thumb"]` – draggable thumb

### Interactive States

- **Disabled**: `[data-disabled]` on the slider and thumbs
- **Vertical**: `[data-orientation="vertical"]`
- **Dragging**: `[data-dragging="true"]` on the thumb being dragged
- **Focus**: `:focus-visible` on the thumb
- **Fill edges**: `[data-fill-start="true"]` / `[data-fill-end="true"]` on the track when the fill reaches the start or end

## API Reference

### Props

<ApiTable component="Slider" kind="props" />

### Slots

<ApiTable component="Slider" kind="slots" />

### Emits

<ApiTable component="Slider" kind="emits" />

## Theme

<ApiTheme component="Slider" />

## Accessibility

- Implements the ARIA slider pattern. The root is a `role="group"`, and each thumb is a `role="slider"`
- Each thumb reports its value with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
- `aria-valuetext` carries the formatted value, and `aria-disabled="true"` is set while disabled
- Arrow keys step by `step`
- Page Up, Page Down and Shift + Arrow step by a tenth of the range, and at least one `step`
- Home and End jump to `min` and `max`
- Range thumbs can't cross. A thumb stops at its neighbour's value, and Home / End move the focused thumb to the edge of its own range
- `label` names the slider and every thumb through `aria-labelledby`. Without one, pass `aria-label`
- With `name`, a hidden input submits the value with a form
- Right-to-left layouts are supported

## Related Components

<RelatedComponents :components="['number-field']" />
