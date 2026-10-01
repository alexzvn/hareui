import type { InjectionKey, Ref } from 'vue'

export interface TextFieldContext {
  /** Id applied to the field's input. */
  id: Readonly<Ref<string>>
  /** Space-separated ids of the rendered description and error elements. */
  describedBy: Readonly<Ref<string | undefined>>
  invalid: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  required: Readonly<Ref<boolean>>
  readonly: Readonly<Ref<boolean>>
  variant: Readonly<Ref<'primary' | 'secondary' | undefined>>
  fullWidth: Readonly<Ref<boolean>>
  /** `aria-label` / `aria-labelledby` passed to the TextField, forwarded to its input. */
  ariaLabel: Readonly<Ref<string | undefined>>
  ariaLabelledby: Readonly<Ref<string | undefined>>
}

export const textFieldContextKey: InjectionKey<TextFieldContext> = Symbol('herouse-textfield')
