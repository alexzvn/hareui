---
title: Dropdown
description: A dropdown displays a list of actions or options that a user can choose
links:
  reka: dropdown-menu
  source: Dropdown.vue
  styles: dropdown.ts
  heroui: dropdown
---

## Usage

```ts
import { Dropdown } from 'herouse'
```

<ComponentPreview name="dropdown/default" />

## Anatomy

A single `Dropdown` component owns the whole structure. The default slot is the trigger
(`as-child`, merged directly onto its own root element). The menu is built from the `items`
array: items, `{ type: 'section' }` groups with a header, `{ type: 'separator' }` dividers and
submenus (an item with nested `items`). Named slots customize the parts of each item.

```vue
<script setup lang="ts">
import type { DropdownEntry } from 'herouse'
import { Button, Dropdown } from 'herouse'

const items: DropdownEntry[] = [
  { type: 'section', label: 'Actions', items: [
    { value: 'new', label: 'New file', description: 'Create a new file', kbd: { keys: ['command'], content: 'N' } },
  ] },
  { type: 'separator' },
  { value: 'share', label: 'Share', items: [{ value: 'email', label: 'Email' }] },
  { value: 'delete', label: 'Delete', variant: 'danger' },
]
</script>

<template>
  <Dropdown :items="items" @action="onAction">
    <Button>Open</Button>
    <template #content-top>Content above the menu</template>
    <template #item-leading="{ item }">Icon</template>
    <template #indicator="{ selected }">Custom indicator</template>
    <template #submenu-indicator="{ item }">Custom chevron</template>
  </Dropdown>
</template>
```

## Examples

### With Icons

<ComponentPreview name="dropdown/with-icons" />

### With Descriptions

<ComponentPreview name="dropdown/with-descriptions" />

### With Disabled Items

<ComponentPreview name="dropdown/with-disabled-items" />

### With Sections

<ComponentPreview name="dropdown/with-sections" />

### With Multiple Selection

<ComponentPreview name="dropdown/with-multiple-selection" />

### Controlled

<ComponentPreview name="dropdown/controlled" />

### Controlled Open State

<ComponentPreview name="dropdown/controlled-open-state" />

### With Single Selection

<ComponentPreview name="dropdown/with-single-selection" />

### Single With Custom Indicator

<ComponentPreview name="dropdown/single-with-custom-indicator" />

### With Section Level Selection

A section with its own `selectionMode` selects independently of the rest of the menu: re-selecting
in a `single` section only replaces that section's value. Every section's selected values live in
the one `v-model` array.

<ComponentPreview name="dropdown/with-section-level-selection" />

### With Keyboard Shortcuts

<ComponentPreview name="dropdown/with-keyboard-shortcuts" />

### With Submenus

<ComponentPreview name="dropdown/with-submenus" />

### With Custom Submenu Indicator

The `#submenu-indicator` slot receives the item. Items the slot renders nothing for keep the
default chevron.

<ComponentPreview name="dropdown/with-custom-submenu-indicator" />

### Custom Trigger

<ComponentPreview name="dropdown/custom-trigger" />

### Long Press Trigger

With `trigger="longPress"` the menu opens on a long press, or with `Alt + ArrowDown` /
`Alt + ArrowUp`, so a regular press keeps the trigger's own action.

<ComponentPreview name="dropdown/long-press-trigger" />

## Customization

### Tailwind CSS

<ComponentPreview name="dropdown/custom-styles" />

### Global Configuration

To customize the Dropdown classes for the whole app, extend the `dropdown` theme in `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    dropdown: {
      slots: {
        popover: 'rounded-lg border border-border bg-overlay p-2',
        menu: 'flex flex-col gap-1',
      },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Element |
|---|---|---|
| `popover` | `dropdown-popover` | The popover container (Reka `DropdownMenuContent`, which carries `role="menu"`); `class` merges here |
| `menu` | `dropdown-menu` | The menu container inside the popover |
| `item` | `menu-item` | Menu item; per-item classes go in `item.class` |
| `indicator` | `menu-item-indicator` | Selection indicator (`menu-item-indicator--checkmark` / `menu-item-indicator--dot` SVG) |
| `submenuIndicator` | `submenu-indicator` | Submenu chevron |
| `section` | - | Section group (`<section role="group">`, labelled by its header) |
| `header` | `header` | Section header, labels the group |
| `separator` | `separator` | Divider between entries |

Item labels and descriptions render with the [Label](/docs/components/label) and
[Description](/docs/components/description) components (`data-slot="label"` /
`data-slot="description"`), and shortcuts with [Kbd](/docs/components/kbd) (`variant="light"`).

#### Variants

- `variant="default"` - Default item styling (per item, `item.variant`)
- `variant="danger"` - Danger item styling: label and indicators in the danger colour

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Hover**: `:hover` or `[data-hovered="true"]` on items
- **Focus**: `[data-focused="true"]` on the focused item, `[data-focus-visible="true"]` for keyboard
  focus only
- **Disabled**: `[data-disabled]` on items
- **Pressed**: `:active` or `[data-pressed="true"]` on items
- **Selected**: `[data-selected="true"]` or `[aria-checked="true"]` on items
- **Has submenu**: `[data-has-submenu="true"]` on submenu triggers
- **Selection mode**: `[data-selection-mode="single|multiple"]` on the menu and its selectable items
- **Entering / Exiting**: `[data-state="open"]` / `[data-state="closed"]` on the popover, mapped from
  HeroUI's `[data-entering]` / `[data-exiting]`

## API Reference

### Props

<ApiTable component="Dropdown" kind="props" />

### Slots

<ApiTable component="Dropdown" kind="slots" />

### Emits

<ApiTable component="Dropdown" kind="emits" />

## Accessibility

Implements the [WAI-ARIA Menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) via Reka
UI's `DropdownMenu` primitive:

- Full keyboard navigation (arrow keys, `Home` / `End`, typeahead using `textValue` or `label`)
- Selectable items use `role="menuitemradio"` (single) or `role="menuitemcheckbox"` (multiple) with
  `aria-checked`
- Item labels name the item; descriptions and keyboard shortcuts describe it
- Focus moves into the menu on open and returns to the trigger on close
- Disabled items are skipped
- Long press support, announced through the trigger's `aria-describedby`
- Submenus open with `ArrowRight` and close with `ArrowLeft`

Pointer selection closes the menu unless the selection is multiple. With the keyboard, `Enter`
selects and closes, while `Space` toggles selectable items and keeps the menu open.

## Related Components

<RelatedComponents :components="['button', 'popover', 'separator', 'list-box']" />
