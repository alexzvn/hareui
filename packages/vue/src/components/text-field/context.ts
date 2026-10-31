import type { InjectionKey, Ref } from 'vue'

import type { ModelModifiers } from '@/utils/modelModifiers'

/** State a `TextField` provides to the `Input`, `TextArea` and field parts rendered inside it. */
export type TextFieldContext = {
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
  /**
   * The field's `v-model` modifiers. It applies `nullable` / `optional` itself; an Input or TextArea without its own
   * `v-model` applies `lazy`, `trim` and `number` to its native control. Read once, as `v-model` modifiers are static.
   */
  modelModifiers: Readonly<ModelModifiers>
  name: Readonly<Ref<string | undefined>>
  type: Readonly<Ref<string>>
}

/** Injection key for the enclosing `TextField`'s {@link TextFieldContext}; `inject` it to build a custom field control. */
export const textFieldContextKey: InjectionKey<TextFieldContext> = Symbol('hareui-textfield')

// Attributes passed to a field component that belong to its input (as in HeroUI, where the field passes them to its
// Input), matched case-insensitively so `maxlength` and `maxLength` both work. Everything else stays on the wrapper.
const INPUT_ATTRS = new Set([
  'autofocus',
  'autocomplete',
  'autocapitalize',
  'autocorrect',
  'spellcheck',
  'inputmode',
  'enterkeyhint',
  'maxlength',
  'minlength',
  'pattern',
  'min',
  'max',
  'step',
  'size',
  'list',
  'form',
  'dirname',
  'aria-label',
  'aria-labelledby',
  'aria-details',
  'aria-errormessage',
  'aria-controls',
  'aria-activedescendant',
  'aria-autocomplete',
  'aria-haspopup',
  'onfocus',
  'onblur',
])

/**
 * Splits a field's fallthrough attributes into the input's and the wrapper's. `aria-describedby` goes to neither:
 * the field merges it into the input's own description ids.
 */
export const splitInputAttrs = (attrs: Record<string, unknown>) => {
  const input: Record<string, unknown> = {}
  const root: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (INPUT_ATTRS.has(key.toLowerCase())) {
      input[key] = value
      continue
    }

    if (key !== 'aria-describedby') root[key] = value
  }

  return { input, root }
}
