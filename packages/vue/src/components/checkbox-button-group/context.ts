import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type checkboxTheme from '../checkbox/theme'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '../../types/tv'
import type theme from './theme'

export interface CheckboxButtonGroupContext {
  /** The selected values. */
  selected: Readonly<Ref<string[]>>
  disabled: Readonly<Ref<boolean>>
  invalid: Readonly<Ref<boolean>>
  readonly: Readonly<Ref<boolean>>
  /** Ids of the group description / error, added to each item's `aria-describedby`. */
  describedBy: Readonly<Ref<string | undefined>>
  /** Group-level variants; each item resolves the theme with them plus its own `customIndicator` / `withIcon`. */
  layout: Readonly<Ref<ComponentVariants<typeof theme>['layout'] | undefined>>
  variant: Readonly<Ref<ComponentVariants<typeof theme>['variant'] | undefined>>
  /** The `checkbox` theme, used by the default indicator. */
  checkboxUi: ComputedRef<ComponentUI<typeof checkboxTheme>>
  uiOverrides: Readonly<Ref<ComponentSlots<typeof theme> | undefined>>
}

export const checkboxButtonGroupContextKey: InjectionKey<CheckboxButtonGroupContext> = Symbol('hareui-checkbox-button-group')
