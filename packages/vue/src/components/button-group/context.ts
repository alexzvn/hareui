import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { ComponentUI } from '@/types/tv'

import type buttonGroupTheme from './theme'

export type ButtonGroupContext = {
  variant: Readonly<Ref<ButtonProps['variant']>>
  size: Readonly<Ref<ButtonProps['size']>>
  disabled: Readonly<Ref<boolean | undefined>>
  fullWidth: Readonly<Ref<boolean | undefined>>
  separator: Readonly<Ref<boolean>>
  /** The group's first element child; its button renders no separator element (HeroUI places none there). */
  firstChild: Readonly<Ref<Element | null>>
  /** The group's slot classes, its `ui` prop layered in. */
  ui: ComputedRef<ComponentUI<typeof buttonGroupTheme>>
}

/** Provided by `ButtonGroup` to its Buttons; each Button re-provides `null` so only the group's own Buttons read it. */
export const buttonGroupContextKey: InjectionKey<ButtonGroupContext | null> =
  Symbol('hareui-button-group')
