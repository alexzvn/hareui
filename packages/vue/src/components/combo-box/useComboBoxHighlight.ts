import type { ComputedRef, ShallowRef } from 'vue'
import { computed, nextTick, onMounted, reactive, shallowRef, watch } from 'vue'

import type { ListBoxItem, ListBoxValue } from '@/components/list-box/ListBox.types'
import type { CollectionRow } from '@/components/list-box/listBoxCollection'
import { useKeyboardModality } from '@/composables/useKeyboardModality'

import type {
  ComboBoxHighlight,
  ComboboxContext,
  FocusStrategy,
  ListboxContext,
} from './ComboBox.types'

/** Keys that move the virtual focus through the open list. */
export type NavigationKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'PageUp' | 'PageDown'

type ComboBoxHighlightOptions = {
  input: Readonly<ShallowRef<HTMLInputElement | null>>
  /** Closed, Reka's content renders Presence's comment placeholder, so `$el` isn't always an element. */
  content: Readonly<ShallowRef<{ $el: Node } | null>>
  /** Every option, sections flattened. */
  options: ComputedRef<ListBoxItem[]>
  /** Whether the popover is open: the closed popover highlights nothing. */
  isOpen: () => boolean
  /** Called with each new highlighted option, `undefined` once none is or the popover closes. */
  onHighlight: (payload: ComboBoxHighlight | undefined) => void
}

const valueAttr = 'data-combo-box-value'

// Reka's own `highlightSelected` (which falls back to the first option) runs a few ticks after a model change
const afterRekaHighlight = async () => {
  await nextTick()
  await nextTick()
  await nextTick()
}

const optionByStrategy = {
  first: (list: HTMLElement[]) => list[0],
  last: (list: HTMLElement[]) => list.at(-1),
} as const satisfies Record<NonNullable<FocusStrategy>, (list: HTMLElement[]) => unknown>

// The highlighted option is RAC's virtual focus: DOM focus stays in the input while Reka highlights options
export const useComboBoxHighlight = (highlightOptions: ComboBoxHighlightOptions) => {
  const { input, content, options, isOpen, onHighlight } = highlightOptions

  // Reactive: the bridge mounts after ComboBox's first render, which already reads `highlighted`
  const listboxRef = shallowRef<ListboxContext>()
  let combobox: ComboboxContext | undefined

  const onReady = (listboxContext: ListboxContext, comboboxContext: ComboboxContext) => {
    // DOM focus stays in the input; Reka highlights options without focusing them
    listboxContext.focusable.value = false
    listboxRef.value = listboxContext
    combobox = comboboxContext
  }

  const highlighted = computed(() => listboxRef.value?.highlightedElement.value ?? null)

  // RAC interaction modality: the highlight is focus-visible after keyboard interaction
  const isKeyboardModality = useKeyboardModality()

  // One stable object (reactive unwraps the ref): a fresh object per change would re-render every option
  const virtualFocus = reactive({ keyboard: isKeyboardModality })

  onMounted(() => {
    if (input.value) combobox?.onInputElementChange(input.value)
  })

  const enabledOptions = (): HTMLElement[] => {
    const el = content.value?.$el
    if (!(el instanceof HTMLElement)) return []

    return [...el.querySelectorAll<HTMLElement>('[role=option]:not([data-disabled])')]
  }

  const setHighlight = (el: HTMLElement | null | undefined) => {
    const listbox = listboxRef.value
    if (!listbox) return

    if (!el) {
      listbox.highlightedElement.value = null
      return
    }

    listbox.changeHighlight(el, true, false)
  }

  // RAC keeps no focused option after these; Reka re-highlights one when the model changes
  const clearHighlightAfterReka = () => {
    afterRekaHighlight().then(() => setHighlight(null))
  }

  // RAC `useSelectableCollection` autoFocus: the first selected option, else first / last per strategy, else none
  const highlightOnOpen = async (strategy: FocusStrategy) => {
    await afterRekaHighlight()

    const list = enabledOptions()
    const selected = list.find((el) => el.getAttribute('data-state') === 'checked')
    const fallback = strategy ? optionByStrategy[strategy](list) : null

    setHighlight(selected ?? fallback)
  }

  const navigate = (key: NavigationKey) => {
    const list = enabledOptions()
    if (!list.length) return

    if (key === 'Home' || key === 'PageUp') {
      setHighlight(list[0])
      return
    }

    if (key === 'End' || key === 'PageDown') {
      setHighlight(list.at(-1))
      return
    }

    const isDown = key === 'ArrowDown'
    const current = highlighted.value ? list.indexOf(highlighted.value) : -1
    if (current === -1) {
      setHighlight(isDown ? list[0] : list.at(-1))
      return
    }

    // RAC doesn't wrap (`shouldFocusWrap` defaults to false)
    const next = Math.min(Math.max(current + (isDown ? 1 : -1), 0), list.length - 1)
    setHighlight(list[next])
  }

  const selectHighlighted = () => {
    const el = highlighted.value
    if (el?.isConnected) el.click()
  }

  const itemValueOf = (el: HTMLElement): ListBoxValue | undefined => {
    const raw = el.getAttribute(valueAttr)
    if (raw == null) return undefined

    return options.value.find((item) => String(item.value) === raw)?.value
  }

  // Reka keeps its highlighted element after closing (detached once the list unmounts): the closed popover
  // highlights nothing, as in RAC
  const highlightedWhileOpen = computed(() => {
    const el = highlighted.value

    return isOpen() && el?.isConnected ? el : null
  })

  watch(highlightedWhileOpen, (el) => {
    const value = el ? itemValueOf(el) : undefined
    onHighlight(el && value !== undefined ? { ref: el, value } : undefined)
  })

  // RAC `shouldFocusOnHover`: hover moves the virtual focus unless the last interaction was a keyboard one
  const onOptionPointermove = (event: PointerEvent) => {
    const el = event.currentTarget as HTMLElement
    const canHighlight =
      !isKeyboardModality.value && highlighted.value !== el && !el.hasAttribute('data-disabled')

    if (canHighlight) setHighlight(el)
  }

  // No closures per row: options re-render only when their own props change
  const optionAttrs = (row: CollectionRow) => {
    return { [valueAttr]: String(row.item.value), onPointermove: onOptionPointermove }
  }

  return {
    onReady,
    highlighted,
    isKeyboardModality,
    virtualFocus,
    setHighlight,
    clearHighlightAfterReka,
    highlightOnOpen,
    navigate,
    selectHighlighted,
    itemValueOf,
    optionAttrs,
  }
}
