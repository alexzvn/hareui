import type { Ref } from 'vue'
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

import type { ColumnWidth } from './columnSizes'
import { calculateColumnSizes, DEFAULT_MIN_COLUMN_WIDTH } from './columnSizes'
import type { TableColumn } from './Table.types'

export type UseTableColumnResizeOptions = {
  /** The column definitions, in display order. */
  columns: () => TableColumn[]
  /** The element whose width the columns are laid out against. */
  container: Readonly<Ref<HTMLElement | null | undefined>>
}

/** A pointer drag on a column resizer. */
type ResizeDrag = { column: TableColumn; startX: number; startWidth: number }

/** Arrow-key resize steps in pixels, without and with Shift. */
const KEYBOARD_STEP = { base: 10, shift: 50 }

/**
 * Column widths and resizing, like React Aria's ResizableTableContainer: columns are laid out
 * against the container's width with `calculateColumnSizes`; resizing freezes the columns to the
 * left at their current pixel widths and keeps the ones to the right flexible.
 */
export const useTableColumnResize = ({ columns, container }: UseTableColumnResizeOptions) => {
  const hasResizableColumns = computed(() => columns().some((column) => column.resizable))
  const containerWidth = ref(0)

  /** Widths set by resizing, replacing `column.width` for every column once a resize happened. */
  const resizedWidths = ref<Record<string, ColumnWidth>>()
  const resizingKey = ref<string>()

  const columnWidths = computed<Record<string, number>>(() => {
    if (!hasResizableColumns.value || !containerWidth.value) return {}

    const sizes = calculateColumnSizes(
      containerWidth.value,
      columns().map((column) => ({
        width: resizedWidths.value?.[column.key] ?? column.width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      })),
    )

    return Object.fromEntries(columns().map((column, i) => [column.key, sizes[i]]))
  })

  const widthStyle = (column: TableColumn) => {
    const width = hasResizableColumns.value ? columnWidths.value[column.key] : column.width
    if (typeof width !== 'number') return undefined

    return { width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }
  }

  const minWidthOf = (column: TableColumn): number => {
    return column.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH
  }

  /** A resizable column's laid-out width; its minimum until the container has been measured (the layout clamps a 0px container to the minimums). */
  const columnWidthOf = (column: TableColumn): number => {
    return columnWidths.value[column.key] ?? minWidthOf(column)
  }

  const baseId = useId()

  // By position, not key: a key may hold characters (spaces) that would split an `aria-labelledby` id list
  const columnHeaderId = (column: TableColumn) => {
    return `${baseId}-column-${columns().indexOf(column)}`
  }

  const clampWidth = (column: TableColumn, width: number) => {
    const maxWidth = column.maxWidth ?? Number.MAX_SAFE_INTEGER

    return Math.max(minWidthOf(column), Math.min(maxWidth, Math.floor(width)))
  }

  const resizeColumn = (resized: TableColumn, width: number) => {
    const resizedIndex = columns().indexOf(resized)
    const resizedWidth = clampWidth(resized, width)

    const nextWidthOf = (column: TableColumn, index: number) => {
      if (index < resizedIndex) return columnWidths.value[column.key]
      if (index === resizedIndex) return resizedWidth

      return resizedWidths.value?.[column.key] ?? column.width ?? '1fr'
    }

    resizedWidths.value = Object.fromEntries(
      columns().map((column, index) => [column.key, nextWidthOf(column, index)]),
    )
  }

  let containerObserver: ResizeObserver | undefined

  const observeContainer = (isResizable: boolean, el: HTMLElement | null | undefined) => {
    containerObserver?.disconnect()
    containerObserver = undefined
    if (!isResizable || !el) return

    containerWidth.value = el.clientWidth

    containerObserver = new ResizeObserver(() => {
      containerWidth.value = el.clientWidth
    })

    containerObserver.observe(el)
  }

  watch(
    [hasResizableColumns, () => container.value],
    ([isResizable, el]) => observeContainer(isResizable, el),
    { flush: 'post' },
  )

  let drag: ResizeDrag | null = null

  const onResizerPointerMove = (event: PointerEvent) => {
    if (!drag) return

    resizeColumn(drag.column, drag.startWidth + event.clientX - drag.startX)
  }

  const onResizerPointerUp = () => {
    drag = null
    resizingKey.value = undefined
    window.removeEventListener('pointermove', onResizerPointerMove)
  }

  const onResizerPointerDown = (column: TableColumn, event: PointerEvent) => {
    drag = { column, startX: event.clientX, startWidth: columnWidths.value[column.key] ?? 0 }
    resizingKey.value = column.key
    window.addEventListener('pointermove', onResizerPointerMove)
    window.addEventListener('pointerup', onResizerPointerUp, { once: true })
  }

  const onResizerKeydown = (column: TableColumn, event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()

    const step = event.shiftKey ? KEYBOARD_STEP.shift : KEYBOARD_STEP.base
    const direction = event.key === 'ArrowRight' ? 1 : -1
    resizeColumn(column, columnWidthOf(column) + direction * step)
  }

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onResizerPointerMove)
    containerObserver?.disconnect()
  })

  return {
    hasResizableColumns,
    resizingKey,
    widthStyle,
    minWidthOf,
    columnWidthOf,
    columnHeaderId,
    onResizerPointerDown,
    onResizerKeydown,
  }
}
