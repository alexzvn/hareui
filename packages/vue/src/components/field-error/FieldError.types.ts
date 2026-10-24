import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type FieldError = typeof theme

/** Props of `FieldError`: a validation message (`role="alert"`) rendered below a field while it is invalid. */
export type FieldErrorProps = {
  /** The id of the element, referenced by `aria-describedby` of the invalid control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<FieldError>
}

/** Slots of `FieldError`. */
export type FieldErrorSlots = {
  /** The error message. */
  default?: () => VNode[]
}
