---
title: Toast
description: Display temporary notifications and messages to users with automatic dismissal and customizable placement
links:
  reka: toast
  source: toast-provider/ToastProvider.vue
  styles: toast-provider/theme.ts
  heroui: toast
---

## Usage

```ts
import { ToastProvider, toast } from '@hareui/vue'
```

<ComponentPreview name="toast/default" />

## Anatomy

A single `ToastProvider` renders the whole stack. Each toast's layout is built in: indicator, title,
description, action and close button. To replace it entirely, use the `#toast` slot
(see [Custom Toast Rendering](#custom-toast-rendering)).

```vue
<ToastProvider />
```

```ts
toast('Event created')
```

## Examples

### Variants

<ComponentPreview name="toast/variants" />

### Placements

<ComponentPreview name="toast/placements" />

### Expanded Stack

<ComponentPreview name="toast/expanded" />

### Simple Toasts

<ComponentPreview name="toast/simple" />

### Custom Indicators

<ComponentPreview name="toast/custom-indicator" />

### Custom Toast Rendering

<ComponentPreview name="toast/custom-toast" />

### Promise & Loading

<ComponentPreview name="toast/promise" />

### Callbacks

<ComponentPreview name="toast/callbacks" />

### Custom Queues

<ComponentPreview name="toast/custom-queue" />

### Close Button

Every toast has a close button. Pass `closeButton: false` to hide it, or an object with an `icon` and a `label` (its accessible name) to customise it.

<ComponentPreview name="toast/close-button" />

### Setup

Render the provider once at the root of your app.

```vue
<template>
  <ToastProvider />
  <Button @click="toast('Simple message')"> Show toast </Button>
</template>

<script setup lang="ts">
import { Button, ToastProvider, toast } from '@hareui/vue'
</script>
```

## Customization

### Tailwind CSS

<ComponentPreview name="toast/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      toast: {
        slots: { toast: 'rounded-xl shadow-lg', content: 'gap-2' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key      | `data-slot`           | Element                                                       |
| ------------- | --------------------- | ------------------------------------------------------------- |
| `region`      | `toast-region`        | The positioned landmark region toasts are teleported into     |
| `toast`       | `toast`               | Each toast's positioned, animated wrapper                     |
| `content`     | `toast-content`       | Wrapper for the title and description                         |
| `indicator`   | `toast-indicator`     | Icon/spinner container, rendered unless `indicator` is `null` |
| `title`       | `toast-title`         | The toast title                                               |
| `description` | `toast-description`   | The toast description                                         |
| `close`       | `toast-close`         | The close button                                              |
| `action`      | `toast-action-button` | The optional action button                                    |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Toast component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/toast-provider/toast-provider.css)):

#### Base Classes

- `.h-toast` - Base toast container
- `.h-toast-region` - Toast region container
- `.h-toast__content` - Content wrapper for title and description
- `.h-toast__indicator` - Icon/indicator container
- `.h-toast__title` - Toast title text
- `.h-toast__description` - Toast description text
- `.h-toast__action` - Action button
- `.h-toast__close-button` - Close button, shown on hover

#### Variant Classes

- `.h-toast--accent` - Accent blue variant
- `.h-toast--success` - Success green variant
- `.h-toast--warning` - Warning yellow/orange variant
- `.h-toast--danger` - Danger red variant

The default variant adds no class.

#### Modifier Classes

- `.h-toast-region--bottom` - Region at the bottom center
- `.h-toast-region--bottom-start` - Region at the bottom start corner
- `.h-toast-region--bottom-end` - Region at the bottom end corner
- `.h-toast-region--top` - Region at the top center
- `.h-toast-region--top-start` - Region at the top start corner
- `.h-toast-region--top-end` - Region at the top end corner
- `.h-toast--bottom` - Stacks upward from the bottom
- `.h-toast--bottom-start` - Stacks upward from the bottom
- `.h-toast--bottom-end` - Stacks upward from the bottom
- `.h-toast--top` - Stacks downward from the top
- `.h-toast--top-start` - Stacks downward from the top
- `.h-toast--top-end` - Stacks downward from the top

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- `[data-frontmost]` — applied to the topmost visible toast
- `[data-index]` — applied based on toast position in stack
- `[data-placement]` — applied based on the region's placement
- `[data-entering]` — applied on first paint of a new toast
- `[data-exiting]` — applied while a closing toast plays its exit transition
- `[data-expanded]` — applied to every toast while the stack is expanded
- `[data-hidden]` — applied to toasts beyond `maxVisibleToasts`

## API Reference

### ToastProvider Props

<ApiTable component="ToastProvider" kind="props" />

### ToastProvider Slots

<ApiTable component="ToastProvider" kind="slots" />

### ToastQueue

Manages toast state outside any component, so toasts can be triggered from anywhere.
By default, every `ToastProvider` shares the module-level queue used by `toast()`.
To run an independent stack, pass your own instance to the provider's `queue` prop.

#### Constructor Options

| Option             | Type     | Default | Description                                                                             |
| ------------------ | -------- | ------- | --------------------------------------------------------------------------------------- |
| `exitDuration`     | `number` | `300`   | How long a closing toast stays mounted for its exit animation (`0` removes immediately) |
| `maxVisibleToasts` | `number` | `3`     | Maximum number of toasts to display at once (visual only)                               |

#### Methods

| Method          | Parameters                                         | Returns         | Description                                                                             |
| --------------- | -------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| `add`           | `(content, options?: { timeout?, onClose? })`      | `string`        | Adds a toast, returns its key                                                           |
| `update`        | `(key, content, options?: { timeout?, onClose? })` | `boolean`       | Updates a toast in place, preserving its stack position; `false` if it no longer exists |
| `close`         | `(key)`                                            | `void`          | Closes a toast by its key                                                               |
| `clear`         | `()`                                               | `void`          | Closes every toast                                                                      |
| `pauseAll`      | `()`                                               | `void`          | Pauses every toast's auto-dismiss timer                                                 |
| `resumeAll`     | `()`                                               | `void`          | Resumes every toast's auto-dismiss timer                                                |
| `visibleToasts` | —                                                  | `QueuedToast[]` | The currently rendered toasts, newest first (getter)                                    |

### toast / useToast()

`toast` and `useToast()` are equivalent. `useToast()` returns the `toast` singleton, for symmetry with other composables.
Toast state lives outside any component instance, so `toast` works from anywhere, including outside `<script setup>`.

```ts
import { toast } from '@hareui/vue'

// Basic toast (auto-dismisses after 4 seconds by default)
toast('Event has been created')

// Variant methods (also auto-dismiss after 4 seconds by default)
toast.success('File saved')
toast.info('New update available')
toast.warning('Please check your settings')
toast.danger('Something went wrong')

// With options. The returned id lets an action close its own toast.
const eventId = toast('Event has been created', {
  description: 'Your event has been scheduled for tomorrow',
  variant: 'default',
  timeout: 5000, // Custom timeout: 5 seconds
  onClose: () => console.log('Closed'),
  action: { label: 'View', onClick: () => toast.close(eventId) },
  indicator: h(CustomIcon),
})

// Update an existing toast in place (keeps its position in the stack).
// Options you omit are inherited, so pass `timeout` to start a countdown
// on a toast that was created persistent.
const id = toast('Saving…', { timeout: 0 })
toast.update(id, 'Saved', { variant: 'success', timeout: 4000 })

// Promise support (automatically shows a loading spinner). The loading toast
// updates in place when the promise settles — same toast, same stack
// position; the auto-dismiss countdown starts at that point.
toast.promise(uploadFile(), {
  loading: 'Uploading file...',
  success: (data) => `File ${data.filename} uploaded`,
  error: 'Failed to upload file',
})

// Manual loading state (persistent toast - no auto-dismiss)
const loadingId = toast('Creating event...', { isLoading: true, timeout: 0 })

// Later, update in place and start the auto-dismiss countdown
toast.update(loadingId, 'Event created', { variant: 'success', timeout: 4000 })

// Queue methods
toast.close(key)
toast.clear()
toast.pauseAll()
toast.resumeAll()
```

#### toast Options

| Option        | Type                                                          | Default     | Description                                                      |
| ------------- | ------------------------------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `description` | `VNodeChild`                                                  | -           | Optional description text                                        |
| `variant`     | `'default' \| 'accent' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Visual variant                                                   |
| `indicator`   | `VNodeChild \| null`                                          | -           | Custom indicator icon (`null` hides it)                          |
| `action`      | `{ label, onClick?, variant?, class? }`                       | -           | Action button                                                    |
| `isLoading`   | `boolean`                                                     | `false`     | Shows a spinner in place of the indicator                        |
| `closeButton` | `boolean \| { icon?, label? }`                                | `true`      | Hides (`false`) or customises the close button                   |
| `timeout`     | `number`                                                      | `4000`      | Auto-dismiss timeout in milliseconds; `0` keeps the toast open   |
| `onClose`     | `() => void`                                                  | -           | Called when the toast is dismissed, as its exit animation starts |

#### toast.promise Options

| Option    | Type                                           | Default | Description                                |
| --------- | ---------------------------------------------- | ------- | ------------------------------------------ |
| `loading` | `VNodeChild`                                   | -       | Message shown while the promise is pending |
| `success` | `VNodeChild \| ((data: T) => VNodeChild)`      | -       | Message shown on success                   |
| `error`   | `VNodeChild \| ((error: Error) => VNodeChild)` | -       | Message shown on error                     |

## Theme

<ApiTheme component="ToastProvider" />

## Accessibility

Each toast implements the [WAI-ARIA alertdialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/),
grouped inside a labeled landmark region:

- **Landmark region**: Toasts render in a labeled landmark reachable with `F6`; `Alt` + `T` moves focus straight to it. The hotkey is configurable via the `hotkey` prop and can be disabled by passing an empty array, and the region label can be overridden with `ariaLabel`. By default the label states the toast count, such as "2 notifications."
- **Keyboard**: `Tab` reaches the controls of visible toasts, `Escape` collapses the
  expanded stack, and dismissing a focused toast moves focus to the nearest remaining
  toast (or back to where focus was before entering the region when none remains)
- **Screen readers**: each toast uses `role="alertdialog"` with its title and
  description linked; new toasts are announced automatically
- **Timers**: auto-dismiss pauses while the stack is hovered or focused, and while
  the page is in a background tab

## Related Components

<RelatedComponents :components="['button', 'close-button', 'spinner']" />
