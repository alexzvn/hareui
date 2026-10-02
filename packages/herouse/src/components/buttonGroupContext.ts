import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type buttonGroupTheme from '../theme/buttonGroup'
import type { ComponentSlots, ComponentUI } from '../types/tv'
import type { ButtonProps } from './Button.vue'

export interface ButtonGroupContext {
  variant: Readonly<Ref<ButtonProps['variant']>>
  size: Readonly<Ref<ButtonProps['size']>>
  disabled: Readonly<Ref<boolean | undefined>>
  fullWidth: Readonly<Ref<boolean | undefined>>
  separator: Readonly<Ref<boolean>>
  ui: ComputedRef<ComponentUI<typeof buttonGroupTheme>>
  uiOverrides: Readonly<Ref<ComponentSlots<typeof buttonGroupTheme> | undefined>>
}

/** Provided by `ButtonGroup` to its Buttons; each Button re-provides `null` so only the group's own Buttons read it. */
export const buttonGroupContextKey: InjectionKey<ButtonGroupContext | null> = Symbol('herouse-button-group')
