// Internal: focus hand-off between Select's trigger and its listbox popover, following RAC Select.
import { useTemplateRef } from 'vue'

/** The option that takes focus when the popover opens with nothing selected. */
export type SelectOpenStrategy = 'first' | 'last'

type SelectListFocusOptions = {
  /** Whether nothing is selected. */
  isPlaceholder: () => boolean
  /** Moves focus back to the trigger button. */
  focusTrigger: () => void
}

export const useSelectListFocus = ({ isPlaceholder, focusTrigger }: SelectListFocusOptions) => {
  const content = useTemplateRef<{ $el: HTMLElement }>('content')
  const listBox = useTemplateRef<{ highlightSelected: () => Promise<void> | undefined }>('listBox')

  let openStrategy: SelectOpenStrategy = 'first'

  const setOpenStrategy = (strategy: SelectOpenStrategy) => {
    openStrategy = strategy
  }

  // Focus moves into the list on open, as in RAC: the first selected option, else the first option (the last one
  // when opened with ArrowUp), else (empty collection) the listbox itself
  const onOpenAutoFocus = async (event: Event) => {
    event.preventDefault()

    const strategy = openStrategy
    openStrategy = 'first'
    await listBox.value?.highlightSelected()

    const list = content.value?.$el.querySelector<HTMLElement>('[data-slot=list-box]')
    if (!list) return

    // Reka's End key moves the highlight (and focus) to the last enabled option
    if (strategy === 'last' && isPlaceholder()) {
      list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', cancelable: true }))
    }

    if (!list.contains(document.activeElement)) list.focus()
  }

  // Reka's non-modal popover skips the trigger refocus after an outside press; RAC restores focus to the trigger
  // unless the press moved it to another element
  const onCloseAutoFocus = (event: Event) => {
    event.preventDefault()

    const active = document.activeElement
    const isFocusUnclaimed =
      !active || active === document.body || !!content.value?.$el.contains(active)

    if (isFocusUnclaimed) focusTrigger()
  }

  return { setOpenStrategy, onOpenAutoFocus, onCloseAutoFocus }
}
