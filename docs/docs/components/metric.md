---
title: Metric
description: A card that shows one key figure with its trend, progress, sparkline and actions
links:
  source: metric/Metric.vue
  styles: metric/theme.ts
---

## Usage

```ts
import { Metric } from '@hareui/vue'
```

<ComponentPreview name="metric/basic" />

## Anatomy

```vue
<Metric title="Revenue" :value="4200" :format="{ format: 'currency', currency: 'USD' }">
  <template #icon />
  <template #title />
  <template #actions />
  <template #value="{ formatted, value }" />
  <template #trend />
  <template #chart />
  <template #footer />
</Metric>
```

`Metric` is a `Card`: it takes `as` and `variant`. The title renders as a `dt` and the value as a `dd` inside a `dl`.

## Examples

### Icon and Status

`icon` sits in a small box before the title. `status` tints the box green (`success`), amber (`warning`) or red
(`danger`).

<ComponentPreview name="metric/icon-status" />

### Trend

`trend` adds a [TrendChip](./trend-chip) next to the value. It takes the chip's props, with the chip text in `label`.

`format` sets how the value is written. It takes [NumberValue](./number-value) props, for example
`{ format: 'currency', currency: 'USD' }`.

<ComponentPreview name="metric/trend" />

### Progress

`progress` adds a thin bar under the value. It is green by default; set `progress.status` to change the colour.

<ComponentPreview name="metric/progress" />

### Sparkline

Put an `AreaChart` from `@hareui/vue/charts` in the `chart` slot. The chart area is 80 px high and runs to the card
edges. Its left and right ends fade out; set `--metric-chart-fade` on the card to change the fade width (10% by
default).

<ComponentPreview name="metric/sparkline" />

### Inline Chart

Set `chart-placement="inline"` to put the chart beside the value instead. The value and the trend stack in the first
column and the chart fills the second, 70 px high.

<ComponentPreview name="metric/chart-inline" />

### Actions

`actions` adds a three-dot button in the top corner. It opens a [Dropdown](./dropdown) with those entries, and the
`action` event receives the chosen one. To show your own content there, use the `actions` slot.

<ComponentPreview name="metric/actions" />

### Footer

The `footer` slot renders under a full-width separator.

<ComponentPreview name="metric/footer" />

### Slots

`value` receives `{ formatted, value }`; `title` and `trend` replace their defaults.

<ComponentPreview name="metric/slots" />

## Accessibility

- The title and value form a description list (`dl` / `dt` / `dd`), so screen readers announce them as a pair.
- The icon is decorative and `aria-hidden`.
- The progress bar is a `progressbar` labelled by the title.
- The actions button is labelled "More actions" (translated through the `App` locale).
- Give a sparkline an `aria-label` describing what it plots.

## Styling Reference

| `ui` key      | `data-slot`        | Description                                       |
| ------------- | ------------------ | ------------------------------------------------- |
| `base`        | `metric`           | Root card                                         |
| `list`        | `metric-list`      | `dl` of header and content (`display: contents`)  |
| `header`      | `metric-header`    | The `dt`: row with the icon and title             |
| `icon`        | `metric-icon`      | 32 px icon box, with `data-status`                |
| `title`       | `metric-title`     | Title text                                        |
| `actions`     | `metric-actions`   | Top-right actions container                       |
| `actionsIcon` | —                  | Three-dot icon of the default button              |
| `content`     | `metric-content`   | The `dd`: grid with the value, trend and progress |
| `value`       | `metric-value`     | The value, 24 px semibold                         |
| `trend`       | `metric-trend`     | The default trend chip                            |
| `progress`    | `metric-progress`  | Full-width progress row                           |
| `chart`       | `metric-chart`     | Chart area: 80 px at the bottom, 70 px inline     |
| `separator`   | `metric-separator` | Edge-to-edge line before the footer               |
| `footer`      | `metric-footer`    | Footer row                                        |

## API Reference

### Props

<ApiTable component="Metric" kind="props" />

### Emits

<ApiTable component="Metric" kind="emits" />

### Slots

<ApiTable component="Metric" kind="slots" />

## Theme

<ApiTheme component="Metric" />

## Related Components

<RelatedComponents :components="['metric-group', 'trend-chip', 'number-value', 'card']" />
