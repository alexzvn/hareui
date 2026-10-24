import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ErrorMessage = typeof theme

export type ErrorMessageProps = {
  /** The id of the element, referenced by `aria-describedby` of the described control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ErrorMessage>
}

export type ErrorMessageSlots = {
  /** The error message content. The element stays rendered while empty, like HeroUI's. */
  default?: () => VNode[]
}
