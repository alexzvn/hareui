---
title: DateRangePicker
description: Combines start and end date fields and a RangeCalendar in a popover for picking a date range
links:
  reka: date-range-picker
  source: date-range-picker/DateRangePicker.vue
  styles: date-range-picker/theme.ts
  heroui: date-range-picker
---

## Usage

```vue
<script setup lang="ts">
import { DateRangePicker } from '@hareui/vue'
</script>
```

<ComponentPreview name="date-range-picker/basic" />

## Anatomy

DateRangePicker renders, in order:

- a [Label](/docs/components/label)
- a segmented [date-input-group](/docs/components/date-field) with the start and end segments, a range separator and a calendar trigger button
- a [Description](/docs/components/description) or [FieldError](/docs/components/field-error)
- a popover with an embedded [RangeCalendar](/docs/components/range-calendar)

The text parts come from props. Each can be replaced with a slot.

```vue
<template>
  <DateRangePicker
    label="…"
    calendar-label="…"
    start-name="…"
    end-name="…"
    description="…"
    error-message="…"
  >
    <template #label />
    <!-- Label content -->
    <template #separator />
    <!-- replaces the default " - " between the inputs -->
    <template #indicator />
    <!-- replaces the default calendar icon in the trigger -->
    <template #description />
    <!-- Description content -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
    <template #calendar />
    <!-- replaces the default RangeCalendar rendered inside the popover -->
  </DateRangePicker>
</template>
```

| `ui` key           | `data-slot`                           | Element                                                                                                        |
| ------------------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`             | `date-range-picker`                   | `<div role="group">` root                                                                                      |
| —                  | `label`                               | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `group`            | `date-input-group`                    | `<div role="group">` holding the inputs and the trigger                                                        |
| `inputContainer`   | `date-input-group-input-container`    | scrollable wrapper around both inputs (iff `input-container`)                                                  |
| `input`            | `date-input-group-input`              | one per end (`slot="start"` / `slot="end"`)                                                                    |
| `segment`          | `date-input-group-segment`            | one per date part (year, month, day, …)                                                                        |
| `rangeSeparator`   | `date-range-picker-range-separator`   | `<span>` between the start and end inputs                                                                      |
| `trigger`          | `date-range-picker-trigger`           | `<button>` that opens the popover, rendered in the group's suffix                                              |
| `triggerIndicator` | `date-range-picker-trigger-indicator` | `<span>` holding the default/custom calendar icon                                                              |
| —                  | `description`                         | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —                  | `field-error`                         | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |
| `popover`          | `date-range-picker-popover`           | the popover content wrapping the [RangeCalendar](/docs/components/range-calendar)                              |

> **DateRangePicker** values are `{ start, end }` objects of [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) values. Use `CalendarDate`, `CalendarDateTime` or `ZonedDateTime`. `v-model` only emits complete ranges (or `null` once both ends are cleared).

## Examples

### Disabled

<ComponentPreview name="date-range-picker/disabled" />

### Controlled

<ComponentPreview name="date-range-picker/controlled" />

### Validation

<ComponentPreview name="date-range-picker/with-validation" />

### Format Options

Control how DateRangePicker values are displayed with props such as `granularity`, `hour-cycle` and `hide-time-zone`. For granularities beyond `"day"`, the `#calendar` slot composes two [TimeField](/docs/components/time-field)s alongside the RangeCalendar. `onChange` commits a time edit without closing the popover.

<ComponentPreview name="date-range-picker/format-options" />

### Input Container

`input-container` wraps the start and end inputs in a horizontally scrollable container, so long date-time ranges scroll inside the group instead of overflowing it.

<ComponentPreview name="date-range-picker/input-container" />

### Form Example

<ComponentPreview name="date-range-picker/form-example" />

### Custom Indicator

The `#indicator` slot replaces the default calendar icon rendered inside the trigger.

<ComponentPreview name="date-range-picker/with-custom-indicator" />

### Render Function

DateRangePicker has no `render` prop. Attributes you pass to `DateRangePicker` fall through to the root element instead.

<ComponentPreview name="date-range-picker/render-function" />

### International Calendar

By default, DateRangePicker displays dates using the calendar system for the given `locale`. The example below shows the Indian calendar system.

<ComponentPreview name="date-range-picker/international-calendar" />

**Note:** `update:modelValue` always emits dates in the same calendar system as `model-value` or `default-value` (Gregorian if neither is given), regardless of the displayed locale.

## Customization

### Tailwind CSS

Style the field parts through `:ui`. The `#calendar` slot lets you fully restyle or replace the embedded RangeCalendar. Bind its `value` and call `onSelect` to keep it wired to the picker.

<ComponentPreview name="date-range-picker/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: {
      dateRangePicker: {
        slots: {
          triggerIndicator: 'text-muted',
          rangeSeparator: 'px-2 text-default',
          popover: 'p-0',
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="date-range-picker"]` – root field container (`inline-flex flex-col gap-1`)
- `group`, `inputContainer`, `input`, `segment` → slots of the internal date input group, shared with [DateField](/docs/components/date-field)
- `trigger` → `[data-slot="date-range-picker-trigger"]` – button that opens the popover
- `triggerIndicator` → `[data-slot="date-range-picker-trigger-indicator"]` – default/custom calendar icon
- `rangeSeparator` → `[data-slot="date-range-picker-range-separator"]` – separator between the start and end inputs
- `popover` → `[data-slot="date-range-picker-popover"]` – popover content wrapping the RangeCalendar

> **Note:** [Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error) and [RangeCalendar](/docs/components/range-calendar) have their own themes. See their respective pages for customization options.

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The DateRangePicker component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/date-range-picker/date-range-picker.css)):

#### Base Classes

- `.h-date-range-picker` - Root wrapper
- `.h-date-range-picker__trigger` - Trigger button that opens the popover
- `.h-date-range-picker__trigger-indicator` - Default or custom indicator inside the trigger
- `.h-date-range-picker__range-separator` - Separator between the start and end inputs
- `.h-date-range-picker__popover` - Popover content wrapper

#### Modifier Classes

- `.h-date-range-picker--full-width` - Stretches to the container width

#### Input Group Classes

The field carries the classes of the internal DateInputGroup part, shared with DateField, TimeField and DatePicker ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/date-input-group/date-input-group.css)):

- `.h-date-input-group` - Container for the segments and the trigger, with border and background styling
- `.h-date-input-group__input-container` - Scrollable container around both inputs, rendered with the `input-container` prop
- `.h-date-input-group__input` - Wrapper around the start or the end segments
- `.h-date-input-group__segment` - Each individual date part
- `.h-date-input-group__suffix` - Holds the trigger button
- `.h-date-input-group--secondary` - Secondary variant without shadow, suitable for use in surfaces
- `.h-date-input-group--full-width` - Stretches the group to the container width

The default `primary` variant adds no class. The popover's RangeCalendar carries the [RangeCalendar classes](/docs/components/range-calendar#css-classes).

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- **Open**: `[data-state="open"|"closed"]` on the trigger and the popover
- **Disabled**: `:disabled` on the trigger, `[data-disabled]` on the root, the group and each segment
- **Invalid**: `[data-invalid="true"]` on the group — automatically hides the description while invalid
- **Required**: `[data-required="true"]` on the root — shows the label's required asterisk
- **Focus visible**: `:focus-visible` on the trigger
- **Hover**: `:hover` on the trigger

### Limitations

- There is no option to force leading zeros on numeric segments, so the `format-options` demo
  drops the "Force leading zeros" switch.
- `v-model` only receives complete ranges (or `null`). While a range is being typed, the partial
  edit (`{ start, end: undefined }`) is held as a local draft and not emitted.
- The field calls `is-date-unavailable` once per date with a `null` anchor. The anchor-aware form
  only applies inside the embedded [RangeCalendar](/docs/components/range-calendar).
- `min-value`/`max-value` validate the field but don't disable days in the popover's calendar, so
  out-of-range days are not greyed out there.

## API Reference

### Props

<ApiTable component="DateRangePicker" kind="props" />

### Slots

<ApiTable component="DateRangePicker" kind="slots" />

### Emits

<ApiTable component="DateRangePicker" kind="emits" />

## Theme

<ApiTheme component="DateRangePicker" />

## Accessibility

- The label names the input group (`aria-labelledby`). Each end is its own segmented spinbutton group
- The field's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `start-name`/`end-name` submit each end through its own hidden input, which also carries native `required`
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> move between segments (across the separator), <kbd>↑</kbd>/<kbd>↓</kbd> increment/decrement the focused segment (a 12-hour hour stays within its AM/PM period), <kbd>PgUp</kbd>/<kbd>PgDn</kbd> step it by a larger amount, <kbd>Home</kbd>/<kbd>End</kbd> set it to its minimum/maximum, digits type directly into the focused segment and auto-advance
- The trigger button is named "Calendar". <kbd>Alt</kbd>+<kbd>↓</kbd> on a segment also opens the popover
- Opening the popover moves focus into the calendar: to the range end, else today
- <kbd>Esc</kbd> closes it, even with the year picker open. An outside click or completing a range also closes it
- On close, focus returns to the trigger
- A range edited through the segments is validated when focus leaves the field, so a range that is briefly reversed mid-edit isn't flagged

## Related Components

<RelatedComponents :components="['date-picker', 'range-calendar', 'date-field', 'label', 'field-error']" />
