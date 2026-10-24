import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import type theme from './theme'

export interface RadioButtonGroupContext {
  /** The selected value, `null` while nothing is selected. */
  selected: ComputedRef<string | null>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  variant: ComputedRef<ComponentVariants<typeof theme>['variant']>
  layout: ComputedRef<ComponentVariants<typeof theme>['layout']>
  /** Ids of the group description / error, appended to each item's `aria-describedby`. */
  describedBy: ComputedRef<string | undefined>
  /** Group-level `ui` overrides, merged under each item's own `ui`. */
  ui: ComputedRef<ComponentSlots<typeof theme> | undefined>
}

export const radioButtonGroupKey: InjectionKey<RadioButtonGroupContext> = Symbol('RadioButtonGroup')

export function useRadioButtonGroup() {
  const context = inject(radioButtonGroupKey, null)
  if (!context) throw new Error('RadioButtonGroupItem must be used inside a RadioButtonGroup.')
  return context
}
