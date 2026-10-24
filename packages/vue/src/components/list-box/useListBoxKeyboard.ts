/*
 * Internal: ListBox's keyboard and selection model (RAC `useSelectableList`).
 *
 * Reka's listbox has no anchor / Shift ranges, selects all on Meta/Ctrl+A by highlighting the last item,
 * ignores Escape, maps PageUp/PageDown inverted, feeds every key (ArrowDown, Shift…) into its typeahead buffer
 * and selects on Space mid-search. A capture-phase handler on the list takes those keys first; plain
 * arrows, Home/End, Enter and Space stay with Reka.
 */
import { injectListboxRootContext } from 'reka-ui'
import type { ShallowRef } from 'vue'
import { defineComponent } from 'vue'

import { useSelectionManager } from '@/composables/useSelectionManager'

import type {
  ListBoxItem,
  ListBoxProps,
  ListBoxRekaItem,
  ListBoxRekaRoot,
  ListBoxValue,
} from './ListBox.types'
import { getPageTarget, getRangeTarget } from './listBoxKeyTargets'
import type { useListBoxSelection } from './useListBoxSelection'
import type { TypeaheadSource } from './useTypeahead'
import { useTypeahead } from './useTypeahead'

type ListBoxKeyboardOptions = {
  props: Required<Pick<ListBoxProps, 'selectionMode'>> &
    Pick<ListBoxProps, 'disabled' | 'virtualize' | 'escapeKeyBehavior'>
  selection: ReturnType<typeof useListBoxSelection>
  listboxRoot: Readonly<ShallowRef<ListBoxRekaRoot | null>>
  /** Option values in collection order. */
  getValues: () => ListBoxValue[]
  getItem: (value: ListBoxValue) => ListBoxItem | undefined
}

type RekaListbox = ReturnType<typeof injectListboxRootContext>

export const useListBoxKeyboard = ({
  props,
  selection,
  listboxRoot,
  getValues,
  getItem,
}: ListBoxKeyboardOptions) => {
  let reka: RekaListbox | undefined

  // Renderless child: the Reka root context is only injectable below ListboxRoot
  const RekaContext = defineComponent({
    setup() {
      reka = injectListboxRootContext()

      return () => null
    },
  })

  // Reka re-highlights and focuses the first selected option whenever the model changes outside its own
  // handlers. Its keyboard handler flags a change as user-made for 1 ms; a modifier-only key does nothing else.
  const markUserAction = () => {
    reka?.onKeydownTypeAhead(new KeyboardEvent('keydown', { key: 'Alt', altKey: true }))
  }

  const isEnabledValue = (value: ListBoxValue) => {
    const item = getItem(value)

    return !!item && !item.disabled && !props.disabled
  }

  const manager = useSelectionManager<ListBoxValue>({
    mode: () => props.selectionMode,
    keys: getValues,
    isDisabled: (value) => !isEnabledValue(value),
    selected: selection.getSelectedValues,
    setSelected: (values) => {
      markUserAction()
      selection.setSelectedValues(values)
    },
    keepOnEscape: () => props.escapeKeyBehavior === 'none',
  })

  const getRekaItems = () => listboxRoot.value?.getItems() ?? []

  /** The enabled option elements, in DOM order. */
  const getEnabledOptions = (items: ListBoxRekaItem[] = getRekaItems()): HTMLElement[] => {
    if (!reka) return []

    return items.map((item) => item.ref).filter((el) => el.dataset.disabled !== '')
  }

  const getOptionValue = (el: HTMLElement) => {
    const item = getRekaItems().find((rekaItem) => rekaItem.ref === el)

    return item?.value as ListBoxValue | undefined
  }

  const highlight = (el: HTMLElement | undefined) => {
    if (el) reka?.changeHighlight(el)
  }

  // RAC `useTypeSelect`: searched from the focused option onwards (inclusive); Space continues a non-empty
  // search instead of selecting
  const typeahead = useTypeahead({ start: 'current', space: true })

  const createTypeaheadSource = (
    focused: HTMLElement | undefined,
  ): TypeaheadSource<HTMLElement> => {
    // One (DOM-querying) `getItems()` per key, not one per option checked
    const items = getRekaItems()
    const valueByEl = new Map(items.map((item) => [item.ref, item.value as ListBoxValue]))

    const getText = (el: HTMLElement) => {
      const value = valueByEl.get(el)
      const item = value === undefined ? undefined : getItem(value)

      return (item?.textValue ?? item?.label ?? el.textContent ?? '').trim()
    }

    return {
      items: getEnabledOptions(items),
      text: getText,
      isCurrent: (el) => el === focused,
    }
  }

  const onTypeahead = (event: KeyboardEvent, focused: HTMLElement | undefined): boolean => {
    const isHandled = typeahead.onKeydown(event, () => createTypeaheadSource(focused), highlight)
    if (!isHandled) return false

    event.stopPropagation()
    if (event.key === ' ') event.preventDefault()

    return true
  }

  /** Where PageUp/PageDown, or a Shift range move of a multiple selection, takes the focus. */
  const getNavigationTarget = (
    event: KeyboardEvent,
    { list, focused }: { list: HTMLElement; focused: HTMLElement | undefined },
  ) => {
    const options = getEnabledOptions()

    const isPageKey = event.key === 'PageDown' || event.key === 'PageUp'
    if (isPageKey) {
      return getPageTarget({ options, from: focused, list, isDown: event.key === 'PageDown' })
    }

    const isRangeMove = event.shiftKey && selection.isMultiple.value && !event.altKey
    if (!isRangeMove) return undefined

    return getRangeTarget(event.key, { options, focused })
  }

  const onKeydownCapture = (event: KeyboardEvent) => {
    if (!reka || props.disabled || event.isComposing) return

    const list = event.currentTarget as HTMLElement
    const focused = (event.target as Element).closest?.<HTMLElement>('[role=option]') ?? undefined

    // The keyboard continues from the focused option, even after Reka dropped its highlight (pointer leave)
    const isFocusUnhighlighted =
      !props.virtualize &&
      focused !== undefined &&
      list.contains(focused) &&
      reka.highlightedElement.value !== focused

    if (isFocusUnhighlighted) reka.highlightedElement.value = focused

    // Escape clears the selection, Meta/Ctrl+A selects every enabled option and keeps focus
    if (selection.isSelectable.value && manager.onKeydown(event)) return

    // Reka's virtualizer pages and searches over the unrendered rows itself
    if (props.virtualize) return
    if (onTypeahead(event, focused)) return

    const target = getNavigationTarget(event, { list, focused })
    if (!target) return

    event.preventDefault()
    event.stopPropagation()
    highlight(target)

    const value = getOptionValue(target)
    const isRangeExtension = event.shiftKey && selection.isMultiple.value && value !== undefined
    if (isRangeExtension) manager.extend(value, focused && getOptionValue(focused))
  }

  // Shift+click / Shift+Space extend the range from the anchor; any other press toggles through Reka
  const onOptionSelect = (item: ListBoxItem, event: CustomEvent<{ originalEvent?: Event }>) => {
    if (!selection.isSelectable.value) return

    const original = event.detail?.originalEvent as MouseEvent | KeyboardEvent | undefined
    if (selection.isMultiple.value && original?.shiftKey) {
      event.preventDefault()
      manager.extend(item.value)

      return
    }

    if (!selection.isSelected(item)) manager.setAnchor(item.value)
  }

  return { RekaContext, onKeydownCapture, onOptionSelect }
}
