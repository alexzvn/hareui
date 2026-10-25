---
title: Unreleased
description: Changes merged since v0.3.0 that are not yet published.
---

Changes merged since [v0.3.0](./v0-3-0) that are not in a published release yet.

## Changes

- `Popover`, `Dropdown`, `Modal`, `Drawer`, `AlertDialog`, `DatePicker` and `DateRangePicker` render on the server again. In v0.3.0 they threw `Element is not defined` during server rendering, for example in Nuxt.
- A `PieChart` centre label and its `#center` slot sit at the centre of the pie that is drawn, including a composed `ChartPie` with its own `cx`, `cy` or radii. Previously they stayed at the middle of the chart.
- `ComboBox` lists your own `aria-describedby` ids first, before its value, description and error ids, as the other fields do.
- A `justify-*` class in a cartesian chart's `ui.legend` now overrides the default `justify-center`, as it already did on pie, radar and radial charts.

## Breaking changes

Props that shared a prefix are grouped into one object prop, for example `:prev="{ label, disabled }"` on `Pagination` and `:tick="{ count, formatter }"` on chart axes. `useResizable` takes one options object. See [Migrating from v0.3.0 to v0.4.0](./migrations/v0.3.0-v0.4.0.md) for every change, with before and after code.

## Accessibility

- While a field is invalid, its description is removed from the page and from `aria-describedby`, so screen readers announce only the error. This applies to `TextField`, `NumberField`, `NumberStepper`, `ColorField`, `SearchField`, `Select`, `ComboBox`, `NativeSelect` and `CellSelect`, whose themes already hid the description visually. Date and time fields already did this.
