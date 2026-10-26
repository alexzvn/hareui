import { shallowReactive } from 'vue'

import type { ListBoxItem } from '@/components/list-box/ListBox.types'
import { itemText } from '@/components/list-box/listBoxCollection'
import { useTypeahead } from '@/components/list-box/useTypeahead'

import type { FocusStrategy } from './useAutocompleteOpen'

/** What `useAutocompleteTrigger` reads from the component. */
export type AutocompleteTriggerOptions<T extends ListBoxItem> = {
  button: () => HTMLButtonElement | undefined
  trigger: () => HTMLElement | undefined
  isDisabled: () => boolean
  isOpen: () => boolean
  setOpen: (value: boolean, strategy?: FocusStrategy) => void
  /** Whether Backspace / Delete clear the selection (the `clearable` prop). */
  isClearable: () => boolean
  clear: () => void
  /** Typeahead candidates and the current selection. */
  typeahead: {
    options: () => T[]
    currentValue: () => T['value'] | undefined
    select: (item: T) => void
  }
}

/** The trigger group (RAC Select trigger): press and key handling, and its hover / focus states. */
export const useAutocompleteTrigger = <T extends ListBoxItem>(
  options: AutocompleteTriggerOptions<T>,
) => {
  const { button, trigger, isDisabled, isOpen, setOpen } = options

  // RAC Group states
  const state = shallowReactive({ isHovered: false, isFocusWithin: false, isFocusVisible: false })

  // Interactive content (clear button, tag remove buttons) handles its own presses
  const isOwnPress = (event: Event) => {
    const interactive = (event.target as Element | null)?.closest('button, [role=button], a, input')

    return !interactive || interactive === button()
  }

  // RAC Select trigger: a mouse press toggles on press start (so press-drag-release can select), and the click
  // that ends it is ignored. Touch, pen and keyboard toggle on click.
  let isMousePress = false

  const onTriggerPointerdown = (event: PointerEvent) => {
    isMousePress = false

    const isPrimaryMouse = event.pointerType === 'mouse' && event.button === 0
    if (isDisabled() || !isPrimaryMouse || !isOwnPress(event)) return

    isMousePress = true
    button()?.focus()
    setOpen(!isOpen(), null)
  }

  // Focus stays where the press put it (the button, or the search field once open)
  const onTriggerMousedown = (event: MouseEvent) => {
    if (isMousePress) event.preventDefault()
  }

  const onTriggerClick = (event: MouseEvent) => {
    if (isDisabled() || !isOwnPress(event)) return

    const isKeyboardClick = event.detail === 0
    if (isMousePress && !isKeyboardClick) {
      isMousePress = false
      return
    }

    setOpen(!isOpen(), isKeyboardClick ? 'first' : null)
  }

  // Typing on the closed trigger selects the next option whose text starts with the typed string (see
  // `TypeaheadStart`)
  const typeahead = useTypeahead({ start: 'next' })

  const onTypeahead = (event: KeyboardEvent) => {
    const source = options.typeahead

    typeahead.onKeydown(event, {
      source: () => ({
        items: source.options(),
        text: itemText,
        disabled: (item) => !!item.disabled,
        isCurrent: (item) => item.value === source.currentValue(),
      }),
      select: source.select,
    })
  }

  const onButtonKeydown = (event: KeyboardEvent) => {
    if (isDisabled()) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true, event.key === 'ArrowDown' ? 'first' : 'last')

      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(!isOpen(), 'first')

      return
    }

    const isClearKey = event.key === 'Backspace' || event.key === 'Delete'
    if (isClearKey && options.isClearable() && !isOpen()) {
      event.preventDefault()
      options.clear()

      return
    }

    onTypeahead(event)
  }

  const onPointerenter = (event: PointerEvent) => {
    state.isHovered = event.pointerType === 'mouse'
  }

  const onPointerleave = () => {
    state.isHovered = false
  }

  const onFocusIn = (event: FocusEvent) => {
    state.isFocusWithin = true
    state.isFocusVisible = event.target === button() && button()?.matches(':focus-visible') === true
  }

  const onFocusOut = (event: FocusEvent) => {
    const isInsideTrigger =
      event.relatedTarget instanceof Node && trigger()?.contains(event.relatedTarget)

    if (isInsideTrigger) return

    state.isFocusWithin = false
    state.isFocusVisible = false
  }

  return {
    state,
    onTriggerPointerdown,
    onTriggerMousedown,
    onTriggerClick,
    onButtonKeydown,
    onPointerenter,
    onPointerleave,
    onFocusIn,
    onFocusOut,
  }
}
