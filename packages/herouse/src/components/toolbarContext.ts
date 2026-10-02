import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type toolbarTheme from '../theme/toolbar'
import type { ComponentSlots, ComponentUI } from '../types/tv'

export interface ToolbarContext {
  orientation: Readonly<Ref<'horizontal' | 'vertical'>>
  ui: ComputedRef<ComponentUI<typeof toolbarTheme>>
  uiOverrides: Readonly<Ref<ComponentSlots<typeof toolbarTheme> | undefined>>
}

/**
 * Provided by `Toolbar` to everything inside it (React Aria's `ToggleButtonGroupContext` / `SeparatorContext`):
 * ToggleButtonGroup and ButtonGroup take the toolbar's orientation, Separator the perpendicular one, and a nested Toolbar
 * or multiple-selection ToggleButtonGroup renders as `role="group"` without its own arrow-key handling.
 */
export const toolbarContextKey: InjectionKey<ToolbarContext | null> = Symbol('herouse-toolbar')
