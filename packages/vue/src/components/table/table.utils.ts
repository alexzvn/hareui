import type { TableColumn, TableRow, TableSelectionKey } from './Table.types'

/** A visible row in display order, with its position in the tree. */
export type FlatRow<T extends TableRow = TableRow> = {
  row: T
  key: TableSelectionKey
  /** Nesting depth, 1 for root rows. */
  depth: number
  hasChildItems: boolean
  /** Index among all visible rows. */
  index: number
}

export type FlattenRowsOptions<T extends TableRow> = {
  rows: T[]
  /** Whether a row with children shows them. */
  isExpanded: (key: TableSelectionKey) => boolean
}

/**
 * Flattens tree rows into display order, skipping the children of collapsed rows. A row without an
 * `id` is keyed by its index among its siblings.
 */
export const flattenRows = <T extends TableRow>({
  rows,
  isExpanded,
}: FlattenRowsOptions<T>): FlatRow<T>[] => {
  const flat: FlatRow<T>[] = []

  const visit = (siblings: T[], depth: number) => {
    siblings.forEach((row, i) => {
      const key = row.id ?? i
      const hasChildItems = !!row.children?.length
      flat.push({ row, key, depth, hasChildItems, index: flat.length })
      if (!hasChildItems || !isExpanded(key)) return

      // Nested rows are rendered with the caller's row type: `children` holds rows of the same shape.
      visit(row.children as T[], depth + 1)
    })
  }

  visit(rows, 1)

  return flat
}

/** A cell's default content. */
export const getCellValue = (row: TableRow, column: TableColumn) => {
  return row[column.key]
}

/** The text-alignment class of a column's header and cells. */
export const getAlignClass = (column: TableColumn) => {
  if (column.align === 'center') return 'text-center'
  if (column.align === 'end') return 'text-end'

  return undefined
}
