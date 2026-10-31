import type { Ref } from 'vue'
import { computed, getCurrentInstance, inject, watch } from 'vue'

import { textFieldContextKey } from '@/components/text-field/context'
import type { ModelModifiers } from '@/utils/modelModifiers'
import { createTextModelDirective } from '@/utils/modelModifiers'

type TextValue = string | number | null | undefined

/** Options of {@link useTextControlModel}. */
type UseTextControlModelOptions = {
  /** The control's own `v-model`. */
  model: Ref<TextValue>
  /** The control's own `v-model` modifiers. */
  modifiers: ModelModifiers
  /** The initial value when uncontrolled. */
  defaultValue?: string | number
}

/**
 * The value of a text control (Input, TextArea, InputGroup) and the `v-text-model` directive for its native
 * `<input>` / `<textarea>`. Inside a `TextField`, a control without its own `v-model` uses the field's value and
 * modifiers; with one, it mirrors into the field so the field's `validate` and form reset see what the user typed.
 */
export const useTextControlModel = (options: UseTextControlModelOptions) => {
  const { model, modifiers, defaultValue } = options
  const field = inject(textFieldContextKey, null)

  const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
  const hasVModel = ['modelValue', 'model-value', 'onUpdate:modelValue'].some(
    (key) => key in vnodeProps,
  )

  const isOwnModel = !field || hasVModel

  // `lazy` / `trim` / `number` act on the native control, so without its own v-model the control takes the field's
  const vTextModel = createTextModelDirective(() =>
    isOwnModel ? modifiers : field!.modelModifiers,
  )

  const value = computed<TextValue>({
    get: () => (isOwnModel ? model.value : field!.model.value),
    set: (v) => {
      if (isOwnModel) model.value = v
      if (field) field.model.value = v ?? undefined
    },
  })

  if (value.value === undefined && defaultValue !== undefined) value.value = defaultValue

  if (field && isOwnModel) {
    watch(
      model,
      (v) => {
        field.model.value = v ?? undefined
      },
      { immediate: true },
    )

    // The field writes its model on form reset; pass that back to the parent's v-model
    watch(field.model, (v) => {
      if (v !== model.value) model.value = v
    })
  }

  return { field, value, vTextModel }
}
