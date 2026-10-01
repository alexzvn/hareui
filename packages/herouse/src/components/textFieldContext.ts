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
  /** Input attributes passed to the TextField (`maxlength`, `autofocus`, `aria-label`, …), forwarded to its input. */
  inputAttrs: Readonly<Ref<Record<string, unknown>>>
  /** The field's value. An Input without its own `v-model` reads and writes it; one with its own `v-model` mirrors into it. */
  model: Ref<string | number | undefined>
  name: Readonly<Ref<string | undefined>>
  type: Readonly<Ref<string>>
}

export const textFieldContextKey: InjectionKey<TextFieldContext> = Symbol('herouse-textfield')
