---
title: Tree
description: A hierarchy of expandable folders and files with selection, keyboard navigation and indent guides.
links:
  source: tree/Tree.vue
  styles: tree/theme.ts
---

## Usage

Pass the hierarchy in the `items` prop. An item with `children` is a folder: it shows a chevron and a folder icon, and `defaultExpanded` opens it on first render.

```ts
import { Tree } from '@hareui/vue'
```

<ComponentPreview name="tree/basic" />

## Anatomy

```vue
<Tree :items="items">
  <template #item-wrapper="{ item, level, expanded, selected, ui }" /> <!-- optional: replaces the whole row -->
  <template #item="{ item, expanded, selected }" />         <!-- optional: replaces icon, label and trailing part -->
  <template #item-leading="{ item, expanded, ui }" />       <!-- optional: the icon before the label -->
  <template #item-label="{ item }" />                        <!-- optional -->
  <template #item-trailing="{ item }" />                     <!-- optional: content at the end of the row -->
  <template #empty />                                        <!-- optional: shown when items is empty -->
</Tree>
```

The tree renders a `ul` with `role="tree"`. Every row is a focusable `treeitem` with its level, position and expanded and selected state, and the children of an open folder render in a nested `ul` with `role="group"`. Arrow keys move between rows, Right and Left open and close folders or move to the first child and the parent, Home and End jump to the first and last row, typing a name jumps to it, and Enter or Space selects.

A row's key is its label. When two items can share a label, pass `get-key` to return a unique key.

### File icons

Use the `#item-leading` slot to choose an icon per file type. Bind `ui.linkLeadingIcon()` to keep the size and colour of the default icons.

<ComponentPreview name="tree/icons" />

### Custom icons

Use `indicator-icon`, `expanded-icon` and `collapsed-icon` to replace the chevron and the folder icons. Each takes an icon class or a component; an item's own `icon` still wins over the folder icons.

<ComponentPreview name="tree/custom-icons" />

### Size

Use the `size` prop to change the row height (20, 28 or 36px), the text and icon size, and the indent per level. Defaults to `md`.

<ComponentPreview name="tree/size" />

### Guide lines

Each level draws a vertical line under its parent's chevron. Set `show-guide-lines` to `'hover'` to show them only while the pointer is over the tree, or to `false` to hide them.

<ComponentPreview name="tree/guide-lines" />

### Color

Selected rows get a neutral background. Use `color="accent"` for an accent one.

<ComponentPreview name="tree/color" />

### Disabled

Set `disabled` on an item to skip it in keyboard navigation and ignore clicks, or on the tree to disable every row.

<ComponentPreview name="tree/disabled" />

## Examples

### Selection

Use `v-model` to read or set the selected item. Clicking a folder selects it and opens or closes it.

<ComponentPreview name="tree/model" />

### Multiple selection

Set `multiple` to select several items; `v-model` is then an array. By default each click adds or removes an item. With `selection-behavior="replace"`, as here, a click selects one item, Ctrl or Cmd adds to the selection, and Shift selects a range. Touch screens have no modifier keys, so for phones keep the default or add [checkboxes](#checkboxes).

<ComponentPreview name="tree/multiple" />

### Checkboxes

Set `checkbox` to put a [Checkbox](./checkbox) before each row's chevron; checking it selects the row. Combine it with `multiple`, `propagate-select`, which selects a folder's descendants with it, and `bubble-select`, which selects a folder once all of its children are. A folder with only some of its descendants selected shows a dash. Here the `select` event cancels selection by click, so a click on a row only opens it.

<ComponentPreview name="tree/checkbox" />

### Control the expanded folders

Use `v-model:expanded` to read or set the keys of the open folders.

<ComponentPreview name="tree/expanded" />

### Trailing content

Use the `#item-trailing` slot to add content at the end of each row, like a change status.

<ComponentPreview name="tree/trailing" />

### Filter

Filter the `items` you pass, and open the folders that still have a match with `v-model:expanded`. The `empty` prop sets the line shown when nothing matches; use the `#empty` slot for richer content. The trailing slot shows a line count for each changed file.

<ComponentPreview name="tree/filter" />

### Per-item slots

Set the `slot` field of an item to give it its own slots: `#<slot>`, `#<slot>-leading`, `#<slot>-label`, `#<slot>-trailing` and `#<slot>-wrapper`. Extra item fields are available in the slot props.

<ComponentPreview name="tree/item-slot" />

### Custom rows

The `#item-wrapper` slot replaces the whole row, chevron and guide lines included. Its root element becomes the `treeitem`, so render a single element; `ui.link()` and the `--tree-level` style keep the row padding and indent.

<ComponentPreview name="tree/wrapper" />

### Events

The `select` and `toggle` events fire before the change, with the event and the item; `event.preventDefault()` cancels it. Here folders open without being selected. An item's own `onSelect` or `onToggle` replaces the event for that item: the Spam folder cancels its toggle and stays closed.

<ComponentPreview name="tree/events" />

### Changing items

The tree follows changes to `items`. Return a stable key with `get-key` when labels change or repeat.

<ComponentPreview name="tree/dynamic" />

### Flat rendering

With `:nested="false"`, every visible row renders as a sibling instead of inside its parent's group. It looks the same, but folders open without the height animation.

<ComponentPreview name="tree/flat" />

### Virtualize

Set `virtualize` to render only the rows in view, for trees with hundreds or thousands of rows. The tree needs a fixed height, and renders flat. Pass `{ overscan, estimateSize }` to tune it; `estimateSize` defaults to the row height of the size.

<ComponentPreview name="tree/virtualize" />

## Motion

Folders open and close with a 200ms height and opacity animation, and the chevron turns in 150ms. Both are switched off when the user prefers reduced motion.

## API

### Props

<ApiTable component="Tree" kind="props" />

### Slots

<ApiTable component="Tree" kind="slots" />

### Emits

<ApiTable component="Tree" kind="emits" />

## Theme

<ApiTheme component="Tree" />
