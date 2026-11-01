---
title: ItemCardGroup
description: Groups ItemCards on one divided surface or in a grid, with an optional heading.
links:
  source: item-card-group/ItemCardGroup.vue
  styles: item-card-group/theme.ts
---

## Usage

Put [ItemCards](./item-card) in the default slot. In the default `list` layout they share the group's surface, with a divider between neighbouring cards.

```ts
import { ItemCard, ItemCardGroup } from '@hareui/vue'
```

<ComponentPreview name="item-card-group/basic" />

## Anatomy

```vue
<ItemCardGroup title="…" description="…">
  <template #header />      <!-- optional: replaces the title and description -->
  <template #title />       <!-- optional: replaces the title text -->
  <template #description /> <!-- optional: replaces the description text -->
  <ItemCard />
  <ItemCard />
</ItemCardGroup>
```

The group renders a `div` with `role="group"`. The title is an `h3`.

## Examples

### With a Heading

<ComponentPreview name="item-card-group/header" />

### Variants

Use the `variant` prop to change the group's surface. It takes the same values as the [ItemCard variants](./item-card#variants),
and the cards inside take it as their default.

<ComponentPreview name="item-card-group/variants" />

### Grid

`layout="grid"` puts the cards in columns, each on its own raised surface. The group itself has no surface in this
layout. This example drops to one column on phones; see [Columns](#columns).

<ComponentPreview name="item-card-group/grid" />

### Columns

Use `columns` to set two (the default) or three grid columns. The count holds at every screen width, so add a
responsive class to use fewer columns on phones. This example passes `class="max-sm:grid-cols-1"`.

<ComponentPreview name="item-card-group/grid-columns" />

### Links

Cards with `href`, `to` or a `@click` listener highlight on hover across the full width of the group.

<ComponentPreview name="item-card-group/pressable" />

### Sections

Stack several groups to split a settings page into sections.

<ComponentPreview name="item-card-group/sections" />

## Accessibility

- The group has `role="group"`. Its title names it and its description describes it.
- Without a title, give the group an `aria-label`.

## API Reference

### Props

<ApiTable component="ItemCardGroup" kind="props" />

### Slots

<ApiTable component="ItemCardGroup" kind="slots" />

## Theme

<ApiTheme component="ItemCardGroup" />
