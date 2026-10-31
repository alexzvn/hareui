import type { IconValue } from '@/types/icon'

/** Customises a component's built-in close button. */
export type CloseButtonOptions = {
  /** Replaces the default close icon. */
  icon?: IconValue
  /** The close button's accessible label; defaults to the locale's close label. */
  label?: string
}

/** A component's `closeButton` prop: `false` hides the button, `true` renders the default, an object customises it. */
export type CloseButtonProp = boolean | CloseButtonOptions
