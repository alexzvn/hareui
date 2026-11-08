---
title: Drawer
description: Slide-out panel for supplementary content and actions
links:
  reka: dialog
  source: drawer/Drawer.vue
  styles: drawer/theme.ts
  heroui: drawer
---

## Usage

```ts
import { Drawer } from '@hareui/vue'
```

<ComponentPreview name="drawer/basic" />

## Anatomy

A single `Drawer` component owns the whole structure. The first child becomes the trigger, merged onto its own root element.
Everything else comes from props and named slots.

```vue
<Drawer handle placement="bottom" title="Heading">
  <Button>Open Drawer</Button>
  <template #body>Body content</template>
  <template #footer="{ close }">
    <Button variant="secondary" @click="close">Cancel</Button>
    <Button @click="close">Confirm</Button>
  </template>
</Drawer>
```

- `handle`: adds the optional drag handle.
- `closeButton`: the close button, on by default.

## Examples

### Placement

`placement` names a physical side of the screen: `left` and `right` stay the same in right-to-left layouts.

<ComponentPreview name="drawer/placements" />

### Non-Dismissable

Set `:dismissible="false"` to prevent closing by clicking outside or dragging. The user must
interact with the drawer's action buttons.

<ComponentPreview name="drawer/non-dismissable" />

### Scrollable Content

The `#body` area automatically handles overflow with native scrolling. Drag-to-dismiss is
excluded from the body area to avoid scroll conflicts.

<ComponentPreview name="drawer/scrollable-content" />

### Controlled State

Bind `v-model:open` to open the drawer from anywhere, here a button outside it.

<ComponentPreview name="drawer/controlled" />

### With Form

<ComponentPreview name="drawer/with-form" />

### Navigation Drawer

<ComponentPreview name="drawer/navigation" />

### Backdrop Variants

<ComponentPreview name="drawer/backdrop-variants" />

### Custom Close Button

Set `closeButton` to `false` to hide the close button. To customise it, pass an object with an `icon` and a `label`. The `label` is its accessible name.

<ComponentPreview name="drawer/custom-close-button" />

### Events

| Event           | Fires when                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| `enter`         | the open animation starts                                                                                    |
| `after:enter`   | the open animation ends                                                                                      |
| `leave`         | the close animation starts                                                                                   |
| `after:leave`   | the drawer has left the page                                                                                 |
| `close:prevent` | Escape, a backdrop click or a closing swipe is ignored because `keyboardDismissible` or `dismissible` is off |

Without an animation, `after:enter` and `after:leave` fire right away. This drawer ignores Escape and backdrop clicks,
so try them to see `close:prevent`.

<ComponentPreview name="drawer/events" />

## Customization

### Tailwind CSS

<ComponentPreview name="drawer/custom-styles" />

### Global Configuration

To customize the Drawer classes for the whole app, extend the `drawer` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      drawer: {
        slots: {
          backdrop: 'bg-gradient-to-br from-black/50 to-black/70',
          dialog: 'rounded-2xl border border-white/10 shadow-2xl',
          header: 'text-center',
          closeTrigger: 'rounded-full bg-white/10 hover:bg-white/20',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key       | `data-slot`            | Element                                                                                               |
| -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `backdrop`     | `drawer-backdrop`      | Overlay backdrop behind the drawer                                                                    |
| `content`      | `drawer-content`       | Positioning wrapper for the drawer panel                                                              |
| `dialog`       | `drawer-dialog`        | The drawer panel itself, which carries `role="dialog"`; `class` merges here                           |
| `header`       | `drawer-header`        | Header section for titles                                                                             |
| `heading`      | `drawer-heading`       | Main title text, which labels the drawer                                                              |
| `body`         | `drawer-body`          | Main scrollable content area, rendered when `#body` is present                                        |
| `footer`       | `drawer-footer`        | Footer section for actions, rendered when `#footer` is present                                        |
| `handle`       | `drawer-handle`        | Visual drag handle indicator (bar: `data-slot="drawer-handle-bar"`), rendered when `handle` is `true` |
| `closeTrigger` | `drawer-close-trigger` | Close button, rendered unless `closeButton` is `false`                                                |

#### Backdrop Variants

- `variant="opaque"` - Opaque colored backdrop (default)
- `variant="blur"` - Blurred backdrop with glass effect
- `variant="transparent"` - Transparent backdrop (no overlay)

#### Placement Variants

- `placement="bottom"` - Slides up from the bottom edge (default)
- `placement="top"` - Slides down from the top edge (the handle renders below the footer)
- `placement="left"` - Slides in from the left edge
- `placement="right"` - Slides in from the right edge

In right-to-left layouts `left` and `right` still dock on that physical side.

### Interactive States

- **Focus**: `:focus-visible` - applied to the trigger and close button
- **Hover**: `:hover` - applied to the close button on hover
- **Active**: `:active` - applied to the trigger and close button when pressed
- **Entering / Exiting**: `data-[state=open]` / `data-[state=closed]` on the backdrop, content and dialog parts.
  The panel slides with a CSS animation: 250ms in, 200ms out, with fixed easing.
  The panel waits for animations, not transitions, before unmounting.
- **Placement**: `data-placement="top|bottom|left|right"` on `content` and `dialog`

## API Reference

### Props

<ApiTable component="Drawer" kind="props" />

### Slots

<ApiTable component="Drawer" kind="slots" />

### Emits

<ApiTable component="Drawer" kind="emits" />

## Theme

<ApiTheme component="Drawer" />

## Accessibility

Implements the [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
with focus management, keyboard handling and scroll lock:

- **Focus trap**: focus is locked within the drawer while open
- **Keyboard**: `Escape` closes it, unless `keyboardDismissible` is `false`. `Tab` cycles elements.
  A scrollable body is not a tab stop of its own
- **Screen readers**: the dialog always has an accessible name, either the rendered title or a
  visually hidden one
- **Scroll lock**: body scroll is disabled while open
- **Drag to dismiss**: dragging the handle, header or footer towards the drawer's edge closes it, when `dismissible`.
  Controls and the body don't start a drag

## Related Components

<RelatedComponents :components="['modal', 'button', 'close-button', 'alert-dialog']" />
