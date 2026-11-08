import type { Column, Header, Table } from '@tanstack/vue-table'
import { nextTick } from 'vue'

import type { DropTarget } from '@/composables/useDragAndDrop'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useLocale } from '@/composables/useLocale'

import type { RichTableData } from './RichTable.types'

// Holds the column id on each draggable header; distinct from the row drag's attribute, as both share the table.
const COLUMN_KEY_ATTRIBUTE = 'data-reorder-column'

// A press on one of these inside a header works it (sorting, resizing, filtering...) instead of dragging the column
const INTERACTIVE_SELECTOR =
  'a, button, input, label, select, textarea, [role="separator"], [contenteditable="true"]'

type UseRichTableColumnReorderOptions<T extends RichTableData> = {
  table: Table<T>
  isEnabled: () => boolean
  getRootElement: () => HTMLElement | undefined
}

type ColumnMove = {
  id: string
  target: DropTarget
}

// `ids` with `move.id` placed before or after the target; unchanged when the target isn't in `ids`
const moveId = (ids: string[], move: ColumnMove) => {
  const rest = ids.filter((id) => id !== move.id)
  const index = rest.indexOf(move.target.key)
  if (index === -1) return ids

  rest.splice(move.target.position === 'before' ? index : index + 1, 0, move.id)

  return rest
}

/**
 * Column reordering by dragging the leaf column headers: a column moves within its pinned side and its header group,
 * through the column order (and the pinning order, which lays out pinned columns).
 */
export const useRichTableColumnReorder = <T extends RichTableData>(
  options: UseRichTableColumnReorderOptions<T>,
) => {
  const { table } = options
  const { t } = useLocale()

  const getColumn = (key: string | undefined) => (key ? table.getColumn(key) : undefined)

  // The columns a column moves among: the visible leaf columns on its pinned side, under the same header group
  const getSiblings = (column: Column<T, unknown>) => {
    const sideColumns = {
      left: () => table.getLeftVisibleLeafColumns(),
      center: () => table.getCenterVisibleLeafColumns(),
      right: () => table.getRightVisibleLeafColumns(),
    }[column.getIsPinned() || 'center']()

    return sideColumns.filter((sibling) => sibling.parent?.id === column.parent?.id)
  }

  const getDragKeys = (key: string) => (options.isEnabled() && getColumn(key) ? [key] : [])

  // Before the first sibling, then after each sibling
  const getTargets = ([key]: string[]): DropTarget[] => {
    const column = getColumn(key)
    const siblings = column ? getSiblings(column) : []
    const [first] = siblings
    if (!first) return []

    return [
      { key: first.id, position: 'before' },
      ...siblings.map((sibling): DropTarget => ({ key: sibling.id, position: 'after' })),
    ]
  }

  const canDrop = ([key]: string[], target: DropTarget) => {
    const column = getColumn(key)

    return !!column && getSiblings(column).some((sibling) => sibling.id === target.key)
  }

  const getLabel = (key: string) => {
    const header = getColumn(key)?.columnDef.header

    return typeof header === 'string' ? header : key
  }

  // The new order moves the focused header in the DOM, which drops the focus: put it back
  const refocusHeader = (key: string) => {
    const headers = options
      .getRootElement()
      ?.querySelectorAll<HTMLElement>(`[${COLUMN_KEY_ATTRIBUTE}]`)

    const header = [...(headers ?? [])].find(
      (element) => element.getAttribute(COLUMN_KEY_ATTRIBUTE) === key,
    )

    if (header && document.activeElement !== header) header.focus()
  }

  const onDrop = ([key]: string[], target: DropTarget) => {
    const column = getColumn(key)
    if (!column) return

    const isHeaderFocused = document.activeElement?.getAttribute(COLUMN_KEY_ATTRIBUTE) === column.id
    const move = { id: column.id, target }
    table.setColumnOrder(
      moveId(
        table.getAllLeafColumns().map(({ id }) => id),
        move,
      ),
    )

    // Pinned columns are laid out in their pinning order, not the column order
    const side = column.getIsPinned()
    if (side)
      table.setColumnPinning((pinning) => ({
        ...pinning,
        [side]: moveId(pinning[side] ?? [], move),
      }))

    if (isHeaderFocused) void nextTick(() => refocusHeader(column.id))
  }

  const drag = useDragAndDrop({
    root: options.getRootElement,
    keyAttribute: COLUMN_KEY_ATTRIBUTE,
    orientation: 'horizontal',
    getDragKeys,
    getTargets,
    canDrop,
    getLabel,
    onDrop,
  })

  // Only leaf column headers drag: group and placeholder cells span other columns
  const isDraggableHeader = (header: Header<T, unknown>) =>
    options.isEnabled() && !header.isPlaceholder && header.subHeaders.length === 0

  /** The drag attributes of a header cell: its key and tab stop, and whether it is dragged or the drop target. */
  const getHeaderAttributes = (header: Header<T, unknown>) => {
    if (!isDraggableHeader(header)) return {}

    const { id } = header.column

    return {
      [COLUMN_KEY_ATTRIBUTE]: id,
      tabindex: 0,
      'aria-description': t('dragAndDrop.instructions'),
      'data-dragging': drag.isDragging(id) ? '' : undefined,
      'data-drop-target': drag.getDropPosition(id),
    }
  }

  const onHeaderPointerDown = (event: PointerEvent, header: Header<T, unknown>) => {
    if (!isDraggableHeader(header)) return

    const isOnControl = (event.target as Element).closest(INTERACTIVE_SELECTOR) !== null
    if (isOnControl) return

    drag.onPointerDown(event, header.column.id)
  }

  const onHeaderKeyDown = (event: KeyboardEvent, header: Header<T, unknown>) => {
    if (isDraggableHeader(header)) drag.onKeyDown(event, header.column.id)
  }

  return { getHeaderAttributes, onHeaderPointerDown, onHeaderKeyDown }
}
