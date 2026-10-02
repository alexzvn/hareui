import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type toggleButtonGroupTheme from '../theme/toggleButtonGroup'
import type { ComponentSlots, ComponentUI } from '../types/tv'
import type { ToggleButtonProps } from './ToggleButton.vue'

export interface ToggleButtonGroupContext {
  selectionMode: Readonly<Ref<'single' | 'multiple'>>
  selected: Readonly<Ref<string[]>>
  disabled: Readonly<Ref<boolean>>
  /** Applies a press on the button with `value`, honoring selection mode. */
  toggle: (value: string) => void
  size: Readonly<Ref<ToggleButtonProps['size']>>
  separator: Readonly<Ref<boolean>>
  ui: ComputedRef<ComponentUI<typeof toggleButtonGroupTheme>>
  uiOverrides: Readonly<Ref<ComponentSlots<typeof toggleButtonGroupTheme> | undefined>>
}

export const toggleButtonGroupContextKey: InjectionKey<ToggleButtonGroupContext> = Symbol('herouse-toggle-button-group')
