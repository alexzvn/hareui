---
title: AreaChart
description: Show how totals and their parts change over time.
links:
  source: area-chart/AreaChart.vue
  styles: area-chart/theme.ts
---

## Usage

```vue
<AreaChart :data="data" index="month" />
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

`index` names the field that holds each row's category. Every other numeric field becomes a series, with a grid, both axes and a tooltip. `AreaChart` fills its parent's width.

<ComponentPreview name="area-chart/basic" />

## Series

Pass `series` to choose the fields, their names and their order. Use a map of key to config, or an array of keys and `{ key, ...config }` objects. Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`); set `colors` for a different palette, or `color` on one series.

```vue
<AreaChart
  :data="data"
  index="month"
  :series="{ organic: { name: 'Organic' }, paid: { name: 'Paid', color: 'var(--chart-2)' } }"
/>
```

Each series takes `name`, `color`, `hide`, `tooltip`, `valueFormatter`, `yAxis`, `curve`, `strokeWidth`, `strokeDasharray`, `dot`, `activeDot`, `connectNulls`, `fill`, `fillOpacity` and `stack`. `curve`, `stroke-width`, `fill`, `fill-opacity`, `dot` and `connect-nulls` on the root apply to every series, and a series' own value wins. Areas fade from the series color by default (`fill="gradient"` with `fill-opacity` `[0.2, 0.02]`); use `'solid'`, `'none'` or a `url(#id)` of your own.

## Axes and Formatting

`x-axis` and `grid` take `false` to hide the part, or an object of `ChartXAxis` and `ChartGrid` props. `y-axis` takes `{ left, right }`, each `false` or an object of `ChartYAxis` props. The y axis fits its widest label.

- `value-formatter` formats values in the tooltip and on the y axis. It receives the series key (`''` on the axis).
- `index-formatter` formats the categories on the x axis and in the tooltip header.
- A series' `valueFormatter` formats that series in the tooltip only.

```vue
<AreaChart
  :data="data"
  index="month"
  :value-formatter="(value) => `$${value}`"
  :y-axis="{ left: { tick: { formatter: compact } } }"
/>
```

## Stacking

`stacked` piles every area on one stack, and the y axis grows to fit the total. Give a series `stack: 'name'` to put it on its own stack, or `stack: false` to keep it out.

## Tooltip

`tooltip` takes `false`, or `ChartTooltip` props such as `indicator`, `cursor`, `labelFormatter` and `valueFormatter`. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the plot: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `indicator`, plus a `position`. Use `#legend-item` to redraw each row, or `#legend` to replace the list. Clicking an item hides or shows its series; bind `v-model:hidden` to read or set the hidden keys. To place the legend elsewhere, such as a card header, render `<ChartLegend :series="series" />` with the same `series` and `colors`.

## Examples

### Tooltip Footer

`#tooltip-footer` adds a total under the default rows. The tooltip's `labelFormatter` rewrites the header, and `indicator: 'line'` draws line indicators.

<ComponentPreview name="area-chart/tooltip-footer" />

### Metric With Trend

`sparkline` drops the grid, axes and tooltip and thins the stroke, for a small trend next to a metric. `:tooltip="{ cursor: false, panel: false }"` keeps the hover dot and announces the hovered value to screen readers without drawing a panel. `index` gives each announcement its week, and `value-formatter` its unit.

<ComponentPreview name="area-chart/metric-with-trend" />

### Several Series

Each series gets its own gradient, and the tooltip lists every series at the hovered hour.

<ComponentPreview name="area-chart/several-series" />

### Sparkline

Without axes, the chart fills its container. Give the container a width and set `height` to fit the text next to it.

<ComponentPreview name="area-chart/sparkline" />

### Stacked

`stacked` piles the series, and the y axis grows to fit the total.

<ComponentPreview name="area-chart/stacked" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Series colors come from `colors` or each series' `color`, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<AreaChart :data="data" :ui="{ tick: 'fill-foreground', grid: 'stroke-accent/20' }">
  ...
</AreaChart>
```

### Gradient fills

The default `'gradient'` fill fades the series color from `fillOpacity[0]` at the top to `fillOpacity[1]` at the bottom. For any other gradient, define a `<linearGradient>` in the default slot and pass its `url(#id)` as `fill`. It draws at full opacity, since the gradient sets its own, unless `fillOpacity` is a number:

```vue
<AreaChart :data="data" index="month" :series="{ output: { fill: 'url(#output-fill)' } }">
  <defs>
    <linearGradient id="output-fill" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="var(--chart-3)" stop-opacity="0.4" />
      <stop offset="100%" stop-color="var(--chart-5)" stop-opacity="0" />
    </linearGradient>
  </defs>
</AreaChart>
```

Gradient ids are global to the page. Use a unique id per chart when you render several.

### Global Configuration

Override the `areaChart` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      areaChart: {
        slots: {
          tick: 'text-xs',
        },
      },
    },
  }),
)
```

## Composition

Without `index` or `series`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as a second y axis with custom ticks, labels on points or reference shapes. This is the first example, built from parts:

```vue
<template>
  <AreaChart>
    <ChartGrid />
    <ChartXAxis />
    <ChartYAxis />
    <ChartArea />
    <ChartTooltip />
  </AreaChart>
</template>
```

<ComponentPreview name="area-chart/composition" />

Parts always draw in the same order (grid, series, axes, cursor), so template order doesn't matter. With `index` or `series` set, parts in the default slot draw next to the generated ones: turn a generated part off (for example `:x-axis="false"`) before adding your own. Hand-placed parts still read the root's `index` and `series`, so `<ChartXAxis />` picks up the categories and `<ChartArea data-key="paid" />` its name and color.

| `ui` key    | `data-slot`                    | Element    | Description                                            |
| ----------- | ------------------------------ | ---------- | ------------------------------------------------------ |
| `base`      | `area-chart`                   | `<div>`    | Responsive container                                   |
| `surface`   | `chart-surface`                | `<svg>`    | Drawing surface, layered grid → series → axes → cursor |
| `overlay`   | `chart-overlay`                | `<div>`    | Layer over the svg that holds the tooltip              |
| `grid`      | `chart-grid`                   | `<g>`      | Grid lines (`chart-grid-line`)                         |
| `axis`      | `chart-x-axis`, `chart-y-axis` | `<g>`      | One group per axis                                     |
| `axisLine`  | `chart-axis-line`              | `<line>`   | Axis line, hidden by default                           |
| `tickLine`  | `chart-tick-line`              | `<line>`   | Tick marks, hidden by default                          |
| `tick`      | `chart-tick`                   | `<text>`   | Axis labels                                            |
| `series`    | `chart-area`                   | `<g>`      | One group per `ChartArea`                              |
| —           | `chart-area-fill`              | `<path>`   | Filled area                                            |
| —           | `chart-area-curve`             | `<path>`   | Line along the top of the area                         |
| —           | `chart-dots`                   | `<g>`      | Group of point markers per series                      |
| `dot`       | `chart-dot`                    | `<circle>` | Point markers when `dot` is set                        |
| `activeDot` | `chart-active-dot`             | `<circle>` | Marker at the hovered point                            |
| `cursor`    | `chart-cursor`                 | `<path>`   | Hover cursor                                           |
| `label`     | `chart-label`                  | `<text>`   | `ChartLabel` text                                      |
| `tooltip`   | `chart-tooltip-wrapper`        | `<div>`    | Floating wrapper around the tooltip panel              |
| `legend`    | `chart-legend`                 | `<ul>`     | Legend drawn from the `legend` prop                    |

## Styling Reference

### Slots

- `base` → `[data-slot="area-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`, with a focus ring when focused from the keyboard
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip
- `grid` → `[data-slot="chart-grid"]` – lines behind the plot; `stroke-muted` at 0.15 stroke opacity
- `axis` → `[data-slot="chart-x-axis"]` – one group per axis (`chart-y-axis` for y)
- `axisLine` → `[data-slot="chart-axis-line"]` – axis line, hidden
- `tickLine` → `[data-slot="chart-tick-line"]` – tick marks, hidden
- `tick` → `[data-slot="chart-tick"]` – axis label text; `fill-muted text-[10px]`
- `series` → `[data-slot="chart-area"]` – group around each area, empty by default
- `dot` → `[data-slot="chart-dot"]` – point markers, off by default. Set `dot` to show them
- `activeDot` → `[data-slot="chart-active-dot"]` – circle at the hovered point, with a 2px `stroke-surface` ring
- `cursor` → `[data-slot="chart-cursor"]` – hover guide: a 1px `stroke-muted` line, dashed 4/4
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text; `fill-muted text-[10px]`
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### AreaChart

<ApiTable component="AreaChart" kind="props" />

<ApiTable component="AreaChart" kind="slots" />

### ChartArea

<ApiTable component="ChartArea" kind="props" />

<ApiTable component="ChartArea" kind="slots" />

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

### ChartLabel

<ApiTable component="ChartLabel" kind="props" />

<ApiTable component="ChartLabel" kind="slots" />

### Theme

<ApiTheme component="AreaChart" />

## Accessibility

- With a `ChartTooltip`, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between points, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each series with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['line-chart', 'bar-chart', 'composed-chart', 'chart-tooltip', 'chart-legend']" />
