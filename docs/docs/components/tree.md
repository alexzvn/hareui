---
title: Tree
description: A hierarchy of expandable folders and files with selection, keyboard navigation and indent guides.
links:
  source: tree/Tree.vue
  styles: tree/theme.ts
---

## Usage

Pass the hierarchy in the `items` prop. An item with `children` is a folder, with a chevron and a folder icon. Set `defaultExpanded` on it to open it on first render.

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

The tree renders a `ul` with `role="tree"`. Every row is a focusable `treeitem` that reports its level, position, and expanded and selected state. The children of an open folder render in a nested `ul` with `role="group"`.

On the keyboard:

- Up and Down move between rows.
- Right opens a folder or moves to its first child. Left closes it or moves to the parent.
- Home and End jump to the first and last row.
- Typing a name jumps to it.
- Enter or Space selects.

A row's key is its label. When two items can share a label, pass `get-key` to return a unique key.

### File icons

Use the `#item-leading` slot to choose an icon per file type. Bind `ui.linkLeadingIcon()` to keep the size and colour of the default icons.

<ComponentPreview name="tree/icons" />

### Custom icons

Use `indicator-icon`, `expanded-icon` and `collapsed-icon` to replace the chevron and the folder icons. Each takes an icon class or a component. An item's own `icon` still wins over the folder icons.

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

Set `multiple` to select several items. `v-model` is then an array, and by default each click adds or removes an item.

With `selection-behavior="replace"`, as here, a click selects one item. Ctrl or Cmd adds to the selection, and Shift selects a range. Touch screens have no modifier keys, so for phones keep the default or add [checkboxes](#checkboxes).

<ComponentPreview name="tree/multiple" />

### Checkboxes

Set `checkbox` to put a [Checkbox](./checkbox) before each row's chevron. Checking it selects the row. Combine it with:

- `multiple`, to check several rows.
- `propagate-select`, which selects a folder's descendants with it.
- `bubble-select`, which selects a folder once all of its children are.

A folder with only some of its descendants selected shows a dash. Here the `select` event cancels selection by click, so a click on a row only opens it.

<ComponentPreview name="tree/checkbox" />

### Control the expanded folders

Use `v-model:expanded` to read or set the keys of the open folders.

<ComponentPreview name="tree/expanded" />

### Trailing content

Use the `#item-trailing` slot to add content at the end of each row, like a change status.

<ComponentPreview name="tree/trailing" />

### Filter

Filter the `items` you pass, and open the folders that still have a match with `v-model:expanded`. The `empty` prop sets the line shown when nothing matches. Use the `#empty` slot for richer content. The trailing slot shows a line count for each changed file.

<ComponentPreview name="tree/filter" />

### Per-item slots

Set the `slot` field of an item to give it its own slots:

- `#<slot>-leading`, `#<slot>-label` and `#<slot>-trailing` for the parts of the row
- `#<slot>` for the row content after the chevron
- `#<slot>-wrapper` for the whole row, including the checkbox, chevron and guide lines

Extra item fields are available in the slot props.

<ComponentPreview name="tree/item-slot" />

### Custom rows

The `#item-wrapper` slot replaces the whole row, chevron and guide lines included. Its root element becomes the `treeitem`, so render a single element. Bind `ui.link()` and the `--tree-level` style to keep the row padding and indent.

<ComponentPreview name="tree/wrapper" />

### Events

The `select` and `toggle` events fire before the change, with the event and the item. Call `event.preventDefault()` to cancel the change. Here folders open without being selected.

An item's own `onSelect` or `onToggle` replaces the event for that item. The Spam folder cancels its toggle and stays closed.

<ComponentPreview name="tree/events" />

### Changing items

The tree follows changes to `items`. Return a stable key with `get-key` when labels change or repeat.

<ComponentPreview name="tree/dynamic" />

### Drag and drop

Set `draggable` to move rows by dragging them. Press a row and move the pointer: a copy of the row follows it. Drop the row before or after another row, or inside a folder. Rest on a collapsed folder to open it and drop between its rows. Use `can-drop` to return `false` for the spots you don't allow. A folder never drops into itself. Here only images go in `public`.

<ComponentPreview name="tree/drag-and-drop" />

The tree doesn't change `items`. It emits `move`, and `moveTreeItems` applies it:

```vue
<Tree :items="items" draggable @move="items = moveTreeItems(items, $event)" />
```

Dragging a selected row moves every selected row, in tree order. The copy under the pointer then shows how many rows you drag. A moved folder takes its rows along. A drop inside a collapsed folder opens it, so you see where the rows went.

`draggable` isn't native HTML drag and drop: nothing drops in from outside the tree.

On the keyboard, Enter picks up the focused row instead of selecting it. Space still selects. The arrow keys step through the spots, and Home and End jump to the first and last. Right opens the collapsed folder you're inside. Enter or Space drops, and Escape cancels. Each step and the drop are announced to screen readers.

On a touch screen, hold a row before dragging it, so a swipe still scrolls. Press Escape during a pointer drag to cancel it.

While dragging, the tree scrolls near its edges, so it works with `virtualize` too. To style custom rows:

- The dragged rows set `data-dragging`.
- The target row sets `data-drop-target` to before, after or inside.

#### Reorder only

Return `false` from `can-drop` for `inside` and for other parents, and rows only change places with their siblings. Here pages stay in their chapter.

<ComponentPreview name="tree/drag-reorder-only" />

### Flat rendering

With `:nested="false"`, every visible row renders as a sibling instead of inside its parent's group. It looks the same, but folders open without the height animation.

<ComponentPreview name="tree/flat" />

### Virtualize

Set `virtualize` to render only the rows in view, for trees with hundreds or thousands of rows. The tree needs a fixed height, and renders flat. Pass `{ overscan, estimateSize }` to tune it. `estimateSize` defaults to the row height of the size.

<ComponentPreview name="tree/virtualize" />

## Styling Reference

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Tree component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/tree/tree.css)):

#### Base Classes

- `.h-tree` - Base tree container
- `.h-tree__item` - A tree item
- `.h-tree__group` - The nested list of a folder's children
- `.h-tree__link` - The row of a tree item
- `.h-tree__guide-line` - The guide line of an ancestor level
- `.h-tree__chevron` - The expand and collapse chevron
- `.h-tree__link-indicator` - The row's selection indicator
- `.h-tree__label` - The row label
- `.h-tree__trailing` - The trailing content of a row
- `.h-tree__drop-indicator` - The drop position line shown while dragging
- `.h-tree__empty` - The empty state

#### Size Classes

- `.h-tree--sm` - Small rows
- `.h-tree--md` - Medium rows (default)
- `.h-tree--lg` - Large rows

#### Variant Classes

- `.h-tree--accent` - Accent selection color

#### Modifier Classes

- `.h-tree--guide-lines-false` - Hides the guide lines
- `.h-tree--guide-lines-hover` - Shows the guide lines only while the tree is hovered

The default color and the default `showGuideLines` value add no class. Icon and checkbox parts keep plain utilities.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

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
