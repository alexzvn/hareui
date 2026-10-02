import type { InjectionKey, Ref } from 'vue'
import { computed, inject } from 'vue'

export interface FieldsetContext {
  /** Whether the surrounding `<Fieldset disabled>` disables its descendants. */
  disabled: Readonly<Ref<boolean>>
}

export const fieldsetContextKey: InjectionKey<FieldsetContext> = Symbol('herouse-fieldset')

/**
 * A control's effective disabled state: its own `disabled` prop or a disabled ancestor `Fieldset`.
 * Native controls are already disabled by the browser; this keeps `data-disabled`, `aria-disabled`
 * and div-based controls in sync, like HeroUI's fieldset context.
 */
export function useFieldsetDisabled(own: () => boolean | undefined) {
  const fieldset = inject(fieldsetContextKey, null)
  return computed(() => !!own() || !!fieldset?.disabled.value)
}
