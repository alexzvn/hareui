import type { EmitFn, MaybeRefOrGetter, ShallowRef, Slot } from 'vue'
import { computed, nextTick, ref, toValue, watch } from 'vue'

import type { PortalTarget } from '@/config'
import type { DialogEmits } from '@/types/dialog'

import { useInertOutside } from './useInertOutside'
import { useLayerDismiss } from './useLayerDismiss'
import { usePortal } from './usePortal'
import { useTabbableFocusLoop } from './useTabbableFocusLoop'
import { useVisualViewport } from './useVisualViewport'

export type DialogShellOptions = {
  /** The component's props; reads `open`, `defaultOpen`, `title`, `portal` and `dismissible`. */
  props: {
    open?: boolean
    defaultOpen?: boolean
    title?: string
    portal?: PortalTarget
    dismissible?: boolean
  }
  /**
   * The component's slots (`useSlots()`); reads `header` and `title`. Only their presence is read, so `Slot<never>`
   * accepts any slot props.
   */
  slots: { header?: Slot<never>; title?: Slot<never> }
  /** The `DialogContent` instance (the component's `useTemplateRef`). */
  dialogContent: Readonly<ShallowRef<{ $el: HTMLElement } | null>>
  /** The component's `emit`; its `Emits` type includes `DialogEmits`. */
  emit: EmitFn<DialogEmits>
  /** Whether Escape closes the dialog. Modal ties it to `dismissible`; Drawer and AlertDialog have `keyboardDismissible`. */
  keyboardDismissible: MaybeRefOrGetter<boolean | undefined>
  /**
   * Header parts besides the `#header` slot and the title that make the header render on their own
   * (Modal's `#icon` / `#description` slots, AlertDialog's status icon).
   * @defaultValue false
   */
  headerExtras?: MaybeRefOrGetter<boolean | undefined>
}

/**
 * The lifecycle Modal, Drawer and AlertDialog share around Reka's `DialogRoot` / `DialogContent`: the open-state
 * mirror, the dismiss rules, React Aria's focus behaviour, the inert page, the portal target and the header flags.
 *
 * Invariants:
 * - The open mirror follows the `open` prop synchronously, and `onOpenChange` in uncontrolled mode only; a controlled
 *   parent that ignores `update:open` keeps the dialog (and the inert page) open.
 * - Escape is blocked unless `keyboardDismissible`; outside presses and focus are blocked unless `props.dismissible`.
 *   Interactions landing in a layer stacked above the dialog never dismiss it.
 * - The page outside the content is `inert` exactly while the mirror is open and the content is mounted.
 * - `enter`, `after:enter`, `leave`, `after:leave` follow the Presence of the element `presenceListeners` is bound to
 *   (the one unmounted last), always in that order; `after:leave` waits until that element left the DOM.
 * - `close:prevent` follows an Escape or outside press blocked only by the `dismissible` flags.
 * - On open, focus goes to the dialog element itself.
 * - `hasHeader` is `#header` slot, `headerExtras` or a title (`title` prop / `#title` slot); `showHeaderTitle` is a
 *   title without a `#header` slot.
 *
 * Must be called in `setup`.
 */
export const useDialogShell = (options: DialogShellOptions) => {
  const { props, slots, emit, dialogContent } = options
  const portalTarget = usePortal(() => props.portal)

  // Tab skips scrollable containers such as an overflowing body, as React Aria's FocusScope does.
  useTabbableFocusLoop(() => dialogContent.value?.$el)

  // Mirrors DialogRoot's open state synchronously: set from the `open` prop and from Reka's `update:open`.
  const openState = ref(props.open ?? props.defaultOpen ?? false)
  watch(
    () => props.open,
    (open) => {
      if (open !== undefined) openState.value = open
    },
    { flush: 'sync' },
  )

  const onOpenChange = (open: boolean) => {
    // Controlled: the `open` watcher follows the parent, which may keep the dialog open.
    if (props.open === undefined) openState.value = open
    emit('update:open', open)
  }

  useInertOutside(dialogContent, openState)

  // Reka's DialogContent already keeps right and Ctrl+left clicks outside from dismissing, so those don't emit
  // `close:prevent` either.
  const { onEscapeKeyDown, onInteractOutside } = useLayerDismiss({
    content: () => dialogContent.value?.$el,
    isDismissible: () => !!props.dismissible,
    isKeyboardDismissible: () => !!toValue(options.keyboardDismissible),
    onPrevent: () => emit('close:prevent'),
  })

  // Reka's Presence skips `leave` when it unmounts without a running exit animation, so it's emitted on demand.
  let isLeaving = false
  const presenceListeners = {
    onEnter: () => {
      isLeaving = false
      emit('enter')
    },
    onAfterEnter: () => emit('after:enter'),
    onLeave: () => {
      isLeaving = true
      emit('leave')
    },
    onAfterLeave: async () => {
      if (!isLeaving) emit('leave')
      isLeaving = false

      // Presence fires `after-leave` before it unmounts the node; the unmount render is queued by then only after one
      // microtask, so wait for it and then for that render.
      await Promise.resolve()
      await nextTick()
      emit('after:leave')
    },
  }

  // React Aria's Dialog focuses the dialog container itself on open, not the first
  // tabbable descendant (Reka's FocusScope default). Match that so e.g. a footer
  // button doesn't pick up an unwanted focus ring when the dialog opens.
  const onOpenAutoFocus = (event: Event) => {
    event.preventDefault()
    ;(event.target as HTMLElement | null)?.focus({ preventScroll: true })
  }

  const visualViewportStyle = useVisualViewport()

  const hasTitle = computed(() => !!(props.title || slots.title))
  const showHeaderTitle = computed(() => !slots.header && hasTitle.value)

  const hasHeader = computed(
    () => !!(slots.header || toValue(options.headerExtras) || hasTitle.value),
  )

  return {
    portalTarget,
    /** Backdrop `style`: `--visual-viewport-height` and `--visual-viewport-top`. */
    visualViewportStyle,
    showHeaderTitle,
    hasHeader,
    /** `DialogRoot`'s `@update:open`. */
    onOpenChange,
    onEscapeKeyDown,
    onInteractOutside,
    onOpenAutoFocus,
    /** `v-bind` on the element unmounted last (the backdrop's `DialogOverlay`): Reka Presence's lifecycle events. */
    presenceListeners,
  }
}
