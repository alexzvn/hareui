<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import type { ColumnWidth } from '../utils/columnSizes'
import theme from '../theme/table'

type Table = typeof theme

export type TableSelectionKey = string | number
export type TableSelection = Set<TableSelectionKey> | 'all'
export type TableSortDirection = 'ascending' | 'descending'

export interface TableSortDescriptor {
  /** Key of the column being sorted. */
  column: string
  /** Sort direction. */
  direction: TableSortDirection
}

export interface TableColumn {
  /** Unique column key. Looked up as `row[key]` for the default cell content and matched against `sortDescriptor.column`. */
  key: string
  /** Header label. Replaced by the `#<key>-header` slot. */
  label?: string
  /** Whether clicking/activating the header toggles `sortDescriptor` for this column. */
  sortable?: boolean
  /** Whether this column is the row's accessible name. Its body cells get `role="rowheader"`. */
  isRowHeader?: boolean
  /** Text alignment of the header and cells. */
  align?: 'start' | 'center' | 'end'
  /**
   * Initial width: pixels, a percentage of the table (`'25%'`) or a share of the free space (`'2fr'`).
   * With resizable columns every column defaults to `'1fr'`; otherwise only pixel widths apply.
   */
  width?: ColumnWidth
  /**
   * Minimum width in pixels for the column layout and resizing (resizable tables only).
   * @defaultValue 75
   */
  minWidth?: number
  /** Maximum width in pixels for the column layout and resizing (resizable tables only). */
  maxWidth?: number
  /** Whether this column shows a drag handle to resize it. */
  resizable?: boolean
  /** Additional classes merged into this column's header and body cells. */
  class?: any
}

export interface TableRow {
  /** Unique row key. Falls back to the row's index among its siblings when omitted — provide one explicitly for nested, filtered or reordered rows. */
  id?: string | number
  /** Nested rows, indented under this one. Pair with `treeColumn` and `expandedKeys`. */
  children?: TableRow[]
  /** Whether the row is disabled: dimmed, excluded from selection and interaction. */
  disabled?: boolean
  /** Arbitrary cell values, read as `row[column.key]` unless a `#<key>-cell` slot is provided. */
  [key: string]: any
}

export interface TableProps {
  /** Column definitions, in display order. */
  columns: TableColumn[]
  /** Row data, already sorted by the caller according to `sortDescriptor` (Table only displays the sort indicator and emits changes). */
  rows: TableRow[]
  /** Accessible label for the table. */
  ariaLabel?: string
  /**
   * Visual variant. Primary has a gray background container with a card-style body; secondary is flat with transparent rows.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Table>['variant']
  /**
   * Row selection behavior. Adds a checkbox column when not `'none'`.
   * @defaultValue 'none'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * Selected row keys when uncontrolled.
   * @defaultValue new Set()
   */
  defaultSelectedKeys?: TableSelection
  /** Row keys excluded from selection, in addition to any row with `disabled`. */
  disabledKeys?: TableSelectionKey[]
  /** Sort state when uncontrolled. */
  defaultSortDescriptor?: TableSortDescriptor
  /** Key of the column that renders indentation for nested rows and receives tree-related slot props. */
  treeColumn?: string
  /**
   * Expanded row keys when uncontrolled.
   * @defaultValue new Set()
   */
  defaultExpandedKeys?: TableSelection
  /** Adds the load-more sentinel at the end of the body; `loadMore` is emitted when it scrolls into view. */
  hasMore?: boolean
  /** Shows the `#load-more` row (a `Spinner` by default) and stops re-emitting `loadMore` while the sentinel stays visible. */
  loading?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Table>
}

export interface TableCellSlotProps {
  /** The row being rendered. */
  row: TableRow
  /** The column being rendered. */
  column: TableColumn
  /** `row[column.key]`. */
  value: unknown
  /** Index of the row among all visible rows (after collapsing unexpanded tree branches). */
  index: number
  /** Nesting depth (1 for root rows), matching the `treeColumn` indentation. */
  depth: number
  /** Whether this row's children are currently shown. Only meaningful for `treeColumn` cells. */
  isExpanded: boolean
  /** Whether this row has nested `children`. Only meaningful for `treeColumn` cells. */
  hasChildItems: boolean
  /** Toggles `isExpanded` for this row. Only meaningful for `treeColumn` cells. */
  toggle: () => void
}

export interface TableHeaderSlotProps {
  /** The column being rendered. */
  column: TableColumn
  /** Current sort direction for this column, when it is the sorted one. */
  sortDirection: TableSortDirection | undefined
}

export interface TableSlots {
  /** Header content for a column, replacing `column.label`. Named dynamically per column: `#<column.key>-header="{ column, sortDirection }"`. */
  [slot: `${string}-header`]: ((props: TableHeaderSlotProps) => any) | undefined
  /** Cell content for a column, replacing `row[column.key]`. Named dynamically per column: `#<column.key>-cell="{ row, column, value, index, depth, isExpanded, hasChildItems, toggle }"`. */
  [slot: `${string}-cell`]: ((props: TableCellSlotProps) => any) | undefined
  /** Content shown instead of the body when `rows` is empty. */
  empty?: () => any
  /** Content of the load-more row shown while `loading`. Defaults to a `Spinner`. */
  'load-more'?: () => any
  /** Footer content, rendered outside the scrollable table (e.g. pagination). */
  footer?: () => any
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { calculateColumnSizes, DEFAULT_MIN_COLUMN_WIDTH } from '../utils/columnSizes'
import Checkbox from './Checkbox.vue'
import Spinner from './Spinner.vue'

const props = withDefaults(defineProps<TableProps>(), {
  variant: 'primary',
  selectionMode: 'none',
  hasMore: false,
  loading: false,
})
const emit = defineEmits<{
  /** Emitted when the load-more sentinel scrolls into view while `hasMore` is true and `loading` is false. */
  loadMore: []
}>()
/** Controlled selected row keys. Use `v-model:selected-keys`. */
const selectedKeysModel = defineModel<TableSelection>('selectedKeys')
/** Controlled expanded row keys (tree rows). Use `v-model:expanded-keys`. */
const expandedKeysModel = defineModel<TableSelection>('expandedKeys')
/** Controlled sort state. Use `v-model:sort-descriptor`. */
const sortDescriptorModel = defineModel<TableSortDescriptor | undefined>('sortDescriptor')
defineSlots<TableSlots>()
const slots = useSlots()

const ui = useComponentUI('table', theme, () => ({ variant: props.variant }))

/* ---------------- Selection ---------------- */
const localSelected = ref<TableSelection>(props.defaultSelectedKeys ?? new Set())
const selectedKeys = computed<TableSelection>(() => selectedKeysModel.value ?? localSelected.value)

function setSelected(next: TableSelection) {
  localSelected.value = next
  selectedKeysModel.value = next
}

function isSelected(key: TableSelectionKey): boolean {
  return selectedKeys.value === 'all' || selectedKeys.value.has(key)
}

function isSelectable(key: TableSelectionKey, row: TableRow): boolean {
  return !row.disabled && !props.disabledKeys?.includes(key)
}

/* ---------------- Expansion (tree rows) ---------------- */
const localExpanded = ref<TableSelection>(props.defaultExpandedKeys ?? new Set())
const expandedKeys = computed<TableSelection>(() => expandedKeysModel.value ?? localExpanded.value)

function isRowExpanded(key: TableSelectionKey): boolean {
  return expandedKeys.value === 'all' || expandedKeys.value.has(key)
}

function toggleExpanded(key: TableSelectionKey) {
  const current = expandedKeys.value
  const next = new Set(current === 'all' ? flatRows.value.filter(r => r.hasChildItems).map(r => r.key) : current)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  localExpanded.value = next
  expandedKeysModel.value = next
}

/* ---------------- Sort ---------------- */
const localSort = ref<TableSortDescriptor | undefined>(props.defaultSortDescriptor)
const sortDescriptor = computed(() => sortDescriptorModel.value ?? localSort.value)

function toggleSort(column: TableColumn) {
  if (!column.sortable)
    return
  const current = sortDescriptor.value
  const direction: TableSortDirection = current?.column === column.key && current.direction === 'ascending' ? 'descending' : 'ascending'
  const next = { column: column.key, direction }
  localSort.value = next
  sortDescriptorModel.value = next
}

function sortDirectionFor(column: TableColumn): TableSortDirection | undefined {
  return sortDescriptor.value?.column === column.key ? sortDescriptor.value.direction : undefined
}

/* ---------------- Row flattening (tree) ---------------- */
interface FlatRow {
  row: TableRow
  key: TableSelectionKey
  depth: number
  hasChildItems: boolean
  index: number
}

const flatRows = computed<FlatRow[]>(() => {
  const acc: FlatRow[] = []
  let index = 0
  function visit(rows: TableRow[], depth: number) {
    rows.forEach((row, i) => {
      const key = row.id ?? i
      const hasChildItems = !!row.children?.length
      acc.push({ row, key, depth, hasChildItems, index: index++ })
      if (hasChildItems && props.treeColumn && isRowExpanded(key))
        visit(row.children!, depth + 1)
    })
  }
  visit(props.rows, 1)
  return acc
})

const selectableKeys = computed(() => flatRows.value.filter(r => isSelectable(r.key, r.row)).map(r => r.key))
const allSelected = computed(() => selectableKeys.value.length > 0 && selectableKeys.value.every(k => isSelected(k)))
const someSelected = computed(() => !allSelected.value && selectableKeys.value.some(k => isSelected(k)))
const selectAllModel = computed<boolean | 'indeterminate'>(() => allSelected.value ? true : someSelected.value ? 'indeterminate' : false)

function toggleSelectAll() {
  if (allSelected.value)
    setSelected(new Set())
  else
    setSelected(new Set(selectableKeys.value))
}

function toggleRowSelection(key: TableSelectionKey, row: TableRow) {
  if (!isSelectable(key, row))
    return
  if (props.selectionMode === 'single') {
    setSelected(isSelected(key) ? new Set() : new Set([key]))
    return
  }
  const current = selectedKeys.value === 'all' ? new Set(selectableKeys.value) : new Set(selectedKeys.value)
  if (current.has(key))
    current.delete(key)
  else
    current.add(key)
  setSelected(current)
}

/** The scroll (or resizable) container: the column layout's width and the load-more observer root. */
const scrollRootRef = ref<HTMLElement>()

/* ---------------- Column resizing ---------------- */
// Like React Aria's ResizableTableContainer: columns are laid out against the container's width
// with `calculateColumnSizes`; resizing freezes the columns to the left at their current pixel
// widths and keeps the ones to the right flexible.
const hasResizableColumns = computed(() => props.columns.some(c => c.resizable))
const containerWidth = ref(0)
/** Widths set by resizing, replacing `column.width` for every column once a resize happened. */
const resizedWidths = ref<Record<string, ColumnWidth>>()
const resizingKey = ref<string>()

const columnWidths = computed<Record<string, number>>(() => {
  if (!hasResizableColumns.value || !containerWidth.value)
    return {}
  const sizes = calculateColumnSizes(containerWidth.value, props.columns.map(column => ({
    width: resizedWidths.value?.[column.key] ?? column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  })))
  return Object.fromEntries(props.columns.map((column, i) => [column.key, sizes[i]]))
})

function widthStyle(column: TableColumn) {
  const w = hasResizableColumns.value ? columnWidths.value[column.key] : column.width
  return typeof w === 'number' ? { width: `${w}px`, minWidth: `${w}px`, maxWidth: `${w}px` } : undefined
}

function minWidthOf(column: TableColumn): number {
  return column.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH
}

function resizeColumn(column: TableColumn, width: number) {
  width = Math.max(minWidthOf(column), Math.min(column.maxWidth ?? Number.MAX_SAFE_INTEGER, Math.floor(width)))
  const index = props.columns.indexOf(column)
  resizedWidths.value = Object.fromEntries(props.columns.map((c, i) => [
    c.key,
    i < index ? columnWidths.value[c.key] : i === index ? width : resizedWidths.value?.[c.key] ?? c.width ?? '1fr',
  ]))
}

let containerObserver: ResizeObserver | undefined
watch([hasResizableColumns, () => scrollRootRef.value], ([resizable, el]) => {
  containerObserver?.disconnect()
  containerObserver = undefined
  if (!resizable || !el)
    return
  containerWidth.value = el.clientWidth
  containerObserver = new ResizeObserver(() => {
    containerWidth.value = el.clientWidth
  })
  containerObserver.observe(el)
}, { flush: 'post' })

let resizeStart: { column: TableColumn, startX: number, startWidth: number } | null = null

function onResizerPointerDown(column: TableColumn, event: PointerEvent) {
  resizeStart = { column, startX: event.clientX, startWidth: columnWidths.value[column.key] ?? 0 }
  resizingKey.value = column.key
  window.addEventListener('pointermove', onResizerPointerMove)
  window.addEventListener('pointerup', onResizerPointerUp, { once: true })
}

function onResizerPointerMove(event: PointerEvent) {
  if (resizeStart)
    resizeColumn(resizeStart.column, resizeStart.startWidth + event.clientX - resizeStart.startX)
}

function onResizerPointerUp() {
  resizeStart = null
  resizingKey.value = undefined
  window.removeEventListener('pointermove', onResizerPointerMove)
}

function onResizerKeydown(column: TableColumn, event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    return
  event.preventDefault()
  const step = event.shiftKey ? 50 : 10
  const dir = event.key === 'ArrowRight' ? 1 : -1
  resizeColumn(column, (columnWidths.value[column.key] ?? 0) + dir * step)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onResizerPointerMove)
  containerObserver?.disconnect()
})

/* ---------------- Load more (infinite scroll sentinel) ---------------- */
const sentinelRef = ref<HTMLElement>()
let observer: IntersectionObserver | undefined

// The state the sentinel was last observed in: the same state is never re-observed, so the
// watch below can fire several times per tick (e.g. on mount) without asking twice.
let observedState: unknown[] = []

function observeSentinel() {
  const state = [props.hasMore, props.loading, props.rows.length, sentinelRef.value]
  if (state.every((value, i) => value === observedState[i]))
    return
  observedState = state
  observer?.disconnect()
  if (!props.hasMore || !sentinelRef.value)
    return
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && !props.loading)
      emit('loadMore')
  }, { root: scrollRootRef.value ?? null })
  observer.observe(sentinelRef.value)
}

// Re-observing delivers a fresh initial entry, so a sentinel that stays in view after a page
// loads (short pages, tall container) asks for the next one, like React Aria's useLoadMoreSentinel.
watch([() => props.hasMore, () => props.loading, () => props.rows.length, sentinelRef], () => nextTick(observeSentinel), { immediate: true })
onBeforeUnmount(() => observer?.disconnect())

/* ---------------- Row focus / keyboard navigation ----------------
 * Matches HeroUI's default `keyboardNavigationBehavior="tab"`: each row is one tab stop
 * (Up/Down/Home/End move it), interactive cell content (checkboxes, buttons) is reached
 * with Tab. This is a plain `<table>`, not a `role="grid"`, so there is no per-cell arrow-key
 * navigation (React Aria's `keyboardNavigationBehavior="arrow"` mode) — recorded as a gap.
 */
const tableRef = ref<HTMLElement>()
const activeRowKey = ref<TableSelectionKey>()
watch(flatRows, (rowsNow) => {
  if (rowsNow.length === 0) {
    activeRowKey.value = undefined
    return
  }
  if (!rowsNow.some(r => r.key === activeRowKey.value))
    activeRowKey.value = rowsNow[0]!.key
}, { immediate: true })

function focusRow(key: TableSelectionKey) {
  nextTick(() => {
    tableRef.value?.querySelector<HTMLElement>(`[data-row-key="${CSS.escape(String(key))}"]`)?.focus()
  })
}

function onRowKeydown(flat: FlatRow, event: KeyboardEvent) {
  const rowsNow = flatRows.value
  const i = rowsNow.findIndex(r => r.key === flat.key)
  if (event.key === 'ArrowDown' && i < rowsNow.length - 1) {
    event.preventDefault()
    activeRowKey.value = rowsNow[i + 1]!.key
    focusRow(rowsNow[i + 1]!.key)
  }
  else if (event.key === 'ArrowUp' && i > 0) {
    event.preventDefault()
    activeRowKey.value = rowsNow[i - 1]!.key
    focusRow(rowsNow[i - 1]!.key)
  }
  else if (event.key === 'Home' && rowsNow.length > 0) {
    event.preventDefault()
    activeRowKey.value = rowsNow[0]!.key
    focusRow(rowsNow[0]!.key)
  }
  else if (event.key === 'End' && rowsNow.length > 0) {
    event.preventDefault()
    activeRowKey.value = rowsNow[rowsNow.length - 1]!.key
    focusRow(rowsNow[rowsNow.length - 1]!.key)
  }
  else if ((event.key === 'Enter' || event.key === ' ') && event.target === event.currentTarget && props.selectionMode !== 'none') {
    event.preventDefault()
    toggleRowSelection(flat.key, flat.row)
  }
}

function onRowClick(flat: FlatRow, event: MouseEvent) {
  if (props.selectionMode === 'none')
    return
  const target = event.target as HTMLElement
  if (target.closest('button, a, input, [data-slot="table-column-resizer"]'))
    return
  toggleRowSelection(flat.key, flat.row)
}

/* ---------------- Misc helpers ---------------- */
const colSpan = computed(() => props.columns.length + (props.selectionMode !== 'none' ? 1 : 0))

function cellValue(row: TableRow, column: TableColumn) {
  return row[column.key]
}

function alignClass(column: TableColumn) {
  if (column.align === 'center')
    return 'text-center'
  if (column.align === 'end')
    return 'text-end'
  return undefined
}
</script>

<template>
  <div ref="tableRef" data-slot="table" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div
      ref="scrollRootRef"
      :data-slot="hasResizableColumns ? 'table-resizable-container' : 'table-scroll-container'"
      :class="hasResizableColumns ? ui.resizableContainer({ class: props.ui?.resizableContainer }) : ui.scrollContainer({ class: props.ui?.scrollContainer })"
    >
      <table :aria-label="ariaLabel" data-slot="table-content" :class="ui.content({ class: props.ui?.content })">
        <thead data-slot="table-header" :class="ui.header({ class: props.ui?.header })">
          <tr>
            <th
              v-if="selectionMode !== 'none'"
              scope="col"
              data-slot="table-column"
              :class="ui.column({ class: [props.ui?.column, 'pe-0'] })"
              @click.stop
            >
              <Checkbox :model-value="selectAllModel" aria-label="Select all" @update:model-value="toggleSelectAll" />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              data-slot="table-column"
              :data-allows-sorting="column.sortable ? 'true' : undefined"
              :aria-sort="column.sortable ? (sortDirectionFor(column) ?? 'none') : undefined"
              :tabindex="column.sortable ? 0 : undefined"
              :style="widthStyle(column)"
              :class="ui.column({ class: [props.ui?.column, column.class, alignClass(column)] })"
              @click="toggleSort(column)"
              @keydown.enter.prevent="toggleSort(column)"
              @keydown.space.prevent="toggleSort(column)"
            >
              <span v-if="column.sortable" data-slot="table-sortable-column-header" :data-direction="sortDirectionFor(column)" :class="ui.sortableColumnHeader({ class: props.ui?.sortableColumnHeader })">
                <slot :name="`${column.key}-header`" :column="column" :sort-direction="sortDirectionFor(column)">{{ column.label }}</slot>
                <!-- Like HeroUI's SortableColumnHeader: the indicator only shows on the sorted column. -->
                <svg
                  v-if="sortDirectionFor(column)"
                  aria-hidden="true"
                  data-slot="table-sortable-column-indicator"
                  :data-direction="sortDirectionFor(column)"
                  :class="ui.sortableColumnIndicator({ class: props.ui?.sortableColumnIndicator })"
                  fill="none"
                  height="16"
                  role="presentation"
                  viewBox="0 0 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M13.03 10.53a.75.75 0 0 1-1.06 0L8 6.56l-3.97 3.97a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06"
                    fill="currentColor"
                    fill-rule="evenodd"
                  />
                </svg>
              </span>
              <slot v-else :name="`${column.key}-header`" :column="column" :sort-direction="undefined">{{ column.label }}</slot>
              <div
                v-if="column.resizable"
                data-slot="table-column-resizer"
                role="separator"
                aria-orientation="vertical"
                :aria-valuenow="columnWidths[column.key]"
                :aria-valuemin="minWidthOf(column)"
                :aria-valuemax="column.maxWidth"
                tabindex="0"
                :data-resizing="resizingKey === column.key ? 'true' : undefined"
                :class="ui.columnResizer({ class: props.ui?.columnResizer })"
                @click.stop
                @pointerdown.stop="onResizerPointerDown(column, $event)"
                @keydown="onResizerKeydown(column, $event)"
              />
            </th>
          </tr>
        </thead>
        <tbody data-slot="table-body" :data-empty="flatRows.length === 0 || undefined" :class="ui.body({ class: props.ui?.body })">
          <!-- Like React Aria's `renderEmptyState`: no row at all unless the slot is provided. -->
          <tr v-if="flatRows.length === 0 && !!slots.empty" role="row">
            <td role="rowheader" :colspan="colSpan">
              <slot name="empty" />
            </td>
          </tr>
          <tr
            v-for="flat in flatRows"
            :key="flat.key"
            class="group"
            data-slot="table-row"
            :data-row-key="flat.key"
            :data-selected="isSelected(flat.key) ? 'true' : undefined"
            :aria-selected="selectionMode !== 'none' ? isSelected(flat.key) : undefined"
            :aria-disabled="flat.row.disabled ? 'true' : undefined"
            :tabindex="flat.key === activeRowKey ? 0 : -1"
            :style="{ '--table-row-level': flat.depth }"
            :class="ui.row({ class: props.ui?.row })"
            @click="onRowClick(flat, $event)"
            @focus="activeRowKey = flat.key"
            @keydown="onRowKeydown(flat, $event)"
          >
            <td
              v-if="selectionMode !== 'none'"
              data-slot="table-cell"
              :class="ui.cell({ class: [props.ui?.cell, 'pe-0'] })"
              @click.stop
            >
              <Checkbox
                :model-value="isSelected(flat.key)"
                :disabled="!isSelectable(flat.key, flat.row)"
                :aria-label="`Select row ${flat.index + 1}`"
                variant="secondary"
                @update:model-value="toggleRowSelection(flat.key, flat.row)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :role="column.isRowHeader ? 'rowheader' : undefined"
              data-slot="table-cell"
              :data-tree-column="treeColumn === column.key ? 'true' : undefined"
              :style="widthStyle(column)"
              :class="ui.cell({ class: [props.ui?.cell, column.class, alignClass(column)] })"
            >
              <slot
                :name="`${column.key}-cell`"
                :row="flat.row"
                :column="column"
                :value="cellValue(flat.row, column)"
                :index="flat.index"
                :depth="flat.depth"
                :is-expanded="isRowExpanded(flat.key)"
                :has-child-items="flat.hasChildItems"
                :toggle="() => toggleExpanded(flat.key)"
              >
                {{ cellValue(flat.row, column) }}
              </slot>
            </td>
          </tr>
          <!-- React Aria's LoadMoreItem: an inert zero-height sentinel row, plus the content row only while loading. -->
          <tr v-if="hasMore" ref="sentinelRef" inert style="height: 0">
            <td style="padding: 0; border: 0">
              <div style="position: relative; height: 1px; width: 1px" />
            </td>
          </tr>
          <tr v-if="hasMore && loading" role="row" data-slot="table-load-more" :class="ui.loadMore({ class: props.ui?.loadMore })">
            <td role="rowheader" :colspan="colSpan">
              <div data-slot="table-load-more-content" :class="ui.loadMoreContent({ class: props.ui?.loadMoreContent })">
                <slot name="load-more">
                  <Spinner size="md" />
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!!slots.footer" data-slot="table-footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </div>
</template>
