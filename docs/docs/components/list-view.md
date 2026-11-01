---
title: ListView
description: A single-column list of rows with keyboard navigation, selection checkboxes, row actions and links.
links:
  source: list-view/ListView.vue
  styles: list-view/theme.ts
---

## Usage

Pass the rows in the `items` prop. Each item needs a `value` and a `label`, and can have a `description` and an `icon`.
Set `selectable` to put a checkbox in each row, and bind the selection with `v-model`.

```ts
import { ListView } from '@hareui/vue'
```

<ComponentPreview name="list-view/basic" />

## Anatomy

```vue
<ListView :items="items" aria-label="Files">
  <template #item="{ item, selected }" />        <!-- optional: replaces icon, label and description -->
  <template #item-leading="{ item, ui }" />       <!-- optional: the icon before the label -->
  <template #item-label="{ item }" />             <!-- optional -->
  <template #item-description="{ item }" />       <!-- optional -->
  <template #item-action="{ item, disabled }" />  <!-- optional: buttons or a menu at the end of the row -->
  <template #empty />                             <!-- optional: shown when items is empty -->
</ListView>
```

The list renders one row per item: an optional checkbox, the icon, the label and description, and the
`#item-action` content at the end.

## Examples

### Selection

- By default rows have no checkbox and no selected state. They can still be pressed.
- `selectable`: one row at a time; `v-model` holds a value or `null`.
- `selectable` with `multiple`: any number of rows; `v-model` holds an array.

<ComponentPreview name="list-view/selection" />

### Secondary Variant

The default `primary` variant sets the rows on a grey card, as in the first example. `variant="secondary"` drops the
card, for a list that already sits on a surface. Selected rows get an accent tint.

<ComponentPreview name="list-view/secondary" />

### Disabled Items

Set `disabled` on an item to skip it with the keyboard and ignore presses. It can't be selected. Here the
`#item-action` slot shows a lock on the disabled rows.

<ComponentPreview name="list-view/disabled" />

### Row Actions

Put buttons or a [Dropdown](./dropdown) in the `#item-action` slot. Clicking them doesn't press the row, and
ArrowRight moves keyboard focus into them.

<ComponentPreview name="list-view/item-action" />

### Action on Press

Listen to `action` to make rows actionable: a press or Enter emits the row's `value`. In a selectable list, a press
runs the action only while nothing is selected. Once a row is checked, presses select instead.

<ComponentPreview name="list-view/action" />

### Links

Give items `href`, or `to` for vue-router, and a press or Enter opens the link. Ctrl/Cmd opens it in a new tab, as on a
normal link. The row itself stays a grid row, not an `<a>`.

<ComponentPreview name="list-view/links" />

### Selection Behaviour

By default a press adds or removes the row (`selection-behavior="toggle"`), which suits touch screens. With
`selection-behavior="replace"` the list works like a file manager:

- A press selects the row alone. Ctrl/Cmd+press adds or removes it; Shift+press selects a range.
- The selection follows the arrow keys. Hold Ctrl/Cmd to move without selecting.
- A double click or Enter runs the action.
- On a touch screen a tap runs the action (or toggles the row when nothing listens to `action`), and the checkboxes
  select.

<ComponentPreview name="list-view/replace" />

### Custom Content

Use `#item-leading` for an avatar and `#item-description` for richer secondary text. The slots receive the `item` with
its extra fields, typed from `items`. To render one item differently, give it a `slot` name: it then uses `#{slot}`,
`#{slot}-leading` and the other `{slot}-` slots instead of the `item-` ones.

<ComponentPreview name="list-view/item-slots" />

### Empty State

With no items the list shows "No results found". Put your own content, such as an [EmptyState](./empty-state), in the
`#empty` slot.

<ComponentPreview name="list-view/empty" />

### With ActionBar

Show bulk actions while rows are selected: bind the [ActionBar](./action-bar)'s `open` to `selected.length > 0`.

<ComponentPreview name="list-view/with-action-bar" contain="30rem" />

### Virtualize

Set `virtualize` to render only the rows in view, for lists with thousands of rows. Give the list a fixed height (here
`h-96`); it then scrolls itself. To tune it, pass `{ estimateSize, overscan }` (48 px and 5 rows by default).

<ComponentPreview name="list-view/virtualize" />

## Accessibility

The list renders `role="grid"`, each row a `row` with one `gridcell`, named by its `label`. Give the list a name with
`aria-label` or `aria-labelledby`.

The list is a single tab stop. Tab focuses the row focused last, else the first selected row, else the first row. Tab
and Shift+Tab leave the list.

| Key                         | Action                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| ArrowDown / ArrowUp         | Move to the next or previous row. Disabled rows are skipped, and focus doesn't wrap.             |
| Home / End                  | Move to the first or last row.                                                                   |
| PageDown / PageUp           | Move one screen of rows down or up.                                                              |
| ArrowRight / ArrowLeft      | Move from the row into the controls of its `#item-action` slot, one by one, and back to the row. |
| Space                       | Select or deselect the row.                                                                      |
| Enter                       | Run the row's action or open its link; select it when it has neither.                            |
| Shift + ArrowDown / ArrowUp | Extend a multiple selection.                                                                     |
| Ctrl/Cmd + A                | Select every enabled row.                                                                        |
| Escape                      | Clear the selection.                                                                             |
| Letters                     | Move to the next row whose label starts with what you typed.                                     |

The selection checkbox isn't a tab stop: Space and the pointer toggle it, so the arrow keys go straight to the row's
actions.

## API Reference

### Props

<ApiTable component="ListView" kind="props" />

### Slots

<ApiTable component="ListView" kind="slots" />

### Emits

<ApiTable component="ListView" kind="emits" />

## Theme

<ApiTheme component="ListView" />
