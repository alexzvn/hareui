---
title: RangeCalendar
description: Date range picker with month grid, navigation, and year picker support built on Reka UI's RangeCalendar.
links:
  reka: range-calendar
  source: range-calendar/RangeCalendar.vue
  styles: range-calendar/theme.ts
  heroui: range-calendar
---

## Usage

```vue
<script setup lang="ts">
import { RangeCalendar } from '@hareui/vue'
</script>
```

<ComponentPreview name="range-calendar/basic" />

## Anatomy

RangeCalendar renders a header (heading or year-picker trigger, plus previous/next buttons)
followed by a 7-column day grid, with an optional overlay year grid. Unlike Calendar, each day is
a `cell` wrapping a `cellButton` — Reka puts the selection/today/outside-view state on the inner
button, not the outer cell.

```vue
<template>
  <RangeCalendar aria-label="Trip dates">
    <template #navIcon="{ direction }" />
    <!-- replaces both chevrons -->
    <template
      #cell="{
        date,
        today,
        selected,
        disabled,
        unavailable,
        outsideView,
        selectionStart,
        selectionEnd,
      }"
    />
    <!-- replaces formatted day -->
  </RangeCalendar>
</template>
```

| `ui` key                     | `data-slot`                              | Element                                                        |
| ---------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `base`                       | `range-calendar`                         | root element                                                   |
| `header`                     | `range-calendar-header`                  | row containing the heading/year-picker trigger and nav buttons |
| `heading`                    | `calendar-heading`                       | formatted month/year label (hidden when `year-picker`)         |
| `navButton`                  | `range-calendar-nav-button`              | previous/next button                                           |
| `navButtonIcon`              | `calendar-nav-button-icon`               | default chevron inside a nav button                            |
| `grid`                       | `range-calendar-grid`                    | the day grid                                                   |
| `gridHeader`                 | `range-calendar-grid-header`             | weekday label row wrapper                                      |
| `gridBody`                   | `range-calendar-grid-body`               | week rows wrapper                                              |
| `gridRow`                    | `range-calendar-grid-row`                | one week row                                                   |
| `headerCell`                 | `calendar-header-cell`                   | weekday label cell                                             |
| `cell`                       | `range-calendar-cell`                    | the interactive day cell — carries all state attributes        |
| `cellButton`                 | `range-calendar-cell-button`             | decorative inner circle (visual only, no attributes)           |
| `cellIndicator`              | `calendar-cell-indicator`                | dot rendered when `indicator(date)` is true                    |
| `yearPickerTrigger`          | `calendar-year-picker-trigger`           | toggles the year grid (when `year-picker`)                     |
| `yearPickerTriggerHeading`   | `calendar-year-picker-trigger-heading`   | heading text inside the trigger                                |
| `yearPickerTriggerIndicator` | `calendar-year-picker-trigger-indicator` | chevron icon inside the trigger                                |
| `yearPickerGrid`             | `calendar-year-picker-grid`              | overlay grid of selectable years                               |
| `yearPickerYearCell`         | `calendar-year-picker-year-cell`         | one selectable year                                            |

## Examples

### Default Value

<ComponentPreview name="range-calendar/default-value" />

### Disabled

<ComponentPreview name="range-calendar/disabled" />

### Read Only

<ComponentPreview name="range-calendar/read-only" />

### Year Picker

Set `year-picker` to replace the plain heading with a toggleable overlay grid of years, bounded by
`min-value`/`max-value` (defaulting to 1900–2099).

<ComponentPreview name="range-calendar/year-picker" />

### Controlled

Use `v-model` and `v-model:placeholder` for external state coordination and custom shortcuts.

<ComponentPreview name="range-calendar/controlled" />

### Min and Max Dates

<ComponentPreview name="range-calendar/min-max-dates" />

### Unavailable Dates

Use `is-date-unavailable` to block dates such as weekends, holidays, or booked slots.

<ComponentPreview name="range-calendar/unavailable-dates" />

### Anchor-Based Unavailable Dates

When selecting a range, `is-date-unavailable` receives a second argument, `anchorDate`, set to
the first selected date. Use it to limit which end dates are valid (for example, within 7 days of
the start).

<ComponentPreview name="range-calendar/anchor-unavailable-dates" />

### Non-Contiguous Ranges

Set `allow-non-contiguous-ranges` to let a selection skip over unavailable dates in the middle of
the range instead of resetting the selection.

<ComponentPreview name="range-calendar/allows-non-contiguous-ranges" />

### Weeks in Month

Set `fixed-weeks` to always render 6 weeks, keeping the grid height stable when navigating between
months.

<ComponentPreview name="range-calendar/weeks-in-month" />

### Week View

Set `visible-duration` to `{ weeks: n }` to show one or more weeks at a time. Navigation advances by the visible week range. Use `page-behavior="single"` to move one week at a time when showing multiple weeks.

<ComponentPreview name="range-calendar/week-view" />

### Day View

Set `visible-duration` to `{ days: n }` to show a rolling window of consecutive days. Navigation advances by the visible day range. Use `page-behavior="single"` to move one day at a time when showing multiple days.

<ComponentPreview name="range-calendar/day-view" />

### Focused Value

Programmatically control which month is displayed using `v-model:placeholder`.

<ComponentPreview name="range-calendar/focused-value" />

### Cell Indicators

Pass `indicator` to render a dot under matching dates, e.g. to surface metadata like events.

<ComponentPreview name="range-calendar/with-indicators" />

### Multiple Months

Set `number-of-months` to show several months side by side. The previous/next buttons always page
by the full visible width, matching React Aria's default behavior for multi-month calendars.

<ComponentPreview name="range-calendar/multiple-months" />

### Invalid

Pass `invalid` to mark the calendar as invalid for consumer-driven validation (e.g. a selected
range that's too long).

<ComponentPreview name="range-calendar/invalid" />

### Real-World Example

<ComponentPreview name="range-calendar/booking-calendar" />

### International Calendars

By default, RangeCalendar displays dates using the calendar system for the given `locale`. The
example below shows the Indian calendar system.

<ComponentPreview name="range-calendar/international-calendar" />

**Note:** `update:modelValue` always emits dates in the same calendar system as `model-value` or
`default-value` (Gregorian if neither is given), regardless of the displayed locale.

## Customization

### Tailwind CSS

<ComponentPreview name="range-calendar/custom-styles" />

### Global Configuration

To customize the RangeCalendar classes for the whole app, extend the `rangeCalendar` theme in
`createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      rangeCalendar: {
        slots: {
          base: 'rounded-2xl border border-border bg-surface p-3 shadow-sm',
          cell: 'rounded-lg',
        },
      },
    },
  }),
)
```

## Styling Reference

### Interactive States

RangeCalendar sets these data attributes on `[data-slot="range-calendar-cell"]`:

- **Selected**: `[data-selected]`
- **Selection start / end**: `[data-selection-start]` / `[data-selection-end]`
- **Today**: `[data-today]`
- **Unavailable**: `[data-unavailable]`
- **Invalid range** (unavailable or out-of-range end, or `invalid`): `[data-invalid]`
- **Outside the visible month**: `[data-outside-view]`
- **Hover**: `:hover`
- **Press**: `:active`
- **Focus visible**: `:focus-visible`
- **Disabled**: `:disabled` or `[data-disabled]`

### Reka UI Limitations

- Week and day views (`visible-duration`) are rendered by HareUI's own grid, since Reka's `CalendarRoot`/`RangeCalendarRoot` always build full month grids. They follow React Aria's `visibleDuration` behaviour (alignment, paging, `page-behavior`, keyboard navigation) and HeroUI's `--week-view`/`--day-view` styles; the year picker, `number-of-months` and `fixed-weeks` only apply to the month view.
- Anchor-aware `is-date-unavailable`: Reka's matcher takes one argument, so RangeCalendar wraps the two-argument callback in a closure that reads the in-progress anchor (the picked start while `end` is unset, `null` once the range is complete, as in react-stately). It also narrows Reka's `min-value`/`max-value` to the run of available days around the anchor (react-stately's `getAvailableRange`), so paging past it is disabled, The lone anchor cell is both selection start and end, as in React Aria.
- `fixed-weeks` is boolean only (always 6 weeks). HeroUI's React `weeksInMonth` accepts any count up
  to 6; Reka's `RangeCalendarRoot` only exposes the all-or-nothing `fixedWeeks` flag.
- `invalid` sets `aria-invalid`/`data-invalid` directly rather than through Reka: Reka's own
  `isInvalid` is a read-only computed derived from `isDateUnavailable`/`minValue`/`maxValue`, with
  no input prop to override it for arbitrary consumer validation (e.g. "stay too long").
- Range selection runs outside Reka: Reka's `RangeCalendarRoot` has no live preview with the selected
  styling, no press-and-drag selection and re-centres the view on every start change, so the month
  view keeps react-stately's anchor/focused-date state itself and uses Reka only for the grid, focus
  movement and paging. Like React Aria, a mouse press anchors the range (drag and release to commit,
  or click a second day), pressing an end of the selected range and dragging adjusts that end, the
  preview follows the hovered or focused day, Enter/Space anchors and moves focus one day ahead,
  Escape cancels, and outside-month days are inert. Picking the first day still emits a half-open
  range (`end: undefined`).

## API Reference

### Props

<ApiTable component="RangeCalendar" kind="props" />

### Slots

<ApiTable component="RangeCalendar" kind="slots" />

### Emits

<ApiTable component="RangeCalendar" kind="emits" />

## Theme

<ApiTheme component="RangeCalendar" />
