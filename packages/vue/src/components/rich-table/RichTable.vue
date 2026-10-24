<script lang="ts">
import type {
  Cell,
  CellContext,
  Column,
  ColumnDef,
  ColumnFiltersOptions,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningOptions,
  ColumnPinningState,
  ColumnSizingInfoState,
  ColumnSizingOptions,
  ColumnSizingState,
  CoreOptions,
  ExpandedOptions,
  ExpandedState,
  FacetedOptions,
  GlobalFilterOptions,
  GroupingOptions,
  GroupingState,
  Header,
  HeaderContext,
  PaginationOptions,
  PaginationState,
  Row,
  RowData,
  RowPinningOptions,
  RowPinningState,
  RowSelectionOptions,
  RowSelectionState,
  SortingOptions,
  SortingState,
  Table,
  TableOptionsWithReactiveData,
  Updater,
  VisibilityOptions,
  VisibilityState,
} from '@tanstack/vue-table'
import type { Virtualizer, VirtualizerOptions } from '@tanstack/vue-virtual'
import type { PrimitiveProps } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'
import type { AriaAttributes, ComponentPublicInstance, StyleValue, WatchOptions } from 'vue'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type RichTableTheme = typeof theme

export type RichTableData = RowData
export type RichTableRow<T extends RichTableData> = Row<T>
export type RichTableHeader<T extends RichTableData, D = unknown> = Header<T, D>
export type RichTableCell<T extends RichTableData, D = unknown> = Cell<T, D>
export type RichTableColumnInstance<T extends RichTableData, D = unknown> = Column<T, D>
export type RichTableHeaderContext<T extends RichTableData, D = unknown> = HeaderContext<T, D>
export type RichTableCellContext<T extends RichTableData, D = unknown> = CellContext<T, D>
/** The TanStack Table instance, exposed as `tableApi`. */
export type RichTableApi<T extends RichTableData> = Table<T>

/** `meta` of a column definition: classes, styles and spans merged into its header (`th`) and body (`td`) cells. */
export interface RichTableColumnMeta<T extends RichTableData = RichTableData, D = unknown> {
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
export interface RichTableMeta<T extends RichTableData = RichTableData> {
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

export interface RichTableProps<T extends RichTableData = RichTableData> {
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
  /**
   * Color of the loading bar.
   * @defaultValue 'accent'
   */
  loadingColor?: ComponentVariants<RichTableTheme>['loadingColor']
  /**
   * Animation of the loading bar.
   * @defaultValue 'carousel'
   */
  loadingAnimation?: ComponentVariants<RichTableTheme>['loadingAnimation']
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
  debugAll?: boolean
  debugCells?: boolean
  debugColumns?: boolean
  debugHeaders?: boolean
  debugRows?: boolean
  debugTable?: boolean
  /** Properties every column definition inherits. */
  defaultColumn?: Partial<ColumnDef<T, unknown>>
  /** Derives each row's id from its data. Defaults to the row's index (its path for sub rows). */
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string
  /** Returns the sub rows of a row, for expandable trees. */
  getSubRows?: (originalRow: T, index: number) => undefined | T[]
  /** State the table starts with when a slice isn't bound with `v-model`. */
  initialState?: CoreOptions<T>['initialState']
  /** Merges the default and the given table options. */
  mergeOptions?: CoreOptions<T>['mergeOptions']
  /** Rendered for a cell whose value is `undefined`. */
  renderFallbackValue?: unknown
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options
   */
  globalFilterOptions?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options
   */
  columnFiltersOptions?: Omit<
    ColumnFiltersOptions<T>,
    'getFilteredRowModel' | 'onColumnFiltersChange'
  >
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options
   */
  columnPinningOptions?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>
  /**
   * Column widths (`size`) are applied to the cells once `enableColumnResizing` is set or a column has been sized.
   * @see https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options
   */
  columnSizingOptions?: Omit<
    ColumnSizingOptions,
    'onColumnSizingChange' | 'onColumnSizingInfoChange'
  >
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options
   */
  visibilityOptions?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/sorting#table-options
   */
  sortingOptions?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>
  /**
   * Pass `getGroupedRowModel: getGroupedRowModel()` to enable client-side grouping.
   * @see https://tanstack.com/table/v8/docs/api/features/grouping#table-options
   */
  groupingOptions?: Omit<GroupingOptions, 'onGroupingChange'>
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/expanding#table-options
   */
  expandedOptions?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/row-selection#table-options
   */
  rowSelectionOptions?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options
   */
  rowPinningOptions?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>
  /**
   * Pass `getPaginationRowModel: getPaginationRowModel()` to enable client-side pagination.
   * @see https://tanstack.com/table/v8/docs/api/features/pagination#table-options
   */
  paginationOptions?: Omit<PaginationOptions, 'onPaginationChange'>
  /**
   * @see https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options
   */
  facetedOptions?: FacetedOptions<T>
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

export interface RichTableSlots<T extends RichTableData = RichTableData> {
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
</script>

<script setup lang="ts" generic="T extends RichTableData">
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { Primitive } from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRef,
  useTemplateRef,
  watch,
} from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<RichTableProps<T>>(), {
  as: 'div',
  variant: 'primary',
  watchOptions: () => ({ deep: true }),
  virtualize: false,
  // Boolean props default to `false` when absent, which would switch off every `autoReset*` option: keep them unset.
  autoResetAll: undefined,
  debugAll: undefined,
  debugCells: undefined,
  debugColumns: undefined,
  debugHeaders: undefined,
  debugRows: undefined,
  debugTable: undefined,
})
const slots = defineSlots<RichTableSlots<T>>()

/** Controlled global filter. Use `v-model:global-filter`. */
const globalFilterState = defineModel<string>('globalFilter')
/** Controlled column filters. Use `v-model:column-filters`. */
const columnFiltersState = defineModel<ColumnFiltersState>('columnFilters')
/** Controlled column order. Use `v-model:column-order`. */
const columnOrderState = defineModel<ColumnOrderState>('columnOrder')
/** Controlled column visibility. Use `v-model:column-visibility`. */
const columnVisibilityState = defineModel<VisibilityState>('columnVisibility')
/** Controlled column pinning (`{ left, right }`). Use `v-model:column-pinning`. */
const columnPinningState = defineModel<ColumnPinningState>('columnPinning')
/** Controlled column sizes. Use `v-model:column-sizing`. */
const columnSizingState = defineModel<ColumnSizingState>('columnSizing')
/** Controlled column resizing info. Use `v-model:column-sizing-info`. */
const columnSizingInfoState = defineModel<ColumnSizingInfoState>('columnSizingInfo')
/** Controlled row selection. Use `v-model:row-selection`. */
const rowSelectionState = defineModel<RowSelectionState>('rowSelection')
/** Controlled row pinning. Use `v-model:row-pinning`. */
const rowPinningState = defineModel<RowPinningState>('rowPinning')
/** Controlled sorting. Use `v-model:sorting`. */
const sortingState = defineModel<SortingState>('sorting')
/** Controlled grouping. Use `v-model:grouping`. */
const groupingState = defineModel<GroupingState>('grouping')
/** Controlled expanded rows. Use `v-model:expanded`. */
// `ExpandedState` may be `true`, so Vue would cast an absent model to `false` (collapsing everything and pinning the state): keep it unset.
const expandedState = defineModel<ExpandedState | undefined>('expanded', { default: undefined })
/** Controlled pagination. Use `v-model:pagination`. */
const paginationState = defineModel<PaginationState>('pagination')

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')
const tableRef = useTemplateRef<HTMLTableElement>('tableRef')

// A shallow copy that is replaced when `props.data` changes: in-place mutations are caught by the (deep) watcher below.
const data = shallowRef<T[]>(props.data ? [...props.data] : [])

watch(
  () => props.data,
  () => {
    data.value = props.data ? [...props.data] : []
  },
  props.watchOptions,
)

// TanStack resolves each column as `{ ...defaultColumn, ...columnDef }`, so any key set here shadows `defaultColumn`.
// The fallback `header` and `cell` are only injected when `defaultColumn` doesn't provide its own.
const columns = computed<RichTableColumn<T>[]>(() =>
  processColumns(
    props.columns ??
      Object.keys(data.value[0] ?? {}).map((accessorKey: string) => ({
        accessorKey,
        ...(props.defaultColumn?.header === undefined && {
          header: accessorKey.charAt(0).toUpperCase() + accessorKey.slice(1),
        }),
      })),
  ),
)

// the injected default cell renders plain text, so the template prints it inline instead of mounting a
// FlexRender component plus a functional component per cell.
function defaultCell({ getValue }: CellContext<T, unknown>) {
  const value = getValue()
  if (value === '' || value === null || value === undefined) {
    return '\u00A0'
  }
  return String(value)
}

function processColumns(columns: RichTableColumn<T>[]): RichTableColumn<T>[] {
  return columns.map((column) => {
    const col = { ...column }

    if ('columns' in col && col.columns) {
      col.columns = processColumns(col.columns)
    }

    if (!col.cell && !props.defaultColumn?.cell) {
      col.cell = defaultCell
    }

    return col
  })
}

// When an external scroll element is provided, it owns the scroll (the root grows inline).
const isExternalScroll = computed(
  () => typeof props.virtualize === 'object' && !!props.virtualize.getScrollElement,
)

const ui = useComponentUI('richTable', theme, () => ({
  variant: props.variant,
  sticky: props.sticky,
  loading: props.loading,
  loadingColor: props.loadingColor,
  loadingAnimation: props.loadingAnimation,
  externalScroll: isExternalScroll.value,
}))

const hasFooter = computed(() => {
  function hasFooterRecursive(columns: RichTableColumn<T>[]): boolean {
    for (const column of columns) {
      if ('footer' in column) {
        return true
      }
      if ('columns' in column && column.columns && hasFooterRecursive(column.columns)) {
        return true
      }
    }
    return false
  }

  return hasFooterRecursive(columns.value)
})

// A model is written on every change (bound or not), so each slice is controlled by its model once it has a value;
// until then TanStack keeps it in its internal state, seeded from `initialState`.
function valueUpdater<S>(
  model: { value: S | undefined },
  key: keyof ReturnType<Table<T>['getState']>,
) {
  return (updaterOrValue: Updater<S>) => {
    const current = (model.value ?? tableApi.getState()[key]) as S
    model.value =
      typeof updaterOrValue === 'function'
        ? (updaterOrValue as (old: S) => S)(current)
        : updaterOrValue
  }
}

// An `undefined` slice falls back to the table's internal state (vue-table merges the two, skipping `undefined`).
const state = {
  get globalFilter() {
    return globalFilterState.value
  },
  get columnFilters() {
    return columnFiltersState.value
  },
  get columnOrder() {
    return columnOrderState.value
  },
  get columnVisibility() {
    return columnVisibilityState.value
  },
  get columnPinning() {
    return columnPinningState.value
  },
  get expanded() {
    return expandedState.value
  },
  get rowSelection() {
    return rowSelectionState.value
  },
  get sorting() {
    return sortingState.value
  },
  get grouping() {
    return groupingState.value
  },
  get rowPinning() {
    return rowPinningState.value
  },
  get columnSizing() {
    return columnSizingState.value
  },
  get columnSizingInfo() {
    return columnSizingInfoState.value
  },
  get pagination() {
    return paginationState.value
  },
}

// vue-table reads its options lazily through a merge proxy, so options backed by this computed follow prop changes.
// The `*Options` props are spread in, so the keys vary and the whole object is rebuilt.
const tableOptions = computed<TableOptionsWithReactiveData<T>>(() => ({
  _features: props._features,
  autoResetAll: props.autoResetAll,
  debugAll: props.debugAll,
  debugCells: props.debugCells,
  debugColumns: props.debugColumns,
  debugHeaders: props.debugHeaders,
  debugRows: props.debugRows,
  debugTable: props.debugTable,
  defaultColumn: props.defaultColumn,
  getRowId: props.getRowId,
  getSubRows: props.getSubRows,
  initialState: props.initialState,
  mergeOptions: props.mergeOptions,
  renderFallbackValue: props.renderFallbackValue,
  // Pass the ref, not its value. With a ref, vue-table's `mergeOptions` spreads each `setOptions` result into a flat
  // object; with a plain array it returns `mergeProxy(prev, …)`, and every recompute of these options nests another
  // proxy layer whose lookups walk all the layers below, until the page freezes.
  data,
  columns: columns.value,
  meta: props.meta ?? {},
  getCoreRowModel: getCoreRowModel(),
  ...props.globalFilterOptions,
  onGlobalFilterChange: valueUpdater(globalFilterState, 'globalFilter'),
  ...props.columnFiltersOptions,
  getFilteredRowModel: getFilteredRowModel(),
  onColumnFiltersChange: valueUpdater(columnFiltersState, 'columnFilters'),
  onColumnOrderChange: valueUpdater(columnOrderState, 'columnOrder'),
  ...props.visibilityOptions,
  onColumnVisibilityChange: valueUpdater(columnVisibilityState, 'columnVisibility'),
  ...props.columnPinningOptions,
  onColumnPinningChange: valueUpdater(columnPinningState, 'columnPinning'),
  ...props.columnSizingOptions,
  onColumnSizingChange: valueUpdater(columnSizingState, 'columnSizing'),
  onColumnSizingInfoChange: valueUpdater(columnSizingInfoState, 'columnSizingInfo'),
  ...props.rowSelectionOptions,
  onRowSelectionChange: valueUpdater(rowSelectionState, 'rowSelection'),
  ...props.rowPinningOptions,
  onRowPinningChange: valueUpdater(rowPinningState, 'rowPinning'),
  ...props.sortingOptions,
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: valueUpdater(sortingState, 'sorting'),
  ...props.groupingOptions,
  onGroupingChange: valueUpdater(groupingState, 'grouping'),
  ...props.expandedOptions,
  getExpandedRowModel: getExpandedRowModel(),
  onExpandedChange: valueUpdater(expandedState, 'expanded'),
  ...props.paginationOptions,
  onPaginationChange: valueUpdater(paginationState, 'pagination'),
  ...props.facetedOptions,
  state,
}))

const tableApi = useVueTable<T>(
  new Proxy({} as TableOptionsWithReactiveData<T>, {
    get: (_, key) => Reflect.get(tableOptions.value, key),
    has: (_, key) => Reflect.has(tableOptions.value, key),
    ownKeys: () => Reflect.ownKeys(tableOptions.value),
    getOwnPropertyDescriptor: (_, key) =>
      Reflect.has(tableOptions.value, key)
        ? { enumerable: true, configurable: true, value: Reflect.get(tableOptions.value, key) }
        : undefined,
  }),
)

const rows = computed(() => tableApi.getRowModel().rows)
const topRows = computed(() => (props.virtualize ? [] : tableApi.getTopRows()))
const bottomRows = computed(() => (props.virtualize ? [] : tableApi.getBottomRows()))
const centerRows = computed(() =>
  topRows.value.length || bottomRows.value.length ? tableApi.getCenterRows() : rows.value,
)
const columnCount = computed(() => tableApi.getVisibleLeafColumns().length)

/* ---------------- Virtualization ---------------- */
const virtualizerProps = toRef(() => {
  const custom = typeof props.virtualize === 'object' ? props.virtualize : {}
  return {
    ...custom,
    estimateSize: custom.estimateSize ?? 65,
    overscan: custom.overscan ?? 12,
  }
})

// Rows must carry the attribute the virtualizer reads their index from when measuring them.
const indexAttribute = computed(() => virtualizerProps.value.indexAttribute ?? 'data-index')

const getScrollElement = () =>
  (isExternalScroll.value ? virtualizerProps.value.getScrollElement?.() : rootRef.value?.$el) ??
  null
// Offset applied to the spacer rows: `scrollMargin` is the table's offset within the scroll element (0 unless set).
const scrollMargin = computed(() => virtualizerProps.value.scrollMargin ?? 0)

// Key measurements by row id so cached heights follow their rows through sorting and filtering.
// The virtualizer memoizes measurements on the `getItemKey` reference, so a new function (wrapping a custom one too) is created for each set of rows.
const getItemKey = computed(() => {
  const rows = centerRows.value
  const getKey = virtualizerProps.value.getItemKey
  return getKey ? (index: number) => getKey(index) : (index: number) => rows[index]?.id ?? index
})

const virtualizer =
  !!props.virtualize &&
  useVirtualizer<Element, Element>({
    ...virtualizerProps.value,
    get count() {
      return centerRows.value.length
    },
    get scrollMargin() {
      return scrollMargin.value
    },
    get getItemKey() {
      return getItemKey.value
    },
    measureElement: measureRowElement,
    getScrollElement,
    estimateSize: (index: number) => {
      const estimate = virtualizerProps.value.estimateSize
      return typeof estimate === 'function' ? estimate(index) : estimate
    },
  })

const virtualItems = computed(() => (virtualizer ? virtualizer.value.getVirtualItems() : []))

// `start`/`end` include `scrollMargin`; exclude it from the spacers so the rows sit inline below preceding content.
const virtualPaddingTop = computed(() => (virtualItems.value[0]?.start ?? 0) - scrollMargin.value)

const virtualPaddingBottom = computed(() => {
  if (!virtualizer || !virtualItems.value.length) {
    return 0
  }
  return (
    virtualizer.value.getTotalSize() -
    (virtualItems.value[virtualItems.value.length - 1]?.end ?? 0) +
    scrollMargin.value
  )
})

// The instance never changes: reading it once keeps the row template from subscribing to every virtualizer update (e.g. on scroll).
const virtualizerInstance = virtualizer ? virtualizer.value : undefined

// Register each rendered row with the virtualizer so its actual height is measured (and re-measured on resize).
// Vue calls a function ref on every patch, and `measureElement` reads `offsetHeight`, forcing a layout
// between row patches. An element already registered under the same item key is observed by the virtualizer's
// ResizeObserver, so it is skipped.
const registeredRows = new WeakMap<Element, unknown>()
function measureRow(el: Element | ComponentPublicInstance | null) {
  if (el instanceof Element && virtualizerInstance) {
    const index = virtualizerInstance.indexFromElement(el)
    const key = virtualizerInstance.options.getItemKey(index)
    if (registeredRows.get(el) === key && virtualizerInstance.elementsCache.get(key) === el) {
      return
    }
    registeredRows.set(el, key)
    virtualizerInstance.measureElement(el)
  }
}

const measureRowRef = virtualizerInstance ? measureRow : undefined

// An expanded `<tr>` belongs to its row's virtual item, so its height is added to the row's (measured by a custom `measureElement` if given). Maps it to its row's `<tr>`.
const expandedRows = new WeakMap<Element, Element>()
let expandedRowsObserver: ResizeObserver | undefined

function measureRowElement(
  el: Element,
  entry: ResizeObserverEntry | undefined,
  instance: Virtualizer<Element, Element>,
) {
  const measure = virtualizerProps.value.measureElement
  const height = measure
    ? measure(el, entry, instance)
    : (entry?.borderBoxSize?.[0]?.blockSize ?? (el as HTMLElement).offsetHeight)
  const expanded = el.nextElementSibling
  return Math.round(
    height +
      (expanded && expandedRows.get(expanded) === el ? (expanded as HTMLElement).offsetHeight : 0),
  )
}

function remeasureRow(el: Element | null | undefined) {
  if (!el?.isConnected || !virtualizer) {
    return
  }
  const instance = virtualizer.value
  instance.resizeItem(
    instance.indexFromElement(el),
    instance.options.measureElement(el, undefined, instance),
  )
}

function onExpandedRowMounted({ el }: { el: unknown }) {
  if (!virtualizer || !(el instanceof Element) || !el.previousElementSibling) {
    return
  }
  expandedRows.set(el, el.previousElementSibling)
  remeasureRow(el.previousElementSibling)
  if (typeof ResizeObserver === 'undefined') {
    return
  }
  // Keep the row's size in sync when the expanded content resizes (e.g. async content).
  expandedRowsObserver ??= new ResizeObserver((entries) =>
    entries.forEach((entry) => remeasureRow(expandedRows.get(entry.target))),
  )
  expandedRowsObserver.observe(el)
}

function onExpandedRowUnmounted({ el }: { el: unknown }) {
  if (!(el instanceof Element)) {
    return
  }
  const row = expandedRows.get(el)
  expandedRows.delete(el)
  expandedRowsObserver?.unobserve(el)
  // Collapsed while its row stays rendered: shrink it back to the row's own height.
  remeasureRow(row)
}

onBeforeUnmount(() => expandedRowsObserver?.disconnect())

type BodyEntry =
  | { kind: 'row'; key: string; row: Row<T>; index?: number }
  | { kind: 'spacer'; key: string; height: number }

// Pinned-top rows, the (virtual) center rows between their spacers, then pinned-bottom rows.
const bodyEntries = computed<BodyEntry[]>(() => {
  const entries: BodyEntry[] = topRows.value.map((row) => ({ kind: 'row', key: row.id, row }))

  if (virtualizer) {
    if (virtualPaddingTop.value > 0) {
      entries.push({ kind: 'spacer', key: 'spacer-top', height: virtualPaddingTop.value })
    }
    for (const virtualRow of virtualItems.value) {
      const row = centerRows.value[virtualRow.index]
      if (row) {
        entries.push({ kind: 'row', key: row.id, row, index: virtualRow.index })
      }
    }
    if (virtualPaddingBottom.value > 0) {
      entries.push({ kind: 'spacer', key: 'spacer-bottom', height: virtualPaddingBottom.value })
    }
  } else {
    for (const row of centerRows.value) {
      entries.push({ kind: 'row', key: row.id, row })
    }
  }

  for (const row of bottomRows.value) {
    entries.push({ kind: 'row', key: row.id, row })
  }

  return entries
})

/* ---------------- Pinned columns ---------------- */
// Whether content is scrolled under the pinned columns: only then is their facing edge outlined.
const leftDetached = ref(false)
const rightDetached = ref(false)
let scrollElement: HTMLElement | undefined
let resizeObserver: ResizeObserver | undefined

function updateDetached() {
  if (!scrollElement) {
    return
  }
  const { scrollLeft, scrollWidth, clientWidth } = scrollElement
  const range = scrollWidth - clientWidth
  // RTL scrolls from 0 (start, right edge) to -range (left edge).
  const fromLeft =
    getComputedStyle(scrollElement).direction === 'rtl' ? scrollLeft + range : scrollLeft
  leftDetached.value = fromLeft > 0.5
  rightDetached.value = fromLeft < range - 0.5
}

onMounted(() => {
  scrollElement = rootRef.value?.$el as HTMLElement | undefined
  if (!scrollElement || isExternalScroll.value) {
    return
  }
  scrollElement.addEventListener('scroll', updateDetached, { passive: true })
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateDetached)
    resizeObserver.observe(scrollElement)
    if (tableRef.value) {
      resizeObserver.observe(tableRef.value)
    }
  }
  updateDetached()
})

onBeforeUnmount(() => {
  scrollElement?.removeEventListener('scroll', updateDetached)
  resizeObserver?.disconnect()
})

// The column on each pinned side that faces the scrolling columns.
const pinnedEdgeIds = computed(() => ({
  left: tableApi.getLeftVisibleLeafColumns().at(-1)?.id,
  right: tableApi.getRightVisibleLeafColumns()[0]?.id,
}))

function getColumnEdge(column: Column<T, unknown>): 'left' | 'right' | undefined {
  const pinned = column.getIsPinned()
  if (!pinned || !(pinned === 'left' ? leftDetached.value : rightDetached.value)) {
    return undefined
  }
  const edgeId = pinnedEdgeIds.value[pinned]
  return column.getLeafColumns().some((leaf) => leaf.id === edgeId) ? pinned : undefined
}

// Widths are only applied once sizing is in play (resizing enabled or a column sized), so plain tables keep the browser's auto layout.
const sizingActive = computed(
  () =>
    !!props.columnSizingOptions?.enableColumnResizing ||
    Object.keys(tableApi.getState().columnSizing).length > 0,
)

function getColumnStyles(
  column: Column<T, unknown>,
  size = column.getSize(),
): Record<string, string> {
  const styles: Record<string, string> = sizingActive.value ? { width: `${size}px` } : {}
  const pinned = column.getIsPinned()
  if (pinned === 'left') {
    styles['--rich-table-pin'] = `${column.getStart('left')}px`
  } else if (pinned === 'right') {
    styles['--rich-table-pin'] = `${column.getAfter('right')}px`
  }
  return styles
}

// TanStack types a column's `meta` as its (empty) `ColumnMeta`: `RichTableColumn` is what declares it as `RichTableColumnMeta`.
function columnMeta(column: Column<T, unknown>): RichTableColumnMeta<T> | undefined {
  return (column.columnDef as RichTableColumn<T>).meta
}

// a cell's pinning, edge and width depend only on its column, so they are resolved once per column
// per change instead of three TanStack proxy walks per cell.
const columnLayouts = computed(() => {
  const layouts = new Map<
    string,
    {
      pinned: 'left' | 'right' | undefined
      edge: 'left' | 'right' | undefined
      styles: Record<string, string>
    }
  >()
  for (const column of tableApi.getAllLeafColumns()) {
    layouts.set(column.id, {
      pinned: column.getIsPinned() || undefined,
      edge: getColumnEdge(column),
      styles: getColumnStyles(column),
    })
  }
  return layouts
})

// Group rows render a column's `aggregatedCell` (falling back to `cell`) and leave the cells of grouped-by columns in their rows empty.
// TanStack v8 also reports cells of rows with sub rows as aggregated and gives every column a default `aggregatedCell`, so only group rows use it.
function cellRenderer(cell: Cell<T, unknown>) {
  const { aggregatedCell, cell: render } = cell.column.columnDef
  return cell.row.getIsGrouped() && cell.getIsAggregated() ? (aggregatedCell ?? render) : render
}

/* ---------------- Rows ---------------- */
function onRowSelect(e: Event, row: Row<T>) {
  if (!props.onSelect) {
    return
  }
  const target = e.target as HTMLElement
  const isInteractive = target.closest('a, button, input, label, select, textarea')
  if (isInteractive) {
    return
  }

  e.preventDefault()
  e.stopPropagation()

  if ((e as KeyboardEvent).repeat) {
    return
  }

  props.onSelect(e, row)
}

function onRowHover(e: Event, row: Row<T> | null) {
  props.onHover?.(e, row)
}

function onRowContextmenu(e: Event, row: Row<T>) {
  if (!props.onContextmenu) {
    return
  }

  if (Array.isArray(props.onContextmenu)) {
    props.onContextmenu.forEach((fn) => fn(e, row))
  } else {
    props.onContextmenu(e, row)
  }
}

function resolveValue<V, A>(prop: V | ((arg: A) => V) | undefined, arg: A): V | undefined {
  return typeof prop === 'function' ? (prop as (arg: A) => V)(arg) : prop
}

function resolveStyle<A>(
  prop: string | Record<string, string> | ((arg: A) => string | Record<string, string>) | undefined,
  arg: A,
): StyleValue {
  return resolveValue(prop, arg)
}

// `getCanSort()` is true for every accessor column, so it cannot tell a column that offers sort UI
// from a plain one, and an explicit `enableSorting: true` can still come from `defaultColumn` or be
// overridden by `sortingOptions`. A header is sortable only when both agree.
function isSortable(column: Column<T, unknown>) {
  return column.columnDef.enableSorting === true && column.getCanSort()
}

function getAriaSort(header: Header<T, unknown>): AriaAttributes['aria-sort'] {
  if (header.isPlaceholder || !isSortable(header.column)) {
    return undefined
  }

  const sorted = header.column.getIsSorted()
  if (!sorted) {
    return 'none'
  }

  // `aria-sort` is a single-column pattern, so the direction goes to the first sort key that has a
  // header on screen. Keys for an unknown id, a hidden column or a column with no sort UI are
  // skipped, otherwise every header would report `none` while the rows are sorted.
  const sortableIds = new Set(
    tableApi
      .getVisibleLeafColumns()
      .filter(isSortable)
      .map((column) => column.id),
  )
  const primary = tableApi.getState().sorting.find(({ id }) => sortableIds.has(id))

  if (primary?.id !== header.column.id) {
    return 'none'
  }

  return sorted === 'asc' ? 'ascending' : 'descending'
}

// A placeholder header (the slot above a column outside a group) and the footer of a column that defines none are
// layout fillers, not headers: an empty `th` would be announced as a nameless column header, so they are plain cells.
function isEmptyHeader(header: Header<T, unknown>) {
  return header.isPlaceholder && !slots[`${header.id}-header`]
}

function isEmptyFooter(header: Header<T, unknown>) {
  return (
    (header.isPlaceholder || header.column.columnDef.footer === undefined) &&
    !slots[`${header.id}-footer`]
  )
}

defineExpose({
  get $el() {
    return rootRef.value?.$el as HTMLElement
  },
  tableRef,
  tableApi,
})
</script>

<template>
  <Primitive
    ref="rootRef"
    :as="props.as"
    data-slot="rich-table"
    v-bind="$attrs"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <table
      ref="tableRef"
      data-slot="rich-table-content"
      :class="ui.base({ class: [props.ui?.base] })"
    >
      <caption
        v-if="props.caption || !!slots.caption"
        data-slot="rich-table-caption"
        :class="ui.caption({ class: [props.ui?.caption] })"
      >
        <slot name="caption">
          {{ props.caption }}
        </slot>
      </caption>

      <thead data-slot="rich-table-header" :class="ui.thead({ class: [props.ui?.thead] })">
        <tr
          v-for="headerGroup in tableApi.getHeaderGroups()"
          :key="headerGroup.id"
          data-slot="rich-table-header-row"
          :class="ui.tr({ class: [props.ui?.tr] })"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned() || undefined"
            :data-edge="getColumnEdge(header.column)"
            :role="isEmptyHeader(header) ? 'cell' : undefined"
            :scope="isEmptyHeader(header) ? undefined : header.colSpan > 1 ? 'colgroup' : 'col'"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : undefined"
            :aria-sort="getAriaSort(header)"
            data-slot="rich-table-column"
            :class="
              ui.th({
                class: [props.ui?.th, resolveValue(columnMeta(header.column)?.class?.th, header)],
              })
            "
            :style="[
              getColumnStyles(header.column, header.getSize()),
              resolveStyle(columnMeta(header.column)?.style?.th, header),
            ]"
          >
            <slot :name="`${header.id}-header`" v-bind="header.getContext()">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </slot>
          </th>
        </tr>
      </thead>

      <tbody data-slot="rich-table-body" :class="ui.tbody({ class: [props.ui?.tbody] })">
        <slot name="body-top" />

        <template v-if="rows.length">
          <template v-for="entry in bodyEntries" :key="entry.key">
            <tr
              v-if="entry.kind === 'spacer'"
              :style="{ height: `${entry.height}px` }"
              aria-hidden="true"
            >
              <td :colspan="columnCount" class="p-0" />
            </tr>

            <template v-else>
              <tr
                :ref="measureRowRef"
                :[indexAttribute]="entry.index"
                :data-selected="entry.row.getIsSelected()"
                :data-selectable="!!props.onSelect || !!props.onHover || !!props.onContextmenu"
                :data-expanded="entry.row.getIsExpanded()"
                :data-pinned="entry.row.getIsPinned() || undefined"
                :tabindex="props.onSelect ? 0 : undefined"
                data-slot="rich-table-row"
                :class="
                  ui.tr({
                    class: [props.ui?.tr, resolveValue(props.meta?.class?.tr, entry.row)],
                  })
                "
                :style="resolveStyle(props.meta?.style?.tr, entry.row)"
                @click="onRowSelect($event, entry.row)"
                @keydown.self.exact.enter.space="onRowSelect($event, entry.row)"
                @pointerenter="onRowHover($event, entry.row)"
                @pointerleave="onRowHover($event, null)"
                @contextmenu="onRowContextmenu($event, entry.row)"
              >
                <td
                  v-for="cell in entry.row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="columnLayouts.get(cell.column.id)?.pinned"
                  :data-edge="columnLayouts.get(cell.column.id)?.edge"
                  :colspan="resolveValue(columnMeta(cell.column)?.colspan?.td, cell)"
                  :rowspan="resolveValue(columnMeta(cell.column)?.rowspan?.td, cell)"
                  data-slot="rich-table-cell"
                  :class="
                    ui.td({
                      class: [props.ui?.td, resolveValue(columnMeta(cell.column)?.class?.td, cell)],
                    })
                  "
                  :style="[
                    columnLayouts.get(cell.column.id)?.styles,
                    resolveStyle(columnMeta(cell.column)?.style?.td, cell),
                  ]"
                >
                  <slot :name="`${cell.column.id}-cell`" v-bind="cell.getContext()">
                    <template v-if="!cell.getIsPlaceholder()">
                      <template v-if="cellRenderer(cell) === defaultCell">{{
                        defaultCell(cell.getContext())
                      }}</template>
                      <FlexRender v-else :render="cellRenderer(cell)" :props="cell.getContext()" />
                    </template>
                  </slot>
                </td>
              </tr>

              <tr
                v-if="entry.row.getIsExpanded() && !!slots.expanded"
                data-slot="rich-table-expanded-row"
                :class="ui.tr({ class: [props.ui?.tr] })"
                @vue:mounted="onExpandedRowMounted"
                @vue:unmounted="onExpandedRowUnmounted"
              >
                <td
                  :colspan="entry.row.getVisibleCells().length"
                  data-slot="rich-table-cell"
                  :class="ui.td({ class: [props.ui?.td] })"
                >
                  <slot name="expanded" :row="entry.row" />
                </td>
              </tr>
            </template>
          </template>
        </template>

        <tr v-else-if="props.loading && !!slots['loading']">
          <td
            :colspan="columnCount"
            data-slot="rich-table-loading"
            :class="ui.loading({ class: props.ui?.loading })"
          >
            <slot name="loading" />
          </td>
        </tr>

        <tr v-else>
          <td
            :colspan="columnCount"
            data-slot="rich-table-empty"
            :class="ui.empty({ class: props.ui?.empty })"
          >
            <slot name="empty">
              {{ props.empty || 'No data' }}
            </slot>
          </td>
        </tr>

        <slot name="body-bottom" />
      </tbody>

      <tfoot
        v-if="hasFooter"
        data-slot="rich-table-footer"
        :class="ui.tfoot({ class: [props.ui?.tfoot] })"
      >
        <tr
          v-for="footerGroup in tableApi.getFooterGroups()"
          :key="footerGroup.id"
          data-slot="rich-table-footer-row"
          :class="ui.tr({ class: [props.ui?.tr] })"
        >
          <th
            v-for="header in footerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned() || undefined"
            :data-edge="getColumnEdge(header.column)"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : undefined"
            :role="isEmptyFooter(header) ? 'cell' : undefined"
            data-slot="rich-table-column"
            :class="
              ui.th({
                class: [props.ui?.th, resolveValue(columnMeta(header.column)?.class?.th, header)],
              })
            "
            :style="[
              getColumnStyles(header.column, header.getSize()),
              resolveStyle(columnMeta(header.column)?.style?.th, header),
            ]"
          >
            <slot :name="`${header.id}-footer`" v-bind="header.getContext()">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.footer"
                :props="header.getContext()"
              />
            </slot>
          </th>
        </tr>
      </tfoot>
    </table>
  </Primitive>
</template>
