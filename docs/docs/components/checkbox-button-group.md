---
title: CheckboxButtonGroup
description: Multi-select cards with icons, rich content and custom indicators.
links:
  reka: checkbox
  source: checkbox-button-group/CheckboxButtonGroup.vue
  styles: checkbox-button-group/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'
</script>
```

<ComponentPreview name="checkbox-button-group/basic" />

## Anatomy

`CheckboxButtonGroup` renders a [Label](/docs/components/label), a [Description](/docs/components/description), its `CheckboxButtonGroupItem` children and a [FieldError](/docs/components/field-error). Each item is a card: an indicator in the top-end corner, an optional icon, then the content.

```vue
<template>
  <CheckboxButtonGroup label="…" description="…" error-message="…">
    <template #label />
    <!-- Label content -->
    <template #description />
    <!-- Description content -->
    <CheckboxButtonGroupItem value="…" label="…" description="…" icon="…">
      <template #indicator />
      <!-- custom indicator, shown while selected -->
      <template #icon />
      <!-- leading icon -->
      <template #label />
      <!-- item title, replaces `label` -->
      <template #description />
      <!-- item description, replaces `description` -->
      <!-- default slot: extra content after the title and description -->
    </CheckboxButtonGroupItem>
    <template #error />
    <!-- FieldError content, rendered when invalid -->
  </CheckboxButtonGroup>
</template>
```

| `ui` key          | `data-slot`                              | Element                                                                          |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| `base`            | `checkbox-button-group`                  | `<div role="group">` root                                                        |
| —                 | `label`                                  | [Label](/docs/components/label) (iff `label` / `#label`)                         |
| —                 | `description`                            | [Description](/docs/components/description) (iff `description` / `#description`) |
| `item`            | `checkbox-button-group-item`             | `<button role="checkbox">` card                                                  |
| `indicator`       | `checkbox-button-group-indicator`        | `<span>` checkbox control or custom icon (iff `indicator`)                       |
| `content`         | `checkbox-button-group-item-content`     | `<span>` content column                                                          |
| `icon`            | `checkbox-button-group-item-icon`        | `<span>` leading icon (iff `icon` / `#icon`)                                     |
| `itemText`        | `checkbox-button-group-item-text`        | `<span>` wrapping the title, description and default slot                        |
| `itemLabel`       | `checkbox-button-group-item-label`       | `<span>` item title (iff `label` / `#label`)                                     |
| `itemDescription` | `checkbox-button-group-item-description` | `<span>` item description (iff `description` / `#description`)                   |
| —                 | `checkbox-button-group-item-extra`       | `<span class="contents">` around the default slot (iff default slot)             |
| —                 | `field-error`                            | [FieldError](/docs/components/field-error) (while invalid)                       |

The `ui` prop on the group styles every item. Set `ui` or `class` on a single `CheckboxButtonGroupItem` to style that card only.

## Examples

### Controlled

Bind the selected values with `v-model`. The array holds each selected item's `value`. Here the default slot adds a keyboard shortcut under each editor setting.

<ComponentPreview name="checkbox-button-group/controlled" />

### Custom Indicator

Put an icon in the `#indicator` slot to replace the checkbox. It takes the accent color and only shows while the card is selected. The default slot adds each goal's target.

<ComponentPreview name="checkbox-button-group/custom-indicator" />

### Disabled Group

`disabled` on the group disables every card. Use `disabled` on a `CheckboxButtonGroupItem` to disable one card.

<ComponentPreview name="checkbox-button-group/disabled-group" />

### Grid Layout

`layout="grid"` switches the group to a CSS grid. Set the columns with a `grid-cols-*` class. The label, description and error span every column.

<ComponentPreview name="checkbox-button-group/grid-layout" />

### Icon Cards

Use the `#label` slot for rich titles. Here each routine's title sits under a round icon tile, and a newer routine also has a "New" tag.

<ComponentPreview name="checkbox-button-group/icon-cards" />

### No Indicator

Set `:indicator="false"` to drop the indicator. The selected card keeps its accent ring.

<ComponentPreview name="checkbox-button-group/no-indicator" />

### Selection State in Content

Every item slot receives `selected` and `disabled`. Here the default slot switches its text from "Add" to "Added" and turns it accent when the card is picked.

<ComponentPreview name="checkbox-button-group/selection-state-in-content" />

### Subscription Plans

The default slot adds content after the title and description. Here each course shows how many lessons it adds per week.

<ComponentPreview name="checkbox-button-group/subscription-plans" />

### With Icons

`icon` takes an icon class or a component and renders before the text. The `#icon` slot replaces it.

<ComponentPreview name="checkbox-button-group/with-icons" />

### With Ripple

Attributes and listeners on an item reach the card, so you can add your own press effect. This one shades the card on hover and grows a ripple from the pointer while it's pressed.

<ComponentPreview name="checkbox-button-group/with-ripple" />

## Customization

### Tailwind CSS

Pass classes through `class` and `ui`, on the group or on one item.

```vue
<template>
  <CheckboxButtonGroup :ui="{ item: 'rounded-lg bg-default', indicator: 'top-4' }">
    <CheckboxButtonGroupItem
      value="team"
      label="Team"
      class="data-[selected=true]:bg-accent-soft"
    />
  </CheckboxButtonGroup>
</template>
```

### CSS Variables

- `--checkbox-button-group-item-radius`: card corner radius, set on the root (default `var(--radius-2xl)`)

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { checkboxButtonGroup: { slots: { item: 'px-4 py-3' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="checkbox-button-group"]`: root (`flex flex-col gap-3`, `grid` with `layout="grid"`)
- `item` → `[data-slot="checkbox-button-group-item"]`: the card, with border, surface background and selection ring
- `indicator` → `[data-slot="checkbox-button-group-indicator"]`: top-end indicator; `[data-custom="true"]` when it holds a custom icon
- `content` → `[data-slot="checkbox-button-group-item-content"]`: content column, a row when an icon is present
- `icon` → `[data-slot="checkbox-button-group-item-icon"]`: leading icon, `svg` sized to 24px
- `itemText` → `[data-slot="checkbox-button-group-item-text"]`: title, description and default-slot content
- `itemLabel` → `[data-slot="checkbox-button-group-item-label"]`, `itemDescription` → `[data-slot="checkbox-button-group-item-description"]`

The default indicator uses the [Checkbox](/docs/components/checkbox) theme's `control` and `indicator` classes, so `variant` and global `checkbox` overrides apply to it.

### Interactive States

- **Selected**: `[data-selected="true"]` on the card (accent ring)
- **Focus visible**: `:focus-visible` on the card (focus ring)
- **Disabled**: `[data-disabled]` on the card (reduced opacity), `[data-disabled="true"]` on the root when the group is disabled
- **Invalid**: `[data-invalid="true"]` on the root and every card
- **Read only**: `[data-readonly="true"]` on the root and every card
- **Layout**: `[data-layout="flex" | "grid"]` on the root

## API Reference

### CheckboxButtonGroup Props

<ApiTable component="CheckboxButtonGroup" kind="props" />

### CheckboxButtonGroup Slots

<ApiTable component="CheckboxButtonGroup" kind="slots" />

### CheckboxButtonGroup Emits

<ApiTable component="CheckboxButtonGroup" kind="emits" />

### CheckboxButtonGroupItem Props

<ApiTable component="CheckboxButtonGroupItem" kind="props" />

### CheckboxButtonGroupItem Slots

<ApiTable component="CheckboxButtonGroupItem" kind="slots" />

### Theme

<ApiTheme component="CheckboxButtonGroup" />

## Accessibility

- The root has `role="group"`, named by the label through `aria-labelledby` and described by the description and error through `aria-describedby`
- Each card is a `<button role="checkbox">` with `aria-checked`. It is named by its title (`label` / `#label`) and described by its description, its default slot content and the group's description and error. Without a title, the card's text content names it
- Every enabled card is its own tab stop; disabled cards are skipped
- Keyboard: <kbd>Space</kbd> toggles the focused card; <kbd>Enter</kbd> submits the enclosing form
- `invalid` sets `aria-invalid="true"` on every card; `readonly` sets `aria-readonly="true"` and keeps the selection
- With `name`, the selected values are submitted as `name[0]`, `name[1]`, … like [CheckboxGroup](/docs/components/checkbox-group)

## Related Components

<RelatedComponents :components="['checkbox-group', 'checkbox', 'radio-button-group', 'form']" />
