---
title: RadarChart
description: Compare several metrics at once on axes arranged in a circle.
links:
  source: radar-chart/RadarChart.vue
  styles: radar-chart/theme.ts
---

## Usage

```vue
<RadarChart :data="data" index="category" />
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

Each row of `data` is one spoke. `index` names the field that labels the spokes, and every other numeric field becomes a radar, with a polygon grid and a tooltip. `RadarChart` fills its parent's width.

<ComponentPreview name="radar-chart/basic" />

## Series

Pass `series` to choose the fields, their names and their order. Use a map of key to config, or an array of keys and `{ key, ...config }` objects. Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`); set `colors` for a different palette, or `color` on one series.

```vue
<RadarChart
  :data="data"
  index="category"
  :series="{ hatchback: { name: 'Hatchback' }, suv: { name: 'SUV', color: 'var(--chart-2)' } }"
/>
```

Each series takes `name`, `color`, `hide`, `tooltip`, `valueFormatter`, `fillOpacity`, `strokeWidth`, `strokeDasharray`, `dot` and `activeDot`. `fill-opacity` (0.15), `stroke-width` (2) and `dot` on the root apply to every radar, and a series' own value wins.

## Grid and Axes

`grid`, `angle-axis` and `radius-axis` take `false` to hide the part, or an object of `ChartPolarGrid`, `ChartPolarAngleAxis` and `ChartPolarRadiusAxis` props. The grid and the spoke labels show by default; the radius axis is off until you set it.

```vue
<RadarChart
  :data="data"
  index="category"
  :grid="{ gridType: 'circle' }"
  :radius-axis="{ angle: 90, domain: [0, 100] }"
/>
```

The `#angle-tick` slot redraws each spoke label. It receives the label position and text, and renders SVG. To change only the text, `index-formatter` formats the spoke labels and the tooltip header.

## Tooltip

Hovering the chart shows every radar at the nearest spoke, under the spoke label. The tooltip stays up while the pointer moves between spokes. `tooltip` takes `false`, or `ChartTooltip` props such as `indicator`. `value-formatter` formats the values, and `index-formatter` the header. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the chart: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `indicator` and `orientation`, plus a `position`. Clicking an item hides or shows its radar; bind `v-model:hidden` to read or set the hidden keys. Use `#legend-item` to redraw each row, or `#legend` to replace the list. To place the legend elsewhere, such as a card header, render `<ChartLegend :series="series" />` with the same `series` and `colors`.

## Examples

### Two Models

Two radars on the same axes compare two cars, with the legend in the card header.

<ComponentPreview name="radar-chart/two-models" />

### Outline Only

`ui.radar: 'fill-none'` drops the fill, so only the outline and the `dot` markers remain.

<ComponentPreview name="radar-chart/outline-only" />

### Three Series

Three radars with their own `color` and a lower `fill-opacity`. Without `dot`, only the hovered spoke gets a marker.

<ComponentPreview name="radar-chart/three-series" />

### Ring Labels

`radius-axis` labels the rings. `angle: 90` draws it straight up, and a fixed `domain` keeps the scale at 0–100.

<ComponentPreview name="radar-chart/ring-labels" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Radar colors come from `colors` or each series' `color`, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<RadarChart
  :data="data"
  index="category"
  :ui="{ polarGrid: 'stroke-accent/30', angleTick: 'fill-foreground text-xs' }"
/>
```

Switch the grid to circles with `:grid="{ gridType: 'circle' }"`, and the outer ring with `:angle-axis="{ axisLine: { type: 'circle' } }"`.

### Global Configuration

Override the `radarChart` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      radarChart: {
        slots: {
          angleTick: 'text-xs',
        },
      },
    },
  }),
)
```

## Composition

Without `index` or `series`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as labels on points or a radar with its own scale. This is the first example, built from parts:

```vue
<template>
  <RadarChart>
    <ChartPolarGrid />
    <ChartPolarAngleAxis />
    <ChartPolarRadiusAxis />
    <ChartRadar />
    <ChartTooltip />
  </RadarChart>
</template>
```

<ComponentPreview name="radar-chart/composition" />

`ChartPolarAngleAxis` labels the spokes with its `data-key`, and each `ChartRadar` draws one field as a closed shape. Put a `ChartLabel` inside a `ChartRadar` to label each point; it sits past the point, away from the center. Parts always draw in the same order (grid, series, axes), so template order doesn't matter. With `index` or `series` set, parts in the default slot draw next to the generated ones: turn a generated part off (for example `:grid="false"`) before adding your own.

| `ui` key         | `data-slot`                                         | Element    | Description                                                           |
| ---------------- | --------------------------------------------------- | ---------- | --------------------------------------------------------------------- |
| `base`           | `radar-chart`                                       | `<div>`    | Responsive container                                                  |
| `surface`        | `chart-surface`                                     | `<svg>`    | Drawing surface                                                       |
| `overlay`        | `chart-overlay`                                     | `<div>`    | Layer over the svg that holds the tooltip                             |
| `polarGrid`      | `chart-polar-grid`                                  | `<g>`      | Rings (`chart-polar-grid-ring`) and spokes (`chart-polar-grid-spoke`) |
| `axis`           | `chart-polar-angle-axis`, `chart-polar-radius-axis` | `<g>`      | One group per axis                                                    |
| `axisLine`       | `chart-polar-angle-axis-line`                       | `<path>`   | Outer ring of the angle axis, hidden by default                       |
| `tickLine`       | `chart-polar-angle-axis-tick-line`                  | `<line>`   | Tick marks of the angle axis, hidden by default                       |
| `angleTick`      | `chart-polar-angle-axis-tick`                       | `<g>`      | One spoke label                                                       |
| `radiusAxisLine` | `chart-polar-radius-axis-line`                      | `<line>`   | Radius axis line                                                      |
| `radiusTick`     | `chart-polar-radius-axis-tick`                      | `<g>`      | One radius label                                                      |
| `series`         | `chart-radar`                                       | `<g>`      | One group per radar                                                   |
| `radar`          | `chart-radar-polygon`                               | `<path>`   | Radar shape                                                           |
| —                | `chart-radar-dots`                                  | `<g>`      | Point markers of one radar, when `dot` is set                         |
| `dot`            | `chart-dot`                                         | `<circle>` | Point marker                                                          |
| `activeDot`      | `chart-active-dot`                                  | `<circle>` | Marker at the hovered spoke                                           |
| `label`          | `chart-label`                                       | `<text>`   | `ChartLabel` text                                                     |
| `tooltip`        | `chart-tooltip-wrapper`                             | `<div>`    | Floating wrapper around the tooltip panel                             |
| `legend`         | `chart-legend`                                      | `<ul>`     | Legend drawn from the `legend` prop                                   |

## Styling Reference

### Slots

- `base` → `[data-slot="radar-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`, with a focus ring when focused from the keyboard
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip
- `polarGrid` → `[data-slot="chart-polar-grid"]` – rings and spokes, muted stroke at 20% opacity
- `axis` → `[data-slot="chart-polar-angle-axis"]` – one group per axis (`chart-polar-radius-axis` for the radius axis)
- `axisLine` → `[data-slot="chart-polar-angle-axis-line"]` – outer ring of the angle axis, hidden
- `tickLine` → `[data-slot="chart-polar-angle-axis-tick-line"]` – angle axis tick marks, hidden
- `angleTick` → `[data-slot="chart-polar-angle-axis-tick"]` – spoke labels, 11px muted text
- `radiusAxisLine` → `[data-slot="chart-polar-radius-axis-line"]` – radius axis line, muted
- `radiusTick` → `[data-slot="chart-polar-radius-axis-tick"]` – radius labels, 10px muted text
- `series` → `[data-slot="chart-radar"]` – group around each radar, empty by default
- `radar` → `[data-slot="chart-radar-polygon"]` – radar shape, empty by default
- `dot` → `[data-slot="chart-dot"]` – point markers when `dot` is set
- `activeDot` → `[data-slot="chart-active-dot"]` – marker at the hovered spoke, outlined in the surface color
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text, 10px muted. Inside a `ChartRadar`, each label sits past its point along the spoke, anchored away from the center
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### RadarChart

<ApiTable component="RadarChart" kind="props" />

<ApiTable component="RadarChart" kind="slots" />

### ChartRadar

<ApiTable component="ChartRadar" kind="props" />

<ApiTable component="ChartRadar" kind="slots" />

### ChartPolarGrid

<ApiTable component="ChartPolarGrid" kind="props" />

### ChartPolarAngleAxis

<ApiTable component="ChartPolarAngleAxis" kind="props" />

<ApiTable component="ChartPolarAngleAxis" kind="slots" />

### ChartPolarRadiusAxis

<ApiTable component="ChartPolarRadiusAxis" kind="props" />

<ApiTable component="ChartPolarRadiusAxis" kind="slots" />

### ChartLabel

<ApiTable component="ChartLabel" kind="props" />

<ApiTable component="ChartLabel" kind="slots" />

### ChartTooltip

<ApiTable component="ChartTooltip" kind="props" />

<ApiTable component="ChartTooltip" kind="slots" />

### Theme

<ApiTheme component="RadarChart" />

## Accessibility

- With a tooltip, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between spokes, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each radar with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['radial-chart', 'pie-chart', 'line-chart', 'chart-tooltip', 'chart-legend']" />
