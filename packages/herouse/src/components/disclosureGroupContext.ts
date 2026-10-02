import type { InjectionKey, Ref } from 'vue'

export interface DisclosureGroupContext {
  /** Whether the disclosure identified by `value` is expanded. */
  isExpanded: (value: string | number) => boolean
  /** Expands or collapses the disclosure identified by `value`. */
  setExpanded: (value: string | number, expanded: boolean) => void
  /** Whether the whole group is disabled. */
  disabled: Readonly<Ref<boolean>>
}

export const disclosureGroupContextKey: InjectionKey<DisclosureGroupContext> = Symbol('herouse-disclosure-group')
