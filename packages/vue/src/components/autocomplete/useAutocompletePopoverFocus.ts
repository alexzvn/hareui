import { nextTick, watch } from 'vue'

import type { ListBoxValue } from '@/components/list-box/ListBox.types'
import type { CollectionRow } from '@/components/list-box/listBoxCollection'
import type { OutsideEvent } from '@/composables/nestedLayer'
import { outsideEventTarget } from '@/composables/nestedLayer'

import type { ListboxContext } from './ListboxBridge'
import type { FocusStrategy } from './useAutocompleteOpen'
import type { NavigationKey } from './useAutocompleteVirtualFocus'

/** What `useAutocompletePopoverFocus` reads from the component. */
export type AutocompletePopoverFocusOptions = {
  isOpen: () => boolean
  /** Whether the popover has a search field (the `search` prop). */
  hasSearch: () => boolean
  searchInput: () => HTMLInputElement | undefined
  /** An element inside the popover, to find the popover from. */
  listElement: () => HTMLElement | undefined
  /** The trigger group; presses on it are not outside presses. */
  trigger: () => HTMLElement | undefined
  /** Reka's listbox context, which applies selections. */
  listbox: () => ListboxContext | undefined
  getOpenStrategy: () => FocusStrategy
  isSelected: (value: ListBoxValue) => boolean
  /** The virtual focus (`useAutocompleteVirtualFocus`). */
  virtualFocus: {
    focusedKey: () => ListBoxValue | null
    enabledRows: () => CollectionRow[]
    setFocusKey: (value: ListBoxValue | null) => void
    navigate: (key: NavigationKey) => void
  }
}

const NAVIGATION_KEYS = new Set<string>([
  'ArrowDown',
  'ArrowUp',
  'Home',
  'End',
  'PageUp',
  'PageDown',
])

const isNavigationKey = (key: string): key is NavigationKey => NAVIGATION_KEYS.has(key)

/** Focus inside the popover: where it lands on open, where it returns on close, and the keys it handles. */
export const useAutocompletePopoverFocus = (options: AutocompletePopoverFocusOptions) => {
  const { isOpen, hasSearch, searchInput, listElement, trigger, listbox, virtualFocus } = options
  const { focusedKey, enabledRows, setFocusKey, navigate } = virtualFocus

  const popoverElement = () => {
    return listElement()?.closest<HTMLElement>('[data-slot=autocomplete-popover]') ?? undefined
  }

  // RAC FocusScope `restoreFocus`: focus returns to what was focused before opening
  let focusBeforeOpen: Element | null = null

  watch(
    isOpen,
    (isNowOpen) => {
      if (isNowOpen) focusBeforeOpen = document.activeElement
    },
    { flush: 'sync' },
  )

  // RAC: the first selected option, else the first / last option when opened from the keyboard, else nothing
  const resolveInitialFocus = () => {
    const enabled = enabledRows()
    const selected = enabled.find((row) => options.isSelected(row.item.value))
    if (selected) return selected

    const strategy = options.getOpenStrategy()
    if (strategy === 'first') return enabled[0]
    if (strategy === 'last') return enabled.at(-1)

    return undefined
  }

  const onOpenAutoFocus = async (event: Event) => {
    event.preventDefault()

    // After Reka's own mount highlight (which falls back to the first option)
    await nextTick()
    await nextTick()
    await nextTick()

    const focusTarget = hasSearch() ? searchInput() : popoverElement()
    focusTarget?.focus()

    setFocusKey(resolveInitialFocus()?.item.value ?? null)
  }

  const canRestoreFocus = (element: Element | null): element is HTMLElement => {
    return element instanceof HTMLElement && element !== document.body && element.isConnected
  }

  const onCloseAutoFocus = (event: Event) => {
    event.preventDefault()

    // Only when focus was still inside the popover (or lost), as RAC
    const active = document.activeElement
    const isFocusElsewhere =
      !!active && active !== document.body && !popoverElement()?.contains(active)

    if (isFocusElsewhere) return
    if (canRestoreFocus(focusBeforeOpen)) focusBeforeOpen.focus()
  }

  // Presses on the trigger toggle it themselves; don't let them count as outside presses
  const onOutside = (event: Event) => {
    const target = outsideEventTarget(event as OutsideEvent)
    if (target instanceof Node && trigger()?.contains(target)) event.preventDefault()
  }

  // Keyboard selection of the focused option (it may be scrolled out and unmounted, so not a click)
  const selectFocused = () => {
    const value = focusedKey()
    const isEnabled = value != null && enabledRows().some((row) => row.item.value === value)
    if (!isEnabled) return

    // Through Reka, so it counts as a user selection (a programmatic model change makes Reka re-highlight and,
    // when virtualized, scroll to the top)
    listbox()?.onValueChange(value)
  }

  // Keys from the search field, or from the popover itself when there is none
  const onPopoverKeydown = (event: KeyboardEvent) => {
    if (event.isComposing) return

    const isFromSearch = event.target === searchInput()
    if (!isFromSearch && event.target !== popoverElement()) return

    if (isNavigationKey(event.key)) {
      event.preventDefault()
      navigate(event.key)

      return
    }

    // Space types into the search field; from the popover itself it selects, as Enter does
    const isSelectKey = event.key === 'Enter' || (event.key === ' ' && !isFromSearch)
    if (!isSelectKey) return

    event.preventDefault()
    selectFocused()
  }

  return { onOpenAutoFocus, onCloseAutoFocus, onOutside, onPopoverKeydown }
}
