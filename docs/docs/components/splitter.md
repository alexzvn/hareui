---
title: Splitter
description: Panels in a row or column, separated by handles that resize them by drag or keyboard.
links:
  source: splitter/Splitter.vue
  styles: splitter/theme.ts
---

## Usage

Pass the panels as `items` and fill each one with the slot named in its `slot` key. A resize handle sits between each pair of panels.

```ts
import { Splitter } from '@hareui/vue'
```

<ComponentPreview name="splitter/basic" />

A splitter takes the full size of its parent; the parent needs a set height for the panels to show.

## Anatomy

```vue
<Splitter :items="items">
  <template #[item.slot]="{ item, index, collapsed, collapse, expand, resize }" /> <!-- one per panel -->
  <template #panel-0="{ item, index, collapsed, collapse, expand, resize }" />     <!-- panels without a `slot` key -->
  <template #resize-handle="{ index }" />                                          <!-- optional: replaces the grip -->
</Splitter>
```

### Items

Each item describes one panel:

- `id?: string`: a stable panel id.
- `defaultSize?: number`: the size until the user resizes it. Panels without one share the space left.
- `minSize?: number` and `maxSize?: number`: the size range a drag can reach.
- `collapsible?: boolean` and `collapsedSize?: number`: lets the panel collapse to `collapsedSize` (default `0`) when dragged below `minSize`.
- `sizeUnit?: '%' | 'px'`: sizes are percentages of the splitter by default; use `'px'` for fixed pixel sizes.
- `order?: number`: the panel's position, needed when panels are rendered conditionally.
- `slot?: string`: the name of the slot that fills the panel.
- `class?: ClassValue` and `ui?: { panel?: ClassValue }`: classes for the panel. Put padding on an element inside the panel, not on the panel itself: the panel's padding adds to its size, so it no longer matches its sizes and can't collapse below the padding. The panel clips content that doesn't fit.

When an item has no `slot`, fill its panel with `#panel-0`, `#panel-1` and so on, by position. Any other fields on the item reach the slot through `item`.

### Orientation

Set `orientation` to `vertical` to place the panels one above the other, with handles that move up and down.

<ComponentPreview name="splitter/vertical" />

### Type

Use the `type` prop to choose the handle's affordance:

- `line` (default): a 1px line.
- `drag`: a line with a small chip of grip dots at its centre.
- `pill`: a line with a short rounded bar at its centre.
- `handle`: the pill grip alone, with no line between the panels.

<ComponentPreview name="splitter/types" />

### Variant

Use the `variant` prop to match the line to the surface the splitter sits on: `primary` (default) for the page background, `secondary` for a surface, `tertiary` for a secondary surface.

<ComponentPreview name="splitter/variants" />

### Indicator

Use the `indicator` prop to add the pill grip to `line` handles.

<ComponentPreview name="splitter/indicator" />

### Disabled

Use the `disabled` prop to lock the current layout. The handles fade and ignore pointer and keyboard input.

<ComponentPreview name="splitter/disabled" />

## Keyboard

Handles are focusable `separator`s. Their `aria-valuenow`, `aria-valuemin` and `aria-valuemax` report the size of the panel before them.

| Key                        | Action                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `ArrowLeft` / `ArrowRight` | Moves a horizontal handle by `keyboard-resize-by` (default `10`, a percentage of the splitter)           |
| `ArrowUp` / `ArrowDown`    | Moves a vertical handle by `keyboard-resize-by`                                                          |
| `Home` / `End`             | Moves the handle as far as the panel sizes allow                                                         |
| `Enter`                    | Collapses or expands the collapsible panel next to the handle (the one before it, else the one after it) |
| `F6` / `Shift+F6`          | Moves focus to the next or previous handle                                                               |

## Examples

### Collapsible panel

A collapsible item folds to `collapsedSize` once a drag pushes it past its `minSize`. The `collapse` and `expand` events fire with the panel's index. To collapse it from outside, call `collapse()` or `expand()` on the panel in the exposed `panelsRef` array.

<ComponentPreview name="splitter/collapsible" />

### Collapsed size

A `collapsedSize` above zero leaves a strip of the folded panel on screen, enough for an icon rail. The panel slot receives `collapsed`, `collapse()` and `expand()`. This example sizes the panel in pixels with `sizeUnit: 'px'`.

<ComponentPreview name="splitter/collapsed-size" />

### Nested splitters

Put a `Splitter` inside a panel to build two-dimensional layouts. Give each splitter its own `id`.

<ComponentPreview name="splitter/nested" />

### Custom handle

Restyle the handle with `ui.handle` and replace its grip with the `resize-handle` slot. The handle carries `data-state="hover"` while a pointer is within reach and `data-state="drag"` while it is dragged.

<ComponentPreview name="splitter/custom-handle" />

### Persistence

Set `auto-save-id` to save the layout to `localStorage` and restore it on the next visit. Resize the panels, then reload the page. The `layout` event fires with every panel's size as it changes.

<ComponentPreview name="splitter/persistence" />

Pass a `storage` object with `getItem(name)` and `setItem(name, value)` to save somewhere else, such as a cookie the server can read. With server rendering, give the splitter an `id` too, so the server and the browser agree on the panel ids.

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      splitter: {
        slots: { handle: 'data-[state=drag]:bg-accent' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key    | `data-slot`          | Description                                                                                                 |
| ----------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `root`      | `splitter`           | The group element. Carries `data-orientation`                                                               |
| `panel`     | `splitter-panel`     | Each panel. Carries `data-state="collapsed"` / `"expanded"` when collapsible                                |
| `handle`    | `splitter-handle`    | Each resize handle (`role="separator"`). Carries `data-state`, `data-type`, `data-variant`, `data-disabled` |
| `indicator` | `splitter-indicator` | The pill or drag grip centred on the handle                                                                 |
| `icon`      | none                 | The grip dots of the `drag` type                                                                            |

## API Reference

### Props

<ApiTable component="Splitter" kind="props" />

### Slots

<ApiTable component="Splitter" kind="slots" />

### Emits

<ApiTable component="Splitter" kind="emits" />

## Theme

<ApiTheme component="Splitter" />

## Related Components

<RelatedComponents :components="['dashboard-sidebar', 'separator']" />
