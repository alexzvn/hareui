---
title: ContextMenu
description: A menu of actions or options that opens at the pointer on right click, or on a long press on touch screens.
links:
  reka: context-menu
  source: context-menu/ContextMenu.vue
  styles: context-menu/theme.ts
---

## Usage

```ts
import { ContextMenu } from '@hareui/vue'
```

The default slot is the area that opens the menu. Right-click it, or press and hold it on a touch screen, and the menu opens below the pointer.

<ComponentPreview name="context-menu/default" />

## Anatomy

A single `ContextMenu` component owns the whole structure. The menu is built from the `items` array with the same entries as [Dropdown](./dropdown): items, `{ type: 'section' }` groups with a header, `{ type: 'separator' }` dividers and submenus (an item with nested `items`). Named slots customize the parts of each item.

```vue
<template>
  <ContextMenu :items="items" @action="onAction">
    <div>Right-click here</div>
    <template #content-top>Content above the items</template>
    <template #item-leading="{ item }">Icon</template>
    <template #item-trailing="{ item }">Custom shortcut</template>
    <template #content-bottom>Content below the items</template>
  </ContextMenu>
</template>

<script setup lang="ts">
import type { ContextMenuEntry, ContextMenuValue } from '@hareui/vue'
import { ContextMenu } from '@hareui/vue'

const items: ContextMenuEntry[] = [
  {
    type: 'section',
    label: 'Edit',
    items: [{ value: 'copy', label: 'Copy', kbd: { keys: 'command', content: 'C' } }],
  },
  { type: 'separator' },
  { value: 'share', label: 'Share', items: [{ value: 'email', label: 'Email' }] },
  { value: 'delete', label: 'Delete', variant: 'danger' },
]

const onAction = (value: ContextMenuValue) => console.log(value)
</script>
```

The trigger area is a `<div>`, so it doesn't take focus. Attributes such as `tabindex="0"` go to it: once focusable, the platform's keyboard shortcut for context menus (`Shift + F10` on Windows and Linux) opens the menu too.

## Examples

### Open State

Use `v-model:open` to read or set the open state. Opened without a pointer, the menu appears below the trigger area's start corner.

<ComponentPreview name="context-menu/controlled" />

### Disabled

With `disabled`, a right click shows the browser's own context menu.

<ComponentPreview name="context-menu/disabled" />

### Long Press

A finger or pen held on the trigger area opens the menu after `press-open-delay` milliseconds (700 by default). Some phones never send a `contextmenu` event, so a long press is the only way to reach the menu there.

<ComponentPreview name="context-menu/long-press" />

### With Sections

Use `{ type: 'section' }` entries to group items under a header.

<ComponentPreview name="context-menu/with-sections" />

### With Groups

Pass an array of arrays to `items` to split the menu into groups, with a separator between each group.

<ComponentPreview name="context-menu/with-groups" />

### Checked Items

Set `selection-mode` to `single` or `multiple` and bind the selected values with `v-model` (always an array).

<ComponentPreview name="context-menu/with-selection" />

### Multiple Selection

Items of a `multiple` menu toggle and keep the menu open, so several can be checked in a row.

<ComponentPreview name="context-menu/with-multiple-selection" />

### Nested Menus

An item with nested `items` opens a submenu. Sections can carry their own `selectionMode` and `indicator`, selecting independently of the rest of the menu into the same `v-model` array.

<ComponentPreview name="context-menu/with-submenus" />

### With Icons

Set `icon` on an item to show an icon before its label. It takes an icon class or a component. The `#item-leading` slot replaces it, for avatars or anything else. `variant: 'danger'` colours destructive items.

<ComponentPreview name="context-menu/with-icons" />

### With Custom Slots

`#content-top` and `#content-bottom` render inside the menu, above and below the items. `#item-label`, `#item-description` and `#item-trailing` replace parts of each item, and `#item` replaces the whole item content.

<ComponentPreview name="context-menu/with-custom-slots" />

### Non-Modal

By default the rest of the page is inert while the menu is open. Set `:modal="false"` to keep it interactive.

<ComponentPreview name="context-menu/non-modal" />

## Customization

### Tailwind CSS

<ComponentPreview name="context-menu/custom-styles" />

### Global Configuration

To customize the ContextMenu classes for the whole app, extend the `contextMenu` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      contextMenu: {
        slots: {
          popover: 'rounded-lg border border-border bg-overlay',
          item: 'rounded-md',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key           | `data-slot`            | Element                                                                                 |
| ------------------ | ---------------------- | --------------------------------------------------------------------------------------- |
| `trigger`          | `context-menu-trigger` | The area that opens the menu; `class` merges here                                       |
| `popover`          | `context-menu-popover` | The popover container, which carries `role="menu"`                                      |
| `menu`             | `context-menu-menu`    | The menu container inside the popover                                                   |
| `item`             | `menu-item`            | Menu item; per-item classes go in `item.class`                                          |
| `indicator`        | `menu-item-indicator`  | Selection indicator (`menu-item-indicator--checkmark` / `menu-item-indicator--dot` SVG) |
| `submenuIndicator` | `submenu-indicator`    | Submenu chevron                                                                         |
| `itemIcon`         | `menu-item-icon`       | `item.icon`, before the label                                                           |
| `section`          | -                      | Section group (`<section role="group">`, labelled by its header)                        |
| `header`           | `header`               | Section header, labels the group                                                        |
| `separator`        | `separator`            | Divider between entries                                                                 |

Submenu popovers use the `popover` and `menu` classes too, with `data-slot="dropdown-popover"` and `data-slot="dropdown-menu"`. Item labels and descriptions render with the [Label](/docs/components/label) and [Description](/docs/components/description) components, and shortcuts with [Kbd](/docs/components/kbd) (`variant="light"`).

#### Variants

- `variant="default"` - Default item styling (per item, `item.variant`)
- `variant="danger"` - Danger item styling: label and indicators in the danger colour

### Interactive States

- **Open**: `[data-state="open"]` on the trigger area and the popover
- **Disabled**: `[data-disabled]` on the trigger area and on disabled items
- **Highlighted**: `[data-highlighted]` on the item under the pointer or keyboard focus (one item at a time)
- **Focus**: `[data-focused="true"]` on the focused item, `[data-focus-visible="true"]` for keyboard focus only
- **Pressed**: `:active` or `[data-pressed="true"]` on items
- **Selected**: `[data-selected="true"]` or `[aria-checked="true"]` on items
- **Has submenu**: `[data-has-submenu="true"]` on submenu triggers
- **Placement**: `[data-side]` on the popover; the enter animation slides in from that side

## API Reference

### Props

<ApiTable component="ContextMenu" kind="props" />

### Slots

<ApiTable component="ContextMenu" kind="slots" />

### Emits

<ApiTable component="ContextMenu" kind="emits" />

## Theme

<ApiTheme component="ContextMenu" />
