---
title: Calendar
description: Date picker with month grid, navigation, and year picker support built on Reka UI's Calendar.
links:
  reka: calendar
  source: calendar/Calendar.vue
  styles: calendar/theme.ts
  heroui: calendar
---

## Usage

```vue
<script setup lang="ts">
import { Calendar } from '@hareui/vue'
</script>
```

<ComponentPreview name="calendar/basic" />

## Anatomy

Calendar renders a header (heading or year-picker trigger, plus previous/next buttons) followed by
a 7-column day grid, with an optional overlay year grid.

```vue
<template>
  <Calendar aria-label="Event date">
    <template #navIcon="{ direction }" />                                  <!-- replaces both chevrons -->
    <template #cell="{ date, today, selected, disabled, unavailable, outsideView }" /> <!-- replaces formatted day -->
  </Calendar>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `calendar` | root element |
| `header` | `calendar-header` | row containing the heading/year-picker trigger and nav buttons |
| `heading` | `calendar-heading` | formatted month/year label (hidden when `year-picker`) |
| `navButton` | `calendar-nav-button` | previous/next button |
| `navButtonIcon` | `calendar-nav-button-icon` | default chevron inside a nav button |
| `grid` | `calendar-grid` | the day grid |
| `gridHeader` | `calendar-grid-header` | weekday label row wrapper |
| `gridBody` | `calendar-grid-body` | week rows wrapper |
| `gridRow` | – | one week row |
| `headerCell` | `calendar-header-cell` | weekday label cell |
| `cell` | `calendar-cell` | one interactive day |
| `cellIndicator` | `calendar-cell-indicator` | dot rendered when `indicator(date)` is true |
| `yearPickerTrigger` | `calendar-year-picker-trigger` | toggles the year grid (when `year-picker`) |
| `yearPickerTriggerHeading` | `calendar-year-picker-trigger-heading` | heading text inside the trigger |
| `yearPickerTriggerIndicator` | `calendar-year-picker-trigger-indicator` | chevron icon inside the trigger |
| `yearPickerGrid` | `calendar-year-picker-grid` | overlay grid of selectable years |
| `yearPickerYearCell` | `calendar-year-picker-year-cell` | one selectable year |

## Examples

### Default Value

<ComponentPreview name="calendar/default-value" />

### Disabled

<ComponentPreview name="calendar/disabled" />

### Read Only

<ComponentPreview name="calendar/read-only" />

### Year Picker

Set `year-picker` to replace the plain heading with a toggleable overlay grid of years, bounded by
`min-value`/`max-value` (defaulting to 1900–2099).

<ComponentPreview name="calendar/year-picker" />

### Controlled

Use `v-model` and `v-model:placeholder` for external state coordination and custom shortcuts.

<ComponentPreview name="calendar/controlled" />

### Min and Max Dates

<ComponentPreview name="calendar/min-max-dates" />

### Unavailable Dates

Use `is-date-unavailable` to block dates such as weekends, holidays, or booked slots.

<ComponentPreview name="calendar/unavailable-dates" />

### Weeks in Month

Set `fixed-weeks` to always render 6 weeks, keeping the grid height stable when navigating between
months.

<ComponentPreview name="calendar/weeks-in-month" />

### Week View

Set `visible-duration` to `{ weeks: n }` to show one or more weeks at a time. Navigation advances by the visible week range. Use `page-behavior="single"` to move one week at a time when showing multiple weeks.

<ComponentPreview name="calendar/week-view" />

### Day View

Set `visible-duration` to `{ days: n }` to show a rolling window of consecutive days. Navigation advances by the visible day range. Use `page-behavior="single"` to move one day at a time when showing multiple days.

<ComponentPreview name="calendar/day-view" />

### Multiple Selection

Set `selection-mode="multiple"` to let users select several dates. `model-value` and `default-value`
become an array of dates.

<ComponentPreview name="calendar/multiple-selection" />

### Focused Value

Programmatically control which month is displayed using `v-model:placeholder`.

<ComponentPreview name="calendar/focused-value" />

### Cell Indicators

Pass `indicator` to render a dot under matching dates, e.g. to surface metadata like events.

<ComponentPreview name="calendar/with-indicators" />

### Custom Navigation Icons

Use the `#navIcon` slot to replace the default chevron icons.

<ComponentPreview name="calendar/custom-icons" />

### Real-World Example

<ComponentPreview name="calendar/booking-calendar" />

### International Calendars

By default, Calendar displays dates using the calendar system for the given `locale`. The example
below shows the Indian calendar system.

<ComponentPreview name="calendar/international-calendar" />

**Note:** `update:modelValue` always emits a date in the same calendar system as `model-value` or
`default-value` (Gregorian if neither is given), regardless of the displayed locale.

### Multiple Months

Set `number-of-months` to show several months side by side. The previous/next buttons always
page by the full visible width, matching React Aria's default behavior for multi-month calendars.

<ComponentPreview name="calendar/multiple-months" />

## Customization

### Tailwind CSS

<ComponentPreview name="calendar/custom-styles" />

### Global Configuration

To customize the Calendar classes for the whole app, extend the `calendar` theme in `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    calendar: {
      slots: {
        base: 'rounded-2xl border border-border bg-surface p-3 shadow-sm',
        cell: 'rounded-lg',
      },
    },
  },
}))
```

## Styling Reference

### Interactive States

Calendar sets these data attributes (from Reka UI):

- **Selected**: `[data-selected]` on `[data-slot="calendar-cell"]`
- **Today**: `[data-today]`
- **Unavailable**: `[data-unavailable]`
- **Outside the visible month**: `[data-outside-view]`
- **Hover**: `:hover`
- **Press**: `:active`
- **Focus visible**: `:focus-visible`
- **Disabled**: `:disabled` or `[data-disabled]`

### Reka UI Limitations

- Week and day views (`visible-duration`) are rendered by HareUI's own grid, since Reka's `CalendarRoot`/`RangeCalendarRoot` always build full month grids. They follow React Aria's `visibleDuration` behaviour (alignment, paging, `page-behavior`, keyboard navigation) and HeroUI's `--week-view`/`--day-view` styles; the year picker, `number-of-months` and `fixed-weeks` only apply to the month view.
- `fixed-weeks` is boolean only (always 6 weeks). HeroUI's React `weeksInMonth` accepts any count up
  to 6; Reka's `CalendarRoot` only exposes the all-or-nothing `fixedWeeks` flag.
- React Aria behaviours Reka lacks are added on top of `CalendarRoot`: Home/End and PageUp/PageDown
  (Shift: by year) keyboard paging, prev/next buttons that keep the focused day of the month,
  inert outside-month days, and re-selecting the selected date keeps it selected (single
  selection) while still emitting `update:modelValue` with it.

## API Reference

### Props

<ApiTable component="Calendar" kind="props" />

### Slots

<ApiTable component="Calendar" kind="slots" />

### Emits

<ApiTable component="Calendar" kind="emits" />

### Theme

<ApiTheme component="Calendar" />
