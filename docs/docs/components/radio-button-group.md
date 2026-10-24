---
title: RadioButtonGroup
description: Cards that pick one option, with room for icons, prices and extra content.
links:
  reka: radio-group
  source: radio-button-group/RadioButtonGroup.vue
  styles: radio-button-group/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
</script>
```

<ComponentPreview name="radio-button-group/basic" />

## Anatomy

`RadioButtonGroup` renders the group label, description and error. Each `RadioButtonGroupItem` is a card: one focusable radio that holds an indicator, an optional icon, a title, a description and any content you add.

```vue
<template>
  <RadioButtonGroup label="…" description="…" error-message="…">
    <template #label />
    <!-- group Label content -->
    <template #description />
    <!-- group Description content -->
    <RadioButtonGroupItem value="…" label="…" description="…" icon="…">
      <template #indicator />
      <!-- custom indicator (default: radio dot) -->
      <template #icon />
      <!-- leading icon -->
      <template #label />
      <!-- title content -->
      <template #description />
      <!-- description content -->
      <!-- default slot: extra content after the description -->
    </RadioButtonGroupItem>
    <template #error />
    <!-- FieldError content, rendered when invalid -->
  </RadioButtonGroup>
</template>
```

| `ui` key           | `data-slot`                           | Element                                                                          |
| ------------------ | ------------------------------------- | -------------------------------------------------------------------------------- |
| `base`             | `radio-button-group`                  | `<div role="radiogroup">` root                                                   |
| —                  | `label`                               | [Label](/docs/components/label) (iff `label` / `#label`)                         |
| —                  | `description`                         | [Description](/docs/components/description) (iff `description` / `#description`) |
| `item`             | `radio-button-group-item`             | `<button role="radio">` card                                                     |
| `indicator`        | `radio-button-group-indicator`        | `<span>` in the top-end corner (unless `indicator` is `false`)                   |
| `control`          | `radio-control`                       | default radio circle inside the indicator (no `#indicator` slot)                 |
| `controlIndicator` | `radio-indicator`                     | dot inside the radio circle                                                      |
| `content`          | `radio-button-group-item-content`     | `<span>` holding the icon and the text                                           |
| `icon`             | `radio-button-group-item-icon`        | `<span>` (iff `icon` / `#icon`)                                                  |
| `itemText`         | `radio-button-group-item-text`        | `<span>` holding the title, description and default slot                         |
| `itemLabel`        | `radio-button-group-item-label`       | `<span>` (iff `label` / `#label`)                                                |
| `itemDescription`  | `radio-button-group-item-description` | `<span>` (iff `description` / `#description`)                                    |
| —                  | `radio-button-group-item-extra`       | `<span class="contents">` around the default slot (iff default slot)             |
| —                  | `field-error`                         | [FieldError](/docs/components/field-error) (while invalid)                       |

## Examples

### Delivery And Payment

A grocery checkout with two grid groups: a delivery slot, then a payment method. The payment cards show an icon and no indicator.

<ComponentPreview name="radio-button-group/delivery-and-payment" />

### Subscription Plans

A membership picker with three plan cards. Each card shows its icon on top, then the price and a feature list. The indicator is hidden: the accent ring marks the chosen plan, and the default slot reads `selected` to add a "Current plan" chip.

<ComponentPreview name="radio-button-group/subscription-plans" />

### Controlled

Bind the selected seat class with `v-model`.

<ComponentPreview name="radio-button-group/controlled" />

### Custom Indicator

Put an icon in the `#indicator` slot. It shows in the accent color while the card is selected. Here a two-column grid of compact backup schedules shows a shield check on the chosen one.

<ComponentPreview name="radio-button-group/custom-indicator" />

### Disabled Group

`disabled` turns off every card, here while room bookings are closed. Set `disabled` on a `RadioButtonGroupItem` to turn off one card.

<ComponentPreview name="radio-button-group/disabled-group" />

### Grid Layout

`layout="grid"` makes the root a CSS grid. Set the columns with a class such as `grid-cols-3`. The group label, description and error span every column.

<ComponentPreview name="radio-button-group/grid-layout" />

### Icon Cards

Use the `#icon` and `#label` slots for richer cards. Here each learning track has a round icon tile, and the last title carries a "New" chip. The custom indicator sits centered on the end side.

<ComponentPreview name="radio-button-group/icon-cards" />

### No Indicator

Set `:indicator="false"` when the selection ring is enough.

<ComponentPreview name="radio-button-group/no-indicator" />

### Selection State in Content

Every item slot (`default`, `label`, `description`, `icon`, `indicator`) receives `selected` and `disabled`. Here the daily minutes switch to the accent color on the selected card.

<ComponentPreview name="radio-button-group/selection-state-in-content" />

### With Icons

`icon` takes a class string or a component and renders it before the text. The `#icon` slot replaces it.

<ComponentPreview name="radio-button-group/with-icons" />

### With Ripple

Listeners on `RadioButtonGroupItem` go to the card. Here `v-on` binds pointer handlers that draw a hover tint and a ripple in a layer clipped to the card radius.

<ComponentPreview name="radio-button-group/with-ripple" />

## Customization

### Tailwind CSS

Pass `class` and `ui` to a single item, or `ui` to the group to style every item.

```vue
<template>
  <RadioButtonGroup :ui="{ item: 'rounded-lg', itemLabel: 'font-semibold' }">
    <RadioButtonGroupItem value="a" label="A" class="bg-default" />
  </RadioButtonGroup>
</template>
```

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { radioButtonGroup: { slots: { item: 'rounded-xl', indicator: 'top-4' } } },
  }),
)
```

The default indicator is the radio dot from [RadioGroup](/docs/components/radio-group), so overrides of `radioGroup` `control` / `indicator` apply to it too.

## Styling Reference

### Slots

- `base` → `[data-slot="radio-button-group"]` – root (`flex flex-col gap-3`, or `grid` with `layout="grid"`)
- `item` → `[data-slot="radio-button-group-item"]` – the card
- `indicator` → `[data-slot="radio-button-group-indicator"]` – indicator in the top-end corner
- `control` → `[data-slot="radio-control"]` – default radio circle; extends the [RadioGroup](/docs/components/radio-group) `control` classes with the card's hover, press and focus states
- `controlIndicator` → `[data-slot="radio-indicator"]` – dot in the radio circle; extends the RadioGroup `indicator` classes
- `content` → `[data-slot="radio-button-group-item-content"]` – icon and text area
- `icon` → `[data-slot="radio-button-group-item-icon"]` – leading icon (SVGs are sized to `size-6`)
- `itemText` → `[data-slot="radio-button-group-item-text"]` – title, description and default slot
- `itemLabel` → `[data-slot="radio-button-group-item-label"]` – title
- `itemDescription` → `[data-slot="radio-button-group-item-description"]` – description

The card radius comes from `--radio-button-group-item-radius` (default `var(--radius-2xl)`).

### Interactive States

- **Selected**: `[data-selected="true"]` on the card (accent ring)
- **Focus visible**: `:focus-visible` on the card (focus ring, replaces the accent ring while focused)
- **Disabled**: `[data-disabled]` on the card (reduced opacity), set when the item, the group or a surrounding `Fieldset` is disabled
- **Custom indicator**: `[data-custom="true"]` on the indicator
- **Invalid**: `[data-invalid="true"]` on the root and every card
- **Read only**: `[data-readonly="true"]` on the root and every card
- **Layout**: `[data-layout]` on the root (`flex` or `grid`)

## API Reference

### RadioButtonGroup Props

<ApiTable component="RadioButtonGroup" kind="props" />

### RadioButtonGroup Slots

<ApiTable component="RadioButtonGroup" kind="slots" />

### RadioButtonGroup Emits

<ApiTable component="RadioButtonGroup" kind="emits" />

### RadioButtonGroupItem Props

<ApiTable component="RadioButtonGroupItem" kind="props" />

### RadioButtonGroupItem Slots

<ApiTable component="RadioButtonGroupItem" kind="slots" />

### Theme

<ApiTheme component="RadioButtonGroup" />

## Accessibility

- The root has `role="radiogroup"`, named by the group label through `aria-labelledby`
- Each card is a `role="radio"` button with `aria-checked`. It is named by its title through `aria-labelledby`, and its `aria-describedby` lists the card description, the default slot content and the group description and error
- Without a visible group label, pass `aria-label` or `aria-labelledby` to `RadioButtonGroup`
- Only the selected card (or the first enabled one) is in the tab order
- Keyboard: arrow keys move focus to the next or previous enabled card and select it; <kbd>Space</kbd> selects the focused card; <kbd>Enter</kbd> submits the surrounding form
- `orientation` limits the arrow keys to one axis: <kbd>↑</kbd> / <kbd>↓</kbd> for `vertical`, <kbd>←</kbd> / <kbd>→</kbd> for `horizontal`. Both axes work when it is omitted
- `readonly` sets `aria-readonly="true"` on the root; the cards stay focusable and announced, but the selection can't change
- `invalid` sets `aria-invalid="true"` on the root; the error is announced via `role="alert"`

## Related Components

<RelatedComponents :components="['radio-group', 'checkbox-button-group', 'form']" />
