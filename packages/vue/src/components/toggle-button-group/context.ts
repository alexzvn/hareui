import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { ToggleButtonProps } from '@/components/toggle-button/ToggleButton.types'
import type { ComponentUI } from '@/types/tv'

import type toggleButtonGroupTheme from './theme'

export type ToggleButtonGroupContext = {
  selectionMode: Readonly<Ref<'single' | 'multiple'>>
  selected: Readonly<Ref<string[]>>
  disabled: Readonly<Ref<boolean>>
  /** Applies a press on the button with `value`, honoring selection mode. */
  toggle: (value: string) => void
  size: Readonly<Ref<ToggleButtonProps['size']>>
  separator: Readonly<Ref<boolean>>
  /** The group's first element child; its button renders no separator element (HeroUI places none there). */
  firstChild: Readonly<Ref<Element | null>>
  /** False inside a Toolbar: the toolbar owns arrow-key focus, so the buttons are plain tab stops (React Aria). */
  roving: boolean
  /** The group's slot classes, its `ui` prop layered in. */
  ui: ComputedRef<ComponentUI<typeof toggleButtonGroupTheme>>
}

export const toggleButtonGroupContextKey: InjectionKey<ToggleButtonGroupContext> = Symbol(
  'hareui-toggle-button-group',
)
