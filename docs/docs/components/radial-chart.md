---
title: RadialChart
description: Draw values as circular bars, for progress rings, gauges and ring comparisons.
links:
  source: radial-chart/RadialChart.vue
  styles: radial-chart/theme.ts
---

## Usage

```vue
<RadialChart :data="data" index="subject" />
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

Each row of `data` becomes a ring, the first one innermost. `index` names the field that holds each ring's name, and the first other numeric field sets its length (`value-key` picks another). Rings get a rounded end, a track behind them and a tooltip. `RadialChart` fills its parent's width.

<ComponentPreview name="radial-chart/basic" />

## Rings

Bars start at 12 o'clock and run clockwise. A full turn equals the largest value; set `max` to measure every ring against a fixed value, such as a goal or 100%. Hidden rings still count toward the default maximum, so hiding one doesn't stretch the others.

Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`). Set `colors` to an array for another palette, or to a map of ring name to color. A `fill` field in a row wins over both.

- `gauge` opens the circle at the bottom (`:start-angle="225"`, `:end-angle="-45"`). `start-angle` and `end-angle` set any other sweep, in degrees counter-clockwise from 3 o'clock, and win over `gauge`.
- `inner-radius` and `outer-radius` set the space the rings share, in pixels or as a percentage of half the shorter chart side. `bar-size` sets each bar's thickness.
- `corner-radius` rounds the bar ends (12 by default). `background` takes `false` to drop the tracks, or `{ fill, class }` to style them.

```vue
<RadialChart :data="data" index="metric" gauge :max="100" inner-radius="70%" outer-radius="90%" />
```

## Center

The `#center` slot puts HTML in the middle of the rings, such as the value of a gauge. It receives `total`, the sum of the visible rings, and `active`, the hovered ring (`name`, `value`, `percent`, `color`) or `null`.

```vue
<RadialChart :data="data" index="drink" :max="goal">
  <template #center="{ total }">
    <span class="text-3xl font-bold">{{ Math.round((total / goal) * 100) }}%</span>
  </template>
</RadialChart>
```

## Tooltip

Hovering a ring, or its track, shows its name and value. `tooltip` takes `false`, or `ChartTooltip` props such as `indicator` and `labelFormatter`. `value-formatter` formats the values. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the chart: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `showValue` and `showPercent`, plus a `position`; the chart's `valueFormatter` formats the legend values too. Clicking an item hides or shows its ring; bind `v-model:hidden` to read or set the hidden names. Use `#legend-item` to redraw each row, or `#legend` to replace the list.

## Examples

### Gauge

`gauge` with `:max="100"` shows one percentage, with its value in the middle.

<ComponentPreview name="radial-chart/gauge" />

### Gauge Cards

One small gauge per card, each measured against its own `max`.

<ComponentPreview name="radial-chart/gauge-cards" />

### Goal Ring

A single ring measured against a goal. A large `inner-radius` and a `bar-size` make a thin ring with room for text in the middle.

<ComponentPreview name="radial-chart/goal-ring" />

### Ring Legend

Rings next to a legend that lists their values, with the total in the middle.

<ComponentPreview name="radial-chart/ring-legend" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Ring colors come from `colors` or a `fill` field in each row, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<RadialChart :data="data" index="subject" :ui="{ radialBarBackground: 'fill-accent/10' }" />
```

### Global Configuration

Override the `radialChart` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    radialChart: {
      slots: {
        radialBarBackground: 'fill-surface-secondary',
      },
    },
  },
}))
```

## Composition

Without `index`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as several bars per ring, labels on the bars or a grid behind the rings. This is the gauge example's ring, built from parts, with a `ChartLabel` for the value:

```vue
<template>
  <RadialChart>
    <ChartPolarAngleAxis />
    <ChartRadialBar>
      <ChartCell />
    </ChartRadialBar>
    <ChartTooltip />
  </RadialChart>
</template>
```

<ComponentPreview name="radial-chart/composition" />

A ring's color comes from a `ChartCell`, a `fill` field in its row, or the bar's `fill`. A `ChartPolarAngleAxis` with `type="number"` and a fixed `domain` sets the full-scale value; `:tick="false"` hides its labels. Put a `ChartLabel` directly in the chart with `position="center"` for text in the middle. With `index` set, parts in the default slot draw over the generated rings.

| `ui` key | `data-slot` | Element | Description |
|---|---|---|---|
| `base` | `radial-chart` | `<div>` | Responsive container |
| `surface` | `chart-surface` | `<svg>` | Drawing surface |
| `overlay` | `chart-overlay` | `<div>` | Layer over the svg that holds the tooltip and the center content |
| — | `chart-radial-bar-background` | `<g>` | Tracks of one `ChartRadialBar`, when `background` is set |
| `radialBarBackground` | `chart-radial-bar-track` | `<path>` | Full-length track behind one bar |
| `series` | `chart-radial-bar` | `<g>` | One group per `ChartRadialBar` |
| `sector` | `chart-radial-bar-sector` | `<path>` | One bar, with `data-index`, and `data-active` while hovered or selected with the keyboard |
| `label` | `chart-label` | `<text>` | `ChartLabel` text |
| `center` | `chart-center` | `<div>` | `#center` content |
| `tooltip` | `chart-tooltip-wrapper` | `<div>` | Floating wrapper around the tooltip panel |
| `legend` | `chart-legend` | `<ul>` | Legend drawn from the `legend` prop |

## Styling Reference

### Slots

- `base` → `[data-slot="radial-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`, with a focus ring when focused from the keyboard
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip and the center content
- `radialBarBackground` → `[data-slot="chart-radial-bar-track"]` – tracks, filled with the default color
- `series` → `[data-slot="chart-radial-bar"]` – group around each `ChartRadialBar`, empty by default
- `sector` → `[data-slot="chart-radial-bar-sector"]` – bars, no outline unless the bar or a `ChartCell` sets a `stroke`
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text, 10px muted
- `center` → `[data-slot="chart-center"]` – `#center` content, a centered column on the middle of the chart that lets the pointer through
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### RadialChart

<ApiTable component="RadialChart" kind="props" />

<ApiTable component="RadialChart" kind="slots" />

### ChartRadialBar

<ApiTable component="ChartRadialBar" kind="props" />

<ApiTable component="ChartRadialBar" kind="slots" />

### ChartPolarAngleAxis

<ApiTable component="ChartPolarAngleAxis" kind="props" />

<ApiTable component="ChartPolarAngleAxis" kind="slots" />

### ChartCell

<ApiTable component="ChartCell" kind="props" />

### ChartLabel

<ApiTable component="ChartLabel" kind="props" />

<ApiTable component="ChartLabel" kind="slots" />

### ChartTooltip

<ApiTable component="ChartTooltip" kind="props" />

<ApiTable component="ChartTooltip" kind="slots" />

### Theme

<ApiTheme component="RadialChart" />

## Accessibility

- With a tooltip, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between rings, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- The tooltip shows the ring under the pointer, also over its empty track, and hides in the center hole and outside the rings.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each ring with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['pie-chart', 'radar-chart', 'bar-chart', 'chart-tooltip', 'chart-legend']" />
