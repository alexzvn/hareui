import type { Row, Table } from '@tanstack/vue-table'
import type { ComputedRef } from 'vue'
import { computed, nextTick } from 'vue'

import type { DropTarget } from '@/composables/useDragAndDrop'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useLocale } from '@/composables/useLocale'

import type {
  RichTableData,
  RichTableReorderEvent,
  RichTableReorderTarget,
} from './RichTable.types'

/** Width of the drag handle column in pixels (the theme's `w-8`): left-pinned columns stick after it. */
export const DRAG_COLUMN_WIDTH = 32

// Holds the row id on each reorderable row; distinct from the column drag's attribute, as both share the table.
const ROW_KEY_ATTRIBUTE = 'data-reorder-row'

type UseRichTableRowReorderOptions<T extends RichTableData> = {
  table: Table<T>
  /** Every body row in display order. */
  rows: ComputedRef<Row<T>[]>
  isEnabled: () => boolean
  getRootElement: () => HTMLElement | undefined
  /** Brings a row into view when the body only renders some rows; scrolls the row's element into view when unset. */
  scrollToRow: ((rowId: string) => void) | undefined
  onReorder: (event: RichTableReorderEvent<T>) => void
}

const isLabelValue = (value: unknown) =>
  (typeof value === 'string' && value !== '') || typeof value === 'number'

// A row is announced by its first text or number cell
const getRowText = <T extends RichTableData>(row: Row<T>) => {
  const value = row
    .getVisibleCells()
    .map((cell) => cell.getValue())
    .find(isLabelValue)

  return value === undefined ? undefined : String(value)
}

/**
 * Row reordering by the drag handle column: top-level rows move by pointer or keyboard, selected rows together,
 * and a drop reports the moved rows with `data` in its new order.
 */
export const useRichTableRowReorder = <T extends RichTableData>(
  options: UseRichTableRowReorderOptions<T>,
) => {
  const { table } = options
  const { t } = useLocale()

  // Sub-rows stay with their parent: only top-level rows move
  const topLevelRows = computed(() => options.rows.value.filter((row) => row.depth === 0))
  const rowPositions = computed(
    () => new Map(topLevelRows.value.map((row, index) => [row.id, index + 1])),
  )

  // Sorted or grouped rows aren't shown in `data` order, so a drop among them has no clear place in `data`
  const isLocked = computed(() => {
    const { sorting, grouping } = table.getState()

    return sorting.length > 0 || grouping.length > 0
  })

  const getRowLabel = (row: Row<T>) => {
    const position = rowPositions.value.get(row.id) ?? row.index + 1

    return getRowText(row) ?? t('richTable.row', { index: position })
  }

  const getDragKeys = (key: string) => {
    if (!options.isEnabled() || isLocked.value) return []

    const row = topLevelRows.value.find((candidate) => candidate.id === key)
    if (!row) return []
    if (!row.getIsSelected()) return [key]

    return topLevelRows.value.filter((candidate) => candidate.getIsSelected()).map(({ id }) => id)
  }

  // Before the first row, then after each row
  const getTargets = (): DropTarget[] => {
    const [first] = topLevelRows.value
    if (!first) return []

    return [
      { key: first.id, position: 'before' },
      ...topLevelRows.value.map((row): DropTarget => ({ key: row.id, position: 'after' })),
    ]
  }

  const getLabel = (key: string) => {
    const row = table.getRowModel().rowsById[key]

    return row ? getRowLabel(row) : key
  }

  const onDrop = (keys: string[], dropTarget: DropTarget) => {
    const target: RichTableReorderTarget = {
      key: dropTarget.key,
      position: dropTarget.position === 'before' ? 'before' : 'after',
    }

    // The top-level rows in `data` order, built from a shallow copy of `data`: `original` is the caller's item
    const dataRows = table.getCoreRowModel().rows
    const rowsById = new Map(dataRows.map((row) => [row.id, row]))
    const movedKeys = new Set(keys)
    const keptRows = dataRows.filter((row) => !movedKeys.has(row.id))
    const targetIndex = keptRows.findIndex((row) => row.id === target.key)
    if (targetIndex === -1) return

    const insertAt = target.position === 'before' ? targetIndex : targetIndex + 1
    const movedRows = keys.flatMap((key) => rowsById.get(key) ?? [])
    const orderedRows = [...keptRows.slice(0, insertAt), ...movedRows, ...keptRows.slice(insertAt)]

    // The new order moves the focused handle's row in the DOM, which drops the focus: put it back
    const focused = document.activeElement
    const root = options.getRootElement()
    const focusedKey = root?.contains(focused)
      ? focused?.closest(`[${ROW_KEY_ATTRIBUTE}]`)?.getAttribute(ROW_KEY_ATTRIBUTE)
      : undefined

    options.onReorder({ keys, target, data: orderedRows.map((row) => row.original) })
    if (!focusedKey) return

    void nextTick(() => {
      const rows = options.getRootElement()?.querySelectorAll(`[${ROW_KEY_ATTRIBUTE}]`) ?? []
      const row = [...rows].find(
        (element) => element.getAttribute(ROW_KEY_ATTRIBUTE) === focusedKey,
      )

      const handle = row?.querySelector<HTMLElement>('[data-slot=rich-table-drag-handle]')
      if (handle && document.activeElement !== handle) handle.focus()
    })
  }

  const drag = useDragAndDrop({
    root: options.getRootElement,
    keyAttribute: ROW_KEY_ATTRIBUTE,
    getDragKeys,
    getTargets,
    getLabel,
    scrollTo: options.scrollToRow,
    onDrop,
  })

  /** The drag attributes of a body row: its key, and whether it is dragged or the drop target. */
  const getRowAttributes = (row: Row<T>) => {
    if (!options.isEnabled() || row.depth > 0) return {}

    return {
      [ROW_KEY_ATTRIBUTE]: row.id,
      'data-dragging': drag.isDragging(row.id) ? '' : undefined,
      'data-drop-target': drag.getDropPosition(row.id),
    }
  }

  return {
    isLocked,
    getRowLabel,
    getRowAttributes,
    onHandlePointerDown: drag.onPointerDown,
    onHandleKeyDown: drag.onKeyDown,
  }
}
