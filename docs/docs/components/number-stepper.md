---
title: NumberStepper
description: Changes a number one step at a time with minus and plus buttons.
links:
  reka: number-field
  source: number-stepper/NumberStepper.vue
  styles: number-stepper/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'
</script>
```

<ComponentPreview name="number-stepper/basic" />

## Anatomy

NumberStepper renders an optional [Label](/docs/components/label), a pill holding the decrement button, the value and the increment button, then an optional [Description](/docs/components/description) and [FieldError](/docs/components/field-error). The value is display text. A visually hidden spin button carries the value for keyboard and screen reader users.

The value animates digit by digit with [NumberFlow](https://number-flow.barvian.me/vue), using the same `format-options` and locale, and doesn't animate when reduced motion is preferred.

```vue
<template>
  <NumberStepper label="…" description="…" error-message="…">
    <template #label />
    <!-- Label content -->
    <template #decrement />
    <!-- decrement button content (default: minus icon) -->
    <template #value />
    <!-- value content (default: formatted value) -->
    <template #increment />
    <!-- increment button content (default: plus icon) -->
    <template #description />
    <!-- Description content -->
    <template #error />
    <!-- FieldError content, rendered when invalid -->
  </NumberStepper>
</template>
```

| `ui` key          | `data-slot`                       | Element                                                                                                        |
| ----------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`            | `number-stepper`                  | `<div>` root                                                                                                   |
| —                 | `label`                           | [Label](/docs/components/label) (iff `label` / `#label`)                                                       |
| `group`           | `number-stepper-group`            | `<div role="group">` holding the buttons and the value                                                         |
| `decrementButton` | `number-stepper-decrement-button` | `<button>` (iff `decrement`)                                                                                   |
| `value`           | `number-stepper-value`            | `<span aria-hidden="true">` with the formatted value                                                           |
| `incrementButton` | `number-stepper-increment-button` | `<button>` (iff `increment`)                                                                                   |
| `input`           | `number-stepper-input`            | visually hidden `<input role="spinbutton">`                                                                    |
| —                 | `description`                     | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —                 | `field-error`                     | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

Use NumberStepper for small counts changed a step at a time, like servings, tickets or bags. Use [NumberField](/docs/components/number-field) when people need to type a value.

## Examples

### Order List

A bakery order as a card grid: one `sm` stepper per item, all bound to one object, each with its own `max`, and a running total underneath.

<ComponentPreview name="number-stepper/order-list" />

### Controlled

Bind the value with `v-model` and use it elsewhere, here to describe a workout. The value is `undefined` while empty.

<ComponentPreview name="number-stepper/controlled" />

### Custom Icons

Replace the plus and minus icons with the `#increment` and `#decrement` slots, here chevrons for an editor font size.

<ComponentPreview name="number-stepper/custom-icons" />

### Custom Value

The `#value` slot receives `value` and `formattedValue`. Use it to render the number your own way, here as a zero-padded locker number.

<ComponentPreview name="number-stepper/custom-value" />

### Disabled

`disabled` turns off both buttons and keyboard input, and fades the stepper.

<ComponentPreview name="number-stepper/disabled" />

### Min Max Values

`min` and `max` bound the value, negative numbers included. The matching button is disabled once the value reaches a bound.

<ComponentPreview name="number-stepper/min-max-values" />

### Reversed Layout

`reversed` puts the increment button first.

<ComponentPreview name="number-stepper/reversed-layout" />

### Sizes

`size` sets the button, icon and value sizes.

<ComponentPreview name="number-stepper/sizes" />

### With Custom Buttons

Pass [Button](/docs/components/button) props to `increment` and `decrement` to render Buttons in place of the built-in ones. Space them with `ui.group`, and add `bg-transparent` to drop the pill background, as in the last two rows.

<ComponentPreview name="number-stepper/with-custom-buttons" />

### With Format Options

`format-options` takes `Intl.NumberFormat` options for currencies, units and percentages. Percent values are fractions, so `0.2` shows as 20%. Pass `locale` to override the `ConfigProvider` locale, as the euro tip does with `de-DE`.

<ComponentPreview name="number-stepper/with-format-options" />

### With Label

`label` and `description` render above and below the stepper. Set `name` to submit the value with a form. Inside a [Form](/docs/components/form), the field validates against the form's schema like any other input.

<ComponentPreview name="number-stepper/with-label" />

### With Step

`step` sets how much each press adds or removes, and values snap to it counting from `min`. Steps can be fractional.

<ComponentPreview name="number-stepper/with-step" />

## Customization

### Tailwind CSS

Pass classes per part with `ui`:

```vue
<template>
  <NumberStepper :ui="{ group: 'bg-accent-soft', value: 'min-w-12 text-accent' }" />
</template>
```

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: {
      numberStepper: {
        slots: {
          group: 'rounded-xl',
          incrementButton: 'rounded-lg',
          decrementButton: 'rounded-lg',
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="number-stepper"]` – root container
- `group` → `[data-slot="number-stepper-group"]` – pill holding the buttons and the value
- `decrementButton` → `[data-slot="number-stepper-decrement-button"]` – minus button
- `value` → `[data-slot="number-stepper-value"]` – the displayed value
- `incrementButton` → `[data-slot="number-stepper-increment-button"]` – plus button
- `input` → `[data-slot="number-stepper-input"]` – visually hidden spin button

### Variants

- `size`: `sm`, `md` (default), `lg`. Sets the button, icon and value sizes. Below the `md` breakpoint each size is one step larger for touch.
- `reversed`: `true` swaps the button order.

### Interactive States

- **Hover**: the button icon turns from `text-muted` to `text-foreground`
- **Pressed**: `[data-pressed="true"]` on a button while it's held; the button scales down
- **Focus visible**: the group shows a focus ring while the hidden spin button has keyboard focus
- **Disabled**: `[data-disabled="true"]` on the root and the group, `disabled` on the buttons and the input
- **Invalid**: `[data-invalid="true"]` on the root and the group
- **Read Only**: `[data-readonly="true"]` on the root
- **Required**: `[data-required="true"]` on the root

## API Reference

### Props

<ApiTable component="NumberStepper" kind="props" />

### Slots

<ApiTable component="NumberStepper" kind="slots" />

### Emits

<ApiTable component="NumberStepper" kind="emits" />

### Theme

<ApiTheme component="NumberStepper" />

## Accessibility

- The hidden input has `role="spinbutton"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, and is in the tab order
- Name it with `label`, or with `aria-label` when there is no visible label
- The buttons are named after the field ("Increase Checked bags", "Decrease Checked bags"), aren't in the tab order, and repeat while held
- Keyboard: <kbd>↑</kbd>/<kbd>↓</kbd> and <kbd>PageUp</kbd>/<kbd>PageDown</kbd> step by `step`, <kbd>Home</kbd>/<kbd>End</kbd> jump to `min`/`max`
- The visible value is `aria-hidden`; screen readers read the spin button instead
- The input's `aria-describedby` lists the rendered description and error

## Related Components

<RelatedComponents :components="['number-field', 'button', 'label', 'description']" />
