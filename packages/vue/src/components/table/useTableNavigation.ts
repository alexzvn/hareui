import type { Ref } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'

import type { SelectionMode, useSelectionManager } from '@/composables/useSelectionManager'

import type { TableSelectionKey } from './Table.types'
import type { FlatRow } from './table.utils'

type SelectionManager = ReturnType<typeof useSelectionManager<TableSelectionKey>>

export type UseTableNavigationOptions = {
  /** The table's root element. */
  table: Readonly<Ref<HTMLElement | null | undefined>>
  /** The visible rows, in display order. */
  rows: () => FlatRow[]
  selectionMode: () => SelectionMode
  manager: SelectionManager
  toggleSelectAll: () => void
}

/** The element holding the table's single tab stop. */
type FocusTarget = { kind: 'row'; key: TableSelectionKey } | { kind: 'header'; index: number }

/** Where each key moves row focus, from the focused row at `index`. */
const ROW_TARGETS = new Map<string, (rows: FlatRow[], index: number) => FlatRow | undefined>([
  ['ArrowDown', (rows, index) => rows[index + 1]],
  ['ArrowUp', (rows, index) => rows[index - 1]],
  ['Home', (rows) => rows[0]],
  ['End', (rows) => rows.at(-1)],
])

/** Where each key moves header focus, from the focused header at `index` of `count`. */
const HEADER_TARGETS = new Map<string, (index: number, count: number) => number>([
  ['ArrowRight', (index) => index + 1],
  ['ArrowLeft', (index) => index - 1],
  ['Home', () => 0],
  ['End', (_index, count) => count - 1],
])

/** Clicks on interactive cell content are theirs, not the row's. */
const INTERACTIVE_SELECTOR = 'button, a, input, [data-slot="table-column-resizer"]'

const isShown = (target: FocusTarget | undefined, rows: FlatRow[]) => {
  if (!target) return false
  if (target.kind === 'header') return true

  return rows.some((flat) => flat.key === target.key)
}

/**
 * Like React Aria's grid, the table is a single tab stop (roving tabindex): the last focused row or
 * column header, initially the first row. Up/Down/Home/End move between rows, ArrowUp from the first
 * row enters the header row, Left/Right move between headers. Checkboxes are out of the tab order;
 * Space/Enter on a row toggles it, Shift+navigation/click selects a range. Focus lands on rows rather
 * than cells: this is a plain `<table>`, not a `role="grid"`, so there is no per-cell navigation.
 */
export const useTableNavigation = (options: UseTableNavigationOptions) => {
  const { table, rows, selectionMode, manager, toggleSelectAll } = options

  const focusTarget = ref<FocusTarget>()

  const activeRowKey = computed(() =>
    focusTarget.value?.kind === 'row' ? focusTarget.value.key : undefined,
  )

  // Keep the tab stop on a header or a still-visible row; otherwise fall back to the first row,
  // or the header row when there are none.
  watch(
    rows,
    (rowsNow) => {
      if (isShown(focusTarget.value, rowsNow)) return

      const firstRow = rowsNow[0]
      focusTarget.value = firstRow
        ? { kind: 'row', key: firstRow.key }
        : { kind: 'header', index: 0 }
    },
    { immediate: true },
  )

  const onRowFocus = (key: TableSelectionKey) => {
    focusTarget.value = { kind: 'row', key }
  }

  const onHeaderFocus = (index: number) => {
    focusTarget.value = { kind: 'header', index }
  }

  const headerTabindex = (index: number) => {
    const target = focusTarget.value

    return target?.kind === 'header' && target.index === index ? 0 : -1
  }

  const headerCells = (): HTMLElement[] => {
    return Array.from(table.value?.querySelectorAll<HTMLElement>('thead > tr > th') ?? [])
  }

  const focusRow = (key: TableSelectionKey) => {
    onRowFocus(key)

    nextTick(() => {
      const selector = `[data-row-key="${CSS.escape(String(key))}"]`
      table.value?.querySelector<HTMLElement>(selector)?.focus()
    })
  }

  const focusHeader = (index: number) => {
    const cells = headerCells()
    const clamped = Math.max(0, Math.min(cells.length - 1, index))
    onHeaderFocus(clamped)
    cells[clamped]?.focus()
  }

  /** Shift extends the range from the anchor; otherwise the row toggles. */
  const selectRow = (key: TableSelectionKey, isRange: boolean) => {
    if (isRange) {
      manager.extend(key)
      return
    }

    manager.toggle(key)
  }

  const onHeaderKeydown = (event: KeyboardEvent) => {
    const cells = headerCells()
    const index = cells.indexOf(event.target as HTMLElement)
    if (index === -1) return

    const headerIndex = HEADER_TARGETS.get(event.key)?.(index, cells.length)
    if (headerIndex !== undefined) {
      event.preventDefault()
      focusHeader(headerIndex)

      return
    }

    const firstRow = rows()[0]
    if (event.key === 'ArrowDown' && firstRow) {
      event.preventDefault()
      focusRow(firstRow.key)

      return
    }

    // The first header holds the select-all checkbox
    const isToggleKey = event.key === ' ' || event.key === 'Enter'
    const isSelectAllHeader = index === 0 && selectionMode() !== 'none'
    if (!isToggleKey || !isSelectAllHeader) return

    event.preventDefault()
    if (selectionMode() === 'multiple') toggleSelectAll()
  }

  const onRowKeydown = (flat: FlatRow, event: KeyboardEvent) => {
    // Keys typed into interactive cell content (inputs, buttons) are theirs
    if (event.target !== event.currentTarget) return

    const hasSelection = selectionMode() !== 'none'

    // Escape clears the selection, Meta/Ctrl+A selects every row
    if (hasSelection && manager.onKeydown(event)) return

    const rowsNow = rows()
    const index = rowsNow.findIndex((candidate) => candidate.key === flat.key)

    const isLeavingFirstRow = event.key === 'ArrowUp' && index === 0 && headerCells().length > 0
    if (isLeavingFirstRow) {
      event.preventDefault()
      focusHeader(0)

      return
    }

    const isToggleKey = event.key === 'Enter' || event.key === ' '
    if (isToggleKey && hasSelection) {
      event.preventDefault()
      selectRow(flat.key, event.shiftKey)

      return
    }

    const next = ROW_TARGETS.get(event.key)?.(rowsNow, index)
    if (!next) return

    event.preventDefault()
    focusRow(next.key)
    if (event.shiftKey) manager.extend(next.key, flat.key)
  }

  const onRowClick = (flat: FlatRow, event: MouseEvent) => {
    if (selectionMode() === 'none') return

    const target = event.target as HTMLElement
    if (target.closest(INTERACTIVE_SELECTOR)) return

    selectRow(flat.key, event.shiftKey)
  }

  return {
    activeRowKey,
    headerTabindex,
    onHeaderFocus,
    onRowFocus,
    onHeaderKeydown,
    onRowKeydown,
    onRowClick,
  }
}
