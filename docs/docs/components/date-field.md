---
title: DateField
description: Date input field with labels, descriptions, and validation
links:
  reka: date-field
  source: date-field/DateField.vue
  styles: date-field/theme.ts
  heroui: date-field
---

## Usage

```vue
<script setup lang="ts">
import { DateField } from '@hareui/vue'
</script>
```

<ComponentPreview name="date-field/basic" />

## Anatomy

DateField renders a [Label](/docs/components/label), a group holding an optional prefix, the segmented date input and an optional suffix, then a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error). The text parts come from props; each can be replaced with a slot.

```vue
<template>
  <DateField label="…" description="…" error-message="…" :invalid="…">
    <template #label />
    <!-- Label content -->
    <template #prefix />
    <!-- content rendered before the segments, e.g. an icon -->
    <template #suffix />
    <!-- content rendered after the segments -->
    <template #description />
    <!-- Description content -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
  </DateField>
</template>
```

| `ui` key  | `data-slot`                | Element                                                                                                        |
| --------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`    | `date-field`               | `<div>` root                                                                                                   |
| —         | `label`                    | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `group`   | `date-input-group`         | `<div role="group">` holding the prefix, segments and suffix                                                   |
| `prefix`  | `date-input-group-prefix`  | `<span>` (iff `#prefix`)                                                                                       |
| `input`   | `date-input-group-input`   | `<div>` wrapping the segments                                                                                  |
| `segment` | `date-input-group-segment` | one per date part (year, month, day, …)                                                                        |
| `suffix`  | `date-input-group-suffix`  | `<span>` (iff `#suffix`)                                                                                       |
| —         | `description`              | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —         | `field-error`              | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

> **DateField** combines a label, segmented date input, description, and error into a single accessible component. Values are [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) objects (`CalendarDate`, `CalendarDateTime` or `ZonedDateTime`) — the same types HeroUI uses.

## Examples

### With Icons

<ComponentPreview name="date-field/with-prefix-icon" />

<ComponentPreview name="date-field/with-suffix-icon" />

<ComponentPreview name="date-field/with-prefix-and-suffix" />

### Variants

The DateField component supports two visual variants:

- **`primary`** (default) - Standard styling with shadow, suitable for most use cases
- **`secondary`** - Lower emphasis variant without shadow, suitable for use in surfaces

<ComponentPreview name="date-field/variants" />

### On Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="date-field/on-surface" />

### With Description

<ComponentPreview name="date-field/with-description" />

### Required Field

<ComponentPreview name="date-field/required" />

### Disabled State

<ComponentPreview name="date-field/disabled" />

### Full Width

<ComponentPreview name="date-field/full-width" />

### Validation

Set `invalid` with `error-message` to control the state yourself, or validate with `required`, a `validate` function, or a surrounding [Form](/docs/components/form).

<ComponentPreview name="date-field/invalid" />

### Granularity

`granularity` controls which segments are rendered, up to and including the given unit. A plain `CalendarDate` only supports `"day"`; use a `CalendarDateTime` or `ZonedDateTime` value for `"hour"`, `"minute"` or `"second"`.

<ComponentPreview name="date-field/granularity" />

### Controlled

Bind the value with `v-model` to synchronize with other components or state management.

<ComponentPreview name="date-field/controlled" />

### Form Example

Complete form example with validation and submission handling.

<ComponentPreview name="date-field/form-example" />

### With Validation

DateField supports validation with `min-value`, `max-value`, `is-date-unavailable`, and custom validation logic.

<ComponentPreview name="date-field/with-validation" />

### Render Function

HeroUI's `render` prop replaces the root element and lets sub-parts render-prop their own markup. Option A has no compound parts to render-prop into; attributes you pass to `DateField` fall through to the root element instead.

<ComponentPreview name="date-field/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="date-field/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { dateField: { slots: { group: 'rounded-xl', segment: 'font-mono' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="date-field"]` – root container (`flex flex-col gap-1`)
- `group` → `[data-slot="date-input-group"]` – container for the prefix, segments and suffix, with border and background styling
- `prefix` → `[data-slot="date-input-group-prefix"]` – content before the segments, e.g. an icon
- `input` → `[data-slot="date-input-group-input"]` – wrapper around the segments
- `segment` → `[data-slot="date-input-group-segment"]` – each individual date part
- `suffix` → `[data-slot="date-input-group-suffix"]` – content after the segments

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options. `group`, `input`, `segment`, `prefix` and `suffix` all belong to the internal `date-input-group` part shared with [TimeField](/docs/components/time-field).

### Interactive States

DateField sets these data attributes:

- **Invalid**: `[data-invalid="true"]` on the root and the group - Automatically hides the description when invalid
- **Required**: `[data-required="true"]` on the root - Shows the label's required asterisk
- **Disabled**: `[data-disabled="true"]` on the root, `[data-disabled]` on the group and each segment
- **Read Only**: `[data-readonly="true"]` on the root
- **Focus Within**: `[data-focus-within="true"]` on the group - Applied when a segment is focused
- **Segment Focus**: `:focus` or `[data-focused="true"]` on a segment
- **Segment Placeholder**: `[data-placeholder]` on a segment showing its placeholder text

## API Reference

### Props

<ApiTable component="DateField" kind="props" />

### Slots

<ApiTable component="DateField" kind="slots" />

### Emits

<ApiTable component="DateField" kind="emits" />

## Theme

<ApiTheme component="DateField" />

## Accessibility

- The label's `for` points to the field's id (auto-generated with `useId()` unless `id` is set)
- The field's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the field and every segment; the error is announced via `role="alert"`
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> move between segments, <kbd>↑</kbd>/<kbd>↓</kbd> increment/decrement the focused segment (a 12-hour hour stays within its AM/PM period), <kbd>PgUp</kbd>/<kbd>PgDn</kbd> step it by a larger amount, <kbd>Home</kbd>/<kbd>End</kbd> set it to its minimum/maximum, digits type directly into the focused segment and auto-advance
- `min-value`, `max-value` and `is-date-unavailable` mark the field invalid on their own, matching React Aria's `useDateFieldState` — no need to compute `invalid` yourself just for native-range feedback

## Related Components

<RelatedComponents :components="['label', 'description', 'field-error', 'time-field']" />
