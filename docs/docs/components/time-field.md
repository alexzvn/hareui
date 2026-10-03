---
title: TimeField
description: Time input field with labels, descriptions, and validation
links:
  reka: time-field
  source: time-field/TimeField.vue
  styles: time-field/theme.ts
  heroui: time-field
---

## Usage

```vue
<script setup lang="ts">
import { TimeField } from '@hareui/vue'
</script>
```

<ComponentPreview name="time-field/basic" />

## Anatomy

TimeField renders a [Label](/docs/components/label), a group holding an optional prefix, the segmented time input and an optional suffix, then a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error). The text parts come from props; each can be replaced with a slot.

```vue
<template>
  <TimeField label="…" description="…" error-message="…" :invalid="…">
    <template #label />        <!-- Label content -->
    <template #prefix />       <!-- content rendered before the segments, e.g. an icon -->
    <template #suffix />       <!-- content rendered after the segments -->
    <template #description />  <!-- Description content -->
    <template #error />        <!-- FieldError content, rendered when invalid -->
  </TimeField>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `time-field` | `<div>` root |
| — | `label` | [Label](/docs/components/label) (iff `label` / `#label`) |
| `group` | `date-input-group` | `<div role="group">` holding the prefix, segments and suffix |
| `prefix` | `date-input-group-prefix` | `<span>` (iff `#prefix`) |
| `input` | `date-input-group-input` | `<div>` wrapping the segments |
| `segment` | `date-input-group-segment` | one per time part (hour, minute, second, day period) |
| `suffix` | `date-input-group-suffix` | `<span>` (iff `#suffix`) |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |
| — | `field-error` | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

> **TimeField** combines a label, segmented time input, description, and error into a single accessible component. Values are [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) `Time` objects — the same type HeroUI uses. It shares its input group with [DateField](/docs/components/date-field).

## Examples

### With Icons

<ComponentPreview name="time-field/with-prefix-icon" />

<ComponentPreview name="time-field/with-suffix-icon" />

<ComponentPreview name="time-field/with-prefix-and-suffix" />

### On Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="time-field/on-surface" />

### With Description

<ComponentPreview name="time-field/with-description" />

### Required Field

<ComponentPreview name="time-field/required" />

### Disabled State

<ComponentPreview name="time-field/disabled" />

### Full Width

<ComponentPreview name="time-field/full-width" />

### Validation

Set `invalid` with `error-message` to control the state yourself, or validate with `required`, a `validate` function, or a surrounding [Form](/docs/components/form).

<ComponentPreview name="time-field/invalid" />

### Controlled

Bind the value with `v-model` to synchronize with other components or state management.

<ComponentPreview name="time-field/controlled" />

### Form Example

Complete form example with validation and submission handling.

<ComponentPreview name="time-field/form-example" />

### With Validation

TimeField supports validation with `min-value`, `max-value`, and custom validation logic.

<ComponentPreview name="time-field/with-validation" />

### Render Function

HeroUI's `render` prop replaces the root element and lets sub-parts render-prop their own markup. Option A has no compound parts to render-prop into; attributes you pass to `TimeField` fall through to the root element instead.

<ComponentPreview name="time-field/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="time-field/custom-styles" />

### Global Configuration

```ts
app.use(createHareUI({
  ui: { timeField: { slots: { group: 'rounded-xl', segment: 'font-mono' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="time-field"]` – root container (`flex flex-col gap-1`)
- `group` → `[data-slot="date-input-group"]` – container for the prefix, segments and suffix, with border and background styling
- `prefix` → `[data-slot="date-input-group-prefix"]` – content before the segments, e.g. an icon
- `input` → `[data-slot="date-input-group-input"]` – wrapper around the segments
- `segment` → `[data-slot="date-input-group-segment"]` – each individual time part
- `suffix` → `[data-slot="date-input-group-suffix"]` – content after the segments

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options. `group`, `input`, `segment`, `prefix` and `suffix` all belong to the internal `date-input-group` part shared with [DateField](/docs/components/date-field).

### Interactive States

TimeField sets these data attributes:

- **Invalid**: `[data-invalid="true"]` on the root and the group - Automatically hides the description when invalid
- **Required**: `[data-required="true"]` on the root - Shows the label's required asterisk
- **Disabled**: `[data-disabled="true"]` on the root, `[data-disabled]` on the group and each segment
- **Read Only**: `[data-readonly="true"]` on the root
- **Focus Within**: `[data-focus-within="true"]` on the group - Applied when a segment is focused
- **Segment Focus**: `:focus` or `[data-focused="true"]` on a segment
- **Segment Placeholder**: `[data-placeholder]` on a segment showing its placeholder text

## API Reference

### Props

<ApiTable component="TimeField" kind="props" />

### Slots

<ApiTable component="TimeField" kind="slots" />

### Emits

<ApiTable component="TimeField" kind="emits" />

### Theme

<ApiTheme component="TimeField" />

## Accessibility

- The label's `for` points to the field's id (auto-generated with `useId()` unless `id` is set)
- The field's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the field; the error is announced via `role="alert"`
- Keyboard: <kbd>←</kbd>/<kbd>→</kbd> move between segments, <kbd>↑</kbd>/<kbd>↓</kbd> increment/decrement the focused segment, digits type directly into the focused segment and auto-advance
- `min-value` and `max-value` mark the field invalid on their own, matching React Aria's `useTimeFieldState` — no need to compute `invalid` yourself just for native-range feedback

## Related Components

<RelatedComponents :components="['label', 'description', 'field-error', 'date-field']" />
