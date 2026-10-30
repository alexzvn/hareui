---
title: PieChart
description: Show parts of a whole as pie or donut slices.
links:
  source: pie-chart/PieChart.vue
  styles: pie-chart/theme.ts
---

## Usage

```vue
<PieChart :data="data" index="mode" />
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

`index` names the field that holds each slice's name, and the first other numeric field sets its size (`value.key` picks another). The chart draws one slice per row with a tooltip. `PieChart` fills its parent's width.

<ComponentPreview name="pie-chart/basic" />

## Slices

Slices start at 3 o'clock and run counter-clockwise, in row order. Colors follow the chart palette by position (`--chart-3`, `--chart-1`, `--chart-4`, `--chart-2`, `--chart-5`). Set `colors` to an array for another palette, or to a map of slice name to color. A `fill` field in a row wins over both.

```vue
<PieChart
  :data="data"
  index="channel"
  :colors="{ Email: 'var(--chart-4)', Chat: 'var(--chart-2)' }"
/>
```

`donut` cuts a hole in the middle and rounds the slices (`inner-radius="68%"`, `:corner-radius="12"`, `:padding-angle="-20"`, so the rounded ends overlap). `inner-radius`, `outer-radius`, `corner-radius`, `padding-angle`, `start-angle` and `end-angle` set each value on their own and win over `donut`. Radii take pixels or a percentage of half the shorter chart side.

## Center

The `#center` slot puts HTML in the middle of the chart, such as a total inside a donut. It receives `total`, the sum of the visible slices, and `active`, the hovered slice (`name`, `value`, `percent`, `color`) or `null`.

```vue
<PieChart :data="data" index="format" donut>
  <template #center="{ total, active }">
    <span class="text-3xl font-bold">{{ active?.value ?? total }}</span>
    <span class="text-sm text-muted">{{ active?.name ?? 'Loans' }}</span>
  </template>
</PieChart>
```

## Tooltip

Hovering a slice shows its name and value. `tooltip` takes `false`, or `ChartTooltip` props such as `indicator` and `labelFormatter`. `value.formatter` formats the values. Use the `#tooltip-footer` slot to add rows under the default ones, or `#tooltip` to replace the panel.

## Legend

Set `legend` to draw a [ChartLegend](./chart-legend) beside the chart: `true` puts it at the bottom, or pass `'top'`, `'left'` or `'right'`. An object sets `ChartLegend` props, such as `showValue` and `showPercent`, plus a `position`; the chart's `value.formatter` formats the legend values too. Clicking an item hides or shows its slice; bind `v-model:hidden` to read or set the hidden names. Use `#legend-item` to redraw each row, or `#legend` to replace the list.

## Examples

### Share Tooltip

`value.formatter` shows each slice as a share of the total, and `#tooltip-footer` adds the order count under it.

<ComponentPreview name="pie-chart/share-tooltip" />

### Donut

`donut` with a legend that shows each value.

<ComponentPreview name="pie-chart/donut" />

### Total In The Hole

`#center` puts the total in the hole, and a vertical legend lists each format with its value and share.

<ComponentPreview name="pie-chart/total-in-the-hole" />

### Storage Donut

The card description and the text in the hole sum the slices. The legend formats the values in gigabytes.

<ComponentPreview name="pie-chart/storage-donut" />

### Two Rings

Two rings with their own rows. The props draw a single pie, so this chart is built from parts: two `ChartPie`s with their own `data` and radii, and a `ChartLegend` under the chart.

<ComponentPreview name="pie-chart/two-rings" />

### Side Legend

A donut with the total in the hole and a legend on the right that lists each value and share.

<ComponentPreview name="pie-chart/side-legend" />

## Customization

### Tailwind CSS

Use `class` for the container and `ui` for the drawn parts. Slice colors come from `colors` or a `fill` field in each row, which accept any CSS color or the `--chart-1` to `--chart-5` tokens.

```vue
<PieChart
  :data="data"
  index="mode"
  :ui="{ sector: 'stroke-background stroke-2', center: 'gap-1' }"
/>
```

### Global Configuration

Override the `pieChart` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      pieChart: {
        slots: {
          sector: 'stroke-background',
        },
      },
    },
  }),
)
```

## Composition

Without `index`, the chart draws only the parts you put in its default slot. Use parts when you need what the props don't cover, such as several rings with their own rows, labels on slices or a custom slice shape. This is the first example, built from parts:

```vue
<template>
  <PieChart>
    <ChartPie>
      <ChartCell />
    </ChartPie>
    <ChartTooltip />
  </PieChart>
</template>
```

<ComponentPreview name="pie-chart/composition" />

`ChartPie` draws one ring from `data-key` and `name-key`, using its own `data` or the chart's. A `ChartCell` per slice sets its color, in row order. Put a `ChartLabel` inside a `ChartPie` to label each slice, or directly in the chart with `position="center"` for text in the middle. With several pies, the tooltip shows the slice under the pointer. With `index` set, parts in the default slot draw over the generated pie.

| `ui` key  | `data-slot`             | Element  | Description                                                                                 |
| --------- | ----------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `base`    | `pie-chart`             | `<div>`  | Responsive container                                                                        |
| `surface` | `chart-surface`         | `<svg>`  | Drawing surface                                                                             |
| `overlay` | `chart-overlay`         | `<div>`  | Layer over the svg that holds the tooltip and the center content                            |
| `series`  | `chart-pie`             | `<g>`    | One group per pie                                                                           |
| `sector`  | `chart-pie-sector`      | `<path>` | One slice, with `data-index`, and `data-active` while hovered or selected with the keyboard |
| `label`   | `chart-label`           | `<text>` | `ChartLabel` text                                                                           |
| `center`  | `chart-center`          | `<div>`  | `#center` content                                                                           |
| `tooltip` | `chart-tooltip-wrapper` | `<div>`  | Floating wrapper around the tooltip panel                                                   |
| `legend`  | `chart-legend`          | `<ul>`   | Legend drawn from the `legend` prop                                                         |

## Styling Reference

### Slots

- `base` → `[data-slot="pie-chart"]` – block container; the chart fills its width unless you set `width`
- `surface` → `[data-slot="chart-surface"]` – the `<svg>`, with a focus ring when focused from the keyboard
- `overlay` → `[data-slot="chart-overlay"]` – layer over the svg that positions the tooltip and the center content
- `series` → `[data-slot="chart-pie"]` – group around each pie, empty by default
- `sector` → `[data-slot="chart-pie-sector"]` – slices, no outline unless the pie or a `ChartCell` sets a `stroke`
- `label` → `[data-slot="chart-label"]` – `ChartLabel` text, 10px muted
- `center` → `[data-slot="chart-center"]` – `#center` content, a centered column on the middle of the chart that lets the pointer through
- `tooltip` → `[data-slot="chart-tooltip-wrapper"]` – floating wrapper around the tooltip panel
- `legend` → `[data-slot="chart-legend"]` – legend drawn from the `legend` prop; with it, `base` becomes a flex row or column

## API Reference

### PieChart

<ApiTable component="PieChart" kind="props" />

<ApiTable component="PieChart" kind="slots" />

### ChartPie

<ApiTable component="ChartPie" kind="props" />

<ApiTable component="ChartPie" kind="slots" />

### ChartCell

<ApiTable component="ChartCell" kind="props" />

### ChartLabel

<ApiTable component="ChartLabel" kind="props" />

<ApiTable component="ChartLabel" kind="slots" />

### ChartTooltip

<ApiTable component="ChartTooltip" kind="props" />

<ApiTable component="ChartTooltip" kind="slots" />

## Theme

<ApiTheme component="PieChart" />

## Accessibility

- With a tooltip, the chart joins the tab order with `role="application"`. Name it with `aria-label` on the chart. <kbd>←</kbd>/<kbd>→</kbd> (or <kbd>↑</kbd>/<kbd>↓</kbd>) move between slices, <kbd>Home</kbd>/<kbd>End</kbd> jump to the first and last, and <kbd>Escape</kbd> hides the tooltip.
- With several pies, the keys walk one pie after the other, in template order.
- The tooltip panel is a polite live region (`role="status"`), so screen readers announce each value as it changes.
- The drawn shapes are hidden from screen readers. Put the key numbers in text next to the chart, as the examples do.
- Animations are skipped when the user prefers reduced motion.
- Don't rely on color alone. Pair each slice with a legend label (`legend` or `ChartLegend`).

## Related Components

<RelatedComponents :components="['radial-chart', 'radar-chart', 'bar-chart', 'chart-tooltip', 'chart-legend']" />
