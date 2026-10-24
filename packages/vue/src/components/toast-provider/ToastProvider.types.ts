import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'
import type { ToastQueue, ToastContentValue as ToastContentValueType } from './toastQueue'

type Toast = typeof theme

export type ToastProviderProps = {
  /**
   * Placement of the toast region.
   * @defaultValue 'bottom'
   */
  placement?: ComponentVariants<Toast>['placement']
  /**
   * The gap between toasts in pixels.
   * @defaultValue 12
   */
  gap?: number
  /**
   * Keeps the stack in its expanded layout instead of expanding only on hover
   * or keyboard focus. Forced expansion does not pause toast timers.
   * @defaultValue false
   */
  isExpanded?: boolean
  /**
   * The maximum number of toasts to display at a time (visual only).
   * @defaultValue 3, or the queue's own `maxVisibleToasts`
   */
  maxVisibleToasts?: number
  /**
   * Hotkey that focuses the toast region. Modifiers match `KeyboardEvent`
   * boolean props, other keys match `event.code`. Pass `[]` to disable.
   * @defaultValue ['altKey', 'KeyT']
   */
  hotkey?: string[]
  /**
   * How much each toast behind the front one scales down.
   * @defaultValue 0.05
   */
  scaleFactor?: number
  /**
   * The width of the toast region; numbers are pixels.
   * @defaultValue 460
   */
  width?: number | string
  /** Custom toast queue instance; defaults to the shared default queue used by `toast()`. */
  queue?: ToastQueue<ToastContentValueType>
  /**
   * Accessible label for the region landmark. Defaults to the toast count, as React Aria does
   * (e.g. "2 notifications.").
   */
  ariaLabel?: string
  /**
   * Renders the toast region in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the region element. */
  class?: ClassValue
  /** Per-slot class overrides, shared by every rendered toast. */
  ui?: ComponentSlots<Toast>
}

export type ToastProviderSlots = {
  /**
   * Replaces a toast's inner content (indicator, title, description, action,
   * close button). The positioned, animated stack wrapper is still rendered
   * by the provider; style it with the `ui.toast` slot override.
   * Put `titleId` / `descriptionId` on the elements holding the title and description to name and describe
   * the toast, and wrap the message in a `role="alert"` element so screen readers announce it.
   */
  toast?: (props: {
    content: ToastContentValueType
    close: () => void
    titleId: string
    descriptionId: string
  }) => VNode[]
}
