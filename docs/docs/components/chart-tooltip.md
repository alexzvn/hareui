---
title: ChartTooltip
description: Shows the values at the hovered point of a chart.
links:
  source: chart-tooltip/ChartTooltipContent.vue
  styles: chart-tooltip/theme.ts
---

## Usage

```ts
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipHeader,
  ChartTooltipIndicator,
  ChartTooltipItem,
  ChartTooltipLabel,
  ChartTooltipValue,
} from '@hareui/vue/charts'
```

Charts ship from the `@hareui/vue/charts` entry. The tooltip panel doesn't draw anything, but the entry needs two optional peer dependencies:

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

<ComponentPreview name="chart-tooltip/basic" />

Inside a chart, `ChartTooltip` renders `ChartTooltipContent` for the hovered point. Use the panel directly for static content, or pass it to the `#content` slot of `ChartTooltip` to customize it.

## Anatomy

```vue
<template>
  <ChartTooltipContent>
    <ChartTooltipHeader />
    <ChartTooltipItem>
      <ChartTooltipIndicator />
      <ChartTooltipLabel />
      <ChartTooltipValue />
    </ChartTooltipItem>
  </ChartTooltipContent>
</template>
```

| `ui` key    | `data-slot`               | Element  | Description                     |
| ----------- | ------------------------- | -------- | ------------------------------- |
| `base`      | `chart-tooltip`           | `<div>`  | The panel                       |
| `header`    | `chart-tooltip-header`    | `<div>`  | Title row, the hovered category |
| `item`      | `chart-tooltip-item`      | `<div>`  | One row per series              |
| `indicator` | `chart-tooltip-indicator` | `<span>` | Color marker, a dot or a line   |
| `label`     | `chart-tooltip-label`     | `<span>` | Series name                     |
| `value`     | `chart-tooltip-value`     | `<span>` | Series value                    |

## Examples

### From Payload

Pass `label` and `payload` and leave the default slot empty. The panel builds the header and one row per entry. The indicator takes the entry's `color`, then `stroke`, then `fill`, so bar series that only set `fill` work too.

<ComponentPreview name="chart-tooltip/from-payload" />

### Palette Tokens

Indicators accept any CSS color. `--chart-1` to `--chart-5` step the accent's lightness from −24% to +24%, so neighboring series stay apart.

<ComponentPreview name="chart-tooltip/palette-tokens" />

### Formatting

Use `label-formatter` for the header and `value-formatter` for each value. Both receive the raw value, so a numeric `label` can become `Week 27`. Without a formatter, values print as-is (`8000`, not `8,000`).

<ComponentPreview name="chart-tooltip/formatting" />

### Hidden State

Set `:active="false"` to render nothing. Turn the switch off to see it. `ChartTooltip` hides the panel on its own; set `active` only when you render the panel yourself.

<ComponentPreview name="chart-tooltip/hidden-state" />

### Line Markers

Set `indicator="line"` to show a short vertical bar instead of a dot.

<ComponentPreview name="chart-tooltip/line-markers" />

### Without Header

Leave out `ChartTooltipHeader`, or set `hide-header` with auto content, for single-series charts.

<ComponentPreview name="chart-tooltip/without-header" />

## Customization

### Tailwind CSS

Use `class` for the panel and `ui` for its parts. Keys in `ui` also apply to parts you compose yourself.

<ComponentPreview name="chart-tooltip/custom-styles" />

### Global Configuration

Override the `chartTooltip` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      chartTooltip: {
        slots: {
          base: 'rounded-xl',
          value: 'font-medium',
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="chart-tooltip"]` – rounded panel with a separator border, overlay background and overlay shadow. Minimum width 140px, tabular numbers
- `header` → `[data-slot="chart-tooltip-header"]` – muted 12px medium text
- `item` → `[data-slot="chart-tooltip-item"]` – flex row with an 8px gap
- `indicator` → `[data-slot="chart-tooltip-indicator"]` – 8px circle with `indicator="dot"`, 4px × 12px pill with `indicator="line"`
- `label` → `[data-slot="chart-tooltip-label"]` – muted 12px text that fills the free space, which pushes the value to the end
- `value` → `[data-slot="chart-tooltip-value"]` – 12px semibold foreground text

### Indicator Shape

The panel sets `[data-indicator="dot"]` or `[data-indicator="line"]`, so you can target either shape from CSS:

```css
[data-slot='chart-tooltip'][data-indicator='line'] [data-slot='chart-tooltip-value'] {
  font-weight: 500;
}
```

## API Reference

### ChartTooltip

<ApiTable component="ChartTooltip" kind="props" />

<ApiTable component="ChartTooltip" kind="slots" />

### ChartTooltipContent

<ApiTable component="ChartTooltipContent" kind="props" />

<ApiTable component="ChartTooltipContent" kind="slots" />

### ChartTooltipHeader

<ApiTable component="ChartTooltipHeader" kind="props" />

### ChartTooltipItem

<ApiTable component="ChartTooltipItem" kind="props" />

### ChartTooltipIndicator

<ApiTable component="ChartTooltipIndicator" kind="props" />

### ChartTooltipLabel

<ApiTable component="ChartTooltipLabel" kind="props" />

### ChartTooltipValue

<ApiTable component="ChartTooltipValue" kind="props" />

## Theme

<ApiTheme component="ChartTooltipContent" />

## Accessibility

- `ChartTooltip` wraps the panel in a polite live region (`role="status"`, `aria-live="polite"`), so screen readers announce the hovered values. It shows the panel on hover and when the user moves through the chart with the arrow keys.
- With `:panel="false"` the region stays visually hidden and is only read by screen readers. The panel itself has no role.
- Indicators are `aria-hidden`; the label text names each series.
- Don't rely on color alone: keep a label on every row.

## Related Components

<RelatedComponents :components="['area-chart', 'bar-chart', 'line-chart', 'composed-chart', 'pie-chart', 'radar-chart', 'radial-chart']" />
