import type { Component } from 'vue'
import { shallowReactive } from 'vue'

import type {
  OpenedOverlay,
  Overlay,
  OverlayInstance,
  OverlayOptions,
  UseOverlayReturn,
} from '@/components/overlay-provider/OverlayProvider.types'

// Module-level so every caller and every `OverlayProvider` share one registry, like `toast()`.
const overlays = shallowReactive<Overlay[]>([])

const getOverlay = (id: symbol): Overlay => {
  const overlay = overlays.find((item) => item.id === id)
  if (!overlay) throw new Error('useOverlay: overlay not found')

  return overlay
}

const open = (id: symbol, props?: Record<string, unknown>): OpenedOverlay => {
  const overlay = getOverlay(id)
  overlay.props = { ...overlay.originalProps, ...props }
  overlay.isOpen = true
  overlay.isMounted = true

  const result = new Promise<unknown>((resolve) => overlay.resolvers.push(resolve))

  return Object.assign(result, { id, result })
}

const close = (id: symbol, value?: unknown) => {
  const overlay = getOverlay(id)
  overlay.isOpen = false

  // Every promise returned by `open` since the last close resolves with this value.
  for (const resolve of overlay.resolvers.splice(0)) resolve(value)
}

const closeAll = () => {
  for (const overlay of overlays) close(overlay.id)
}

const unmount = (id: symbol) => {
  const overlay = getOverlay(id)
  overlay.isMounted = false
  if (!overlay.destroyOnClose) return

  overlays.splice(overlays.indexOf(overlay), 1)
}

const patch = (id: symbol, props: Record<string, unknown>) => {
  const overlay = getOverlay(id)
  overlay.props = { ...overlay.props, ...props }
}

const isOpen = (id: symbol): boolean => {
  return getOverlay(id).isOpen
}

const create = <T extends Component>(
  component: T,
  options: OverlayOptions<Record<string, unknown>> = {},
): OverlayInstance<T> => {
  const { props = {}, defaultOpen = false, destroyOnClose = false } = options

  const id = Symbol('useOverlay')

  // Shallow: fields are replaced wholesale, and the component itself must never become a reactive proxy.
  const overlay = shallowReactive<Overlay>({
    id,
    component,
    isOpen: defaultOpen,
    isMounted: defaultOpen,
    destroyOnClose,
    originalProps: props,
    props: { ...props },
    resolvers: [],
  })

  // The registry is module-level, so on the server it would outlive the request and collect the overlays of every
  // render. Overlays open from event handlers, which only run in the browser, so the server registers none.
  if (typeof window !== 'undefined') overlays.push(overlay)

  return {
    id,
    get isOpen() {
      return overlay.isOpen
    },
    get isMounted() {
      return overlay.isMounted
    },
    open: (openProps) => open(id, openProps) as ReturnType<OverlayInstance<T>['open']>,
    close: (value) => close(id, value),
    patch: (patchProps) => patch(id, patchProps),
    unmount: () => unmount(id),
  }
}

const overlayApi: UseOverlayReturn = {
  overlays,
  create,
  open,
  close,
  closeAll,
  patch,
  unmount,
  isOpen,
}

/**
 * Opens overlays (a `Modal`, `Drawer`, `AlertDialog`, or a component wrapping one) from code. `create()` registers a
 * component; its handle opens it with props and returns a promise that resolves with the value of the component's
 * `close` event. The overlays render in the `OverlayProvider` that `App` mounts, and the registry is shared by every
 * caller.
 */
export const useOverlay = (): UseOverlayReturn => {
  return overlayApi
}
