---
title: Unreleased
description: Changes merged since v0.3.0 that are not yet published.
---

Changes merged since [v0.3.0](./v0-3-0) that are not in a published release yet.

## New components

- `ContextMenu`: a menu that opens at the pointer on right click or long press, with sections, item groups, submenus, single or multiple selection, shortcuts and item slots.
- `Stepper`: a horizontal or vertical step indicator with `v-model`, linear navigation, `next()` / `prev()`, item icons, partial line progress, colors and sizes.
- `Timeline`: an ordered list of events with icon or avatar markers, per-item status tones, `v-model` progress, vertical or horizontal orientation, a centred axis with alternate placement, and per-item slots.
- `Rating`: a row of icons to show or collect a score, with `v-model`, half and fractional steps, clearable, hoverable, read-only, custom icons or an `#item` slot, and Form validation.
- `Tree`: expandable folders and files with indent guides, single, multiple and checkbox-style selection, controlled expansion, per-item slots and virtualization.
- `Splitter`: resizable panels from an `items` prop, with line, drag, pill and handle grips, collapsible panels, keyboard resizing and layout persistence (`auto-save-id`).
- `Sidebar`: a standalone collapsible sidebar with `offcanvas`, `icon` or `none` collapse, `sidebar`, `floating` or `inset` variants, a rail, and a slideover, drawer or modal menu on mobile that closes when a link inside it is clicked (`auto-close`).
- `Toc`: a table of contents that follows the heading in view, as a sticky list (collapsible below `lg`, with an optional straight or circuit highlight) or as floating marks that open the links on hover or press.
- `CommandPalette` (`@hareui/vue/command-palette`): grouped commands with fuzzy search, keyboard navigation, `v-model` and `v-model:search-term`, nested lists, shortcuts, match highlighting, virtualization and per-group slots. Needs the optional `fuse.js` peer.
- `Carousel` (`@hareui/vue/carousel`): slides with arrows, dots and thumbnails, `in-place`, `modal` and `miniatures` types, vertical and RTL support, and arrow-key navigation. Needs the optional `embla-carousel-vue` peer; the autoplay, auto-scroll, auto-height, class-names, fade and wheel-gestures plugin props each load their own `embla-carousel-*` package only when set.
- `CodeBlock` (`@hareui/vue/code-block`): code with a filename or language header, copy button, highlighted lines and line numbers. Highlighting uses the optional `shiki` peer when it's installed, with light and dark themes.
- `useOverlay()`: open a `Modal`, `Drawer` or `AlertDialog` from code and await the value it closes with. `App` now renders the `OverlayProvider` it needs. See [Overlays](../getting-started/overlays).

The four components with an import path of their own aren't exported from `@hareui/vue`, so apps that don't use them don't need their peers.

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
