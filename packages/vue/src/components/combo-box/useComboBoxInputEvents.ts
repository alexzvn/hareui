import type { ComputedRef, Ref, ShallowRef, WritableComputedRef } from 'vue'

import type { CollectionValue } from '@/components/list-box/useCollectionModel'

import type { ComboBoxProps, FocusStrategy } from './ComboBox.types'

type ComboBoxInputEventsOptions = {
  props: Pick<ComboBoxProps, 'readonly' | 'menuTrigger' | 'allowsEmptyCollection'>
  input: Readonly<ShallowRef<HTMLInputElement | null>>
  /** The combo box root element; focus moving inside it or into `content` isn't a blur. */
  rootEl: () => HTMLElement | undefined
  content: Readonly<ShallowRef<{ $el: Node } | null>>
  isDisabled: Readonly<Ref<boolean>>
  isMultiple: () => boolean
  isFocused: Ref<boolean>
  isFocusVisible: Ref<boolean>
  isOpen: ComputedRef<boolean>
  isShowingAll: Ref<boolean>
  filteredCount: ComputedRef<number>
  inputValue: Ref<string>
  selection: WritableComputedRef<CollectionValue, CollectionValue | undefined>
  setHighlight: (el: HTMLElement | null) => void
  clearHighlightAfterReka: () => void
  open: (strategy: FocusStrategy, trigger: 'focus' | 'input' | 'manual') => void
  close: () => void
  commitValue: () => void
  commitValidation: () => void
}

// Typing, focus and blur on the input, and presses on the trigger button (RAC `useComboBox`)
export const useComboBoxInputEvents = (options: ComboBoxInputEventsOptions) => {
  const { props, input, isFocused, isFocusVisible, isOpen, filteredCount, inputValue, selection } =
    options

  // RAC clears the selection with the text. Reka then re-highlights its first option, while RAC keeps no focused
  // option, so Tab / Enter commit the cleared value
  const clearSelectionWithText = () => {
    const hasSelection = selection.value != null
    selection.value = null

    if (hasSelection) options.clearHighlightAfterReka()
  }

  // RAC `useComboBoxState` effect when the text changes
  const onInputTextChange = () => {
    options.setHighlight(null)
    options.isShowingAll.value = false

    if (!options.isMultiple() && inputValue.value === '') clearSelectionWithText()

    const hasResults = filteredCount.value > 0 || props.allowsEmptyCollection
    const shouldOpen =
      isFocused.value && hasResults && !isOpen.value && props.menuTrigger !== 'manual'

    if (shouldOpen) {
      options.open(null, 'input')
      return
    }

    const shouldClose = isOpen.value && !props.allowsEmptyCollection && filteredCount.value === 0
    if (shouldClose) options.close()
  }

  const onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    if (props.readonly) return

    inputValue.value = value
    onInputTextChange()
  }

  // The text and selection when the input gained focus: a blur after a change commits validation
  const takeSnapshot = () => ({
    text: inputValue.value,
    selection: JSON.stringify(selection.value),
  })

  let snapshotOnFocus = { text: '', selection: '' }

  const hasChangedSinceFocus = () => {
    const now = takeSnapshot()

    return now.text !== snapshotOnFocus.text || now.selection !== snapshotOnFocus.selection
  }

  // Set while a trigger press moves focus into the input: the press toggles the popover itself
  let shouldSkipFocusOpen = false

  const onFocus = (event: FocusEvent) => {
    isFocusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')

    if (isFocused.value) return

    isFocused.value = true
    snapshotOnFocus = takeSnapshot()
    if (props.menuTrigger === 'focus' && !shouldSkipFocusOpen) options.open(null, 'focus')
  }

  // Focus moving to the trigger or into the popover isn't a blur of the field
  const isInsideField = (node: Node) => {
    return options.rootEl()?.contains(node) || options.content.value?.$el?.contains?.(node)
  }

  const onBlur = (event: FocusEvent) => {
    isFocusVisible.value = false

    const next = event.relatedTarget as Node | null
    if (next && isInsideField(next)) return

    isFocused.value = false
    options.commitValue()

    if (hasChangedSinceFocus()) options.commitValidation()
  }

  // RAC: press start toggles, focus stays in the input
  const pressTrigger = (strategy: FocusStrategy) => {
    if (options.isDisabled.value || props.readonly) return

    const isOpenOnPress = isOpen.value
    shouldSkipFocusOpen = true
    input.value?.focus()
    shouldSkipFocusOpen = false

    if (isOpenOnPress) {
      options.close()
      return
    }

    options.open(strategy, 'manual')
  }

  const onTriggerPointerdown = (event: PointerEvent) => {
    if (event.button !== 0) return

    event.preventDefault()
    pressTrigger(null)
  }

  const onTriggerClick = (event: MouseEvent) => {
    // Keyboard / programmatic clicks (pointer presses are handled on pointerdown)
    if (event.detail === 0) pressTrigger('first')
  }

  return { onInput, onFocus, onBlur, onTriggerPointerdown, onTriggerClick }
}
