---
title: ActionBar
description: A floating toolbar fixed to the bottom of the screen for contextual actions, such as bulk actions on selected rows.
links:
  source: action-bar/ActionBar.vue
  styles: action-bar/theme.ts
---

## Usage

```ts
import { ActionBar } from '@hareui/vue'
```

The action bar is a pill-shaped [Toolbar](./toolbar) fixed to the bottom centre of the screen. It slides in when `open`
turns `true` and out when it turns `false`. Bind it with `v-model:open`, or use `default-open` when you don't need to
control it.

The bar floats over the page, 24 px above the bottom edge (plus the safe area on phones). Leave about 6rem of padding
below the content it acts on, as the examples do with `pb-24`, so it never covers the last rows.

<ComponentPreview name="action-bar/basic" contain />

## Anatomy

```vue
<ActionBar :open="selected.length > 0">
  <template #prefix="{ labelClass, close }" />   <!-- optional: counts, badges -->
  <template #default="{ labelClass, close }" />  <!-- the main actions -->
  <template #suffix="{ labelClass, close }" />   <!-- optional: a dismiss button -->
</ActionBar>
```

Every section is optional, and a separator is drawn between the sections that are present.

The bar doesn't track a selection itself: bind `open` to whatever decides when it shows, such as
`selected.length > 0`. Call the `close` slot prop to close it. Escape and clicks outside don't close it.

## Examples

### Responsive Labels

Wrap the text of a button in an element with the `labelClass` slot prop. Below 640 px the text is hidden on screen, so
the button shrinks to its icon, and screen readers still read the label. Switch the preview to a phone to see it.

```vue
<template #default="{ labelClass }">
  <Button size="sm" variant="ghost">
    <Icon icon="gravity-ui:pencil" />
    <span :class="labelClass">Edit</span>
  </Button>
</template>
```

<ComponentPreview name="action-bar/responsive-labels" contain device="mobile" />

### Attached

The bar has a surface background by default. Set `:attached="false"` to remove it; the rounding and the shadow stay.

<ComponentPreview name="action-bar/detached" contain />

### Orientation

`orientation="vertical"` stacks the sections. The arrow keys then move up and down, and the separators turn
horizontal.

<ComponentPreview name="action-bar/vertical" contain />

### With RichTable

Show bulk actions while rows are selected. The clear button empties the [RichTable](./rich-table) selection, which
closes the bar.

<ComponentPreview name="action-bar/with-rich-table" contain="30rem" />

### With ListView

The same pattern with a selectable [ListView](./list-view).

<ComponentPreview name="list-view/with-action-bar" contain="30rem" />

### Custom Styles

Use the `ui` prop to move the bar or restyle the pill; `class` applies to the pill.

<ComponentPreview name="action-bar/custom-styles" contain />

## Accessibility

- The bar is a `toolbar`: the arrow keys move between its controls and Tab leaves it.
- Its `aria-label` defaults to "Actions" (translated through the `App` locale). Set your own that says what the
  actions apply to.
- With reduced motion requested, the bar appears and disappears without animating.

## API Reference

### Props

<ApiTable component="ActionBar" kind="props" />

### Slots

<ApiTable component="ActionBar" kind="slots" />

### Emits

<ApiTable component="ActionBar" kind="emits" />

## Theme

<ApiTheme component="ActionBar" />
