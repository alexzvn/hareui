import type {
  Cell,
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersOptions,
  ColumnPinningOptions,
  ColumnSizingOptions,
  CoreOptions,
  ExpandedOptions,
  FacetedOptions,
  GlobalFilterOptions,
  GroupingOptions,
  Header,
  HeaderContext,
  PaginationOptions,
  Row,
  RowData,
  RowPinningOptions,
  RowSelectionOptions,
  SortingOptions,
  Table,
  VisibilityOptions,
} from '@tanstack/vue-table'
import type { VirtualizerOptions } from '@tanstack/vue-virtual'
import type { PrimitiveProps } from 'reka-ui'
import type { WatchOptions } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type RichTableTheme = typeof theme

/** Shape of a row's source data: any object type passed in `data`. */
export type RichTableData = RowData

/** A TanStack row: the source data (`original`) plus its id, depth, sub rows and feature state. */
export type RichTableRow<T extends RichTableData> = Row<T>

/** A TanStack header cell of a column, as rendered in `thead`/`tfoot`. */
export type RichTableHeader<T extends RichTableData, D = unknown> = Header<T, D>

/** A TanStack body cell: one column of one row. */
export type RichTableCell<T extends RichTableData, D = unknown> = Cell<T, D>

/** A TanStack column instance, as returned by `tableApi.getColumn()`. */
export type RichTableColumnInstance<T extends RichTableData, D = unknown> = Column<T, D>

/** Props of a `#<column-id>-header` / `#<column-id>-footer` slot and of a column's `header`/`footer` render function. */
export type RichTableHeaderContext<T extends RichTableData, D = unknown> = HeaderContext<T, D>

/** Props of a `#<column-id>-cell` slot and of a column's `cell` render function. */
export type RichTableCellContext<T extends RichTableData, D = unknown> = CellContext<T, D>

/** The TanStack Table instance, exposed as `tableApi`. */
export type RichTableApi<T extends RichTableData> = Table<T>

/** `meta` of a column definition: classes, styles and spans merged into its header (`th`) and body (`td`) cells. */
export type RichTableColumnMeta<T extends RichTableData = RichTableData, D = unknown> = {
  class?: {
    th?: string | ((header: Header<T, D>) => string)
    td?: string | ((cell: Cell<T, D>) => string)
  }
  style?: {
    th?:
      | string
      | Record<string, string>
      | ((header: Header<T, D>) => string | Record<string, string>)
    td?: string | Record<string, string> | ((cell: Cell<T, D>) => string | Record<string, string>)
  }
  colspan?: {
    td?: string | ((cell: Cell<T, D>) => string)
  }
  rowspan?: {
    td?: string | ((cell: Cell<T, D>) => string)
  }
}

/** `meta` of the table: classes and styles merged into every body row (`tr`). */
export type RichTableMeta<T extends RichTableData = RichTableData> = {
  class?: {
    tr?: string | ((row: Row<T>) => string)
  }
  style?: {
    tr?: string | Record<string, string> | ((row: Row<T>) => string | Record<string, string>)
  }
}

/** A TanStack column definition whose `meta` is typed as {@link RichTableColumnMeta}. */
export type RichTableColumn<T extends RichTableData, D = unknown> = ColumnDef<T, D> & {
  meta?: RichTableColumnMeta<T, D>
}

/** Look of the loading bar shown under the header while `loading` is set. */
export type RichTableLoadingBar = {
  /**
   * Color of the loading bar.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<RichTableTheme>['loadingColor']
  /**
   * Animation of the loading bar.
   * @defaultValue 'carousel'
   */
  animation?: ComponentVariants<RichTableTheme>['loadingAnimation']
}

/** TanStack debug logging switches, each logging to the console. */
export type RichTableDebug = {
  /** Logs debugging information for every table feature. */
  all?: boolean
  /** Logs cell debugging information. */
  cells?: boolean
  /** Logs column debugging information. */
  columns?: boolean
  /** Logs header debugging information. */
  headers?: boolean
  /** Logs row debugging information. */
  rows?: boolean
  /** Logs table debugging information. */
  table?: boolean
}

/** Table options of each built-in TanStack feature, keyed by feature. The state change handlers are bound to the `v-model`s. */
export type RichTableFeatures<T extends RichTableData = RichTableData> = {
  /**
   * Global filtering (`v-model:global-filter`), e.g. `globalFilterFn`.
   * @see https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options
   */
  globalFilter?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>
  /**
   * Column filtering (`v-model:column-filters`).
   * @see https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options
   */
  columnFilters?: Omit<ColumnFiltersOptions<T>, 'getFilteredRowModel' | 'onColumnFiltersChange'>
  /**
   * Column pinning (`v-model:column-pinning`).
   * @see https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options
   */
  columnPinning?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>
  /**
   * Column sizing (`v-model:column-sizing`). Column widths (`size`) are applied to the cells once `enableColumnResizing` is set or a column has been sized.
   * @see https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options
   */
  columnSizing?: Omit<ColumnSizingOptions, 'onColumnSizingChange' | 'onColumnSizingInfoChange'>
  /**
   * Column visibility (`v-model:column-visibility`).
   * @see https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options
   */
  visibility?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>
  /**
   * Sorting (`v-model:sorting`), e.g. `manualSorting`.
   * @see https://tanstack.com/table/v8/docs/api/features/sorting#table-options
   */
  sorting?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>
  /**
   * Grouping (`v-model:grouping`). Pass `getGroupedRowModel: getGroupedRowModel()` to enable client-side grouping.
   * @see https://tanstack.com/table/v8/docs/api/features/grouping#table-options
   */
  grouping?: Omit<GroupingOptions, 'onGroupingChange'>
  /**
   * Row expanding (`v-model:expanded`), e.g. `getRowCanExpand`.
   * @see https://tanstack.com/table/v8/docs/api/features/expanding#table-options
   */
  expanded?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>
  /**
   * Row selection (`v-model:row-selection`).
   * @see https://tanstack.com/table/v8/docs/api/features/row-selection#table-options
   */
  rowSelection?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>
  /**
   * Row pinning (`v-model:row-pinning`).
   * @see https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options
   */
  rowPinning?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>
  /**
   * Pagination (`v-model:pagination`). Pass `getPaginationRowModel: getPaginationRowModel()` to enable client-side pagination.
   * @see https://tanstack.com/table/v8/docs/api/features/pagination#table-options
   */
  pagination?: Omit<PaginationOptions, 'onPaginationChange'>
  /**
   * Column faceting.
   * @see https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options
   */
  faceted?: FacetedOptions<T>
}

/** Props of `RichTable`: a data table driven by TanStack Table, with sorting, filtering, selection, pinning, grouping and virtualization. */
export type RichTableProps<T extends RichTableData = RichTableData> = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The rows. A shallow copy is kept and replaced whenever `data` changes (deeply, see `watchOptions`). */
  data?: T[]
  /** TanStack column definitions. Defaults to one column per key of the first row, titled by the key. */
  columns?: RichTableColumn<T>[]
  /** Accessible caption, visually hidden. Replaced by the `#caption` slot. */
  caption?: string
  /** Table `meta`: `meta.class.tr` / `meta.style.tr` are merged into every body row. */
  meta?: RichTableMeta<T>
  /**
   * Visual variant. Primary has a gray container with a card-style body; secondary is flat with transparent rows.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<RichTableTheme>['variant']
  /**
   * Enable virtualization for large datasets. Pass an object to configure the TanStack virtualizer.
   * Row pinning is not supported when virtualization is enabled.
   * @see https://tanstack.com/virtual/latest/docs/api/virtualizer#options
   * @defaultValue false
   */
  virtualize?:
    | boolean
    | (Partial<
        Omit<VirtualizerOptions<Element, Element>, 'count' | 'estimateSize' | 'overscan'>
      > & {
        /**
         * Virtualize against an external scroll element instead of the table's own root.
         * Pair with `scrollMargin` set to the table's offset from the scroll element's start.
         * @defaultValue undefined
         */
        getScrollElement?: () => Element | null
        /**
         * Number of items rendered outside the visible area.
         * @defaultValue 12
         */
        overscan?: number
        /**
         * Estimated size (in px) of each item, or a function that returns the size for a given index.
         * @defaultValue 65
         */
        estimateSize?: number | ((index: number) => number)
      })
  /**
   * The text to display when the table is empty.
   * @defaultValue 'No data'
   */
  empty?: string
  /**
   * Whether the table has a sticky header or footer: `true` for both, `'header'` or `'footer'` for one.
   * @defaultValue false
   */
  sticky?: boolean | 'header' | 'footer'
  /**
   * Whether the table is loading: shows the animated bar under the header, and the `#loading` slot while there are no rows.
   * @defaultValue false
   */
  loading?: boolean
  /** Color and animation of the loading bar. */
  loadingBar?: RichTableLoadingBar
  /**
   * Customize how `data` changes are watched (for ex: disable deep watching or limit the traversal depth). Improves performance with large datasets, at the cost of missing in-place row mutations.
   * @see https://vuejs.org/api/options-state.html#watch
   * @defaultValue { deep: true }
   */
  watchOptions?: WatchOptions
  /** Custom TanStack features registered on the table. */
  _features?: CoreOptions<T>['_features']
  /** Resets every `auto reset` behavior (page index, expanded rows...) when set. */
  autoResetAll?: boolean
  /** TanStack debug logging, per area. */
  debug?: RichTableDebug
  /** Properties every column definition inherits. */
  defaultColumn?: Partial<ColumnDef<T, unknown>>
  /** Derives each row's id from its data. Defaults to the row's index (its path for sub rows). */
  getRowId?: CoreOptions<T>['getRowId']
  /** Returns the sub rows of a row, for expandable trees. */
  getSubRows?: CoreOptions<T>['getSubRows']
  /** State the table starts with when a slice isn't bound with `v-model`. */
  initialState?: CoreOptions<T>['initialState']
  /** Merges the default and the given table options. */
  mergeOptions?: CoreOptions<T>['mergeOptions']
  /** Rendered for a cell whose value is `undefined`. */
  renderFallbackValue?: unknown
  /** Table options of the built-in TanStack features (sorting, filtering, pinning, pagination...). */
  features?: RichTableFeatures<T>
  /** Called when a row is clicked (or activated with Enter/Space). Makes rows selectable (cursor, tabindex). */
  onSelect?: (e: Event, row: Row<T>) => void
  /** Called with the row when the pointer enters it, and with `null` when it leaves. */
  onHover?: (e: Event, row: Row<T> | null) => void
  /** Called when the context menu is requested on a row. */
  onContextmenu?: ((e: Event, row: Row<T>) => void) | Array<(e: Event, row: Row<T>) => void>
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RichTableTheme>
}

/** Slots of `RichTable`. Per-column slots are named after the column id. */
export type RichTableSlots<T extends RichTableData = RichTableData> = {
  /** Header content of a column, replacing its `header` definition. Named per column id: `#<column-id>-header`. */
  [slot: `${string}-header`]: ((props: HeaderContext<T, unknown>) => unknown) | undefined
  /** Footer content of a column, replacing its `footer` definition. Named per column id: `#<column-id>-footer`. */
  [slot: `${string}-footer`]: ((props: HeaderContext<T, unknown>) => unknown) | undefined
  /** Cell content of a column, replacing its `cell` definition. Named per column id: `#<column-id>-cell`. */
  [slot: `${string}-cell`]: ((props: CellContext<T, unknown>) => unknown) | undefined
  /** Content of the row below an expanded row. Without it, expanding only reveals sub rows (`get-sub-rows`, grouping). */
  expanded?: (props: { row: Row<T> }) => unknown
  /** Content shown when there are no rows. Defaults to `empty`. */
  empty?: () => unknown
  /** Content shown instead of `#empty` while `loading` and there are no rows. */
  loading?: () => unknown
  /** Caption of the table, visually hidden. */
  caption?: () => unknown
  /** Rows rendered before the data rows. */
  'body-top'?: () => unknown
  /** Rows rendered after the data rows. */
  'body-bottom'?: () => unknown
}
