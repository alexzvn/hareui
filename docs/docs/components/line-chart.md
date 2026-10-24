---
title: LineChart
description: Follow how one or more values change over time.
links:
  source: line-chart/LineChart.vue
  styles: line-chart/theme.ts
---

## Usage

```vue
<LineChart :data="data" index="month" />
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

`index` names the field that holds each row's category. Every other numeric field becomes a line, with a grid, both axes and a tooltip. `LineChart` fills its parent's width.

<ComponentPreview name="line-chart/basic" />

## Series

Pass `series` to choose the fields, their names and their order. Use a map of key to config, or an array of keys and `{ key, ...config }` objects. Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`); set `colors` for a different palette, or `color` on one series.

```vue
<LineChart
  :data="data"
  index="month"
  :series="{ actual: { name: 'Actual' }, target: { name: 'Target', strokeDasharray: '5 5' } }"
/>
```

Each series takes `name`, `color`, `hide`, `tooltip`, `valueFormatter`, `yAxis`, `curve`, `strokeWidth`, `strokeDasharray`, `dot`, `activeDot` and `connectNulls`. `curve`, `stroke-width`, `dot` and `connect-nulls` on the root apply to every series, and a series' own value wins. Lines are smooth (`curve: 'monotone'`) without point markers by default; set `dot` to draw them.

## Axes and Formatting

`x-axis`, `y-axis` and `grid` take `false` to hide the part, or an object of `ChartXAxis`, `ChartYAxis` and `ChartGrid` props. The y axis fits its widest label. A series with `yAxis: 'right'` draws against a second y axis on the right; set its props with `y-axis-right`.

- `value-formatter` formats values in the tooltip and on the y axis. It receives the series key (`''` on the axis).
- `index-formatter` formats the categories on the x axis and in the tooltip header.
- A series' `valueFormatter` formats that series in the tooltip only.

```vue
<LineChart :data="data" index="month" :value-formatter="value => `${value}°C`" :y-axis="{ domain: [0, 30] }" />
```

## Tooltip

`tooltip` takes `false`, or `ChartTooltip` props such as `indicator`, `cursor`, `labelFormatter` and `valueFormatter`. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the plot: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `indicator`, plus a `position`. Use `#legend-item` to redraw each row, or `#legend` to replace the list. Clicking an item hides or shows its series; bind `v-model:hidden` to read or set the hidden keys. To place the legend elsewhere, such as a card header, render `<ChartLegend :series="series" />` with the same `series` and `colors`.

## Examples

### Budget Line

Give a series `strokeDasharray` to mark a budget or a previous period. The budget also uses `curve: 'stepAfter'`, since it changes in steps. The legend swatch in the header is dashed to match.

<ComponentPreview name="line-chart/budget-line" />

### Metric With Trend

`sparkline` drops the grid, axes and tooltip and thins the stroke, for a small trend next to a metric. `:tooltip="{ cursor: false, panel: false }"` keeps the hover dot and announces the hovered value to screen readers without drawing a panel. `index` gives each announcement its week, and `value-formatter` its unit.

<ComponentPreview name="line-chart/metric-with-trend" />

### Multiple Lines

Each key in `series` becomes a line. `colors` sets the palette, and the same `series` and `colors` drive the `ChartLegend` in the header.

<ComponentPreview name="line-chart/multi-line" />

### Range Switcher

Swap `data` when the range changes; the line animates to the new values. A hidden y axis with `domain` set to `dataMin - 100` and `dataMax + 100` keeps the line off the edges.

<ComponentPreview name="line-chart/range-switcher" />

### Sparkline

Without axes, the chart fills its container. Give the container a width and set `height` to fit the text next to it.

<ComponentPreview name="line-chart/sparkline" />

### Stat Cards

Put stat cards above a chart card. The series' `valueFormatter` adds the unit in the tooltip, and the y axis `tickFormatter` shortens the labels.

<ComponentPreview name="line-chart/stat-cards" />

### Linear

Set `curve="linear"` for straight segments between points. `ticks` in `y-axis` picks the exact grid lines to show.

<ComponentPreview name="line-chart/linear" />

### Tooltip Total

`#tooltip-footer` adds a total under the default rows, and the tooltip's `valueFormatter` adds the unit to each value.

<ComponentPreview name="line-chart/tooltip-total" />

### Point Markers

Give a series a `dot` object to draw a marker at every point, and `activeDot` to size the marker under the cursor. A fixed `domain` on the y axis keeps small changes visible.

<ComponentPreview name="line-chart/point-markers" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Series colors come from `colors` or each series' `color`, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<LineChart :data="data" :ui="{ tick: 'fill-foreground', grid: 'stroke-accent/20' }">
  ...
</LineChart>
```

### Global Configuration

Override the `lineChart` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    lineChart: {
      slots: {
        tick: 'text-xs',
      },
    },
  },
}))
```

## Composition

Without `index` or `series`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as labels on points, reference shapes or custom axis ticks.

```vue
<template>
  <LineChart>
    <ChartGrid />
    <ChartXAxis />
    <ChartYAxis />
    <ChartLine />
    <ChartTooltip />
  </LineChart>
</template>
```

Parts always draw in the same order (grid, series, axes, cursor), so template order doesn't matter. With `index` or `series` set, parts in the default slot draw next to the generated ones: turn a generated part off (for example `:x-axis="false"`) before adding your own. Hand-placed parts still read the root's `index` and `series`, so `<ChartXAxis />` picks up the categories and `<ChartLine data-key="oslo" />` its name and color. The [AreaChart page](./area-chart#composition) has a full example built from parts.

| `ui` key | `data-slot` | Element | Description |
|---|---|---|---|
| `base` | `line-chart` | `<div>` | Responsive container |
| `surface` | `chart-surface` | `<svg>` | Drawing surface, layered grid → series → axes → cursor |
| `overlay` | `chart-overlay` | `<div>` | Layer over the svg that holds the tooltip |
| `grid` | `chart-grid` | `<g>` | Grid lines (`chart-grid-line`) |
| `axis` | `chart-x-axis`, `chart-y-axis` | `<g>` | One group per axis |
| `axisLine` | `chart-axis-line` | `<line>` | Axis line, hidden by default |
| `tickLine` | `chart-tick-line` | `<line>` | Tick marks, hidden by default |
| `tick` | `chart-tick` | `<text>` | Axis labels |
| `series` | `chart-line` | `<g>` | One group per series |
| — | `chart-line-curve` | `<path>` | One path per `ChartLine` |
| — | `chart-dots` | `<g>` | Group of point markers per series |
| `dot` | `chart-dot` | `<circle>` | Point markers |
| `activeDot` | `chart-active-dot` | `<circle>` | Marker at the hovered point |
| `cursor` | `chart-cursor` | `<path>` | Hover cursor |
| `tooltip` | `chart-tooltip-wrapper` | `<div>` | Floating wrapper around the tooltip panel |
| `label` | `chart-label` | `<text>` | `ChartLabel` text |
| `legend` | `chart-legend` | `<ul>` | Legend drawn from the `legend` prop |

## Styling Reference

### Slots

- `base` → `[data-slot="line-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip
- `grid` → `[data-slot="chart-grid"]` – lines behind the plot; `stroke-muted` at 0.15 stroke opacity
- `axis` → `[data-slot="chart-x-axis"]` – one group per axis (`chart-y-axis` for y)
- `axisLine` → `[data-slot="chart-axis-line"]` – axis line, hidden
- `tickLine` → `[data-slot="chart-tick-line"]` – tick marks, hidden
- `tick` → `[data-slot="chart-tick"]` – axis label text; `fill-muted text-[10px]`
- `series` → `[data-slot="chart-line"]` – group around each series, empty by default
- `dot` → `[data-slot="chart-dot"]` – point markers. Off in charts drawn from props; a hand-placed `ChartLine` draws them unless `:dot="false"`
- `activeDot` → `[data-slot="chart-active-dot"]` – circle at the hovered point, with a 2px `stroke-surface` ring
- `cursor` → `[data-slot="chart-cursor"]` – hover guide: a 1px `stroke-muted` line, dashed 4/4
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text; `fill-muted text-[10px]`
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### LineChart

<ApiTable component="LineChart" kind="props" />

<ApiTable component="LineChart" kind="slots" />

### ChartLine

<ApiTable component="ChartLine" kind="props" />

<ApiTable component="ChartLine" kind="slots" />

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

<ApiTheme component="LineChart" />

## Accessibility

- With a `ChartTooltip`, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between points, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each series with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['area-chart', 'bar-chart', 'composed-chart', 'chart-tooltip', 'chart-legend']" />
