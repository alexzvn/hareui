import type { Ref } from 'vue'
import { computed, ref } from 'vue'

import type { SelectionMode } from '@/composables/useSelectionManager'
import { useSelectionManager } from '@/composables/useSelectionManager'

import type { TableRow, TableSelection, TableSelectionKey } from './Table.types'
import type { FlatRow } from './table.utils'

export type UseTableSelectionOptions = {
  /** The `v-model:selected-keys` binding. */
  model: Ref<TableSelection | undefined>
  /** The selected row keys while uncontrolled. */
  defaultSelectedKeys?: TableSelection
  mode: () => SelectionMode
  /** Keys excluded from selection, besides disabled rows. */
  disabledKeys: () => TableSelectionKey[] | undefined
  /** The visible rows, in display order. */
  rows: () => FlatRow[]
}

/**
 * Row selection, controlled through `model` or kept locally: the per-row checkboxes, the select-all
 * checkbox and the keyboard/pointer selection model.
 */
export const useTableSelection = (options: UseTableSelectionOptions) => {
  const { model, defaultSelectedKeys = new Set(), mode, disabledKeys, rows } = options

  const localSelected = ref<TableSelection>(defaultSelectedKeys)
  const selectedKeys = computed<TableSelection>(() => model.value ?? localSelected.value)

  const setSelected = (next: TableSelection) => {
    localSelected.value = next
    model.value = next
  }

  const isSelected = (key: TableSelectionKey): boolean => {
    return selectedKeys.value === 'all' || selectedKeys.value.has(key)
  }

  const isSelectable = (key: TableSelectionKey, row: TableRow): boolean => {
    return !row.disabled && !disabledKeys()?.includes(key)
  }

  const selectableKeys = computed(() =>
    rows()
      .filter((flat) => isSelectable(flat.key, flat.row))
      .map((flat) => flat.key),
  )

  const isAllSelected = computed(
    () => selectableKeys.value.length > 0 && selectableKeys.value.every((key) => isSelected(key)),
  )

  const isSomeSelected = computed(
    () => !isAllSelected.value && selectableKeys.value.some((key) => isSelected(key)),
  )

  const selectAllModel = computed<boolean | 'indeterminate'>(() => {
    if (isAllSelected.value) return true

    return isSomeSelected.value ? 'indeterminate' : false
  })

  const toggleSelectAll = () => {
    const next = isAllSelected.value ? [] : selectableKeys.value
    setSelected(new Set(next))
  }

  // Anchor + Shift ranges, select-all and Escape (RAC `SelectionManager`, toggle behaviour)
  const manager = useSelectionManager<TableSelectionKey>({
    mode,
    keys: () => rows().map((flat) => flat.key),
    isDisabled: (key) => {
      const flat = rows().find((candidate) => candidate.key === key)

      return !flat || !isSelectable(key, flat.row)
    },
    selected: () => (selectedKeys.value === 'all' ? selectableKeys.value : [...selectedKeys.value]),
    setSelected: (keys) => setSelected(new Set(keys)),
  })

  return { isSelected, isSelectable, selectableKeys, selectAllModel, toggleSelectAll, manager }
}
