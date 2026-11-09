---
title: Modal
description: Dialog overlay for focused user interactions and important content
links:
  reka: dialog
  source: modal/Modal.vue
  styles: modal/theme.ts
  heroui: modal
---

## Usage

```ts
import { Modal } from '@hareui/vue'
```

<ComponentPreview name="modal/default" />

## Anatomy

A single `Modal` component owns the whole structure — the first child is the trigger
(`as-child`, merged directly onto its own root element), everything else is supplied
through named slots.

```vue
<Modal>
  <Button>Open Modal</Button>
  <template #icon><!-- optional icon --></template>
  <template #title>Heading</template>
  <template #description><p>Optional supporting text</p></template>
  <template #body>Body content</template>
  <template #footer="{ close }">
    <Button @click="close">Continue</Button>
  </template>
</Modal>
```

## Examples

### Sizes

<ComponentPreview name="modal/sizes" />

### Placement

<ComponentPreview name="modal/placements" />

### Scroll Behavior

<ComponentPreview name="modal/scroll-comparison" />

### Controlled State

<ComponentPreview name="modal/controlled" />

### With Form

<ComponentPreview name="modal/with-form" />

### Custom Trigger

<ComponentPreview name="modal/custom-trigger" />

### Backdrop Variants

<ComponentPreview name="modal/backdrop-variants" />

### Custom Backdrop

<ComponentPreview name="modal/custom-backdrop" />

### Dismiss Behavior

<ComponentPreview name="modal/dismiss-behavior" />

### Close Methods

The `#footer`, `#body` and `#content` slots receive a `close` function. `#content` replaces the whole dialog, so set `title` too. The title stays as the dialog's accessible name, visually hidden.

<ComponentPreview name="modal/close-methods" />

### Custom Animations

<ComponentPreview name="modal/custom-animations" />

### Custom Portal

<ComponentPreview name="modal/custom-portal" />

### Custom Close Button

Set `closeButton` to `false` to hide the close button. To customise it, pass an object with an `icon` and a `label`, which is its accessible name.

<ComponentPreview name="modal/custom-close-button" />

### Events

| Event           | Fires when                                                         |
| --------------- | ------------------------------------------------------------------ |
| `enter`         | the open animation starts                                          |
| `after:enter`   | the open animation ends                                            |
| `leave`         | the close animation starts                                         |
| `after:leave`   | the modal has left the page                                        |
| `close:prevent` | Escape or a backdrop click is ignored because `dismissible` is off |

Without an animation, `after:enter` and `after:leave` fire right away. This modal ignores Escape and backdrop clicks,
so try them to see `close:prevent`.

<ComponentPreview name="modal/events" />

## Customization

### Tailwind CSS

<ComponentPreview name="modal/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      modal: {
        slots: { dialog: 'rounded-2xl' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key       | `data-slot`           | Element                                                                                                                     |
| -------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `backdrop`     | `modal-backdrop`      | The full-screen overlay behind the dialog                                                                                   |
| `container`    | `modal-container`     | Positioning wrapper with placement support                                                                                  |
| `dialog`       | `modal-dialog`        | The dialog surface, which carries `role="dialog"`; `class` merges here                                                      |
| `header`       | `modal-header`        | Header section for the icon, title and description, rendered when `#header`, `#icon`, `#description`, or a title is present |
| `icon`         | `modal-icon`          | Icon wrapper rendered before the title, rendered when `#icon` is present                                                    |
| `heading`      | `modal-heading`       | The title, which labels the dialog                                                                                          |
| `body`         | `modal-body`          | The scrollable content area, rendered when `#body` is present                                                               |
| `footer`       | `modal-footer`        | Footer section for actions, rendered when `#footer` is present                                                              |
| `closeTrigger` | `modal-close-trigger` | The default close button, rendered unless `closeButton` is `false`                                                          |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Modal component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/modal/modal.css)):

#### Base Classes

- `.h-modal__backdrop` - Overlay backdrop behind the modal
- `.h-modal__container` - Positioning wrapper with placement support
- `.h-modal__dialog` - Modal content container
- `.h-modal__header` - Header section for titles and icons
- `.h-modal__heading` - Title text
- `.h-modal__icon` - Icon wrapper before the title
- `.h-modal__body` - Main content area
- `.h-modal__footer` - Footer section for actions

The close button carries the [CloseButton](/docs/components/close-button) classes. `placement` adds no class: the container and dialog read their `data-placement` attribute.

#### Backdrop Variants

- `.h-modal__backdrop--opaque` - Opaque colored backdrop (default)
- `.h-modal__backdrop--blur` - Blurred backdrop with glass effect
- `.h-modal__backdrop--transparent` - Transparent backdrop (no overlay)

#### Scroll Variants

- `.h-modal__dialog--scroll-inside` - Constrains modal height for body scrolling (default)
- `.h-modal__body--scroll-inside` - Makes only the body scrollable (default)
- `.h-modal__container--scroll-outside` - Enables scrolling the entire modal
- `.h-modal__dialog--scroll-outside` - Lets the dialog grow with its content
- `.h-modal__body--scroll-outside` - Allows full-page scrolling

#### Size Classes

- `.h-modal__dialog--xs` - Extra small width
- `.h-modal__dialog--sm` - Small width
- `.h-modal__dialog--md` - Medium width (default)
- `.h-modal__dialog--lg` - Large width
- `.h-modal__dialog--cover` - Fills the container, keeping its padding
- `.h-modal__dialog--full` - Fills the whole viewport, without radius or shadow
- `.h-modal__container--full` - Removes the padding and the zoom/slide entrance for the `full` size

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- `data-[state=open]` / `data-[state=closed]` — applied to `backdrop` and `container`
  during the enter/exit animation, the hooks for entrance/exit animations
- `data-placement="auto|top|center|bottom"` — applied to `container` and `dialog`,
  mirroring the `placement` prop

## API Reference

### Props

<ApiTable component="Modal" kind="props" />

### Slots

<ApiTable component="Modal" kind="slots" />

### Emits

<ApiTable component="Modal" kind="emits" />

## Theme

<ApiTheme component="Modal" />

## Accessibility

Implements the [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
with these behaviours:

- **Focus trap**: focus is locked within the dialog while open and restored to the
  trigger on close
- **Keyboard**: `Escape` closes the dialog unless `dismissible` is `false`. `Tab`
  cycles through focusable elements inside it. A scrollable body is not a tab stop of its own.
  Give it `tabindex="0"` if you want it to be one
- **Screen readers**: the dialog always has an accessible name — either the rendered
  title or a visually hidden one
- **Scroll lock**: body scroll is disabled while the modal is open

## Related Components

<RelatedComponents :components="['popover', 'tooltip', 'button']" />
