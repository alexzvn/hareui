---
title: ComposedChart
description: Mix bars, lines and areas on shared axes to compare related metrics in one chart.
links:
  source: composed-chart/ComposedChart.vue
  styles: composed-chart/theme.ts
---

## Usage

```vue
<ComposedChart
  :data="data"
  index="day"
  :series="{ covers: { type: 'bar' }, avgCheck: { type: 'line', yAxis: 'right' } }"
/>
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

`index` names the field that holds each row's category. Each series picks its shape with `type`: `'bar'`, `'line'` (the default) or `'area'`. `ComposedChart` fills its parent's width and draws a grid, the axes and a tooltip.

<ComponentPreview name="composed-chart/basic" />

## Series

Pass `series` as a map of key to config, or an array of keys and `{ key, ...config }` objects. Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`); set `colors` for a different palette, or `color` on one series. Without `series`, every numeric field becomes a line.

Each series takes `type`, `name`, `color`, `hide`, `tooltip`, `valueFormatter` and `yAxis`, plus the options of its type: `curve`, `strokeWidth`, `strokeDasharray`, `dot`, `activeDot` and `connectNulls` for lines and areas, `fill` and `fillOpacity` for areas, and `radius` and `barSize` for bars. `curve`, `stroke-width` and `radius` on the root apply to every series of a matching type. Series draw in a fixed order: areas, then bars, then lines.

## Two y axes

Give a series `yAxis: 'right'` to draw it against a second y axis on the right. Set that axis' props with `y-axis-right`, and the left one's with `y-axis`:

```vue
<ComposedChart
  :data="data"
  index="day"
  :series="{ covers: { type: 'bar' }, avgCheck: { type: 'line', yAxis: 'right' } }"
  :y-axis-right="{ tickFormatter: (value) => `€${value}` }"
/>
```

## Axes and Formatting

`x-axis`, `y-axis` and `grid` take `false` to hide the part, or an object of `ChartXAxis`, `ChartYAxis` and `ChartGrid` props. Each y axis fits its widest label.

- `value-formatter` formats values in the tooltip and on the y axes. It receives the series key (`''` on the axes).
- `index-formatter` formats the categories on the x axis and in the tooltip header.
- A series' `valueFormatter` formats that series in the tooltip only, which suits series with different units.

## Stacking

`stacked` stacks the bars and areas; lines never stack. Give a series `stack: 'name'` to put it on its own stack, or `stack: false` to keep it out.

## Tooltip

`tooltip` takes `false`, or `ChartTooltip` props such as `indicator`, `cursor`, `labelFormatter` and `valueFormatter`. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the plot: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `indicator`, plus a `position`. Use `#legend-item` to redraw each row, or `#legend` to replace the list. Clicking an item hides or shows its series; bind `v-model:hidden` to read or set the hidden keys. To place the legend elsewhere, such as a card header, render `<ChartLegend :series="series" />` with the same `series` and `colors`.

## Examples

### Stacked Bars And A Rate

`stacked` piles the bars, and a percentage line with `yAxis: 'right'` draws on a right y axis with a fixed `domain` of `[0, 100]`.

<ComponentPreview name="composed-chart/stacked-bars-and-a-rate" />

### Area And Average

An area for this year and a dashed line for the long-term average. The area fades from its color by default; `fillOpacity` sets the top and bottom opacity of the gradient.

<ComponentPreview name="composed-chart/area-and-average" />

### Two Scales

Bars on the left y axis and an area on the right. The area draws its own line along the top, so one series covers both.

<ComponentPreview name="composed-chart/two-scales" />

### Area, Bars And Line

An area, bars and a line with dots in one chart. The occupancy line's `valueFormatter` adds a percent sign in the tooltip, and `y-axis-right` formats its axis.

<ComponentPreview name="composed-chart/area-bars-and-line" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Series colors come from `colors` or each series' `color`, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<ComposedChart :data="data" :ui="{ tick: 'fill-foreground', grid: 'stroke-accent/20' }">
  ...
</ComposedChart>
```

### Global Configuration

Override the `composedChart` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      composedChart: {
        slots: {
          tick: 'text-xs',
        },
      },
    },
  }),
)
```

## Composition

Without `index` or `series`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as custom y-axis ids, labels on points or reference shapes.

```vue
<template>
  <ComposedChart>
    <ChartGrid />
    <ChartXAxis />
    <ChartYAxis />
    <ChartBar />
    <ChartLine />
    <ChartArea />
    <ChartTooltip />
  </ComposedChart>
</template>
```

Parts always draw in the same order (grid, series, axes, cursor), so template order doesn't matter. Give each `ChartYAxis` a `y-axis-id` and put the second one on the right with `orientation="right"`; series pick their axis with the same `y-axis-id`. With `index` or `series` set, parts in the default slot draw next to the generated ones: turn a generated part off (for example `:x-axis="false"`) before adding your own. The [AreaChart page](./area-chart#composition) has a full example built from parts.

| `ui` key    | `data-slot`                                               | Element    | Description                                            |
| ----------- | --------------------------------------------------------- | ---------- | ------------------------------------------------------ |
| `base`      | `composed-chart`                                          | `<div>`    | Responsive container                                   |
| `surface`   | `chart-surface`                                           | `<svg>`    | Drawing surface, layered grid → series → axes → cursor |
| `overlay`   | `chart-overlay`                                           | `<div>`    | Layer over the svg that holds the tooltip              |
| `grid`      | `chart-grid`                                              | `<g>`      | Grid lines (`chart-grid-line`)                         |
| `axis`      | `chart-x-axis`, `chart-y-axis`                            | `<g>`      | One group per axis                                     |
| `axisLine`  | `chart-axis-line`                                         | `<line>`   | Axis line, hidden by default                           |
| `tickLine`  | `chart-tick-line`                                         | `<line>`   | Tick marks, hidden by default                          |
| `tick`      | `chart-tick`                                              | `<text>`   | Axis labels                                            |
| `series`    | `chart-bar`, `chart-line`, `chart-area`                   | `<g>`      | One group per series                                   |
| —           | `chart-bar-rectangle`                                     | `<path>`   | One shape per bar, with `data-index`                   |
| —           | `chart-line-curve`, `chart-area-curve`, `chart-area-fill` | `<path>`   | Line and area paths                                    |
| —           | `chart-dots`                                              | `<g>`      | Group of point markers per series                      |
| `dot`       | `chart-dot`                                               | `<circle>` | Point markers                                          |
| `activeDot` | `chart-active-dot`                                        | `<circle>` | Marker at the hovered point                            |
| `cursor`    | `chart-cursor`                                            | `<path>`   | Hover cursor                                           |
| `tooltip`   | `chart-tooltip-wrapper`                                   | `<div>`    | Floating wrapper around the tooltip panel              |
| `label`     | `chart-label`                                             | `<text>`   | `ChartLabel` text                                      |
| `legend`    | `chart-legend`                                            | `<ul>`     | Legend drawn from the `legend` prop                    |

## Styling Reference

### Slots

- `base` → `[data-slot="composed-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip
- `grid` → `[data-slot="chart-grid"]` – lines behind the plot; `stroke-muted` at 0.15 stroke opacity
- `axis` → `[data-slot="chart-x-axis"]` – one group per axis (`chart-y-axis` for y)
- `axisLine` → `[data-slot="chart-axis-line"]` – axis line, hidden
- `tickLine` → `[data-slot="chart-tick-line"]` – tick marks, hidden
- `tick` → `[data-slot="chart-tick"]` – axis label text; `fill-muted text-[10px]`
- `series` → `[data-slot="chart-bar"]` – group around each series (`chart-line`, `chart-area` for the others), empty by default
- `dot` → `[data-slot="chart-dot"]` – point markers of lines and areas, off by default. Set `dot` on a series to show them
- `activeDot` → `[data-slot="chart-active-dot"]` – circle at the hovered point, with a 2px `stroke-surface` ring
- `cursor` → `[data-slot="chart-cursor"]` – hover guide: a dashed 1px line, or a `fill-current` band at `opacity-5` when the chart has bars
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text; `fill-muted text-[10px]`
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### ComposedChart

<ApiTable component="ComposedChart" kind="props" />

<ApiTable component="ComposedChart" kind="slots" />

### ChartBar

<ApiTable component="ChartBar" kind="props" />

<ApiTable component="ChartBar" kind="slots" />

### ChartLine

<ApiTable component="ChartLine" kind="props" />

<ApiTable component="ChartLine" kind="slots" />

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

### Theme

<ApiTheme component="ComposedChart" />

## Accessibility

- With a `ChartTooltip`, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between points, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each series with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['line-chart', 'bar-chart', 'area-chart', 'chart-tooltip', 'chart-legend']" />
