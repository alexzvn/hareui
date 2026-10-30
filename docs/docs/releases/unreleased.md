---
title: Unreleased
description: Changes merged since v0.3.0 that are not yet published.
---

Changes merged since [v0.3.0](./v0-3-0) that are not in a published release yet.

## New components

- `Timeline`: an ordered list of events with icon or avatar markers, per-item status tones, `v-model` progress, vertical or horizontal orientation, a centred axis with alternate placement, and per-item slots.
- `Splitter`: resizable panels from an `items` prop, with line, drag, pill and handle grips, collapsible panels, keyboard resizing and layout persistence (`auto-save-id`).

## Changes

- `Popover`, `Dropdown`, `Modal`, `Drawer`, `AlertDialog`, `DatePicker` and `DateRangePicker` render on the server again. In v0.3.0 they threw `Element is not defined` during server rendering, for example in Nuxt.
- A `PieChart` centre label and its `#center` slot sit at the centre of the pie that is drawn, including a composed `ChartPie` with its own `cx`, `cy` or radii. Previously they stayed at the middle of the chart.
- `ComboBox` lists your own `aria-describedby` ids first, before its value, description and error ids, as the other fields do.
- A `justify-*` class in a cartesian chart's `ui.legend` now overrides the default `justify-center`, as it already did on pie, radar and radial charts.
- `Modal`, `Drawer` and `AlertDialog` stay over the visible area when iOS Safari scrolls the page to show the on-screen keyboard. Previously the overlay stayed at the top of the page, so a drawer's header went off screen and its bottom stopped short of the keyboard. A top or bottom `Drawer` is now at most 85% of the visible area's height rather than of the page's, so a tall one keeps its header in view while the keyboard is open.

## Breaking changes

Props that shared a prefix are grouped into one object prop, for example `:prev="{ label, disabled }"` on `Pagination` and `:tick="{ count, formatter }"` on chart axes. `useResizable` takes one options object. See [Migrating from v0.3.0 to v0.4.0](./migrations/v0.3.0-v0.4.0.md) for every change, with before and after code.

## Accessibility

- While a field is invalid, its description is removed from the page and from `aria-describedby`, so screen readers announce only the error. This applies to `TextField`, `NumberField`, `NumberStepper`, `ColorField`, `SearchField`, `Select`, `ComboBox`, `NativeSelect` and `CellSelect`, whose themes already hid the description visually. Date and time fields already did this.
