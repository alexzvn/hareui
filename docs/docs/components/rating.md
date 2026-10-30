---
title: Rating
description: A row of icons to show a score or collect one, with half steps, custom icons and form validation.
links:
  source: rating/Rating.vue
  styles: rating/theme.ts
---

## Usage

Bind the score with `v-model`. `0` means no rating.

```ts
import { Rating } from '@hareui/vue'
```

<ComponentPreview name="rating/basic" />

## Anatomy

Each item stacks an empty icon, the same icon in the fill color clipped to the rated share of that item, and one transparent radio per step. The rating is a radio group: the label comes from `label` or `aria-label`, and each radio is named by `item-label`.

```vue
<template>
  <Rating label="…" description="…" error-message="…">
    <template #label />
    <!-- replaces the label prop -->
    <template #description />
    <!-- replaces the description prop -->
    <template #item="{ index, filled }" />
    <!-- one icon; rendered for the empty and the filled layer -->
    <template #error="{ validationErrors }" />
    <!-- error content, shown when invalid -->
  </Rating>
</template>
```

### Controlled

Bind `v-model` to read and set the score from outside, for example to show it as text or reset it to `0`.

<ComponentPreview name="rating/controlled" />

### Colors

The `color` prop sets the color of the filled icons.

<ComponentPreview name="rating/colors" />

### Sizes

`size` sets the icon size and the gap between icons: `sm`, `md` (default) or `lg`.

<ComponentPreview name="rating/sizes" />

### Length

`length` sets the number of icons.

<ComponentPreview name="rating/length" />

### Half Steps

`step` divides each icon: `0.5` picks a half on the left part of an icon and a whole on the right part. `0.25` and `0.1` are also accepted.

<ComponentPreview name="rating/half-steps" />

### Clearable

With `clearable`, pressing the current value again resets the rating to `0`.

<ComponentPreview name="rating/clearable" />

### Hoverable

With `hoverable`, the icons preview the value under the pointer before it's pressed.

<ComponentPreview name="rating/hoverable" />

### Disabled

A disabled rating dims to half opacity and ignores pointer and keyboard input.

<ComponentPreview name="rating/disabled" />

### Read Only

A read-only rating shows its value at full opacity and can't be focused or changed.

<ComponentPreview name="rating/read-only" />

### Fractional Values

A read-only rating fills any fraction, such as an average of `4.3`, whatever its `step`.

<ComponentPreview name="rating/read-only-fractional" />

### Orientation

`orientation="vertical"` stacks the icons in a column, and <kbd>↑</kbd> and <kbd>↓</kbd> move between them.

<ComponentPreview name="rating/vertical" />

## Icons

### Custom Icon

`icon` takes a component, or a class string when your app renders icons from classes (such as `i-lucide-heart`). Pair it with `item-label` so each radio reads well.

<ComponentPreview name="rating/custom-icon" />

### Empty Icon

`empty-icon` replaces the icon behind the filled part, for example an outline under a solid fill. Its color comes from the `item` slot class.

<ComponentPreview name="rating/empty-icon" />

### Icon Per Item

The `#item` slot renders each icon. It receives the item's 1-based `index` and `filled`, which is `false` for the empty layer and `true` for the filled one.

<ComponentPreview name="rating/item-slot" />

## Forms

### Label and Description

`label` names the rating and `description` adds a hint below it. Both also take slots for richer content.

<ComponentPreview name="rating/field" />

### Validation

`required` blocks submission until a value is picked, and `validate` checks the picked value. Inside a [Form](/docs/components/form), the value submits under `name`.

<ComponentPreview name="rating/validation" />

## Examples

### Score Breakdown

Read-only ratings in a description list show the score of each category.

<ComponentPreview name="rating/score-breakdown" />

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      rating: {
        slots: { item: 'text-default' },
        defaultVariants: { color: 'accent' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot`    | Description                                                                                                                  |
| -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `base`   | `rating`       | The radio group, with the label, description and error                                                                       |
| `items`  | `rating-items` | The row (or column) of icons. Carries `data-orientation`                                                                     |
| `item`   | `rating-item`  | One icon. Its text color is the empty color. Carries `data-active` when fully filled and `data-partial` when partly filled   |
| `icon`   | `rating-icon`  | The icon wrapper, sized by `size`. Rendered twice per item                                                                   |
| `fill`   | `rating-fill`  | The filled layer, clipped to `--rating-fill` (the rated share of the item, `0%` to `100%`). Its text color is the fill color |
| `step`   | `rating-step`  | The transparent radio covering the item from its start edge. One per step; carries `data-value` and the focus ring           |

> **Note:** The [Label](/docs/components/label), [Description](/docs/components/description) and [FieldError](/docs/components/field-error) have their own themes.

### Interactive States

- **Disabled**: `aria-disabled="true"` on the root; the icons dim to 50%
- **Read only**: `[data-readonly="true"]` and `aria-readonly="true"` on the root
- **Invalid**: `[data-invalid="true"]` and `aria-invalid="true"` on the root
- **Required**: `[data-required="true"]` on the root
- **Pressed**: a pressed item shrinks to 80%; the fill animates its width over 100ms. Both are off when the user prefers reduced motion

## API Reference

### Props

<ApiTable component="Rating" kind="props" />

### Slots

<ApiTable component="Rating" kind="slots" />

### Emits

<ApiTable component="Rating" kind="emits" />

## Theme

<ApiTheme component="Rating" />

## Accessibility

- The root is a `radiogroup`, named by `label` (through `aria-labelledby`) or by your `aria-label`; the description and error are linked through `aria-describedby`
- Each step is a `radio` named by `item-label`, `"3 out of 5"` by default
- Keyboard: <kbd>Tab</kbd> enters and leaves the rating as one stop; arrow keys move and select the previous or next step; <kbd>Home</kbd> and <kbd>End</kbd> select the lowest and highest value; <kbd>Space</kbd> on the current value clears it when `clearable`
- A read-only rating keeps its radios out of the tab order

## Related Components

<RelatedComponents :components="['radio-group', 'slider', 'form']" />
