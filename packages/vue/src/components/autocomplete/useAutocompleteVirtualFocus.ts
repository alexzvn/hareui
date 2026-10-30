import { computed, nextTick, reactive, ref, watch } from 'vue'

import type { ListBoxItem, ListBoxValue } from '@/components/list-box/ListBox.types'
import type { CollectionRow } from '@/components/list-box/listBoxCollection'
import { useKeyboardModality } from '@/composables/useKeyboardModality'

import type { AutocompleteProps } from './Autocomplete.types'

/** What `useAutocompleteVirtualFocus` reads from the component. */
export type AutocompleteVirtualFocusOptions = {
  /** Id of the listbox; option ids derive from it. */
  listboxId: () => string
  /** The scrolling listbox element. */
  listElement: () => HTMLElement | undefined
  /** The flat, filtered option rows (ListBoxRows `rows()`). */
  rows: () => CollectionRow[]
  /** Virtualized: scrolls the row at `index` of `rows()` into view (ListBoxRows `scrollToIndex`). */
  scrollToIndex: (index: number) => void
  /** Every option, filtered or not. */
  options: () => ListBoxItem[]
  /** The `virtualize` prop. */
  virtualize: () => AutocompleteProps['virtualize']
  isDisabled: () => boolean
  isOpen: () => boolean
}

/** Keys that move the virtual focus through the options. */
export type NavigationKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'PageUp' | 'PageDown'

const DEFAULT_ROW_SIZE = 50

const clamp = (value: number, { min, max }: { min: number; max: number }) => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Virtual focus (RAC `focusedKey`): DOM focus stays in the search field or on the popover while one option is
 * marked focused. Tracked by value, not element: virtualized rows unmount when scrolled out.
 */
export const useAutocompleteVirtualFocus = (options: AutocompleteVirtualFocusOptions) => {
  const { listboxId, listElement, rows, scrollToIndex, virtualize, isDisabled, isOpen } = options

  const keyboardModality = useKeyboardModality()
  const focusedKey = ref<ListBoxValue | null>(null)

  const optionId = (value: ListBoxValue) => `${listboxId()}-option-${String(value)}`

  const activeDescendant = computed(() =>
    focusedKey.value != null ? optionId(focusedKey.value) : undefined,
  )

  const enabledRows = () => {
    if (isDisabled()) return []

    return rows().filter((row) => !row.item.disabled)
  }

  const revealOption = (value: ListBoxValue) => {
    document.getElementById(optionId(value))?.scrollIntoView({ block: 'nearest' })
  }

  // Virtualized: render the row first, then scroll it into view like any other (RAC `scrollIntoViewport`)
  const revealVirtualRow = (list: HTMLElement, value: ListBoxValue) => {
    const index = rows().findIndex((row) => row.item.value === value)
    if (index === -1) return

    // tanstack's scrollToIndex aligns to the padded scroll ends; it only serves to mount the row here. Then go back
    // and scroll it to the nearest edge (the row stays mounted until the next scroll event)
    const scrollTop = list.scrollTop
    scrollToIndex(index)

    requestAnimationFrame(() => {
      list.scrollTop = scrollTop
      revealOption(value)
    })
  }

  const setFocusKey = (value: ListBoxValue | null, shouldScroll = true) => {
    focusedKey.value = value
    if (value == null || !shouldScroll) return

    const list = listElement()
    const isRendered = document.getElementById(optionId(value)) !== null
    if (virtualize() && list && !isRendered) {
      revealVirtualRow(list, value)
      return
    }

    nextTick(() => revealOption(value))
  }

  // Row position in content coordinates: measured when mounted, from the virtualizer's fixed row size otherwise
  const createRowMeasure = (list: HTMLElement) => {
    const allRows = rows()
    const virtualizeOptions = virtualize()
    const rowSize =
      typeof virtualizeOptions === 'object'
        ? (virtualizeOptions.estimateSize ?? DEFAULT_ROW_SIZE)
        : DEFAULT_ROW_SIZE

    const listTop = list.getBoundingClientRect().top - list.scrollTop

    return (row: CollectionRow) => {
      const node = document.getElementById(optionId(row.item.value))
      if (node && !virtualizeOptions) {
        const rect = node.getBoundingClientRect()

        return { y: rect.top - listTop, height: rect.height }
      }

      return { y: allRows.indexOf(row) * rowSize, height: rowSize }
    }
  }

  // RAC `ListKeyboardDelegate.getKeyPageBelow/Above`: a viewport height down / up when the list scrolls, else
  // last / first
  const getPageIndex = (
    enabled: CollectionRow[],
    { current, isDown }: { current: number; isDown: boolean },
  ): number => {
    const list = listElement()
    const isScrollable = !!list && list.scrollHeight > list.clientHeight
    if (!list || current === -1 || !isScrollable) return isDown ? enabled.length - 1 : 0

    const measure = createRowMeasure(list)
    const start = measure(enabled[current]!)
    let index = current

    if (isDown) {
      const pageY = Math.min(list.scrollHeight, start.y - start.height + list.clientHeight)
      while (index < enabled.length - 1 && measure(enabled[index]!).y < pageY) index++

      return index
    }

    const pageY = Math.max(0, start.y + start.height - list.clientHeight)
    while (index > 0 && measure(enabled[index]!).y > pageY) index--

    return index
  }

  const getNextRow = (enabled: CollectionRow[], key: NavigationKey) => {
    const current = enabled.findIndex((row) => row.item.value === focusedKey.value)
    if (key === 'Home') return enabled[0]
    if (key === 'End') return enabled.at(-1)

    if (key === 'PageUp' || key === 'PageDown') {
      return enabled[getPageIndex(enabled, { current, isDown: key === 'PageDown' })]
    }

    const isDown = key === 'ArrowDown'
    if (current === -1) return isDown ? enabled[0] : enabled.at(-1)

    const next = current + (isDown ? 1 : -1)

    return enabled[clamp(next, { min: 0, max: enabled.length - 1 })]
  }

  const navigate = (key: NavigationKey) => {
    const enabled = enabledRows()
    if (!enabled.length) return

    setFocusKey(getNextRow(enabled, key)?.item.value ?? null)
  }

  // The option under the pointer, from the `id` its attrs write
  const itemById = computed(
    () => new Map(options.options().map((item) => [optionId(item.value), item])),
  )

  const getEventItem = (event: Event) => {
    return itemById.value.get((event.currentTarget as HTMLElement).id)
  }

  const canFocusItem = (item: ListBoxItem) => !item.disabled && !isDisabled()

  // RAC `shouldFocusOnHover`: hover moves focus unless the last interaction was a keyboard one
  const onOptionPointermove = (event: PointerEvent) => {
    const item = getEventItem(event)
    if (!item || keyboardModality.value || focusedKey.value === item.value) return
    if (!canFocusItem(item)) return

    setFocusKey(item.value, false)
  }

  // Pointer selection focuses the picked option (it stays focused in multiple mode)
  const onOptionPointerdown = (event: PointerEvent) => {
    const item = getEventItem(event)
    if (item && canFocusItem(item)) setFocusKey(item.value, false)
  }

  // No closures per row: options re-render only when their own props change
  const optionAttrs = (row: CollectionRow) => {
    return {
      id: optionId(row.item.value),
      onPointermove: onOptionPointermove,
      onPointerdown: onOptionPointerdown,
    }
  }

  // One stable object (reactive unwraps the refs): a fresh object per change would re-render every option
  const virtualFocus = reactive({ keyboard: keyboardModality, value: focusedKey })

  watch(isOpen, (isNowOpen) => {
    if (!isNowOpen) focusedKey.value = null
  })

  return {
    focusedKey,
    activeDescendant,
    virtualFocus,
    enabledRows,
    setFocusKey,
    navigate,
    optionAttrs,
  }
}
