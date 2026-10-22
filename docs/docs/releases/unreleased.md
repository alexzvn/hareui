---
title: Unreleased
description: Changes on the main branch that haven't been published yet.
---

These changes are on the main branch and will ship in the next release.

## New

### New components

**Forms:**

- [CellSwitch](/docs/components/cell-switch), [CellSlider](/docs/components/cell-slider), [CellSelect](/docs/components/cell-select) and [CellColorPicker](/docs/components/cell-color-picker) put a label and its control in one row, for settings panels.
- [CheckboxButtonGroup](/docs/components/checkbox-button-group) and [RadioButtonGroup](/docs/components/radio-button-group) show each option as a selectable card, with an optional icon, description and custom indicator.
- [DropZone](/docs/components/drop-zone) accepts files by drag and drop or from the file picker, filters them by type and size, and lists them with upload progress.
- [InlineSelect](/docs/components/inline-select) is a select that reads as part of a sentence.
- [NativeSelect](/docs/components/native-select) styles the browser's `<select>`, with a label, description and validation.
- [NumberStepper](/docs/components/number-stepper) changes a number with minus and plus buttons around the value.

**Charts:** SVG charts in a separate entry, `@hareui/vue/charts`. They need `d3-scale` and `d3-shape`, which are optional peer dependencies:

```bash
npm i d3-scale d3-shape
```

- [AreaChart](/docs/components/area-chart), [LineChart](/docs/components/line-chart), [BarChart](/docs/components/bar-chart) and [ComposedChart](/docs/components/composed-chart) plot series against an x and a y axis. Areas and bars can be stacked, and a composed chart mixes bars, lines and areas.
- [PieChart](/docs/components/pie-chart), [RadarChart](/docs/components/radar-chart) and [RadialChart](/docs/components/radial-chart) cover pies and donuts, radar plots, and progress rings and gauges.
- [ChartTooltip](/docs/components/chart-tooltip) is the panel shown on hover. Use its parts to build your own tooltip content.
- [ChartLegend](/docs/components/chart-legend) lists a chart's series, and can show or hide them.

Set `index`, plus `series` to pick the fields, and a chart draws its parts for you: grid, axes and tooltip on cartesian charts, slices or rings with a tooltip on pie and radial charts. Add `legend` for a legend that hides a series on click:

```vue
<AreaChart :data="data" index="month" :series="['revenue', 'costs']" stacked />
```

To control every part, place `ChartXAxis`, `ChartArea`, `ChartTooltip` and the other parts inside the chart yourself.

Apps that don't import `@hareui/vue/charts` don't need d3 installed.

Charts take their colors from five new theme variables, `--chart-1` to `--chart-5`: shades of `--accent` from darker to lighter, with `--chart-3` equal to the accent. Tailwind classes such as `bg-chart-2` and `text-chart-4` use them too, and overriding `--accent` recolors every chart.

The `@hareui/vue/vite` plugin and `HareUIResolver` import chart components from `@hareui/vue/charts`, so auto import works for them as well.

## Changes

- `Select` has `side` and `align` props to place its popover, and a `leading` slot before the value.
- A `Select` named only by `aria-label` now announces its label together with the selected value.
- Options in `Select` and `ListBox` show the focus ring only while you use the keyboard, as in `ComboBox` and `Autocomplete`. Opening the list with the mouse no longer rings the selected option.
- A disabled `Slider` sets `aria-disabled` on its thumbs.
- `Slider` submits its value under `name` (`volume=65`) instead of `volume[0]`. A range slider repeats the name for each thumb.
- `Slider` keeps its value inside `min` and `max`, and `changeEnd` reports the new value after an arrow key instead of the previous one.
- `Slider` can be dragged on touch screens without scrolling the page.
- When a form submit fails, a `RadioGroup` now moves focus to its first enabled option instead of the group.
- `@hareui/vue` now depends on `@number-flow/vue`, which NumberStepper uses to animate its value.
