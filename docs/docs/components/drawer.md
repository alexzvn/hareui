---
title: Drawer
description: Slide-out panel for supplementary content and actions
links:
  reka: dialog
  source: Drawer.vue
  styles: drawer.ts
  heroui: drawer
---

## Usage

```ts
import { Drawer } from 'herouse'
```

<ComponentPreview name="drawer/basic" />

## Anatomy

A single `Drawer` component owns the whole structure. The first child is the trigger
(`as-child`, merged directly onto its own root element); everything else is supplied
through props and named slots.

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

`handle` adds the optional drag handle, `closeButton` (on by default) the close button.
`ui` keys: `backdrop`, `content`, `dialog`, `handle`, `header`, `heading`, `body`, `footer`,
`closeTrigger`.

## Examples

### Placement

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

<ComponentPreview name="drawer/controlled" />

### With Form

<ComponentPreview name="drawer/with-form" />

### Navigation Drawer

<ComponentPreview name="drawer/navigation" />

### Backdrop Variants

<ComponentPreview name="drawer/backdrop-variants" />

## Customization

### Tailwind CSS

<ComponentPreview name="drawer/custom-styles" />

### Global Configuration

To customize the Drawer classes for the whole app, extend the `drawer` theme in `createHeroUse`:

```ts
app.use(createHeroUse({
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
}))
```

## Styling Reference

| `ui` key | `data-slot` | Element |
|---|---|---|
| `backdrop` | `drawer-backdrop` | Overlay backdrop behind the drawer (Reka `DialogOverlay`) |
| `content` | `drawer-content` | Positioning wrapper for the drawer panel |
| `dialog` | `drawer-dialog` | The drawer panel itself (Reka `DialogContent`); `class` merges here |
| `header` | `drawer-header` | Header section for titles |
| `heading` | `drawer-heading` | Main title text (Reka `DialogTitle`) |
| `body` | `drawer-body` | Main scrollable content area, rendered when `#body` is present |
| `footer` | `drawer-footer` | Footer section for actions, rendered when `#footer` is present |
| `handle` | `drawer-handle` | Visual drag handle indicator (bar: `data-slot="drawer-handle-bar"`), rendered when `handle` is `true` |
| `closeTrigger` | `drawer-close-trigger` | Close button, rendered when `closeButton` is `true` |

#### Backdrop Variants

- `variant="opaque"` - Opaque colored backdrop (default)
- `variant="blur"` - Blurred backdrop with glass effect
- `variant="transparent"` - Transparent backdrop (no overlay)

#### Placement Variants

- `placement="bottom"` - Slides up from the bottom edge (default)
- `placement="top"` - Slides down from the top edge (the handle renders below the footer)
- `placement="left"` - Slides in from the left edge
- `placement="right"` - Slides in from the right edge

### Interactive States

- **Focus**: `:focus-visible` - applied to the trigger and close button
- **Hover**: `:hover` - applied to the close button on hover
- **Active**: `:active` - applied to the trigger and close button when pressed
- **Entering / Exiting**: `data-[state=open]` / `data-[state=closed]` on `backdrop`, `content`
  and `dialog`, mapped from HeroUI's `[data-entering]` / `[data-exiting]`. The panel slide is a
  CSS animation (Reka waits for animations, not transitions, before unmounting) with HeroUI's
  distance, durations (250ms in, 200ms out) and easing
- **Placement**: `data-placement="top|bottom|left|right"` on `content` and `dialog`

## API Reference

### Props

<ApiTable component="Drawer" kind="props" />

### Slots

<ApiTable component="Drawer" kind="slots" />

### Emits

<ApiTable component="Drawer" kind="emits" />

## Accessibility

Implements the [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
via Reka UI's `Dialog` primitive:

- **Focus trap**: focus is locked within the drawer while open
- **Keyboard**: `Escape` closes it (unless `keyboardDismissible` is `false`), `Tab` cycles elements
- **Screen readers**: the dialog always has an accessible name, either the rendered title or a
  visually hidden one
- **Scroll lock**: body scroll is disabled while open
- **Drag to dismiss**: pointer drags towards the drawer's edge on the handle, header and footer
  areas close it (when `dismissible`); controls and the body are excluded

## Related Components

- [Modal](/docs/components/modal)
- [Button](/docs/components/button)
- [CloseButton](/docs/components/close-button)
- [AlertDialog](/docs/components/alert-dialog)
