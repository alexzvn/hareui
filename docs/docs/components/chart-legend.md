---
title: ChartLegend
description: A list of chart series or slices with color markers, optional values and toggles to hide them.
links:
  source: chart-legend/ChartLegend.vue
  styles: chart-legend/theme.ts
---

## Usage

```ts
import { ChartLegend } from '@hareui/vue/charts'
```

Charts ship from the `@hareui/vue/charts` entry, which needs two peer dependencies:

::: code-group

```bash [npm]
npm i d3-scale d3-shape
```

```bash [pnpm]
pnpm add d3-scale d3-shape
```

```bash [yarn]
yarn add d3-scale d3-shape
```

```bash [bun]
bun add d3-scale d3-shape
```

:::

<ComponentPreview name="chart-legend/basic" />

Pass the same `series` and `colors` as the chart. The legend names and colors each row the way the chart does, so you can place it anywhere, such as a card header.

Inside a chart, set the chart's `legend` prop instead (`true`, `'top'`, `'bottom'`, `'left'` or `'right'`). The chart renders a `ChartLegend` for you, and clicking a row hides that series.

## Anatomy

```vue
<template>
  <ChartLegend>
    <template #item="{ item, index, toggle }" />
  </ChartLegend>
</template>
```

| `ui` key    | `data-slot`              | Element                | Description                             |
| ----------- | ------------------------ | ---------------------- | --------------------------------------- |
| `base`      | `chart-legend`           | `<ul>`                 | The list                                |
| `item`      | `chart-legend-item`      | `<li>`                 | One row per series or slice             |
| `trigger`   | `chart-legend-trigger`   | `<span>` or `<button>` | Row content. A button with `toggleable` |
| `indicator` | `chart-legend-indicator` | `<span>`               | Color marker, a dot or a line           |
| `label`     | `chart-legend-label`     | `<span>`               | Series or slice name                    |
| `value`     | `chart-legend-value`     | `<span>`               | Value, with `show-value`                |
| `percent`   | `chart-legend-percent`   | `<span>`               | Share of the total, with `show-percent` |

## Examples

### Slices with Values

For pie and radial charts, pass `data` and `index` instead of `series`. Each row is one datum. `show-value` adds its value and `show-percent` its share of the visible total. Use `orientation="vertical"` for a list beside the chart.

<ComponentPreview name="chart-legend/donut-breakdown" />

Slice colors follow the chart: the row's `fill` field, then a `colors` map keyed by name, then the palette by position. `value.key` picks the value field when the rows have more than one number, and `value.formatter` formats the values.

### Toggle Series

Set `toggleable` to turn each row into a button. Bind the same list with `v-model:hidden` on the legend and the chart, so clicking a row hides its series. Hidden rows stay in the legend, dimmed, so you can click them to show the series again.

<ComponentPreview name="chart-legend/toggle-series" />

### Custom Items

Use the `#item` slot to replace the content of each row. It receives the row (`key`, `name`, `color`, `hidden`, and `value` and `percent` for slices), its `index`, and `toggle`. With `toggleable`, the slot renders inside the row's button.

<ComponentPreview name="chart-legend/custom-item" />

### Explicit Items

Pass `items` to list rows yourself, for example series that aren't in the chart's data. `items` wins over `series` and `data`.

```vue
<template>
  <ChartLegend
    :items="[
      { key: 'target', name: 'Target', color: 'var(--muted)' },
      { key: 'actual', name: 'Actual', color: 'var(--chart-3)' },
    ]"
    indicator="line"
  />
</template>
```

## Customization

### Tailwind CSS

Use `class` for the list and `ui` for its parts:

```vue
<template>
  <ChartLegend
    :series="series"
    class="justify-center"
    :ui="{ indicator: 'size-2', label: 'text-sm text-foreground' }"
  />
</template>
```

### Global Configuration

Override the `chartLegend` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      chartLegend: {
        slots: {
          indicator: 'rounded-sm',
          label: 'font-medium',
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="chart-legend"]` – unstyled list. A wrapping row with a 12px gap when horizontal, a column with a 12px gap when vertical
- `item` → `[data-slot="chart-legend-item"]` – one row. Hidden rows drop to 40% opacity
- `trigger` → `[data-slot="chart-legend-trigger"]` – flex row with a 6px gap (12px when vertical). With `toggleable`, a pointer cursor and a focus ring
- `indicator` → `[data-slot="chart-legend-indicator"]` – 12px circle with `indicator="dot"`, 4px × 12px pill with `indicator="line"`
- `label` → `[data-slot="chart-legend-label"]` – muted 12px text when horizontal. 14px foreground text that fills the row when vertical, which pushes the value to the end
- `value` → `[data-slot="chart-legend-value"]` – semibold foreground text with tabular numbers
- `percent` → `[data-slot="chart-legend-percent"]` – muted 12px text with tabular numbers

### States

The list sets `[data-orientation="horizontal"]` or `[data-orientation="vertical"]`. Hidden rows set `[data-hidden="true"]`:

```css
[data-slot='chart-legend-item'][data-hidden='true'] [data-slot='chart-legend-label'] {
  text-decoration: line-through;
}
```

## API Reference

### Props

<ApiTable component="ChartLegend" kind="props" />

### Slots

<ApiTable component="ChartLegend" kind="slots" />

### Theme

<ApiTheme component="ChartLegend" />

## Accessibility

- The legend is a list (`<ul>` and `<li>`), so screen readers announce the number of rows.
- With `toggleable`, each row is a `<button>` with `aria-pressed`: pressed while its series is shown. Tab moves between rows, and Enter or Space toggles one.
- Indicators are `aria-hidden`; the label text names each series.
- Without `toggleable`, rows are plain text and take no focus.

## Related Components

<RelatedComponents :components="['chart-tooltip', 'area-chart', 'bar-chart', 'line-chart', 'pie-chart', 'radial-chart']" />
