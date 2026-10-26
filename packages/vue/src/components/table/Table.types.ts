import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type { ColumnWidth } from './columnSizes'
import type theme from './theme'

type Table = typeof theme

/** Key identifying a row for selection, expansion and `disabledKeys`: the row's `id`, or its index when it has none. */
export type TableSelectionKey = string | number

/** Selected (or expanded) row keys, or `'all'` when every selectable row is selected. */
export type TableSelection = Set<TableSelectionKey> | 'all'

/** Direction of a column sort. */
export type TableSortDirection = 'ascending' | 'descending'

/** The column the table is sorted by and in which direction, used by `v-model:sortDescriptor`. */
export type TableSortDescriptor = {
  /** Key of the column being sorted. */
  column: string
  /** Sort direction. */
  direction: TableSortDirection
}

/** Definition of one table column: its key, header label, alignment, sizing and sorting. */
export type TableColumn = {
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
  class?: ClassValue
}

/** One row of table data. Cell values are read by column key; `children` nests rows under it. */
export type TableRow = {
  /** Unique row key. Falls back to the row's index among its siblings when omitted — provide one explicitly for nested, filtered or reordered rows. */
  id?: string | number
  /** Nested rows, indented under this one. Pair with `treeColumn` and `expandedKeys`. */
  children?: TableRow[]
  /** Whether the row is disabled: dimmed, excluded from selection and interaction. */
  disabled?: boolean
  /** Arbitrary cell values, read as `row[column.key]` unless a `#<key>-cell` slot is provided. */
  [key: string]: unknown
}

/** Props of the `Table` component. */
export type TableProps<T extends TableRow = TableRow> = {
  /** Column definitions, in display order. */
  columns: TableColumn[]
  /** Row data, already sorted by the caller according to `sortDescriptor` (Table only displays the sort indicator and emits changes). */
  rows: T[]
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
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Table>
}

/** Props passed to a `#<column.key>-cell` slot. */
export type TableCellSlotProps<T extends TableRow = TableRow> = {
  /** The row being rendered. */
  row: T
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

/** Props passed to a `#<column.key>-header` slot. */
export type TableHeaderSlotProps = {
  /** The column being rendered. */
  column: TableColumn
  /** Current sort direction for this column, when it is the sorted one. */
  sortDirection: TableSortDirection | undefined
}

/** Slots of the `Table` component. */
export type TableSlots<T extends TableRow = TableRow> = {
  /** Header content for a column, replacing `column.label`. Named dynamically per column: `#<column.key>-header="{ column, sortDirection }"`. */
  [slot: `${string}-header`]: ((props: TableHeaderSlotProps) => VNode[]) | undefined
  /** Cell content for a column, replacing `row[column.key]`. Named dynamically per column: `#<column.key>-cell="{ row, column, value, index, depth, isExpanded, hasChildItems, toggle }"`. */
  [slot: `${string}-cell`]: ((props: TableCellSlotProps<T>) => VNode[]) | undefined
  /** Content shown instead of the body when `rows` is empty. */
  empty?: () => VNode[]
  /** Content of the load-more row shown while `loading`. Defaults to a `Spinner`. */
  'load-more'?: () => VNode[]
  /** Footer content, rendered outside the scrollable table (e.g. pagination). */
  footer?: () => VNode[]
}
