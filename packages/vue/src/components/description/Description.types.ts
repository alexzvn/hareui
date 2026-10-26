import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Description = typeof theme

/** Props of the `Description` component: helper text that describes a form control. */
export type DescriptionProps = {
  /** The id of the element, referenced by `aria-describedby` of the described control. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Description>
}

/** Slots of the `Description` component. */
export type DescriptionSlots = {
  /** The description content. */
  default?: () => VNode[]
}
