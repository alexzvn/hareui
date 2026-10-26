import type { Column, Header, Table } from '@tanstack/vue-table'
import type { AriaAttributes } from 'vue'

import type { RichTableData, RichTableSlots } from './RichTable.types'

/**
 * Whether a header cell is an empty layout filler: a placeholder (the slot above a column outside a
 * group) with no slot. An empty `th` would be announced as a nameless column header, so fillers
 * render as plain cells.
 */
export const isEmptyHeader = <T extends RichTableData>(
  header: Header<T, unknown>,
  slots: RichTableSlots<T>,
) => {
  return header.isPlaceholder && !slots[`${header.id}-header`]
}

/** Whether a footer cell is an empty layout filler: a placeholder, or the footer of a column that defines none, with no slot. */
export const isEmptyFooter = <T extends RichTableData>(
  header: Header<T, unknown>,
  slots: RichTableSlots<T>,
) => {
  const isUndefined = header.isPlaceholder || header.column.columnDef.footer === undefined

  return isUndefined && !slots[`${header.id}-footer`]
}

/** The `scope` of a header cell: none for a layout filler, `colgroup` when it spans columns. */
export const getHeaderScope = <T extends RichTableData>(
  header: Header<T, unknown>,
  slots: RichTableSlots<T>,
) => {
  if (isEmptyHeader(header, slots)) return undefined

  return header.colSpan > 1 ? 'colgroup' : 'col'
}

// `getCanSort()` is true for every accessor column, so it cannot tell a column that offers sort UI
// from a plain one, and an explicit `enableSorting: true` can still come from `defaultColumn` or be
// overridden by `features.sorting`. A header is sortable only when both agree.
const isSortable = <T extends RichTableData>(column: Column<T, unknown>) => {
  return column.columnDef.enableSorting === true && column.getCanSort()
}

// `aria-sort` is a single-column pattern, so the direction goes to the first sort key that has a
// header on screen. Keys for an unknown id, a hidden column or a column with no sort UI are
// skipped, otherwise every header would report `none` while the rows are sorted.
const getPrimarySortId = <T extends RichTableData>(table: Table<T>) => {
  const sortableColumns = table.getVisibleLeafColumns().filter(isSortable)
  const sortableIds = new Set(sortableColumns.map((column) => column.id))
  const primary = table.getState().sorting.find(({ id }) => sortableIds.has(id))

  return primary?.id
}

/** The `aria-sort` of a header cell: only sortable headers have one. */
export const getAriaSort = <T extends RichTableData>(
  table: Table<T>,
  header: Header<T, unknown>,
): AriaAttributes['aria-sort'] => {
  if (header.isPlaceholder || !isSortable(header.column)) return undefined

  const sorted = header.column.getIsSorted()
  if (!sorted) return 'none'

  if (getPrimarySortId(table) !== header.column.id) return 'none'

  return sorted === 'asc' ? 'ascending' : 'descending'
}
