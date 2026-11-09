---
title: AlertDialog
description: Modal dialog for critical confirmations requiring user attention and explicit action
links:
  reka: dialog
  source: alert-dialog/AlertDialog.vue
  styles: alert-dialog/theme.ts
  heroui: alert-dialog
---

## Usage

```ts
import { AlertDialog } from '@hareui/vue'
```

<ComponentPreview name="alert-dialog/default" />

## Anatomy

A single `AlertDialog` component owns the whole structure. The first child is the trigger. It is
merged onto its own root element, like `as-child`. Everything else comes from props and named slots.

```vue
<AlertDialog status="danger" title="Heading">
  <Button>Open Alert Dialog</Button>
  <template #icon><!-- optional: replaces the status icon --></template>
  <template #body>Body content</template>
  <template #footer="{ close }">
    <Button variant="tertiary" @click="close">Cancel</Button>
    <Button @click="close">Confirm</Button>
  </template>
</AlertDialog>
```

## Examples

### Statuses

<ComponentPreview name="alert-dialog/statuses" />

### Placements

<ComponentPreview name="alert-dialog/placements" />

### Sizes

<ComponentPreview name="alert-dialog/sizes" />

### Controlled State

Bind `v-model:open` to open the dialog from anywhere, here a button outside it.

<ComponentPreview name="alert-dialog/controlled" />

### Custom Icon

<ComponentPreview name="alert-dialog/custom-icon" />

### Custom Trigger

<ComponentPreview name="alert-dialog/custom-trigger" />

### Backdrop Variants

<ComponentPreview name="alert-dialog/backdrop-variants" />

### Custom Backdrop

<ComponentPreview name="alert-dialog/custom-backdrop" />

### Dismiss Behavior

An alert dialog waits for an answer: by default, Escape and clicks on the backdrop don't close it. Set
`keyboardDismissible` to close it with Escape, and `dismissible` to close it with a backdrop click.

<ComponentPreview name="alert-dialog/dismiss-behavior" />

### Close Methods

The `#footer`, `#body` and `#content` slots receive a `close` function. `#content` replaces the whole dialog. Set `title` too, so screen readers still get a name for the dialog.

<ComponentPreview name="alert-dialog/close-methods" />

### Custom Animations

<ComponentPreview name="alert-dialog/custom-animations" />

### Custom Portal

<ComponentPreview name="alert-dialog/custom-portal" />

### Custom Close Button

Set `closeButton` to `false` to hide the close button. Pass an object with an `icon` and a `label` to customise it. The `label` is the button's accessible name.

<ComponentPreview name="alert-dialog/custom-close-button" />

### Events

| Event           | Fires when                            |
| --------------- | ------------------------------------- |
| `enter`         | the open animation starts             |
| `after:enter`   | the open animation ends               |
| `leave`         | the close animation starts            |
| `after:leave`   | the dialog has left the page          |
| `close:prevent` | Escape or a backdrop click is ignored |

Without an animation, `after:enter` and `after:leave` fire right away. An alert dialog ignores Escape and backdrop
clicks unless `keyboardDismissible` or `dismissible` is set, so try them to see `close:prevent`.

<ComponentPreview name="alert-dialog/events" />

## Customization

### Tailwind CSS

<ComponentPreview name="alert-dialog/custom-styles" />

### Global Configuration

To customize the AlertDialog classes for the whole app, extend the `alertDialog` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      alertDialog: {
        slots: {
          backdrop: 'bg-gradient-to-br from-black/60 to-black/80',
          dialog: 'rounded-2xl border border-red-500/20 shadow-2xl',
          header: 'gap-4',
          icon: 'size-16',
          closeTrigger: 'rounded-full bg-white/10 hover:bg-white/20',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key       | `data-slot`                  | Element                                                                           |
| -------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| `backdrop`     | `alert-dialog-backdrop`      | Overlay backdrop behind the dialog                                                |
| `container`    | `alert-dialog-container`     | Positioning wrapper with placement support                                        |
| `dialog`       | `alert-dialog-dialog`        | Dialog content container, which carries `role="alertdialog"`; `class` merges here |
| `header`       | `alert-dialog-header`        | Header section for the icon and title                                             |
| `heading`      | `alert-dialog-heading`       | Heading text, which labels the dialog                                             |
| `body`         | `alert-dialog-body`          | Main content area, rendered when `#body` is present                               |
| `footer`       | `alert-dialog-footer`        | Footer section for actions, rendered when `#footer` is present                    |
| `icon`         | `alert-dialog-icon`          | Icon container with status colors, rendered when `icon` is `true`                 |
| `closeTrigger` | `alert-dialog-close-trigger` | Close button, rendered unless `closeButton` is `false`                            |

The default status icon inside `icon` carries `data-slot="alert-dialog-default-icon"`.

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The AlertDialog component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/alert-dialog/alert-dialog.css)):

#### Base Classes

- `.h-alert-dialog__backdrop` - Overlay backdrop behind the dialog
- `.h-alert-dialog__container` - Positioning wrapper with placement support
- `.h-alert-dialog__dialog` - Dialog content container
- `.h-alert-dialog__header` - Header section for icon and title
- `.h-alert-dialog__heading` - Heading text styles
- `.h-alert-dialog__body` - Main content area
- `.h-alert-dialog__footer` - Footer section for actions
- `.h-alert-dialog__icon` - Icon container with status colors

The close button carries the [CloseButton](/docs/components/close-button) classes. `placement` adds no class: the container and dialog read their `data-placement` attribute.

#### Backdrop Variants

- `.h-alert-dialog__backdrop--opaque` - Opaque colored backdrop (default)
- `.h-alert-dialog__backdrop--blur` - Blurred backdrop with glass effect
- `.h-alert-dialog__backdrop--transparent` - Transparent backdrop (no overlay)

#### Status Variants (Icon)

- `.h-alert-dialog__icon--default` - Default gray status
- `.h-alert-dialog__icon--accent` - Accent blue status
- `.h-alert-dialog__icon--success` - Success green status
- `.h-alert-dialog__icon--warning` - Warning orange status
- `.h-alert-dialog__icon--danger` - Danger red status (default)

#### Size Classes

- `.h-alert-dialog__dialog--xs` - Extra small width
- `.h-alert-dialog__dialog--sm` - Small width
- `.h-alert-dialog__dialog--md` - Medium width (default)
- `.h-alert-dialog__dialog--lg` - Large width
- `.h-alert-dialog__dialog--cover` - Fills the container, keeping its padding

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- **Focus**: `:focus-visible` - applied to the trigger, dialog, and close button
- **Hover**: `:hover` - applied to the close button on hover
- **Active**: `:active` - applied to the close button when pressed
- **Entering / Exiting**: `data-[state=open]` / `data-[state=closed]` on `backdrop` and
  `container` during the enter/exit animation
- **Placement**: `data-placement="auto|top|center|bottom"` on `container` and `dialog`,
  mirroring the `placement` prop

## API Reference

### Props

<ApiTable component="AlertDialog" kind="props" />

### Slots

<ApiTable component="AlertDialog" kind="slots" />

### Emits

<ApiTable component="AlertDialog" kind="emits" />

## Theme

<ApiTheme component="AlertDialog" />

## Accessibility

Implements the [WAI-ARIA AlertDialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
with focus management, keyboard handling and scroll lock:

- **Focus trap**: focus is locked within the alert dialog
- **Keyboard**: `Escape` closes it only when `keyboardDismissible` is `true`. `Tab` cycles elements.
  A scrollable body is not a tab stop of its own
- **Screen readers**: the dialog has `role="alertdialog"` and always has an accessible name,
  either the rendered title or a visually hidden one
- **Scroll lock**: body scroll is disabled while open
- **Required action**: by default neither the backdrop nor `Escape` dismisses it
  (`dismissible` and `keyboardDismissible` are `false`)

## Related Components

<RelatedComponents :components="['button', 'close-button']" />
