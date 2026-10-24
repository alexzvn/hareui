import type { Ref } from 'vue'
import { computed, ref } from 'vue'

import type { TableSelection, TableSelectionKey } from './Table.types'

export type UseTableExpansionOptions = {
  /** The `v-model:expanded-keys` binding. */
  model: Ref<TableSelection | undefined>
  /** The expanded row keys while uncontrolled. */
  defaultExpandedKeys?: TableSelection
  /** Keys of the visible rows with children: what `'all'` expands to when one of them collapses. */
  parentKeys: () => TableSelectionKey[]
}

/** Which tree rows show their children, controlled through `model` or kept locally. */
export const useTableExpansion = ({
  model,
  defaultExpandedKeys = new Set(),
  parentKeys,
}: UseTableExpansionOptions) => {
  const localExpanded = ref<TableSelection>(defaultExpandedKeys)
  const expandedKeys = computed<TableSelection>(() => model.value ?? localExpanded.value)

  const isRowExpanded = (key: TableSelectionKey): boolean => {
    return expandedKeys.value === 'all' || expandedKeys.value.has(key)
  }

  const toggleExpanded = (key: TableSelectionKey) => {
    const current = expandedKeys.value
    const next = new Set(current === 'all' ? parentKeys() : current)

    const isCollapsing = next.has(key)
    if (isCollapsing) next.delete(key)
    if (!isCollapsing) next.add(key)

    localExpanded.value = next
    model.value = next
  }

  return { isRowExpanded, toggleExpanded }
}
