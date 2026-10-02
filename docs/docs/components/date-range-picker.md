---
title: DateRangePicker
description: Combines start and end date fields and a RangeCalendar in a popover for picking a date range
links:
  reka: date-range-picker
  source: DateRangePicker.vue
  styles: dateRangePicker.ts
  heroui: date-range-picker
---

## Usage

```vue
<script setup lang="ts">
import { DateRangePicker } from 'herouse'
</script>
```

<ComponentPreview name="date-range-picker/basic" />

## Anatomy

DateRangePicker renders a [Label](/docs/components/label), a segmented [date-input-group](/docs/components/date-field) holding the start and end segments, a range separator and a calendar trigger button, a [Description](/docs/components/description)/[FieldError](/docs/components/field-error), and a popover with an embedded [RangeCalendar](/docs/components/range-calendar). The text parts come from props; each can be replaced with a slot.

```vue
<template>
  <DateRangePicker label="…" calendar-label="…" start-name="…" end-name="…" description="…" error-message="…">
    <template #label />       <!-- Label content -->
    <template #separator />   <!-- replaces the default " - " between the inputs -->
    <template #indicator />   <!-- replaces the default calendar icon in the trigger -->
    <template #description /> <!-- Description content -->
    <template #error />       <!-- FieldError content, rendered when invalid -->
    <template #calendar />    <!-- replaces the default RangeCalendar rendered inside the popover -->
  </DateRangePicker>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `date-range-picker` | `<div role="group">` root |
| — | `label` | [Label](/docs/components/label) (iff `label` / `#label`) |
| `group` | `date-input-group` | `<div role="group">` holding the inputs and the trigger |
| `inputContainer` | `date-input-group-input-container` | scrollable wrapper around both inputs (iff `input-container`) |
| `input` | `date-input-group-input` | one per end (`slot="start"` / `slot="end"`) |
| `segment` | `date-input-group-segment` | one per date part (year, month, day, …) |
| `rangeSeparator` | `date-range-picker-range-separator` | `<span>` between the start and end inputs |
| `trigger` | `date-range-picker-trigger` | `<button>` that opens the popover, rendered in the group's suffix |
| `triggerIndicator` | `date-range-picker-trigger-indicator` | `<span>` holding the default/custom calendar icon |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |
| — | `field-error` | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |
| `popover` | `date-range-picker-popover` | the popover content wrapping the [RangeCalendar](/docs/components/range-calendar) |

> **DateRangePicker** values are `{ start, end }` objects of [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) values (`CalendarDate`, `CalendarDateTime` or `ZonedDateTime`) — the same types HeroUI uses. Like React Aria, `v-model` only emits complete ranges (or `null` once both ends are cleared).

## Examples

### Disabled

<ComponentPreview name="date-range-picker/disabled" />

### Controlled

<ComponentPreview name="date-range-picker/controlled" />

### Validation

<ComponentPreview name="date-range-picker/with-validation" />

### Format Options

Control how DateRangePicker values are displayed with props such as `granularity`, `hour-cycle` and `hide-time-zone`. For granularities beyond `"day"`, the `#calendar` slot composes two [TimeField](/docs/components/time-field)s alongside the RangeCalendar; `onChange` commits a time edit without closing the popover.

<ComponentPreview name="date-range-picker/format-options" />

### Input Container

`input-container` wraps the start and end inputs in a horizontally scrollable container (HeroUI's `DateField.InputContainer`), so long date-time ranges scroll inside the group instead of overflowing it.

<ComponentPreview name="date-range-picker/input-container" />

### Form Example

<ComponentPreview name="date-range-picker/form-example" />

### Custom Indicator

The `#indicator` slot replaces the default calendar icon rendered inside the trigger.

<ComponentPreview name="date-range-picker/with-custom-indicator" />

### Render Function

HeroUI's `render` prop replaces the root element. Option A has no `render` prop; attributes you pass to `DateRangePicker` fall through to the root element instead.

<ComponentPreview name="date-range-picker/render-function" />

### International Calendar

By default, DateRangePicker displays dates using the calendar system for the given `locale`. The example below shows the Indian calendar system.

<ComponentPreview name="date-range-picker/international-calendar" />

**Note:** `update:modelValue` always emits dates in the same calendar system as `model-value` or `default-value` (Gregorian if neither is given), regardless of the displayed locale.

## Customization

### Tailwind CSS

Style the field parts through `:ui`; the `#calendar` slot lets you fully restyle (or replace) the embedded RangeCalendar — bind its `value` and call `onSelect` to keep it wired to the picker.

<ComponentPreview name="date-range-picker/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { dateRangePicker: { slots: { triggerIndicator: 'text-muted', rangeSeparator: 'px-2 text-default', popover: 'p-0' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="date-range-picker"]` – root field container (`inline-flex flex-col gap-1`)
- `group`, `inputContainer`, `input`, `segment` → the internal `date-input-group`'s slots, shared with [DateField](/docs/components/date-field)
- `trigger` → `[data-slot="date-range-picker-trigger"]` – button that opens the popover
- `triggerIndicator` → `[data-slot="date-range-picker-trigger-indicator"]` – default/custom calendar icon
- `rangeSeparator` → `[data-slot="date-range-picker-range-separator"]` – separator between the start and end inputs
- `popover` → `[data-slot="date-range-picker-popover"]` – popover content wrapping the RangeCalendar

> **Note:** [Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error) and [RangeCalendar](/docs/components/range-calendar) have their own themes. See their respective pages for customization options.

### Interactive States

- **Open**: `[data-state="open"|"closed"]` on the trigger and the popover
- **Disabled**: `:disabled` on the trigger, `[data-disabled]` on the root, the group and each segment
- **Invalid**: `[data-invalid="true"]` on the group — automatically hides the description while invalid
- **Required**: `[data-required="true"]` on the root — shows the label's required asterisk
- **Focus visible**: `:focus-visible` on the trigger
- **Hover**: `:hover` on the trigger

### Reka UI Limitations

- `shouldForceLeadingZeros` has no equivalent: Reka's `DateRangeFieldRoot` doesn't expose a flag to force leading
  zeros, so the `format-options` demo drops the "Force leading zeros" switch.
- `v-model` is driven through a local draft: Reka's `DateRangeFieldRoot` emits every partial edit
  (`{ start, end: undefined }`) as its model value, while React Aria keeps an incomplete range as an internal
  placeholder and only emits complete ranges. DateRangePicker feeds Reka the draft and emits only complete ranges
  (or `null`), matching HeroUI.
- Reka's `DateRangePickerRoot` reads `isDateUnavailable` once at setup, with a single argument. The field side
  calls the matcher with a `null` anchor (as React Aria does outside the calendar); the anchor-aware form only
  applies inside the embedded [RangeCalendar](/docs/components/range-calendar).
- HeroUI's composed `RangeCalendar` passes its own 1900/2099 `minValue`/`maxValue` defaults, which override the
  picker's bounds, so its popover never greys out-of-range days (the field still validates them). The embedded
  RangeCalendar here matches that: `min-value`/`max-value` validate the field but don't disable calendar days.

## API Reference

### Props

<ApiTable component="DateRangePicker" kind="props" />

### Slots

<ApiTable component="DateRangePicker" kind="slots" />

### Emits

<ApiTable component="DateRangePicker" kind="emits" />

## Accessibility

- The label names the input group (`aria-labelledby`); each end is its own segmented spinbutton group
- The field's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `start-name`/`end-name` submit each end through its own hidden input, which also carries native `required`
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> move between segments (across the separator), <kbd>↑</kbd>/<kbd>↓</kbd> increment/decrement the focused segment, digits type directly into the focused segment and auto-advance
- Opening the popover moves focus into the calendar (the range start, else today); <kbd>Esc</kbd> or an outside click closes it, and completing a range closes it and returns focus to the trigger

## Related Components

<RelatedComponents :components="['date-picker', 'range-calendar', 'date-field', 'label', 'field-error']" />
