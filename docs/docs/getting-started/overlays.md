---
title: Overlays
description: Open modals, drawers and alert dialogs from code with useOverlay, and await the value they close with.
---

`useOverlay()` opens a `Modal`, `Drawer` or `AlertDialog` from code instead of from a trigger in your template. You register a component once with `create()`, then open it from any event handler, pass it props, update them while it is open, and `await` the value it closes with.

## Setup

The overlays render inside [`App`](/docs/components/app), so wrap your application with it:

```vue
<template>
  <App>
    <RouterView />
  </App>
</template>

<script setup lang="ts">
import { App } from '@hareui/vue'
</script>
```

Without `App`, render an `OverlayProvider` once, next to your root content. Render it only once: each provider renders every open overlay.

```vue
<template>
  <RouterView />
  <OverlayProvider />
</template>

<script setup lang="ts">
import { OverlayProvider } from '@hareui/vue'
</script>
```

## Usage

Put the overlay in a component of its own, with a `Modal`, `Drawer` or `AlertDialog` as its root element. The provider binds `open` and listens for `update:open`, which pass through to that root, so the component doesn't declare them.

<<< @/demos/use-overlay/components/ReleaseNotesModal.vue

Then create the overlay and call `open()`:

```ts
import { useOverlay } from '@hareui/vue'

const overlay = useOverlay()

const releaseNotes = overlay.create(ReleaseNotesModal, {
  props: { version: '2.4', notes: ['…'] },
})

releaseNotes.open()
```

<ComponentPreview name="use-overlay/modal" />

## Drawer

Props passed to `open()` are merged over the ones given to `create()`, so one overlay can show different content each time. Every `open()` starts again from the `create()` props.

<ComponentPreview name="use-overlay/drawer" />

## Returning a Value

`open()` returns a promise. It resolves with the payload of the component's `close` event, which also closes the overlay. When the overlay closes another way, such as through its close button, Escape or a press outside where the component allows them, or `closeAll()`, the promise resolves with `undefined`. The alert dialog below can only be dismissed with its close button.

<<< @/demos/use-overlay/components/ConfirmRemoveDialog.vue

<ComponentPreview name="use-overlay/return-value" />

If you'd rather destructure, read the promise from the `result` field of what `open()` returns. With TypeScript, its type comes from the component's `close` event: `Promise<boolean | undefined>` here.

## Updating Props

Use `patch()` to update the props of an open overlay, for example to report progress.

<ComponentPreview name="use-overlay/patch-props" />

## Closing and Unmounting

- `close(value)` closes the overlay from code and resolves its pending `open()` promises with `value`.
- `useOverlay().closeAll()` closes every overlay, for example before navigating away.
- A closed overlay stays rendered until its exit animation ends, then unmounts, so it starts fresh on the next `open()`.
- An overlay stays registered after closing, ready to open again. Pass `destroyOnClose: true` to `create()` for one-off overlays that should be removed after they close, such as a confirmation helper that creates a new overlay on each call.
- `unmount()` stops rendering an overlay at once, without waiting for its exit animation.

```ts
const confirm = (member: string): Promise<boolean | undefined> => {
  const dialog = overlay.create(ConfirmRemoveDialog, {
    props: { member },
    destroyOnClose: true,
  })

  return dialog.open()
}
```

## Provide and Inject

Overlays render inside `App`, not where `open()` is called, so they can only `inject()` values provided above `App` (by app plugins or the root component). Pass anything else as props:

```ts
const workspace = inject(workspaceKey)

const members = overlay.create(MembersModal, {
  props: { workspace },
})
```

## Server Rendering

Overlays render in the browser only. During server rendering, `create()` returns a handle without registering the overlay, so one request never sees the overlays of another. An overlay created with `defaultOpen: true` opens once the page has loaded in the browser.

## API

### useOverlay()

`useOverlay()` returns one registry shared by every caller, so an overlay created in one component can be opened, patched or closed from another through its `id`.

| Name       | Type                                                             | Description                                                                                     |
| ---------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `create`   | `(component: T, options?: OverlayOptions) => OverlayInstance<T>` | Registers `component` as an overlay and returns its handle.                                     |
| `open`     | `(id: symbol, props?: Record<string, unknown>) => OpenedOverlay` | Opens the overlay `id`, with `props` merged over the `create()` props.                          |
| `close`    | `(id: symbol, value?: unknown) => void`                          | Closes the overlay `id`, resolving its pending `open()` promises with `value`.                  |
| `closeAll` | `() => void`                                                     | Closes every overlay; their pending `open()` promises resolve with `undefined`.                 |
| `patch`    | `(id: symbol, props: Record<string, unknown>) => void`           | Merges `props` into the props the overlay is rendered with.                                     |
| `unmount`  | `(id: symbol) => void`                                           | Stops rendering the overlay, and removes it from `overlays` when created with `destroyOnClose`. |
| `isOpen`   | `(id: symbol) => boolean`                                        | Whether the overlay `id` is open.                                                               |
| `overlays` | `Overlay[]`                                                      | Every overlay created and not yet destroyed.                                                    |

### OverlayOptions

| Name             | Type                | Default | Description                                                                          |
| ---------------- | ------------------- | ------- | ------------------------------------------------------------------------------------ |
| `props`          | `Partial<Props<T>>` | `{}`    | Props passed to the component. `open(props)` merges its own over these.              |
| `defaultOpen`    | `boolean`           | `false` | Opens the overlay as soon as it is created.                                          |
| `destroyOnClose` | `boolean`           | `false` | Removes the overlay from `overlays` once it has closed and its exit animation ended. |

### OverlayInstance

The handle returned by `create()`.

| Name        | Type                                                   | Description                                                                                  |
| ----------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `open`      | `(props?: Partial<Props<T>>) => OpenedOverlay<Result>` | Opens the overlay. Resolves with the `close` event's payload, or `undefined` when dismissed. |
| `close`     | `(value?: Result) => void`                             | Closes the overlay, resolving every pending `open()` promise with `value`.                   |
| `patch`     | `(props: Partial<Props<T>>) => void`                   | Merges `props` into the props the overlay is rendered with.                                  |
| `unmount`   | `() => void`                                           | Stops rendering the overlay at once.                                                         |
| `id`        | `symbol`                                               | The overlay's identifier, accepted by the id-based methods of `useOverlay()`.                |
| `isOpen`    | `boolean`                                              | Whether the overlay is open.                                                                 |
| `isMounted` | `boolean`                                              | Whether the overlay is rendered: from `open()` until its exit animation after closing ends.  |
