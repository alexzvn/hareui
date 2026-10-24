import type { Ref } from 'vue'
import { computed, ref } from 'vue'

import type { TableColumn, TableSortDescriptor, TableSortDirection } from './Table.types'

export type UseTableSortOptions = {
  /** The `v-model:sort-descriptor` binding. */
  model: Ref<TableSortDescriptor | undefined>
  /** The sort state while uncontrolled. */
  defaultSortDescriptor?: TableSortDescriptor
}

/**
 * The sort state, controlled through `model` or kept locally. Table only shows the indicator and
 * reports changes: the caller sorts the rows.
 */
export const useTableSort = ({ model, defaultSortDescriptor }: UseTableSortOptions) => {
  const localSort = ref<TableSortDescriptor | undefined>(defaultSortDescriptor)
  const sortDescriptor = computed(() => model.value ?? localSort.value)

  const sortDirectionFor = (column: TableColumn): TableSortDirection | undefined => {
    return sortDescriptor.value?.column === column.key ? sortDescriptor.value.direction : undefined
  }

  /** Sorts by `column` ascending, or flips it to descending when it already sorts ascending. */
  const toggleSort = (column: TableColumn) => {
    if (!column.sortable) return

    const isAscending = sortDirectionFor(column) === 'ascending'
    const next: TableSortDescriptor = {
      column: column.key,
      direction: isAscending ? 'descending' : 'ascending',
    }

    localSort.value = next
    model.value = next
  }

  return { sortDirectionFor, toggleSort }
}
