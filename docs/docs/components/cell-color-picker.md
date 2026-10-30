---
title: CellColorPicker
description: A settings row that shows a color and opens a picker.
links:
  reka: popover
  source: cell-color-picker/CellColorPicker.vue
  styles: cell-color-picker/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { CellColorPicker } from '@hareui/vue'
</script>
```

<ComponentPreview name="cell-color-picker/basic" />

## Anatomy

CellColorPicker is a [ColorPicker](/docs/components/color-picker) whose trigger is one row: the label at the start, the hex value and a [ColorSwatch](/docs/components/color-swatch) at the end. The popover opens below the row, aligned to its end, with a saturation/brightness [ColorArea](/docs/components/color-area) and a hue [ColorSlider](/docs/components/color-slider). Pass `presets` to add a [ColorSwatchPicker](/docs/components/color-swatch-picker) on top, or fill the popover yourself with the default slot.

```vue
<template>
  <CellColorPicker label="…" :presets="…">
    <template #label />
    <!-- row label content -->
    <template #value />
    <!-- value content (receives color, hex) -->
    <template #default />
    <!-- popover content (receives color, close) -->
  </CellColorPicker>
</template>
```

| `ui` key       | `data-slot`                       | Element                                                                           |
| -------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| `base`         | `cell-color-picker`               | `<div>` root                                                                      |
| —              | `color-picker`                    | [ColorPicker](/docs/components/color-picker)                                      |
| `trigger`      | `color-picker-trigger`            | `<button>` row                                                                    |
| `label`        | `cell-color-picker-label`         | `<span>` row label                                                                |
| `valueDisplay` | `cell-color-picker-value-display` | `<span>` hex value                                                                |
| `swatch`       | `color-swatch`                    | [ColorSwatch](/docs/components/color-swatch)                                      |
| `popover`      | `color-picker-popover`            | popover content                                                                   |
| `presets`      | `color-swatch-picker`             | [ColorSwatchPicker](/docs/components/color-swatch-picker) (when `presets` is set) |

## Examples

### Controlled

Bind the color with `v-model`. The emitted value is a `Color`; format it with `colorToString`. Here the terminal cursor below follows the row.

<ComponentPreview name="cell-color-picker/controlled" />

### Disabled

`disabled` locks the row and keeps it from opening.

<ComponentPreview name="cell-color-picker/disabled" />

### Settings Group

Give each row its own color and group them, here one color per activity in a workout chart.

<ComponentPreview name="cell-color-picker/settings-group" />

### Variants

`default` has a field background and shadow for the page. Use `secondary` on surfaces such as cards.

<ComponentPreview name="cell-color-picker/variants" />

### With Presets

The default slot replaces the popover content. This one has a hex field, a lightness slider and a palette of folder colors. Picking a swatch sets the color. To add a palette to the default content, pass `presets` instead.

<ComponentPreview name="cell-color-picker/with-presets" />

## Customization

### Tailwind CSS

Pass classes per part with `ui`, or replace the popover content with the default slot:

```vue
<template>
  <CellColorPicker label="Event color" :ui="{ swatch: 'rounded-md', valueDisplay: 'font-mono' }">
    <ColorArea
      aria-label="Color area"
      color-space="hsb"
      :x="{ channel: 'saturation' }"
      :y="{ channel: 'brightness' }"
    />
    <ColorField aria-label="Hex" />
  </CellColorPicker>
</template>
```

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { cellColorPicker: { slots: { trigger: 'h-10', swatch: 'size-6' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="cell-color-picker"]`: root container (`flex`)
- `trigger` → `[data-slot="color-picker-trigger"]`: the row (`h-9`, `rounded-field`, `px-3`, `gap-3`)
- `label` → `[data-slot="cell-color-picker-label"]`: leading text, truncated when long
- `valueDisplay` → `[data-slot="cell-color-picker-value-display"]`: hex value in `text-muted`
- `swatch` → `[data-slot="color-swatch"]`: 20px round swatch
- `popover` → `[data-slot="color-picker-popover"]`: popover panel
- `presets` → `[data-slot="color-swatch-picker"]`: preset palette

The root is named `cell-color-picker`; the other parts keep the [ColorPicker](/docs/components/color-picker) names. `trigger` and `popover` classes are merged over the ColorPicker theme. The row background follows `--cell-bg-current`, so a plain `bg-*` class in `ui.trigger` wins in every state. The `secondary` variant sets `--cell-bg`, `--cell-bg-hover` and `--cell-bg-focus`.

### Interactive States

- **Open**: `[data-state="open"]` and `aria-expanded="true"` on the row
- **Disabled**: `[data-disabled="true"]` on the root and the row, `disabled` on the row. A disabled [Fieldset](/docs/components/fieldset) or Form also disables the row
- **Hovered**: `:hover` on the row (devices with hover only)
- **Focus Visible**: `:focus-visible` on the row

## API Reference

### Props

<ApiTable component="CellColorPicker" kind="props" />

### Slots

<ApiTable component="CellColorPicker" kind="slots" />

### Emits

<ApiTable component="CellColorPicker" kind="emits" />

## Theme

<ApiTheme component="CellColorPicker" />

## Accessibility

- The row is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`; its name is the label, the hex value and the swatch's color name
- <kbd>Enter</kbd> or <kbd>Space</kbd> opens the popover and moves focus into it; <kbd>Escape</kbd> closes it and returns focus to the row
- The color area, hue slider and presets keep their own keyboard support

## Related Components

<RelatedComponents :components="['color-picker', 'color-swatch-picker', 'cell-select', 'cell-switch']" />
