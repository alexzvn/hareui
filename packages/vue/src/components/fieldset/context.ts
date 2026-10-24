import type { InjectionKey, Ref } from 'vue'
import { computed, inject } from 'vue'

export type FieldsetContext = {
  /** Whether the surrounding `<Fieldset disabled>` (or a disabled or submitting `Form`) disables its descendants. */
  disabled: Readonly<Ref<boolean>>
}

export const fieldsetContextKey: InjectionKey<FieldsetContext> = Symbol('hareui-fieldset')

/**
 * A control's effective disabled state: its own `disabled` prop, a disabled ancestor `Fieldset`, or a disabled or
 * submitting ancestor `Form`.
 * Native controls are already disabled by the browser; this keeps `data-disabled`, `aria-disabled`
 * and div-based controls in sync, like HeroUI's fieldset context.
 */
export function useFieldsetDisabled(own: () => boolean | undefined) {
  const fieldset = inject(fieldsetContextKey, null)
  return computed(() => !!own() || !!fieldset?.disabled.value)
}
