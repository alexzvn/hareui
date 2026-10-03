---
title: RadioGroup
description: Radio group for selecting a single option from a list
links:
  reka: radio-group
  source: radio-group/RadioGroup.vue
  styles: radio-group/theme.ts
  heroui: radio-group
---

## Usage

```vue
<script setup lang="ts">
import { RadioGroup } from '@hareui/vue'
</script>
```

<ComponentPreview name="radio-group/basic" />

## Anatomy

RadioGroup renders a [Label](/docs/components/label) and a [Description](/docs/components/description) from props, then one row per `items` entry — each with its own content button, control, indicator, and optional [Description](/docs/components/description) — followed by a [FieldError](/docs/components/field-error) when `invalid` is true.

```vue
<template>
  <RadioGroup :items="items" label="…" description="…" error-message="…" :invalid="…">
    <template #label />                             <!-- Label content -->
    <template #description />                        <!-- Description content -->
    <template #item-label="{ item, index }" />        <!-- replaces item.label -->
    <template #item-description="{ item, index }" />  <!-- replaces item.description -->
    <template #indicator="{ item, checked }" />       <!-- custom content inside each control -->
    <template #error />                               <!-- FieldError content, rendered when invalid -->
  </RadioGroup>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `radio-group` | root element |
| `item` | `radio` | per-item row (`<div>`) |
| `content` | `radio-content` | the clickable control + label button |
| `control` | `radio-control` | circular control |
| `indicator` | `radio-indicator` | inner dot / `#indicator` content |
| — | — | [Label](/docs/components/label) (iff `label` / `#label`) |
| — | — | [Description](/docs/components/description) (group, iff `description` / `#description`) |
| — | — | [Description](/docs/components/description) (per-item, iff `item.description` / `#item-description`) |
| — | — | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

### Typing items

`items` takes the exported `RadioGroupItem` type. Extra fields are kept: extend the type, and the slots receive your type, so no casts are needed.

```ts
import type { RadioGroupItem } from '@hareui/vue'

interface MyItem extends RadioGroupItem {
  icon: string
}

const items: MyItem[] = [/* ... */]
// <template #item-label="{ item }"> — item.icon is a string
```

## Examples

### Horizontal Orientation

<ComponentPreview name="radio-group/horizontal" />

### Variants

The RadioGroup component supports two visual variants:

- **`primary`** (default) - Standard styling with default background, suitable for most use cases
- **`secondary`** - Lower emphasis variant, suitable for use alongside surface-style backgrounds

<ComponentPreview name="radio-group/variants" />

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="radio-group/on-surface" />

### Disabled

<ComponentPreview name="radio-group/disabled" />

### Controlled

Bind the selected value with `v-model`.

<ComponentPreview name="radio-group/controlled" />

### Uncontrolled

Combine `default-value` with `@update:model-value` when you only need to react to updates.

<ComponentPreview name="radio-group/uncontrolled" />

### Validation

Mark the group `required` inside a [Form](/docs/components/form): submitting without a selection is blocked and shows the error. A `validate` function receives the selected value, and `invalid` overrides both.

<ComponentPreview name="radio-group/validation" />

### Delivery & Payment

<ComponentPreview name="radio-group/delivery-and-payment" />

### Custom Indicator

<ComponentPreview name="radio-group/custom-indicator" />

## Customization

### Tailwind CSS

Use the `#item-label` slot and `:ui` overrides to restyle each row. HeroUI's render-state attributes `data-[hovered|pressed|focus-visible=true]` map to `hover:` / `active:` / `focus-visible:`.

<ComponentPreview name="radio-group/custom-styles" />

### Global Configuration

```ts
app.use(createHareUI({
  ui: { radioGroup: { slots: { control: 'size-5' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="radio-group"]` – root container (`flex flex-col`)
- `item` → `[data-slot="radio"]` – one row per item (`flex flex-col items-start gap-1`)
- `content` → `[data-slot="radio-content"]` – the clickable button wrapping control + label
- `control` → `[data-slot="radio-control"]` – circular control
- `indicator` → `[data-slot="radio-indicator"]` – inner dot, empty by default; fill with `#indicator` for custom content

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options.

### Interactive States

RadioGroup sets these data attributes:

- **Selected** (per item): `[data-selected="true"]` on `[data-slot="radio"]` and on its `[data-slot="radio-content"]`
- **Disabled**: `[data-disabled="true"]` on `[data-slot="radio"]` (group `disabled` or `item.disabled`)
- **Invalid**: `[data-invalid="true"]` on `[data-slot="radio"]` when the group `invalid` is true
- **Read only**: `[data-readonly="true"]` and `aria-readonly="true"` on the root
- **Required**: `[data-required="true"]` on the root

## API Reference

### Props

<ApiTable component="RadioGroup" kind="props" />

### Slots

<ApiTable component="RadioGroup" kind="slots" />

### Emits

<ApiTable component="RadioGroup" kind="emits" />

### Theme

<ApiTheme component="RadioGroup" />

## Accessibility

- The group label is associated via `aria-labelledby`; each item's clickable button has `aria-describedby` listing its own description and the group's description/error ids
- `invalid` sets `aria-invalid="true"` and `data-invalid="true"` on the root; the error is rendered via [FieldError](/docs/components/field-error) (`role="alert"`)
- `required` sets `data-required="true"` on the root
- Keyboard: arrow keys move selection between items, following `orientation`; <kbd>Tab</kbd> moves focus into and out of the group as a single stop
- **Difference from HeroUI:** pressing a disabled radio moves focus to the group container (Reka's roving-focus root), where HeroUI leaves focus where it was. The next <kbd>Tab</kbd> then starts from the group

## Related Components

<RelatedComponents :components="['label', 'description', 'field-error', 'checkbox', 'switch']" />
