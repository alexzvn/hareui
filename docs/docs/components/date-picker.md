---
title: DatePicker
description: Combines a DateField and a Calendar in a popover for picking a date
links:
  reka: date-field
  source: date-picker/DatePicker.vue
  styles: date-picker/theme.ts
  heroui: date-picker
---

## Usage

```vue
<script setup lang="ts">
import { DatePicker } from '@hareui/vue'
</script>
```

<ComponentPreview name="date-picker/basic" />

## Anatomy

DatePicker renders, in order:

- a [Label](/docs/components/label)
- a segmented [date-input-group](/docs/components/date-field) with the field segments and a calendar trigger button
- a [Description](/docs/components/description) or [FieldError](/docs/components/field-error)
- a popover with an embedded [Calendar](/docs/components/calendar)

The text parts come from props. Each can be replaced with a slot.

```vue
<template>
  <DatePicker label="…" calendar-label="…" description="…" error-message="…" :invalid="…">
    <template #label />
    <!-- Label content -->
    <template #indicator />
    <!-- replaces the default calendar icon in the trigger -->
    <template #description />
    <!-- Description content -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
    <template #calendar />
    <!-- replaces the default Calendar rendered inside the popover -->
  </DatePicker>
</template>
```

| `ui` key           | `data-slot`                     | Element                                                                                                        |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`             | `date-picker`                   | `<div>` root (the field; also a [DateField](/docs/components/date-field))                                      |
| —                  | `label`                         | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `group`            | `date-input-group`              | `<div role="group">` holding the segments and the trigger                                                      |
| `input`            | `date-input-group-input`        | `<div>` wrapping the segments                                                                                  |
| `segment`          | `date-input-group-segment`      | one per date part (year, month, day, …)                                                                        |
| `trigger`          | `date-picker-trigger`           | `<button>` that opens the popover, rendered in the group's suffix                                              |
| `triggerIndicator` | `date-picker-trigger-indicator` | `<span>` holding the default/custom calendar icon                                                              |
| —                  | `description`                   | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —                  | `field-error`                   | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |
| `popover`          | `date-picker-popover`           | the popover content wrapping the [Calendar](/docs/components/calendar)                                         |

> **DatePicker** combines a segmented date field and a calendar popover into a single accessible component. Values are [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) objects. Use `CalendarDate`, `CalendarDateTime` or `ZonedDateTime`.

## Examples

### Disabled

<ComponentPreview name="date-picker/disabled" />

### Controlled

Bind the value with `v-model` to synchronize with other components or state management.

<ComponentPreview name="date-picker/controlled" />

### Validation

Set `invalid` with `error-message` to control the state yourself. Or validate with any of these:

- `required`
- `min-value`, `max-value` or `is-date-unavailable`
- a `validate` function
- a surrounding [Form](/docs/components/form)

<ComponentPreview name="date-picker/with-validation" />

### Format Options

Control how DatePicker values are displayed with props such as `granularity`, `hour-cycle` and `hide-time-zone`. For granularities beyond `"day"`, the `#calendar` slot composes a [TimeField](/docs/components/time-field) alongside the Calendar to edit the time portion.

<ComponentPreview name="date-picker/format-options" />

### Form Example

Complete form example with validation and submission handling.

<ComponentPreview name="date-picker/form-example" />

### Custom Indicator

The `#indicator` slot replaces the default calendar icon rendered inside the trigger.

<ComponentPreview name="date-picker/with-custom-indicator" />

### Render Function

DatePicker has no `render` prop. Attributes you pass to `DatePicker` fall through to the root element instead.

<ComponentPreview name="date-picker/render-function" />

### International Calendar

By default, DatePicker displays dates using the calendar system for the given `locale`. The example below shows the Indian calendar system.

<ComponentPreview name="date-picker/international-calendar" />

**Note:** `update:modelValue` always emits a date in the same calendar system as `model-value` or `default-value` (Gregorian if neither is given), regardless of the displayed locale.

## Customization

### Tailwind CSS

The `#calendar` slot lets you fully restyle or replace the embedded Calendar. Bind its `value` and `onSelect` to keep it wired to the picker.

<ComponentPreview name="date-picker/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { datePicker: { slots: { trigger: 'text-muted', popover: 'p-0' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="date-picker"]` – root field container (`inline-flex flex-col gap-1`)
- `group`, `input`, `segment` → slots of the internal date input group, shared with [DateField](/docs/components/date-field) and [TimeField](/docs/components/time-field)
- `trigger` → `[data-slot="date-picker-trigger"]` – button that opens the popover
- `triggerIndicator` → `[data-slot="date-picker-trigger-indicator"]` – default/custom calendar icon
- `popover` → `[data-slot="date-picker-popover"]` – popover content wrapping the Calendar

> **Note:** [Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error) and [Calendar](/docs/components/calendar) have their own themes. See their respective pages for customization options.

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The DatePicker component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/date-picker/date-picker.css)):

#### Base Classes

- `.h-date-picker` - Root wrapper
- `.h-date-picker__trigger` - Trigger button that opens the popover
- `.h-date-picker__trigger-indicator` - Default or custom indicator inside the trigger
- `.h-date-picker__popover` - Popover content wrapper

#### Modifier Classes

- `.h-date-picker--full-width` - Stretches to the container width

#### Input Group Classes

The field carries the classes of the internal DateInputGroup part, shared with DateField, TimeField and DateRangePicker ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/date-input-group/date-input-group.css)):

- `.h-date-input-group` - Container for the segments and the trigger, with border and background styling
- `.h-date-input-group__input` - Wrapper around the segments
- `.h-date-input-group__segment` - Each individual date part
- `.h-date-input-group__suffix` - Holds the trigger button
- `.h-date-input-group--secondary` - Secondary variant without shadow, suitable for use in surfaces
- `.h-date-input-group--full-width` - Stretches the group to the container width

The default `primary` variant adds no class. The popover's Calendar carries the [Calendar classes](/docs/components/calendar#css-classes).

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

DatePicker sets these data attributes:

- **Invalid**: `[data-invalid="true"]` on the field and the group — automatically hides the description while invalid
- **Required**: `[data-required="true"]` on the field — shows the label's required asterisk
- **Disabled**: `[data-disabled="true"]` on the field, `[data-disabled]` on the group, each segment and the trigger
- **Open**: `[data-state="open"|"closed"]` on the trigger and the popover
- **Focus Visible**: `[data-focus-visible="true"]` on the trigger

### Limitations

- There is no option to force leading zeros on numeric segments, so the `format-options` demo
  drops that control.
- Selecting a calendar day always closes the popover. This is not configurable. It is also why
  the `format-options` demo's inline time field only stays reachable before a date is picked.

## API Reference

### Props

<ApiTable component="DatePicker" kind="props" />

### Slots

<ApiTable component="DatePicker" kind="slots" />

### Emits

<ApiTable component="DatePicker" kind="emits" />

## Theme

<ApiTheme component="DatePicker" />

## Accessibility

- The label's `for` points to the field's id (auto-generated with `useId()` unless `id` is set)
- The field's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the field and every segment
- The error is announced via `role="alert"`
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> move between segments, <kbd>↑</kbd>/<kbd>↓</kbd> increment/decrement the focused segment (a 12-hour hour stays within its AM/PM period), <kbd>PgUp</kbd>/<kbd>PgDn</kbd> step it by a larger amount, <kbd>Home</kbd>/<kbd>End</kbd> set it to its minimum/maximum, digits type directly into the focused segment and auto-advance
- `min-value`, `max-value` and `is-date-unavailable` mark the field invalid on their own. You don't need to set `invalid` for range feedback
- The trigger button is named "Calendar". It opens the popover, as does <kbd>Alt</kbd>+<kbd>↓</kbd> on a segment
- On open, the calendar focuses the selected date
- <kbd>Esc</kbd> closes the popover, even with the year picker open. An outside click or picking a date also closes it
- On close, focus returns to the trigger

## Related Components

<RelatedComponents :components="['date-field', 'calendar', 'label', 'description', 'field-error']" />
