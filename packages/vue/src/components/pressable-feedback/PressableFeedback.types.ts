import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type PressableFeedback = typeof theme

/** The edge a hold or progress overlay sweeps toward as it reveals. */
export type PressableFeedbackSweep = 'right' | 'left' | 'down' | 'up'

/** Options of the `ripple` effect: a circle that grows from the press point and fades out on release. */
export type PressableFeedbackRipple = {
  /**
   * How long the circle takes to grow across the element, in ms.
   * @defaultValue 150
   */
  duration?: number
  /**
   * Opacity of the current colour laid over the element while the pointer hovers it.
   * @defaultValue 0.08
   */
  hoverOpacity?: number
  /**
   * Opacity of the circle while pressed.
   * @defaultValue 0.12
   */
  pressedOpacity?: number
  /**
   * The shortest time the circle stays before fading, in ms, so a quick tap still shows it.
   * @defaultValue 225
   */
  minimumPressDuration?: number
}

/** Options of the `highlight` effect: the current colour laid over the element on hover and press. */
export type PressableFeedbackHighlight = {
  /**
   * Opacity of the overlay while the pointer hovers the element.
   * @defaultValue 0.08
   */
  hoverOpacity?: number
  /**
   * Opacity of the overlay while pressed.
   * @defaultValue 0.12
   */
  pressedOpacity?: number
}

/** Options of the `hold` effect: an overlay that sweeps in while the element is held and confirms once full. */
export type PressableFeedbackHold = {
  /**
   * How long the element must be held before `confirm` fires, in ms.
   * @defaultValue 2000
   */
  duration?: number
  /**
   * How long the overlay takes to snap back when released early, in ms.
   * @defaultValue 200
   */
  releaseDuration?: number
  /**
   * The edge the overlay sweeps toward.
   * @defaultValue 'right'
   */
  sweep?: PressableFeedbackSweep
  /**
   * Hide the overlay again when the element is released after confirming. Off, it stays until `reset()`.
   * @defaultValue true
   */
  resetOnComplete?: boolean
}

/** Options of the `progress` effect: an overlay that sweeps in after a press, without holding. */
export type PressableFeedbackProgress = {
  /**
   * How long the sweep runs before `complete` fires, in ms.
   * @defaultValue 2000
   */
  duration?: number
  /**
   * How long the overlay takes to snap back when it resets, in ms.
   * @defaultValue 300
   */
  releaseDuration?: number
  /**
   * The edge the overlay sweeps toward.
   * @defaultValue 'right'
   */
  sweep?: PressableFeedbackSweep
  /**
   * Hide the overlay `resetDelay` ms after it completes. Off, it stays until `reset()`.
   * @defaultValue true
   */
  autoReset?: boolean
  /**
   * How long the full overlay stays before an automatic reset, in ms.
   * @defaultValue 1500
   */
  resetDelay?: number
}

/**
 * Props of the `PressableFeedback` component: a pressable element with ripple, highlight, hold-to-confirm and
 * progress feedback layered over its content. Effects can be combined.
 */
export type PressableFeedbackProps = {
  /**
   * The element or component to render as. A `button` gets `type="button"`; another element gets
   * `role="button"`, joins the tab order and clicks on Enter and Space; a component gets `disabled` and handles the
   * rest itself.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * Whether the element is disabled: no feedback, no events, and the layers are hidden.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Grow a circle from the press point (the centre for a keyboard press) and tint the element on hover.
   * Under reduced motion the circle appears at full size without growing.
   * @defaultValue false
   */
  ripple?: boolean | PressableFeedbackRipple
  /**
   * Tint the element with its current colour on hover and press.
   * @defaultValue false
   */
  highlight?: boolean | PressableFeedbackHighlight
  /**
   * Sweep an overlay in while the element is held with a pointer, Space or Enter, and emit `confirm` once it has
   * been held for the full `duration`. Releasing earlier snaps the overlay back. The overlay shows the `#hold`
   * slot, or the default slot when it is not set. Under reduced motion it fades in instead of sweeping.
   * @defaultValue false
   */
  hold?: boolean | PressableFeedbackHold
  /**
   * Sweep an overlay in after a click and emit `complete` once it is full. The overlay shows the `#progress` slot,
   * or the default slot when it is not set. Under reduced motion it fades in instead of sweeping.
   * @defaultValue false
   */
  progress?: boolean | PressableFeedbackProgress
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<PressableFeedback>
}

/** Events of the `PressableFeedback` component. */
export type PressableFeedbackEmits = {
  /** The element was held for the full `hold` duration. */
  confirm: []
  /** The `progress` overlay finished sweeping in. */
  complete: []
  /** A completed hold or progress overlay went back to idle. */
  reset: []
}

/** Slot props of every `PressableFeedback` slot. */
export type PressableFeedbackSlotProps = {
  /** Whether the element is being held and the hold overlay is sweeping in. */
  holding: boolean
  /** Whether the progress overlay is sweeping in. */
  progressing: boolean
  /** Whether a hold has confirmed or a progress has completed, and its overlay is still shown. */
  complete: boolean
  /** Hides a completed overlay and goes back to idle. */
  reset: () => void
}

/** Slots of the `PressableFeedback` component. */
export type PressableFeedbackSlots = {
  /** The element's content. */
  default?: (props: PressableFeedbackSlotProps) => VNode[]
  /** Content of the hold overlay. Defaults to the default slot. */
  hold?: (props: PressableFeedbackSlotProps) => VNode[]
  /** Content of the progress overlay. Defaults to the default slot. */
  progress?: (props: PressableFeedbackSlotProps) => VNode[]
}

/** What a template ref on `PressableFeedback` exposes. */
export type PressableFeedbackExposed = {
  /** Hides a completed hold or progress overlay and goes back to idle. */
  reset: () => void
}
