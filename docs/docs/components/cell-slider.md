---
title: CellSlider
description: A slider laid out as a settings row, with the label and the current value inside the track.
links:
  reka: slider
  source: cell-slider/CellSlider.vue
  styles: cell-slider/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { CellSlider } from '@hareui/vue'
</script>
```

<ComponentPreview name="cell-slider/basic" />

## Anatomy

CellSlider is a horizontal [Slider](/docs/components/slider) where the whole row is the track. The fill tints the row up to the value. The thumb shows as a thin bar while you hover the row, drag, or focus the thumb. The label sits at the start of the row and the value at the end.

```vue
<template>
  <CellSlider label="…">
    <template #label />
    <!-- label content -->
    <template #output="{ value, formatted }" />
    <!-- value at the end of the row -->
  </CellSlider>
</template>
```

| `ui` key | `data-slot`     | Element                                                                                  |
| -------- | --------------- | ---------------------------------------------------------------------------------------- |
| `base`   | `cell-slider`   | `<div role="group">` root                                                                |
| `label`  | `label`         | [Label](/docs/components/label) at the start of the row, when `label` or `#label` is set |
| `output` | `slider-output` | `<output>` at the end of the row                                                         |
| `track`  | `slider-track`  | `<span>`, the visible row                                                                |
| `fill`   | `slider-fill`   | `<span>` tint from the start of the row to the value                                     |
| `thumb`  | `slider-thumb`  | `<span role="slider">` hit area; the bar is its `::after`                                |

## Examples

### Controlled

Bind the value with `v-model`. The text below the row is computed from the current speed.

<ComponentPreview name="cell-slider/controlled" />

### Disabled

<ComponentPreview name="cell-slider/disabled" />

### Integer Step

`step` defaults to `1`, so the value moves in whole numbers. Set `min` and `max` to fit the range, here a font size from 10 to 24.

<ComponentPreview name="cell-slider/integer-step" />

### Secondary Group

Use `variant="secondary"` on a surface or card, where the default row would blend into the background.

<ComponentPreview name="cell-slider/secondary-group" />

### Settings Group

Stack rows under headings to build a filter panel. Pass `format-options` per row to show currency, units or decimals.

<ComponentPreview name="cell-slider/settings-group" />

### Variants

`default` is a field-colored row with a shadow and a gray fill. `secondary` uses the default background, no shadow and a translucent fill.

<ComponentPreview name="cell-slider/variants" />

## Customization

### Tailwind CSS

Pass classes per part with `ui`:

```vue
<template>
  <CellSlider
    label="Brightness"
    :default-value="60"
    :ui="{ fill: 'bg-accent/15', output: 'text-accent' }"
  />
</template>
```

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { cellSlider: { slots: { track: 'h-10', fill: 'bg-accent/10' } } },
  }),
)
```

The slots are merged over the [Slider](/docs/components/slider) theme, so `ui.slider` in the app config applies here too.

## Styling Reference

### Slots

- `base` → `[data-slot="cell-slider"]`: root, a one-row grid with the label and value columns over the track
- `track` → `[data-slot="slider-track"]`: the row (`h-9`, `rounded-field`); it clips the fill and the bar
- `fill` → `[data-slot="slider-fill"]`: value tint, full row height
- `thumb` → `[data-slot="slider-thumb"]`: transparent hit area, `1.25rem` wide; its `::after` is the `2px × 16px` bar
- `label` → `[data-slot="label"]`: label text; it truncates with an ellipsis when the value needs the room
- `output` → `[data-slot="slider-output"]`: formatted value, tabular figures

The row background reads `--cell-bg-current`, so a plain `bg-*` class in `ui.track` wins on hover too. The variants set `--cell-bg` and `--cell-bg-hover`.

### Interactive States

- **Disabled**: `[data-disabled]` on the root, the track and the thumb
- **Hover**: the row tints and the bar fades in to 40%
- **Dragging**: `[data-dragging="true"]` on the thumb; the bar shows at 70% and stretches
- **Focus Visible**: `[data-focus-visible="true"]` on the thumb; the bar shows at 70% with the focus ring

## API Reference

### Props

<ApiTable component="CellSlider" kind="props" />

### Slots

<ApiTable component="CellSlider" kind="slots" />

### Emits

<ApiTable component="CellSlider" kind="emits" />

## Theme

<ApiTheme component="CellSlider" />

## Accessibility

- The thumb has `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` set to the formatted value, and `aria-disabled="true"` while disabled
- The label names the root group and the thumb through `aria-labelledby`; without a label, pass `aria-label`
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> step by `step`, <kbd>PageUp</kbd>/<kbd>PageDown</kbd> and <kbd>Shift</kbd> + arrows move a tenth of the range, <kbd>Home</kbd>/<kbd>End</kbd> jump to `min`/`max`
- The label and value ignore the pointer, so a press anywhere on the row moves the value

## Related Components

<RelatedComponents :components="['slider', 'cell-switch', 'number-stepper']" />
