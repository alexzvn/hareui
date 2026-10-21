---
title: NavigationMenu
description: A list of links that can be displayed horizontally or vertically.
links:
  source: navigation-menu/NavigationMenu.vue
  styles: navigation-menu/theme.ts
---

## Usage

```ts
import { NavigationMenu } from '@hareui/vue'
```

<ComponentPreview name="navigation-menu/basic" align="start" minHeight="420px" />

Use the NavigationMenu component to build a header navigation with dropdown content or a sidebar menu with collapsible sections.

A horizontal menu doesn't wrap, so its labels truncate when it runs out of room. The horizontal examples on this page pass `:ui="{ linkLabel: 'max-sm:sr-only' }"` to show only the icons on small screens; the labels stay available to screen readers.

### Items

Use the `items` prop as an array of objects with the following properties. Pass an array of arrays to render groups, separated by a divider in a vertical menu.

| Field | Type | Description |
|---|---|---|
| `label` | `string` | The item text |
| `icon` | `string \| Component` | Leading icon, see [Icons](#icons) |
| `avatar` | `AvatarProps` | Leading avatar, shown instead of the icon |
| `badge` | `string \| number \| ChipProps` | Trailing [Chip](/docs/components/chip) |
| `chip` | `boolean \| BadgeProps` | A [Badge](/docs/components/badge) dot anchored to the icon |
| `kbds` | `string[]` | Keyboard shortcut: modifier names (`'command'`, `'shift'`, ...) render as symbols |
| `tooltip` | `boolean \| TooltipProps` | A [Tooltip](/docs/components/tooltip) with the label (vertical `collapsed`, or any item when horizontal) |
| `popover` | `boolean \| NavigationMenuPopoverProps` | A popover with the children when the vertical menu is `collapsed` |
| `trailingIcon` | `string \| Component` | Replaces the chevron |
| `type` | `'label' \| 'trigger' \| 'link'` | `label` is a group heading, `trigger` makes an item with `href` and `children` a collapsible button |
| `defaultOpen` / `open` | `boolean` | Initially expanded (vertical) |
| `value` | `string` | The value matched by `v-model` / `default-value` |
| `active` | `boolean` | Marks the current item |
| `disabled` | `boolean` | Disables the item |
| `slot` | `string` | Name of the slots that render this item |
| `onSelect` | `(e: Event) => void` | Called when the item is selected |
| `actions` | `DropdownEntry[]` | A ⋮ menu at the end of a vertical row, see [With item actions](#with-item-actions) |
| `children` | `NavigationMenuChildItem[]` | A submenu: an accordion (vertical) or dropdown content (horizontal) |
| `href`, `to`, `as`, `target`, `rel`, `download`, `external`, `exact`, `replace` | | Link props, see [Links](#links) |
| `class`, `ui` | | Classes for the item's link, per-slot classes |

Child items accept `label`, `icon`, `onSelect`, `class` and the link properties. A `description` is shown in the horizontal dropdown content.

Use `type: 'label'` to render an item as a group heading. Set `type: 'trigger'` on an item with both `href` and `children` to make it toggle its children instead of navigating.

#### Links

An item with `href` renders an `<a>`, an item without one renders a `<button>`. When `vue-router` is installed, `to` renders a `RouterLink` and the item becomes active when its route matches; add `exact` to match only the exact route. Setting `active` on an item overrides the router.

Use `as` to render the link as another component. `target: '_blank'` adds an external icon and `rel="noopener noreferrer"`.

#### Icons

HareUI doesn't ship an icon set. The `icon` and `trailingIcon` properties, and the `trailing-icon` and `external-icon` props, accept either a component or a class name. A class name is set on an empty `<span>`, which works with icon fonts and CSS icon plugins such as `i-lucide-house`. The examples on this page use [Iconify](https://iconify.design) components:

```ts
import { Icon } from '@iconify/vue'
import { h } from 'vue'

// Create once, outside `setup`: a new component per render would remount the icon.
// Forward every attribute: the menu passes `class`, `data-slot` and `aria-hidden`.
const home = (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: 'gravity-ui:house' })
```

### Orientation

Use the `orientation` prop to change the orientation of the NavigationMenu. Defaults to `horizontal`. In a vertical menu, items with `children` expand in place.

<ComponentPreview name="navigation-menu/orientation" minHeight="420px" />

Group items by passing an array of arrays, and add `type: 'label'` items as group headings.

<ComponentPreview name="navigation-menu/groups" minHeight="420px" />

### Collapsed

Use the `collapsed` prop in a vertical menu to show only the icons. The menu doesn't set its own width, so size its container to match.

<ComponentPreview name="navigation-menu/collapsed" minHeight="420px" />

### Highlight

Use the `highlight` prop to display a line next to the active item. Use the `highlight-color` prop to change its color.

<ComponentPreview name="navigation-menu/highlight" minHeight="420px" />

### Color

Use the `color` prop to change the color of the active item.

<ComponentPreview name="navigation-menu/color" minHeight="260px" />

### Variant

Use the `variant` prop to change the style of the items. `pill` fills the background of hovered, open and active items; `link` only changes their text color.

<ComponentPreview name="navigation-menu/variant" minHeight="420px" />

### Trailing Icon

Use the `trailing-icon` prop to customize the icon shown on items with children. Defaults to a chevron.

<ComponentPreview name="navigation-menu/trailing-icon" align="start" minHeight="420px" />

### Arrow

Use the `arrow` prop to display an arrow on the dropdown content of a horizontal menu.

<ComponentPreview name="navigation-menu/arrow" align="start" minHeight="420px" />

### Content Orientation

Use the `content-orientation` prop to change the layout of the dropdown content in a horizontal menu. Defaults to `horizontal`. With `vertical`, the content is a single list that moves between triggers inside a shared viewport.

<ComponentPreview name="navigation-menu/content-orientation" align="start" minHeight="420px" />

### Viewport

Use the `viewport` prop with a vertical `content-orientation` to align the viewport with its trigger. Set `align` to `start`, `center` or `end`.

<ComponentPreview name="navigation-menu/viewport" align="start" minHeight="420px" />

### Unmount

Use the `unmount-on-hide` prop to keep the content in the DOM when it closes, for example to preserve form state. Defaults to `true`.

<ComponentPreview name="navigation-menu/unmount" align="start" minHeight="420px" />

## Examples

### Control active item

Use `v-model` to control which item is open, matching the item's `value`. Use `default-value` to set the initial item without binding it. Change the field used for matching with the `value-key` prop.

In a horizontal menu, or with `type="single"`, the model is a `string`. A vertical menu defaults to `type="multiple"` and its model is a `string[]`.

Items without a `value` get one from their position: `item-0`, `item-1` for top-level items and `item-1-0` for nested ones, prefixed with `group-0-` when `items` has several groups.

<ComponentPreview name="navigation-menu/control-active-item" align="start" minHeight="420px" />

### With tooltip in items

Use the `tooltip` prop in a collapsed vertical menu to show each item's label in a [Tooltip](/docs/components/tooltip). Pass an object to configure every tooltip, or set `tooltip` on a single item to always show it.

<ComponentPreview name="navigation-menu/with-tooltip" minHeight="360px" />

### With popover in items

Use the `popover` prop in a collapsed vertical menu to show an item's children in a popover. It opens on hover by default; set `mode: 'click'` to open it on click. Customize its content with the `#item-content` slot.

<ComponentPreview name="navigation-menu/with-popover" minHeight="360px" />

### With chip in items

Use the `chip` property to display a [Badge](/docs/components/badge) dot on an item's icon. Pass an object to set any of its props, such as `color`.

<ComponentPreview name="navigation-menu/with-chip" minHeight="260px" />

### With bottom tab bar

Use the `ui` prop to turn a horizontal menu into a bottom tab bar for mobile layouts.

<ComponentPreview name="navigation-menu/with-bottom-tab-bar" minHeight="160px" />

### With collapsed labels

Use the `ui` prop to show a small label under each icon in a collapsed menu.

<ComponentPreview name="navigation-menu/with-collapsed-labels" minHeight="320px" />

### With custom slot

Use the `slot` property to customize a single item. It renders with the `#<slot>`, `#<slot>-leading`, `#<slot>-label`, `#<slot>-trailing`, `#<slot>-actions` and `#<slot>-content` slots instead of the generic `#item` ones.

<ComponentPreview name="navigation-menu/with-custom-slot" align="start" minHeight="260px" />

### With item actions

Use the `actions` property in a vertical menu to add a ⋮ button at the end of the row that opens a [Dropdown](/docs/components/dropdown) with these items. Entries take an `icon`, `variant: 'danger'` for destructive ones, and an `onSelect` called when they're picked. Add more buttons before it with the `#item-actions` slot, or `#<slot>-actions` for a single item, and style them with the slot's `ui.linkAction()`.

The buttons sit next to the link, not inside it, so they're separate tab stops with their own `aria-label` ("More actions for Reports"). They show on hover, keyboard focus and on the active row, always on touch screens and in the mobile sheet. The row stays highlighted while its menu is open, and the actions are hidden when the menu is `collapsed`.

<ComponentPreview name="navigation-menu/with-actions" minHeight="320px" />

### With trailing slot

Use the `#item-trailing` slot to add content inside each item's link, after the label. Each item has the `group` class, so you can use `group-hover:` utilities. For buttons and menus, prefer [item actions](#with-item-actions), which aren't nested in the link.

<ComponentPreview name="navigation-menu/with-trailing-slot" minHeight="360px" />

### With content slot

Use the `#item-content` slot to replace the dropdown content of an item.

<ComponentPreview name="navigation-menu/with-content-slot" align="start" minHeight="510px" />

### Sidebar

A vertical menu in an app sidebar, with groups, a collapsible section, a badge, a keyboard shortcut and item actions on the projects. Collapse it to switch to icons with tooltips and popovers.

<ComponentPreview name="navigation-menu/sidebar" minHeight="560px" />

## Styling Reference

| `ui` key | Description |
|---|---|
| `root` | The `<nav>` |
| `list` | Each `<ul>` (one per group) |
| `label` | A group heading |
| `item` | An `<li>` |
| `link` | The item's link or button |
| `linkLeadingIcon`, `linkLeadingAvatar`, `linkLeadingChip` | Leading icon, avatar, chip |
| `linkLabel` | The label |
| `linkTrailing` | Wrapper of the trailing content |
| `linkTrailingBadge`, `linkTrailingKbd`, `linkTrailingIcon` | Trailing badge, shortcut, chevron |
| `linkRow` | Wrapper of a vertical link and its actions, only on items with actions |
| `linkActions`, `linkAction` | The actions container and each of its buttons |
| `linkActionsItemIcon` | The icons of the `actions` menu entries |
| `childList`, `childItem`, `childLink` | The children list (accordion content, dropdown content or popover) |
| `separator` | Divider between groups |
| `viewport`, `content`, `indicator`, `arrow` | Horizontal dropdown parts |

### Interactive States

Hovered items get a `bg-default` background with the `pill` variant and `text-foreground` with the `link` variant, on devices that support hover. An open trigger has `data-state="open"`, the active item has `aria-current="page"` when it comes from the router, keyboard focus shows a `:focus-visible` ring, and disabled items have `aria-disabled`.

## API Reference

### Props

<ApiTable component="NavigationMenu" kind="props" />

### Slots

<ApiTable component="NavigationMenu" kind="slots" />

### Emits

<ApiTable component="NavigationMenu" kind="emits" />

### Theme

<ApiTheme component="NavigationMenu" />
