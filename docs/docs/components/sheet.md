---
title: Sheet
description: Swipeable panel with native scroll snapping, resting positions and nested sheets
links:
  reka: dialog
  source: sheet/Sheet.vue
  styles: sheet/theme.ts
  heroui: sheet
---

## Usage

```ts
import { Sheet } from '@hareui/vue'
```

<ComponentPreview name="sheet/basic" />

## Anatomy

A single `Sheet` component owns the whole structure. The first child is the trigger, and the sheet's behavior merges
onto it directly. Everything else comes from props and named slots.

```vue
<Sheet close-button title="Details">
  <Button>Open sheet</Button>
  <template #body>Sheet content</template>
  <template #footer="{ close }">
    <Button @click="close">Done</Button>
  </template>
</Sheet>
```

- `title`: the heading. It also labels the sheet, so keep it when you replace `#header`.
- `handle`: the drag grip, shown by default on `top` and `bottom` sheets.
- `closeButton`: adds a close button to the header.
- `#body`, `#footer`, `#close` and `#content` receive a `close` function for your own buttons.

## Examples

### Placements

Set `placement` to `bottom` (default), `top`, `left` or `right`. It names a physical edge of the screen, so `left` and
`right` stay the same in right-to-left layouts.

<ComponentPreview name="sheet/placements" />

### Snap Points

Numbers are **pixels**, not fractions. Strings are CSS lengths, with percentages relative to the sheet. The sheet
opens at the first point and expands to its full size without listing it, so a trailing `1`, `'1'` or `'100%'` is
ignored.

<ComponentPreview name="sheet/snap-points" />

### Snap Point Model

Bind `v-model:snap-point` to read or set where the sheet rests. The value is an index into `snapPoints`, and
`snapPoints.length` means fully expanded. The sheet opens at this snap point, and setting it while open scrolls the
sheet there. The model updates once a swipe comes to rest at a snap point, not while the sheet moves.

Here the title follows the snap point, and **Show all** sets it to `2`. The page stays undimmed while the sheet rests
at 120px or 400px. The backdrop fades in only as the sheet grows past the last snap point.

<ComponentPreview name="sheet/ride-sheet" />

### Music Player

A mini player rests at an 88px snap point. Swipe up, or drag the handle, for the full player. The header reads
`v-model:snap-point` to swap the mini player for a toolbar, and the chevron sets it back to `0`.

<ComponentPreview name="sheet/music-player" />

### Share Sheet

A bottom sheet with a grid of share targets and a row that copies the link.

<ComponentPreview name="sheet/share-sheet" />

### Backdrop Variants

<ComponentPreview name="sheet/backdrop-variants" />

### Non-Dismissable

`:dismissible="false"` ignores outside presses and swipes. Add `:keyboard-dismissible="false"` to ignore Escape too.
Close controls inside the sheet still work.

<ComponentPreview name="sheet/non-dismissable" />

### Scrollable Content

At a snap point, a swipe expands the sheet. Once it is fully expanded, `#body` scrolls its content. The handle can
also be dragged with a pointer, including a mouse.

<ComponentPreview name="sheet/scrollable-content" />

### With Form

Put form fields in `#body`. Secondary inputs suit the overlay surface.

<ComponentPreview name="sheet/with-form" />

### Detached

`detached` floats the sheet away from the screen edges and rounds every corner.

<ComponentPreview name="sheet/detached" />

### Controlled State

Bind `v-model:open`, or set `default-open` for an uncontrolled sheet. A controlled sheet can leave out the trigger.

<ComponentPreview name="sheet/controlled" />

### Handle Only

The handle is a visible grip that also follows pointer drags. On touch, a swipe anywhere on the panel moves the sheet
until it is fully expanded. With a mouse, drag the handle.

<ComponentPreview name="sheet/handle-only" />

### Nested Sheets

A `Sheet` inside another sheet's slots stacks on top of it: the sheets below shrink back while it is open, and focus
returns to the parent when it closes. Only the bottom-most sheet dims the page.

<ComponentPreview name="sheet/nested" />

### Professions Picker

A search field in `#header` and a virtualized `ListBox` in `#body`, in a sheet that opens at a 355px snap point.
Picking an occupation updates the value and closes the sheet.

<ComponentPreview name="sheet/professions-picker" />

## Customization

The sheet moves by scrolling, never by transforms: style its parts freely, but don't add a translate or transform
entrance animation to `content` or `dialog`.

### Tailwind CSS

`class` merges into `content`. Use `ui` for every other part.

```vue
<Sheet
  close-button
  title="Details"
  class="mx-auto max-w-lg"
  :ui="{ dialog: 'rounded-t-3xl border border-border', header: 'text-center', body: 'px-6 pb-6' }"
>
  <Button variant="secondary">Open sheet</Button>
  <template #body>Sheet content</template>
</Sheet>
```

### Global Configuration

To customize the Sheet classes for the whole app, extend the `sheet` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      sheet: {
        slots: {
          dialog: 'border border-border',
          header: 'text-center',
          body: 'px-6 pb-6',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key       | `data-slot`           | Element                                                                           |
| -------------- | --------------------- | --------------------------------------------------------------------------------- |
| `overlay`      | `sheet-overlay`       | Full-screen layer holding the backdrop and the scroll container                   |
| `backdrop`     | `sheet-backdrop`      | Backdrop behind the sheet                                                         |
| `scroller`     | —                     | Scroll container the sheet moves in (`data-sheet-scroll`)                         |
| `content`      | `sheet-content`       | Sheet sizing and stacking wrapper; `class` merges here                            |
| `dialog`       | `sheet-dialog`        | Dialog surface, which carries `role="dialog"`                                     |
| `header`       | `sheet-header`        | Header section, rendered with a `title`, `#title` or `#header`                    |
| `heading`      | `sheet-heading`       | Title text, which labels the sheet                                                |
| `body`         | `sheet-body`          | Content area that scrolls once the sheet is fully expanded; rendered with `#body` |
| `footer`       | `sheet-footer`        | Footer actions, rendered with `#footer`                                           |
| `handle`       | `sheet-handle`        | Draggable handle area, rendered while `handle` is on                              |
| `handleBar`    | `sheet-handle-bar`    | Visual grip inside the handle                                                     |
| `closeTrigger` | `sheet-close-trigger` | Close button, rendered when `closeButton` is set                                  |

#### Backdrop Variants

- `variant="opaque"` - Dimmed backdrop (default)
- `variant="blur"` - Blurred backdrop
- `variant="transparent"` - Transparent backdrop

Only the bottom-most sheet in a nested stack dims the page.

#### Placement Variants

- `placement="bottom"` - Bottom edge (default)
- `placement="top"` - Top edge (the handle renders below the footer)
- `placement="left"` - Left edge
- `placement="right"` - Right edge

### Interactive States

- **Focus**: `:focus-visible` - applied to the close button
- **Hover**: `:hover` - applied to the close button
- **Disabled**: `:disabled`, `[aria-disabled="true"]` - applied to the close button
- **Dragging**: `[data-dragging]` on `handle` while a handle drag is in progress
- **Expanded**: `[data-expanded]` on `content` once the sheet is fully expanded. The body scrolls from then on
- **Stacking**: `[data-has-descendants]` on `content` while a nested sheet is open above it, and
  `[data-stack-index]` on `backdrop` and `content` (`0` for the bottom-most sheet)
- **Detached**: `[data-detached]` on `content`
- **Snap points**: `[data-snap-points]` on `content` when `snapPoints` is set
- **Entering / Exiting**: `[data-entering]` / `[data-exiting]` on `overlay`
- **Closed**: `[data-closed]` on `overlay` while a closed sheet leaves the screen. It ignores the pointer
- **Placement**: `data-placement="top|bottom|left|right"` on `content` and `dialog`

## API Reference

### Props

<ApiTable component="Sheet" kind="props" />

### Slots

<ApiTable component="Sheet" kind="slots" />

### Emits

<ApiTable component="Sheet" kind="emits" />

## Theme

<ApiTheme component="Sheet" />

## Sheet and Drawer

Both slide in from an edge of the screen. Sheet moves by native scrolling, so it can rest at snap points, follows a
swipe anywhere on the panel and stacks nested sheets. Drawer animates with CSS and is dragged from the panel outside
its body and controls, with no resting positions. Pick Sheet for snap points and nested stacks, Drawer for a plain
side panel.

## Accessibility

Implements the [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
with focus management, keyboard handling and scroll lock:

- **Accessible name**: `title` labels the dialog, shown in the header or visually hidden when you replace the header
- **Focus management**: opening moves focus into the sheet and keeps it there. Closing restores focus to the trigger,
  so closing a nested sheet returns focus to its parent
- **Keyboard**: `Tab` and `Shift+Tab` move between controls. `Escape` closes the sheet unless `keyboardDismissible`
  is `false`
- **Close controls**: the close button and your own buttons calling `close` work from the keyboard, even when the
  sheet isn't dismissible
- **Scroll lock**: page scrolling is locked while the sheet is open. The body scrolls once the sheet is fully
  expanded, and a closing sheet no longer locks the page
- **Drag handle**: hidden from assistive technology and not draggable from the keyboard, so keep a close control
  instead of relying on swipes alone

## Related Components

<RelatedComponents :components="['drawer', 'modal', 'button', 'close-button']" />
