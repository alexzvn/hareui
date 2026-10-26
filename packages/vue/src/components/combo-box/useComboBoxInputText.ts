import type { Ref } from 'vue'
import { computed, getCurrentInstance, ref } from 'vue'

import type { ListBoxValue } from '@/components/list-box/ListBox.types'

type ComboBoxInputTextOptions = {
  /** The component's `defineModel('inputValue')` ref. */
  model: Ref<string | undefined>
  /** The uncontrolled text before any input (read once). */
  defaultText: () => string
  isMultiple: () => boolean
  /** The current selected value in single mode. */
  selectedKey: () => ListBoxValue | null
  resolveItemText: (value: ListBoxValue | null) => string
}

// The input text: `v-model:input-value` wins when bound, else a local value
export const useComboBoxInputText = (options: ComboBoxInputTextOptions) => {
  const { model, defaultText, isMultiple, selectedKey, resolveItemText } = options

  // Whether the parent binds `v-model:input-value` (defineModel keeps a local value when it doesn't)
  const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
  const isControlled = () => ['inputValue', 'input-value'].some((key) => key in vnodeProps)

  const uncontrolledText = ref(defaultText())

  const inputValue = computed<string>({
    get: () => (isControlled() ? (model.value ?? '') : uncontrolledText.value),
    set: (value) => {
      uncontrolledText.value = value
      model.value = value
    },
  })

  // Takes the key explicitly after a write: a bound `v-model` only reflects it once the parent re-renders
  const resetInputValue = (key = selectedKey()) => {
    inputValue.value = isMultiple() ? '' : resolveItemText(key)
  }

  // Mirrors an outside selection change into the local text without emitting `update:inputValue`
  const mirrorText = (text: string) => {
    if (!isControlled()) uncontrolledText.value = text
  }

  return { inputValue, resetInputValue, mirrorText }
}
