// Internal: ListView's selection model (RAC `useSelectableItem` / `useSelectableCollection` over the shared
// selection manager).
import { computed, shallowRef } from 'vue'

import { useSelectionManager } from '@/composables/useSelectionManager'

import type { ListViewItem, ListViewProps, ListViewValue } from './ListView.types'

/** The modifier keys of the press or key that changes the selection. */
export type SelectionModifiers = Pick<KeyboardEvent, 'shiftKey' | 'ctrlKey' | 'metaKey'>

/** How many rows can be selected, derived from `selectable` and `multiple`. */
export type ListViewSelectionMode = 'none' | 'single' | 'multiple'

type ListViewSelectionOptions = {
  props: Required<Pick<ListViewProps, 'selectionBehavior'>> &
    Pick<ListViewProps, 'modelValue' | 'defaultValue'>
  /** The selection mode. */
  mode: () => ListViewSelectionMode
  /** The items, in display order. */
  items: () => ListViewItem[]
  /** Receives the new selection in the `v-model` shape. */
  onUpdate: (value: ListViewValue | ListViewValue[] | null) => void
}

const toValues = (value: ListViewValue | ListViewValue[] | null | undefined): ListViewValue[] => {
  if (value === null || value === undefined) return []

  return Array.isArray(value) ? value : [value]
}

export const useListViewSelection = ({
  props,
  mode,
  items,
  onUpdate,
}: ListViewSelectionOptions) => {
  const local = shallowRef(toValues(props.defaultValue))

  const selectedValues = computed(() =>
    props.modelValue === undefined ? local.value : toValues(props.modelValue),
  )

  const selectedSet = computed(() => new Set(selectedValues.value))
  const itemsByValue = computed(() => new Map(items().map((item) => [item.value, item])))
  const isSelectable = computed(() => mode() !== 'none')
  const isMultiple = computed(() => mode() === 'multiple')

  const setSelectedValues = (values: ListViewValue[]) => {
    local.value = values
    onUpdate(isMultiple.value ? values : (values[0] ?? null))
  }

  const manager = useSelectionManager<ListViewValue>({
    mode,
    keys: () => items().map((item) => item.value),
    // An unknown value (an item just removed) counts as disabled
    isDisabled: (value) => {
      const item = itemsByValue.value.get(value)

      return !item || !!item.disabled
    },
    selected: () => selectedValues.value,
    setSelected: setSelectedValues,
  })

  const isSelected = (value: ListViewValue) => selectedSet.value.has(value)

  const replace = (value: ListViewValue) => {
    manager.setAnchor(value)
    setSelectedValues([value])
  }

  /**
   * A press, Space, or Enter on a row without an action. Single selection selects the row or clears it; multiple
   * selection extends the range with Shift, toggles the row with `toggle` behaviour or Ctrl/Cmd, else selects it alone.
   */
  const select = (value: ListViewValue, modifiers: SelectionModifiers) => {
    if (!isMultiple.value) return manager.toggle(value)
    if (modifiers.shiftKey) return manager.extend(value)

    const isToggle = props.selectionBehavior === 'toggle' || modifiers.ctrlKey || modifiers.metaKey

    if (isToggle) return manager.toggle(value)

    replace(value)
  }

  /**
   * Keyboard focus moved from `from` to `to`: Shift extends a multiple selection; with `replace` behaviour the
   * selection follows focus unless Ctrl/Cmd is held (RAC `selectOnFocus`).
   */
  const onFocusMove = ({
    to,
    from,
    modifiers,
  }: {
    to: ListViewValue
    from: ListViewValue
    modifiers: SelectionModifiers
  }) => {
    if (!isSelectable.value) return
    if (modifiers.shiftKey && isMultiple.value) return manager.extend(to, from)

    const isFollowing =
      props.selectionBehavior === 'replace' && !modifiers.ctrlKey && !modifiers.metaKey

    if (isFollowing) replace(to)
  }

  return {
    selectedValues,
    isSelectable,
    isMultiple,
    isSelected,
    select,
    toggle: manager.toggle,
    onFocusMove,
    onKeydown: manager.onKeydown,
  }
}
