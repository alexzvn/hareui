import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, toValue, watch } from 'vue'

import type { LayerDismissPolicy, OutsideEvent } from './nestedLayer'
import { shouldDismissOnEscape, shouldDismissOnOutside, shouldDismissOnPress } from './nestedLayer'

type LayerDismissOptions = {
  /**
   * The Layer's `[data-dismissable-layer]` element or Reka's positioning wrapper around it (a `*Content`
   * component's `$el`). Read when an event arrives, so a non-reactive `$el` is fine.
   */
  content: MaybeRefOrGetter<Node | null | undefined>
  /**
   * Whether presses and focus outside the Layer stack dismiss it.
   * @defaultValue true
   */
  isDismissible?: MaybeRefOrGetter<boolean>
  /**
   * Whether Escape dismisses the Layer.
   * @defaultValue isDismissible
   */
  isKeyboardDismissible?: MaybeRefOrGetter<boolean>
  /**
   * Whether presses with any button but the primary one keep the Layer open, as React Aria's `useInteractOutside`.
   * @defaultValue false
   */
  shouldIgnoreSecondaryButton?: boolean
  /**
   * Reka's DismissableLayer only starts listening for outside presses a task after the content mounts, so a press
   * right after opening is lost. React Aria listens as soon as the Layer is open: with this set, presses created
   * after the Layer opened (the opening press itself is older) dismiss it through `onDismiss`.
   */
  earlyPress?: {
    /** The Layer's open state. */
    isOpen: MaybeRefOrGetter<boolean>
    /** Closes the Layer. */
    onDismiss: () => void
  }
}

/**
 * The one dismiss policy for Layers built on Reka's DismissableLayer (Popover, Dropdown, the Dialog shell): which
 * Escape presses and outside interactions dismiss, decided by `nestedLayer`'s pure policy (Layer stack, shadow-root
 * retargeting, pointer button, `dismissible` flags).
 *
 * Bind `onEscapeKeyDown` and `onInteractOutside` on the Reka content; `interactOutside` follows both
 * `pointerDownOutside` and `focusOutside` with the same event, so no other outside handler is needed.
 * Must be called in `setup` or an effect scope.
 */
export const useLayerDismiss = (options: LayerDismissOptions) => {
  const resolvePolicy = (): LayerDismissPolicy => ({
    content: toValue(options.content),
    isDismissible: toValue(options.isDismissible),
    isKeyboardDismissible: toValue(options.isKeyboardDismissible),
    shouldIgnoreSecondaryButton: options.shouldIgnoreSecondaryButton,
  })

  // An early press already dismissed the Layer, so Reka must not dismiss a second time once its listener catches up.
  let handledPress: Event | undefined

  const onEscapeKeyDown = (event: KeyboardEvent) => {
    if (!shouldDismissOnEscape(resolvePolicy())) event.preventDefault()
  }

  const onInteractOutside = (event: OutsideEvent) => {
    const isHandled = event.detail.originalEvent === handledPress
    if (isHandled || !shouldDismissOnOutside(event, resolvePolicy())) event.preventDefault()
  }

  const { earlyPress } = options
  if (earlyPress) {
    let openedAt = 0
    let isListening = false

    const onDocumentPointerDown = (event: PointerEvent) => {
      if (event.timeStamp < openedAt || !shouldDismissOnPress(event, resolvePolicy())) return
      handledPress = event
      earlyPress.onDismiss()
    }

    const stopListening = () => {
      // Guarded: the immediate watcher also runs during server rendering, where `document` is undefined.
      if (!isListening) return
      isListening = false
      document.removeEventListener('pointerdown', onDocumentPointerDown, true)
    }

    const listen = (content: Node | null | undefined) => {
      stopListening()
      if (!content) return
      isListening = true
      openedAt = performance.now()
      document.addEventListener('pointerdown', onDocumentPointerDown, true)
    }

    // Post flush: the content's `$el` isn't reactive and is only current after the render that opens the Layer.
    watch(() => (toValue(earlyPress.isOpen) ? toValue(options.content) : null), listen, {
      flush: 'post',
      immediate: true,
    })

    onScopeDispose(stopListening)
  }

  return {
    /** Reka content's `@escape-key-down`. */
    onEscapeKeyDown,
    /** Reka content's `@interact-outside`. */
    onInteractOutside,
  }
}
