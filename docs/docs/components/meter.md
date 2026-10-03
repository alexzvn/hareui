---
title: Meter
description: A meter represents a quantity within a known range, or a fractional value.
links:
  source: meter/Meter.vue
  styles: meter/theme.ts
  heroui: meter
---

## Usage

```ts
import { Meter } from '@hareui/vue'
```

<ComponentPreview name="meter/basic" />

## Anatomy

HeroUI's `Label`, `Meter.Output`, `Meter.Track` and `Meter.Fill` parts are rendered by the component.
Reka UI has no meter primitive, so the root carries React Aria's meter semantics
(`role="meter progressbar"`, `aria-valuenow`, `aria-valuetext`) itself.

```vue
<Meter :value="60" label="Storage">
  <template #label /> <!-- optional: replaces the label text -->
  <template #output="{ percentage, valueText }" /> <!-- optional: replaces the value text -->
</Meter>
```

- The label renders when the `label` prop or `#label` slot is provided, and labels the meter via `aria-labelledby`.
- The output renders next to a label; set `show-output` to force it on or off.

`ui` keys: `base`, `label`, `output`, `track`, `fill`.

## Examples

### Sizes

<ComponentPreview name="meter/sizes" />

### Colors

<ComponentPreview name="meter/colors" />

### Without Label

When no visible label is needed, use `aria-label` for accessibility.

<ComponentPreview name="meter/without-label" />

### Custom Value Scale

Use `min-value`, `max-value`, and `format-options` to customize the value range and display format.

<ComponentPreview name="meter/custom-value" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and the `ui` prop for the label, output, track and fill:

<ComponentPreview name="meter/custom-styles" />

### Global theme override

Override the `meter` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    meter: {
      slots: {
        base: 'w-full gap-2',
        track: 'h-3 rounded-full',
        fill: 'rounded-full',
      },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `meter` | Base container (grid layout) |
| `label` | `label` | Label text (Label theme plus the grid placement) |
| `output` | `meter-output` | Value text display |
| `track` | `meter-track` | Track background |
| `fill` | `meter-fill` | Filled portion of the track |

HeroUI's modifier classes correspond to props (HareUI renders utilities, not BEM classes, so
style through `class`, `ui` or `createHareUI`):

- `size`: `sm` (thinner track), `md` (default), `lg` (thicker track) (`.meter--{size}`)
- `color`: `default`, `accent` (default), `success`, `warning`, `danger` (`.meter--{color}`)

## API Reference

### Props

<ApiTable component="Meter" kind="props" />

### Slots

<ApiTable component="Meter" kind="slots" />

### Theme

<ApiTheme component="Meter" />

`#label` and `#output` receive:

| Prop | Type | Description |
|------|------|-------------|
| `percentage` | `number` | The percentage of the meter (0-100) |
| `valueText` | `string` | The formatted value text |

