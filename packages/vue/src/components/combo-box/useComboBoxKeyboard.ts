import type { ComputedRef, Ref } from 'vue'

import type { ListBoxValue } from '@/components/list-box/ListBox.types'

import type { ComboBoxProps, FocusStrategy } from './ComboBox.types'
import type { NavigationKey } from './useComboBoxHighlight'

type ComboBoxKeyboardOptions = {
  props: Pick<ComboBoxProps, 'readonly'>
  isMultiple: () => boolean
  isOpen: ComputedRef<boolean>
  inputValue: Ref<string>
  selectedKey: ComputedRef<ListBoxValue | null>
  selectedText: ComputedRef<string>
  highlighted: ComputedRef<HTMLElement | null>
  itemValueOf: (el: HTMLElement) => ListBoxValue | undefined
  setHighlight: (el: HTMLElement | null) => void
  selectHighlighted: () => void
  navigate: (key: NavigationKey) => void
  open: (strategy: FocusStrategy, trigger: 'manual') => void
  commitSelection: () => void
  commitValue: () => void
  revert: () => void
}

type KeyHandler = (event: KeyboardEvent) => void

// RAC `useComboBox` keyboard handling on the input; DOM focus never leaves it
export const useComboBoxKeyboard = (options: ComboBoxKeyboardOptions) => {
  const { props, isMultiple, isOpen, inputValue, selectedKey, selectedText, highlighted } = options

  const onEnter = (event: KeyboardEvent) => {
    if (isOpen.value) event.preventDefault()

    const option = isOpen.value ? highlighted.value : null
    if (!option) {
      options.commitValue()
      return
    }

    // Re-picking the selected option just commits
    const value = options.itemValueOf(option)
    const isSelectedOption = !isMultiple() && value !== undefined && value === selectedKey.value
    if (isSelectedOption) {
      options.commitSelection()
      return
    }

    options.selectHighlighted()
  }

  const onTab = () => {
    if (!isOpen.value) return

    if (highlighted.value) {
      options.selectHighlighted()
      return
    }

    options.commitValue()
  }

  const onEscape = (event: KeyboardEvent) => {
    if (isOpen.value || inputValue.value !== selectedText.value) event.preventDefault()

    options.revert()
  }

  const onArrowVertical = (event: KeyboardEvent) => {
    event.preventDefault()

    const key = event.key as 'ArrowDown' | 'ArrowUp'
    if (!isOpen.value) {
      options.open(key === 'ArrowDown' ? 'first' : 'last', 'manual')
      return
    }

    options.navigate(key)
  }

  const onPageJump = (event: KeyboardEvent) => {
    if (!isOpen.value) return

    event.preventDefault()
    options.navigate(event.key as NavigationKey)
  }

  const onArrowHorizontal = () => {
    options.setHighlight(null)
  }

  const keyHandlers = new Map<string, KeyHandler>([
    ['Enter', onEnter],
    ['Tab', onTab],
    ['Escape', onEscape],
    ['ArrowDown', onArrowVertical],
    ['ArrowUp', onArrowVertical],
    ['Home', onPageJump],
    ['End', onPageJump],
    ['PageUp', onPageJump],
    ['PageDown', onPageJump],
    ['ArrowLeft', onArrowHorizontal],
    ['ArrowRight', onArrowHorizontal],
  ])

  const onKeydown = (event: KeyboardEvent) => {
    if (event.isComposing || props.readonly) return

    keyHandlers.get(event.key)?.(event)
  }

  return { onKeydown }
}
