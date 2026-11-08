import type { Column, Table } from '@tanstack/vue-table'
import { computed } from 'vue'

import type { RichTableData } from './RichTable.types'

type PinnedSide = 'left' | 'right'

type ColumnLayout = {
  pinned: PinnedSide | undefined
  edge: PinnedSide | undefined
  styles: Record<string, string>
}

type UseRichTableColumnLayoutOptions<T extends RichTableData> = {
  table: Table<T>
  /** Whether content is scrolled under the columns pinned to each side. */
  detached: Readonly<Record<PinnedSide, boolean>>
  isResizingEnabled: () => boolean
  /** The width of the cells before the first column (the drag handle column), which left-pinned columns stick after. */
  getLeadingWidth: () => number
}

/** Widths, pinning offsets and outlined edges of the columns. */
export const useRichTableColumnLayout = <T extends RichTableData>(
  options: UseRichTableColumnLayoutOptions<T>,
) => {
  const { table, detached } = options

  // The column on each pinned side that faces the scrolling columns.
  const pinnedEdgeIds = computed(() => ({
    left: table.getLeftVisibleLeafColumns().at(-1)?.id,
    right: table.getRightVisibleLeafColumns()[0]?.id,
  }))

  /** The pinned side whose outlined edge this column is on, if any. */
  const getColumnEdge = (column: Column<T, unknown>): PinnedSide | undefined => {
    const pinned = column.getIsPinned()
    if (!pinned || !detached[pinned]) return undefined

    const edgeId = pinnedEdgeIds.value[pinned]
    const isEdge = column.getLeafColumns().some((leaf) => leaf.id === edgeId)

    return isEdge ? pinned : undefined
  }

  // Widths are only applied once sizing is in play (resizing enabled or a column sized), so plain tables keep the browser's auto layout.
  const isSizingActive = computed(
    () => options.isResizingEnabled() || Object.keys(table.getState().columnSizing).length > 0,
  )

  const getColumnStyles = (
    column: Column<T, unknown>,
    size = column.getSize(),
  ): Record<string, string> => {
    const styles: Record<string, string> = isSizingActive.value ? { width: `${size}px` } : {}
    const pinned = column.getIsPinned()
    if (!pinned) return styles

    const offset =
      pinned === 'left'
        ? column.getStart('left') + options.getLeadingWidth()
        : column.getAfter('right')

    styles['--rich-table-pin'] = `${offset}px`

    return styles
  }

  // A cell's pinning, edge and width depend only on its column, so they are resolved once per column
  // per change instead of three TanStack proxy walks per cell.
  const columnLayouts = computed(() => {
    const layouts = new Map<string, ColumnLayout>()

    for (const column of table.getAllLeafColumns()) {
      layouts.set(column.id, {
        pinned: column.getIsPinned() || undefined,
        edge: getColumnEdge(column),
        styles: getColumnStyles(column),
      })
    }

    return layouts
  })

  return { getColumnEdge, getColumnStyles, columnLayouts }
}
