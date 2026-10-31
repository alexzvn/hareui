---
title: ItemCard
description: A row with an icon, a title, a description and a trailing action such as a button, a switch or a select.
links:
  source: item-card/ItemCard.vue
  styles: item-card/theme.ts
---

## Usage

Set the `icon`, `title` and `description` props, and put a control in the `#action` slot.

```ts
import { ItemCard } from '@hareui/vue'
```

<ComponentPreview name="item-card/basic" />

## Anatomy

```vue
<ItemCard :icon="icon" title="…" description="…">
  <template #icon />        <!-- optional: the content of the icon box -->
  <template #title />       <!-- optional: replaces the title text -->
  <template #description /> <!-- optional: replaces the description text -->
  <template #action />      <!-- optional: trailing content -->
  <!-- optional default slot: extra content under the description -->
</ItemCard>
```

The card renders a `div` with the icon box, the text and the action in a row. The title and the description stay on
one line each and end with an ellipsis when they don't fit. `icon` takes a component or an icon class.

## Examples

### Variants

Use the `variant` prop to change the surface:

- `default`: raised, with a shadow
- `secondary`: tinted, flat
- `tertiary`: a deeper tint, flat
- `outline`: a border only
- `transparent`: no surface

Inside an [ItemCardGroup](./item-card-group) the card takes the group's variant unless it sets its own.

<ComponentPreview name="item-card/variants" />

### Title only

Without a description the title is centred on the icon.

<ComponentPreview name="item-card/title-only" />

### Without icon

Leave out `icon` and the `#icon` slot and the text starts at the edge of the card.

<ComponentPreview name="item-card/without-icon" />

### With a switch

<ComponentPreview name="item-card/with-switch" />

### With a select

An [InlineSelect](./inline-select) fits the action slot, with single or multiple selection.

<ComponentPreview name="item-card/with-select" />

### Links and buttons

- With `to` or `href` the card renders a link, through `RouterLink` when the app has vue-router.
- With a `@click` listener it renders a `button`. Set `as` to render another element.

Both get a hover and press highlight and a focus ring. Keep buttons and other controls out of their `#action` slot: a
link or a button can't contain another one.

<ComponentPreview name="item-card/pressable" />

### A stack of cards

Separate cards with a gap for a list where every row stands on its own. To share one surface with dividers, use an [ItemCardGroup](./item-card-group).

<ComponentPreview name="item-card/stack" />

### Rich title

The `#title` slot can hold more than text, such as a [Chip](./chip).

<ComponentPreview name="item-card/rich-title" />

### Custom icon box

Restyle the icon box with `ui.icon` and fill it with the `#icon` slot. The action slot can hold any layout.

<ComponentPreview name="item-card/custom-icon" />

## Accessibility

- The icon is decorative and hidden from screen readers.
- A card with `href` or `to` is a link; a card with a `@click` listener is a button. Both are reached with Tab and
  named by their text.
- Give a control in the `#action` slot its own `aria-label`, as the switch and select examples do.

## API Reference

### Props

<ApiTable component="ItemCard" kind="props" />

### Slots

<ApiTable component="ItemCard" kind="slots" />

## Theme

<ApiTheme component="ItemCard" />
