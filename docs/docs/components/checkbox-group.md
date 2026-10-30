---
title: CheckboxGroup
description: A checkbox group component for managing multiple checkbox selections
links:
  source: checkbox-group/CheckboxGroup.vue
  styles: checkbox-group/theme.ts
  heroui: checkbox-group
---

## Usage

```vue
<script setup lang="ts">
import { CheckboxGroup } from '@hareui/vue'
</script>
```

<ComponentPreview name="checkbox-group/basic" />

## Anatomy

CheckboxGroup renders its checkboxes from the `items` array. Label, description, error and per-item parts are composed through props or named slots.

```vue
<CheckboxGroup :items="items" label="…" description="…" error-message="…">
  <template #label />                          <!-- Group label -->
  <template #description />                    <!-- Group description -->
  <template #item-label="{ item, index }" />   <!-- Each item's label -->
  <template #item-description="{ item }" />    <!-- Each item's help text -->
  <template #indicator="{ item, checked }" />  <!-- Custom indicator inside each control -->
  <template #error="{ validationErrors }" />   <!-- FieldError content, rendered while invalid -->
</CheckboxGroup>
```

| `ui` key    | `data-slot`          | Element                                                                                                        |
| ----------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`      | `checkbox-group`     | root element                                                                                                   |
| `item`      | `checkbox`           | per-item root (`<div>`)                                                                                        |
| `content`   | `checkbox-content`   | the clickable control + label                                                                                  |
| `control`   | `checkbox-control`   | the box                                                                                                        |
| `indicator` | `checkbox-indicator` | checkmark / `#indicator` content                                                                               |
| —           | `label`              | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| —           | `description`        | [Description](/docs/components/description) (group and per-item)                                               |
| —           | `field-error`        | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

### Typing items

`items` takes the exported `CheckboxGroupItem` type. Extra fields are kept: extend the type, and the slots receive your type, so no casts are needed.

```ts
import type { CheckboxGroupItem } from '@hareui/vue'

interface MyItem extends CheckboxGroupItem {
  icon: string
}

const items: MyItem[] = [/* ... */]
// <template #item-label="{ item }"> — item.icon is a string
```

## Examples

### In Surface

When used inside a surface (here a `bg-surface` container), use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="checkbox-group/on-surface" />

### Disabled

<ComponentPreview name="checkbox-group/disabled" />

### Indeterminate

<ComponentPreview name="checkbox-group/indeterminate" />

### Controlled

<ComponentPreview name="checkbox-group/controlled" />

### Validation

Mark the group `required` inside a [Form](/docs/components/form): submitting with nothing selected is blocked and shows the error. A `validate` function receives the selected values, and `invalid` overrides both.

<ComponentPreview name="checkbox-group/validation" />

### Features and Add-ons Example

<ComponentPreview name="checkbox-group/features-and-addons" />

### With Custom Indicator

<ComponentPreview name="checkbox-group/with-custom-indicator" />

### Render Function

<ComponentPreview name="checkbox-group/render-function" />

Attributes such as `data-*` fall through to the root element.

## Customization

### Tailwind CSS

<ComponentPreview name="checkbox-group/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { checkboxGroup: { slots: { base: 'flex flex-col gap-2' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="checkbox-group"]` — `flex flex-col`; each item after the first gets `mt-4`
- Items use the [Checkbox](/docs/components/checkbox) theme (`content`, `control`, `indicator`)

## API Reference

### Props

<ApiTable component="CheckboxGroup" kind="props" />

### Slots

<ApiTable component="CheckboxGroup" kind="slots" />

### Emits

<ApiTable component="CheckboxGroup" kind="emits" />

## Theme

<ApiTheme component="CheckboxGroup" />

## Related Components

<RelatedComponents :components="['checkbox', 'radio-group', 'form']" />
