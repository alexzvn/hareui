---
title: InlineSelect
description: A select that reads as part of a sentence or heading.
links:
  reka: popover
  source: inline-select/InlineSelect.vue
  styles: inline-select/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { InlineSelect } from '@hareui/vue'
</script>
```

<ComponentPreview name="inline-select/basic" />

## Anatomy

InlineSelect is a [Select](/docs/components/select) with a ghost trigger: no border or shadow, a background only on hover, just the value and a small indicator. It takes the same `items`, `v-model`, slots and form props. The popover holds a [ListBox](/docs/components/list-box) and opens at the bottom end of the trigger. The root is named `inline-select`; the inner parts keep Select's `select-*` names.

```vue
<template>
  <InlineSelect aria-label="…" :items="items">
    <template #leading />                                  <!-- inside the trigger, before the value -->
    <template #value="{ selectedItems, isPlaceholder, text }" /> <!-- trigger value -->
    <template #indicator="{ open }" />                     <!-- indicator (default: chevrons-expand icon) -->
    <template #item-leading="{ item, selected }" />        <!-- ListBox item slots, forwarded -->
    <template #item-indicator="{ selected }" />            <!-- option checkmark -->
  </InlineSelect>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `inline-select` | root `<div>` |
| `trigger` | `select-trigger` | `<button>` |
| `value` | `select-value` | `<span>` inside the trigger, truncated |
| `indicator` | `select-indicator` | `<span aria-hidden>` holding the icon |
| `popover` | `select-popover` | popover holding the ListBox |

There is no visible label. Give the trigger a name with `aria-label`, or point `aria-labelledby` at nearby text.

## Examples

### Environment Switcher

Put content before the value with the `#leading` slot, here a status dot for the current environment. Show the same dot in each option with `#item-leading`; the `description` of each item adds its URL.

<ComponentPreview name="inline-select/environment-switcher" />

### Custom Indicator

Replace the default icon with the `#indicator` slot, here a single chevron. It is sized by `--inline-select-indicator-size`.

<ComponentPreview name="inline-select/custom-indicator" />

### Multi Select

Set `selection-mode="multiple"` to pick several options. `v-model` becomes an array, the popover stays open while you pick, and the trigger lists the selected labels.

<ComponentPreview name="inline-select/multi-select" />

### Placements

The popover opens below the trigger, aligned to its end. Change it with `side` and `align`; each option here applies one pair. The popover flips to the opposite side when there isn't enough room.

<ComponentPreview name="inline-select/placements" />

### Inside Text

The root is `inline-flex`, so the trigger text sits on the same baseline as the sentence around it.

<ComponentPreview name="inline-select/inside-text" />

## Customization

### Tailwind CSS

Pass classes per part with `ui`, or on the root with `class`. Set the popover width with `ui.popover`; it is never narrower than the trigger.

```vue
<template>
  <InlineSelect
    aria-label="Sort by"
    :items="sortOptions"
    :ui="{ trigger: 'text-base text-foreground', value: 'font-semibold', popover: 'w-56' }"
  />
</template>
```

### CSS Variables

| Variable | Default | Description |
|---|---|---|
| `--inline-select-value-max-width` | `12rem` | Width at which the value truncates |
| `--inline-select-indicator-size` | `0.75rem` | Size of the indicator icon |

```vue
<template>
  <InlineSelect class="[--inline-select-value-max-width:8rem]" aria-label="Sort by" :items="sortOptions" />
</template>
```

### Global Configuration

```ts
app.use(createHareUI({
  ui: { inlineSelect: { slots: { trigger: 'text-foreground', indicator: 'text-current' } } },
}))
```

The InlineSelect classes are merged over the Select theme, so `ui.select` overrides from your config apply here too unless an InlineSelect class replaces them.

## Styling Reference

### Slots

- `base` → `[data-slot="inline-select"]` – root (`inline-flex`), sets the CSS variables
- `trigger` → `[data-slot="select-trigger"]` – ghost button, `text-sm text-muted`; on hover the text turns `text-foreground` over a rounded `--field-hover` background
- `value` → `[data-slot="select-value"]` – selected label(s), truncated at `--inline-select-value-max-width`
- `indicator` → `[data-slot="select-indicator"]` – icon, positioned in the flow and not rotated when open
- `popover` → `[data-slot="select-popover"]` – dropdown panel

### Interactive States

- **Hover**: `:hover` or `[data-hovered="true"]` on the trigger
- **Focus visible**: `:focus-visible` or `[data-focus-visible="true"]` on the trigger (focus ring)
- **Disabled**: `:disabled` or `[data-disabled="true"]` on the trigger (reduced opacity)
- **Invalid**: `[data-invalid="true"]` on the root
- **Open**: `[data-open="true"]` on the root and the indicator

## API Reference

### Props

<ApiTable component="InlineSelect" kind="props" />

### Slots

<ApiTable component="InlineSelect" kind="slots" />

### Emits

<ApiTable component="InlineSelect" kind="emits" />

### Theme

<ApiTheme component="InlineSelect" />

## Accessibility

InlineSelect behaves like [Select](/docs/components/select) and follows the ARIA listbox pattern:

- The trigger is a `<button>` with `aria-haspopup="listbox"`. Name it with `aria-label` or `aria-labelledby`; the current value is added to its accessible name
- Click, <kbd>Enter</kbd> or <kbd>Space</kbd> opens the list on the selected option, else the first
- <kbd>↓</kbd> opens the list on the selected option, else the first. <kbd>↑</kbd> opens it on the selected option, else the last
- <kbd>↑</kbd> / <kbd>↓</kbd> move between options, <kbd>Enter</kbd> selects, <kbd>Esc</kbd> closes; focus returns to the trigger
- In single selection, typing on the closed trigger selects the first option that starts with the typed text
- Icons in `#leading` and the indicator are decorative: mark your own icons `aria-hidden="true"`
- A hidden native `<select>` carries `name`, form data and `required` validation

## Related Components

<RelatedComponents :components="['select', 'native-select', 'list-box', 'dropdown']" />
