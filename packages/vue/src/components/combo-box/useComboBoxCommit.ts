import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { nextTick, watch } from 'vue'

import type { ListBoxValue } from '@/components/list-box/ListBox.types'
import type { CollectionValue } from '@/components/list-box/useCollectionModel'

import type { ComboBoxProps } from './ComboBox.types'

type ComboBoxCommitOptions = {
  props: Pick<ComboBoxProps, 'allowsCustomValue'>
  isMultiple: () => boolean
  isFocused: Ref<boolean>
  selection: WritableComputedRef<CollectionValue, CollectionValue | undefined>
  selectedKey: ComputedRef<ListBoxValue | null>
  selectedText: ComputedRef<string>
  inputValue: Ref<string>
  resetInputValue: () => void
  /** Writes the local text without emitting `update:inputValue`. */
  mirrorText: (text: string) => void
  close: () => void
}

// RAC `commitSelection` / `commitCustomValue` / `commitValue` / `revert`
export const useComboBoxCommit = (options: ComboBoxCommitOptions) => {
  const { props, isMultiple, isFocused, selection, selectedKey, selectedText, inputValue } = options

  const commitSelection = () => {
    options.resetInputValue()
    options.close()
  }

  // RAC sets `lastValueRef` first so clearing the selection doesn't reset the custom text
  let isKeepingText = false

  const commitCustomValue = () => {
    if (!isMultiple()) {
      isKeepingText = true
      selection.value = null

      nextTick(() => {
        isKeepingText = false
      })
    }

    options.close()
  }

  const commitValue = () => {
    const isCustomText = props.allowsCustomValue && inputValue.value !== selectedText.value
    if (isCustomText) {
      commitCustomValue()
      return
    }

    commitSelection()
  }

  const revert = () => {
    const shouldKeepCustomText = props.allowsCustomValue && selectedKey.value == null
    if (shouldKeepCustomText) {
      commitCustomValue()
      return
    }

    commitSelection()
  }

  // When the selection changes from outside (v-model), mirror the text like RAC
  watch(selectedText, () => {
    if (!isMultiple() && !isFocused.value && !isKeepingText) options.mirrorText(selectedText.value)
  })

  return { commitSelection, commitValue, revert }
}
