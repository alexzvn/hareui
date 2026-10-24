---
title: BarChart
description: Compare amounts across categories, side by side or stacked, upright or sideways.
links:
  source: bar-chart/BarChart.vue
  styles: bar-chart/theme.ts
---

## Usage

```vue
<BarChart :data="data" index="month" />
```

Charts ship from the `@hareui/vue/charts` entry, not the package root. Charts need two peer dependencies:

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

`index` names the field that holds each row's category. Every other numeric field becomes a bar series, with a grid, both axes and a tooltip. `BarChart` fills its parent's width.

<ComponentPreview name="bar-chart/basic" />

## Series

Pass `series` to choose the fields, their names and their order. Use a map of key to config, or an array of keys and `{ key, ...config }` objects. Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`); set `colors` for a different palette, or `color` on one series.

```vue
<BarChart
  :data="data"
  index="month"
  :series="{ desktop: { name: 'Desktop' }, mobile: { name: 'Mobile', color: 'var(--chart-2)' } }"
/>
```

Each series takes `name`, `color`, `hide`, `tooltip`, `valueFormatter`, `yAxis`, `radius`, `barSize`, `fillOpacity` and `stack`. Series without a stack sit side by side in each category. `bar-size`, `bar-gap`, `bar-category-gap` and `max-bar-size` on the root size the bars, and `radius` (4 by default) rounds the outer end of each bar.

## Layout

`layout="vertical"` lays the bars out horizontally: the y axis lists the categories and the x axis shows the values. The grid switches to vertical lines.

```vue
<BarChart :data="data" index="command" layout="vertical" />
```

## Axes and Formatting

`x-axis`, `y-axis` and `grid` take `false` to hide the part, or an object of `ChartXAxis`, `ChartYAxis` and `ChartGrid` props. The y axis fits its widest label. A series with `yAxis: 'right'` draws against a second y axis on the right; set its props with `y-axis-right`.

- `value-formatter` formats values in the tooltip and on the value axis. It receives the series key (`''` on the axis).
- `index-formatter` formats the categories on the category axis and in the tooltip header.
- A series' `valueFormatter` formats that series in the tooltip only.

```vue
<BarChart :data="data" index="month" :value-formatter="(value) => `${value} mm`" />
```

## Stacking

`stacked` piles every bar on one stack, and only the end of the stack is rounded. Give a series `stack: 'name'` to put it on its own stack, or `stack: false` to keep it beside the stack.

## Tooltip

`tooltip` takes `false`, or `ChartTooltip` props such as `indicator`, `cursor`, `labelFormatter` and `valueFormatter`. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the plot: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `indicator`, plus a `position`. Use `#legend-item` to redraw each row, or `#legend` to replace the list. Clicking an item hides or shows its series; bind `v-model:hidden` to read or set the hidden keys. To place the legend elsewhere, such as a card header, render `<ChartLegend :series="series" />` with the same `series` and `colors`.

## Examples

### Against An Average

Two series compare this year with a long-term average. Bars without a stack sit side by side, and `value-formatter` adds the unit on the y axis and in the tooltip.

<ComponentPreview name="bar-chart/against-an-average" />

### Tooltip Total

`#tooltip-footer` adds a total row across all channels under the default rows.

<ComponentPreview name="bar-chart/tooltip-total" />

### Side By Side

Each key in `series` adds a bar to every category. `bar-size` keeps the bars thin when there are few categories.

<ComponentPreview name="bar-chart/side-by-side" />

### Horizontal

`layout="vertical"` lays the bars out horizontally, with the categories on the y axis. A `radius` larger than half the bar height gives fully rounded ends.

<ComponentPreview name="bar-chart/horizontal" />

### Stacked Rows

Combine `layout="vertical"` with `stacked`. Only the outer end of each stack is rounded. `legend` draws the legend under the plot.

<ComponentPreview name="bar-chart/stacked-rows" />

### Metric With Bars

A bar chart without a y axis (`:y-axis="false"`) works as a compact trend under a metric.

<ComponentPreview name="bar-chart/metric-with-bars" />

### Stacked

`stacked` piles the series on one stack, and the y axis grows to fit the total.

<ComponentPreview name="bar-chart/stacked" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Series colors come from `colors` or each series' `color`, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<BarChart :data="data" :ui="{ tick: 'fill-foreground', grid: 'stroke-accent/20' }">
  ...
</BarChart>
```

### Global Configuration

Override the `barChart` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      barChart: {
        slots: {
          tick: 'text-xs',
        },
      },
    },
  }),
)
```

## Composition

Without `index` or `series`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as a color per bar with `ChartCell`, labels on bars or reference shapes.

```vue
<template>
  <BarChart>
    <ChartGrid />
    <ChartXAxis />
    <ChartYAxis />
    <ChartBar />
    <ChartTooltip />
  </BarChart>
</template>
```

Parts always draw in the same order (grid, series, axes, cursor), so template order doesn't matter. With `index` or `series` set, parts in the default slot draw next to the generated ones: turn a generated part off (for example `:x-axis="false"`) before adding your own. Hand-placed parts still read the root's `index` and `series`, so `<ChartXAxis />` picks up the categories and `<ChartBar data-key="sales" />` its name and color. The [AreaChart page](./area-chart#composition) has a full example built from parts.

`ChartBar` takes `ChartCell` children to color single bars, for example to highlight the current month:

```vue
<BarChart :data="data" index="month">
  <ChartBar data-key="sales" fill="var(--chart-1)">
    <ChartCell v-for="(row, index) in data" :key="row.month" :fill="index === data.length - 1 ? 'var(--accent)' : undefined" />
  </ChartBar>
</BarChart>
```

| `ui` key   | `data-slot`                    | Element  | Description                                            |
| ---------- | ------------------------------ | -------- | ------------------------------------------------------ |
| `base`     | `bar-chart`                    | `<div>`  | Responsive container                                   |
| `surface`  | `chart-surface`                | `<svg>`  | Drawing surface, layered grid → series → axes → cursor |
| `overlay`  | `chart-overlay`                | `<div>`  | Layer over the svg that holds the tooltip              |
| `grid`     | `chart-grid`                   | `<g>`    | Grid lines (`chart-grid-line`)                         |
| `axis`     | `chart-x-axis`, `chart-y-axis` | `<g>`    | One group per axis                                     |
| `axisLine` | `chart-axis-line`              | `<line>` | Axis line, hidden by default                           |
| `tickLine` | `chart-tick-line`              | `<line>` | Tick marks, hidden by default                          |
| `tick`     | `chart-tick`                   | `<text>` | Axis labels                                            |
| `series`   | `chart-bar`                    | `<g>`    | One group per series                                   |
| —          | `chart-bar-rectangle`          | `<path>` | One shape per bar, with `data-index`                   |
| `cursor`   | `chart-cursor`                 | `<path>` | Hover cursor                                           |
| `tooltip`  | `chart-tooltip-wrapper`        | `<div>`  | Floating wrapper around the tooltip panel              |
| `label`    | `chart-label`                  | `<text>` | `ChartLabel` text                                      |
| `legend`   | `chart-legend`                 | `<ul>`   | Legend drawn from the `legend` prop                    |

## Styling Reference

### Slots

- `base` → `[data-slot="bar-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip
- `grid` → `[data-slot="chart-grid"]` – lines behind the plot; `stroke-muted` at 0.15 stroke opacity
- `axis` → `[data-slot="chart-x-axis"]` – one group per axis (`chart-y-axis` for y)
- `axisLine` → `[data-slot="chart-axis-line"]` – axis line, hidden
- `tickLine` → `[data-slot="chart-tick-line"]` – tick marks, hidden
- `tick` → `[data-slot="chart-tick"]` – axis label text; `fill-muted text-[10px]`
- `series` → `[data-slot="chart-bar"]` – group around each series, empty by default
- `cursor` → `[data-slot="chart-cursor"]` – hover guide: a `fill-current` band at `opacity-5` across the hovered category
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text; `fill-muted text-[10px]`
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### BarChart

<ApiTable component="BarChart" kind="props" />

<ApiTable component="BarChart" kind="slots" />

### ChartBar

<ApiTable component="ChartBar" kind="props" />

<ApiTable component="ChartBar" kind="slots" />

### ChartCell

<ApiTable component="ChartCell" kind="props" />

### ChartLabel

<ApiTable component="ChartLabel" kind="props" />

<ApiTable component="ChartLabel" kind="slots" />

### ChartXAxis

<ApiTable component="ChartXAxis" kind="props" />

<ApiTable component="ChartXAxis" kind="slots" />

### ChartYAxis

<ApiTable component="ChartYAxis" kind="props" />

<ApiTable component="ChartYAxis" kind="slots" />

### ChartGrid

<ApiTable component="ChartGrid" kind="props" />

### ChartTooltip

<ApiTable component="ChartTooltip" kind="props" />

<ApiTable component="ChartTooltip" kind="slots" />

### Theme

<ApiTheme component="BarChart" />

## Accessibility

- With a `ChartTooltip`, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between bars, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each series with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['line-chart', 'composed-chart', 'area-chart', 'chart-tooltip', 'chart-legend']" />
