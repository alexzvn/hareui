import type { PrimitiveProps } from 'reka-ui'

import type { ButtonProps } from '@/components/button/Button.types'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ErrorTheme = typeof theme

/** The error to display. Accepts Nuxt's `NuxtError` (`statusCode`/`statusMessage`) and H3's `status`/`statusText` alike. */
export type ErrorValue = {
  statusCode?: number
  status?: number
  statusMessage?: string
  statusText?: string
  message?: string
}

/** Props of the clear button: those of `Button`, plus its `label`. */
export type ErrorClearProps = ButtonProps & { label?: string }

export type ErrorProps = {
  /**
   * The element or component to render as. An object sets the element per part (`{ root, statusMessage }`).
   * @defaultValue 'main'
   */
  as?: PrimitiveProps['as'] | { root?: PrimitiveProps['as']; statusMessage?: PrimitiveProps['as'] }
  /** The error to display: status code, status message and message. */
  error?: ErrorValue
  /**
   * The URL the clear button links to. Set it to an empty string to render a plain button and handle `clear` yourself.
   * @defaultValue '/'
   */
  redirect?: string
  /**
   * The button that clears the error. An object is forwarded to the `Button` (`label` sets its text); `false` hides it.
   * `{ size: 'lg', variant: 'primary', label: 'Back to home' }`
   * @defaultValue true
   */
  clear?: boolean | ErrorClearProps
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ErrorTheme>
}

export type ErrorSlots = {
  /** Content rendered after the links. */
  default?: () => unknown
  /** Content above the status code, e.g. an icon. */
  leading?: (props: { ui: ComponentUI<ErrorTheme> }) => unknown
  /** The status code. Defaults to `error.statusCode`. */
  statusCode?: () => unknown
  /** The status message heading. Defaults to `error.statusMessage`. */
  statusMessage?: () => unknown
  /** The error message. Defaults to `error.message`. */
  message?: () => unknown
  /** Replaces the clear button. */
  links?: () => unknown
}

export type ErrorEmits = {
  /** Fired when the clear button is clicked, before it follows `redirect`. Call `event.preventDefault()` to navigate yourself. */
  clear: [event: MouseEvent]
}
