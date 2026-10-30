// Internal: ListBox's selection, controlled by `v-model` or held here when uncontrolled.
import type { Ref } from 'vue'
import { computed, ref } from 'vue'

import type { SelectionMode } from '@/composables/useSelectionManager'

import type { ListBoxItem, ListBoxValue } from './ListBox.types'

type ListBoxSelection = ListBoxValue | ListBoxValue[] | undefined

type ListBoxSelectionOptions = {
  /** The `v-model` ref; `undefined` when unbound. */
  model: Ref<ListBoxValue | ListBoxValue[] | null | undefined>
  mode: () => SelectionMode
  /** The initial uncontrolled selection, read once. */
  defaultValue?: ListBoxValue | ListBoxValue[] | null
}

export const useListBoxSelection = ({ model, mode, defaultValue }: ListBoxSelectionOptions) => {
  const isSelectable = computed(() => mode() !== 'none')
  const isMultiple = computed(() => mode() === 'multiple')

  // `v-model` wins when bound; otherwise the selection lives here, seeded from `defaultValue`
  const uncontrolled = ref<ListBoxSelection>(defaultValue ?? (isMultiple.value ? [] : undefined))

  const selection = computed<ListBoxSelection>({
    get: () => {
      const current = model.value === undefined ? uncontrolled.value : model.value

      return current ?? undefined
    },
    set: (value) => {
      uncontrolled.value = value
      model.value = value ?? null
    },
  })

  // O(1) membership per option render (a multiple selection can be large)
  const selectedSet = computed(() =>
    Array.isArray(selection.value) ? new Set(selection.value) : undefined,
  )

  const isSelected = (item: ListBoxItem) => {
    const current = selection.value
    if (!isSelectable.value || current == null) return false

    return selectedSet.value ? selectedSet.value.has(item.value) : current === item.value
  }

  /** The selection as a list of values. */
  const getSelectedValues = (): ListBoxValue[] => {
    const current = selection.value
    if (current == null) return []

    return Array.isArray(current) ? current : [current]
  }

  /** Writes `values`; a single selection keeps only the first. */
  const setSelectedValues = (values: ListBoxValue[]) => {
    selection.value = isMultiple.value ? values : values[0]
  }

  return {
    selection,
    isSelectable,
    isMultiple,
    isSelected,
    getSelectedValues,
    setSelectedValues,
  }
}
