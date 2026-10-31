import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { nextTick, watch } from 'vue'

import type { ListBoxValue } from '@/components/list-box/ListBox.types'
import type { CollectionValue } from '@/components/list-box/useCollectionModel'
import { createChangeEvent } from '@/utils/formControlEvents'

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
  /** Emits `change` for committed custom text the selection write didn't already report. */
  onChange: (event: Event) => void
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

  // The text as the input gained focus or as of the last commit or selection write (which reports its own
  // `change`): committing it again isn't a change
  let committedText = inputValue.value

  const syncCommittedText = () => {
    committedText = inputValue.value
  }

  watch(selectedKey, syncCommittedText, { flush: 'sync' })

  watch(
    isFocused,
    (focused) => {
      if (focused) syncCommittedText()
    },
    { flush: 'sync' },
  )

  // Multiple selection keeps the text as a filter: only single selection commits it as the value
  const commitCustomValue = () => {
    if (isMultiple()) {
      options.close()
      return
    }

    const isNewText = inputValue.value !== committedText
    syncCommittedText()

    // Clearing a selection emits `change` itself
    if (isNewText && selection.value == null) options.onChange(createChangeEvent())

    isKeepingText = true
    selection.value = null

    nextTick(() => {
      isKeepingText = false
    })

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
