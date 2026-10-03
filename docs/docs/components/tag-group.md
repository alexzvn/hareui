---
title: Tag Group
description: A focusable list of tags with support for selection and removal
links:
  source: tag-group/TagGroup.vue
  styles: tag-group/theme.ts
  heroui: tag-group
---

## Usage

```vue
<script setup lang="ts">
import { TagGroup } from '@hareui/vue'
</script>
```

<ComponentPreview name="tag-group/basic" />

## Anatomy

TagGroup renders an optional [Label](/docs/components/label), a grid of tags, and an optional [Description](/docs/components/description) / error message below it. Each tag is a `role="row"` wrapping a `role="gridcell"` with the tag content and, when `removable`, a remove button.

```vue
<template>
  <TagGroup label="…" :items="items">
    <template #label />                                             <!-- Label content -->
    <template #description />                                       <!-- Description content -->
    <template #errorMessage />                                      <!-- Error message content -->
    <template #item="{ item, index, selected, disabled }" />        <!-- Content of each tag (default: item.label) -->
    <template #empty />                                              <!-- Rendered inside the list when `items` is empty (usually <EmptyState>) -->
  </TagGroup>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `tag-group` | `<div>` root |
| `list` | `tag-group-list` | `<div role="grid">` |
| `tag` *(`tag` theme)* | `tag` | `<div role="row">`, one per item |
| `removeButton` *(`tag` theme)* | `tag-remove-button` | [CloseButton](/docs/components/close-button) (iff `removable`) |

### Typing items

`items` takes the exported `TagGroupItem` type. Extra fields are kept: extend the type, and the slots receive your type, so no casts are needed.

```ts
import type { TagGroupItem } from '@hareui/vue'

interface MyItem extends TagGroupItem {
  icon: string
}

const items: MyItem[] = [/* ... */]
// <template #item="{ item }"> — item.icon is a string
```

## Examples

### Sizes

<ComponentPreview name="tag-group/sizes" />

### Variants

<ComponentPreview name="tag-group/variants" />

### With Icons & Avatars

<ComponentPreview name="tag-group/with-prefix" />

### Disabled

Tags can be disabled individually (`items[].disabled`), or by id via `disabled-keys`.

<ComponentPreview name="tag-group/disabled" />

### Selection Modes

`selection-mode` is `'none'` (default), `'single'` or `'multiple'`. Bind the selected ids with `v-model:selected`.

<ComponentPreview name="tag-group/selection-modes" />

### Controlled Selection

<ComponentPreview name="tag-group/controlled" />

### With Remove Button

Set `removable` to show a remove button on every (non-disabled) tag. It emits `remove` with the removed id(s) — also fired by pressing Delete / Backspace while a tag is focused, in which case the whole current selection is removed if the focused tag is part of it. Use the `#removeButton` slot to replace the default close icon.

<ComponentPreview name="tag-group/with-remove-button" />

### With Error Message

<ComponentPreview name="tag-group/with-error-message" />

### With List Data

Keep the items in a `ref`, remove them on `@remove`, and render an `EmptyState` in the `#empty` slot once the list is empty.

<ComponentPreview name="tag-group/with-list-data" />

### Render Function

Attributes on `TagGroup` (other than `aria-label`) fall through to the root element.

<ComponentPreview name="tag-group/render-function" />

## EmptyState

`EmptyState` is the small muted placeholder HeroUI renders inside empty collections (TagGroup, ListBox, Table). It renders "No results found" by default; pass your own text in the default slot. Use it in TagGroup's `#empty` slot.

```vue
<script setup lang="ts">
import { EmptyState } from '@hareui/vue'
</script>

<template>
  <EmptyState class="p-1">
    No team members
  </EmptyState>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `empty-state` | `<div>` root |

<ApiTable component="EmptyState" kind="props" />

### EmptyState Theme

<ApiTheme component="EmptyState" />

## Customization

### Tailwind CSS

<ComponentPreview name="tag-group/custom-styles" />

### Global Configuration

```ts
app.use(createHareUI({
  ui: { tagGroup: { slots: { list: 'gap-2' } }, tag: { slots: { base: 'rounded-full' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="tag-group"]` – column layout wrapping the label, list, description and error message
- `list` → `[data-slot="tag-group-list"]` – wrapping flex layout holding the tags
- `tag` (from the `tag` theme) → `[data-slot="tag"]` – one tag
- `removeButton` (from the `tag` theme) → `[data-slot="tag-remove-button"]` – the remove button

### Interactive States

- **Selected**: `aria-selected="true"` / `[data-selected="true"]` on a tag (only meaningful when `selection-mode` isn't `'none'`)
- **Disabled**: `aria-disabled="true"` / `[data-disabled="true"]` on a tag; its remove button is also disabled
- **Pressed**: `[data-pressed="true"]` on a tag
- **Focus**: `[data-focus-visible="true"]` on a tag
- **Empty**: `[data-empty="true"]` on the list when `items` is empty

## API Reference

### Props

<ApiTable component="TagGroup" kind="props" />

### Slots

<ApiTable component="TagGroup" kind="slots" />

### Emits

<ApiTable component="TagGroup" kind="emits" />

### TagGroup Theme

<ApiTheme component="TagGroup" />

## Accessibility

- The list has `role="grid"`; each tag has `role="row"` wrapping a `role="gridcell"`, matching React Aria's `TagGroup`
- `aria-multiselectable` is set on the list when `selection-mode` is `'multiple'`
- `label` names the list through `aria-labelledby`; without one, pass `aria-label`
- `description` and `error-message` are both referenced by the list's `aria-describedby`
- Keyboard: Arrow keys move roving focus between tags, skipping disabled ones; Home / End jump to the first / last enabled tag; Enter / Space toggles selection; Delete / Backspace removes the focused tag (or the whole selection, if it's part of it) when `removable`; Escape clears the selection

## Related Components

<RelatedComponents :components="['close-button', 'label', 'description']" />
