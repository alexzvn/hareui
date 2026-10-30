import type { TableOptionsWithReactiveData, TableState, Updater } from '@tanstack/vue-table'
import {
  functionalUpdate,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { ComputedRef, Ref } from 'vue'
import { computed, shallowRef, watch } from 'vue'

import type { RichTableColumn, RichTableData, RichTableProps } from './RichTable.types'
import { createColumnsFromRow, resolveColumnCells } from './richTableColumns'

type StateKey =
  | 'globalFilter'
  | 'columnFilters'
  | 'columnOrder'
  | 'columnVisibility'
  | 'columnPinning'
  | 'expanded'
  | 'rowSelection'
  | 'sorting'
  | 'grouping'
  | 'rowPinning'
  | 'columnSizing'
  | 'columnSizingInfo'
  | 'pagination'

/** One `v-model` per table state slice. */
type StateModels = { [K in StateKey]: Ref<TableState[K] | undefined> }

const copyRows = <T>(rows: T[] | undefined): T[] => {
  return rows ? [...rows] : []
}

// Live getters, so the table reads each model's current value on every access.
// An `undefined` slice falls back to the table's internal state (vue-table merges the two, skipping `undefined`).
const createModelState = (models: StateModels): Partial<TableState> => {
  const state: Partial<TableState> = {}

  for (const key of Object.keys(models) as StateKey[]) {
    Object.defineProperty(state, key, {
      enumerable: true,
      configurable: true,
      get: () => models[key].value,
    })
  }

  return state
}

// vue-table reads its options lazily through a merge proxy, so options read through this proxy
// follow the computed as it changes.
const toLiveOptions = <O extends object>(options: ComputedRef<O>): O => {
  return new Proxy({} as O, {
    get: (_, key) => Reflect.get(options.value, key),
    has: (_, key) => Reflect.has(options.value, key),
    ownKeys: () => Reflect.ownKeys(options.value),
    getOwnPropertyDescriptor: (_, key) => {
      if (!Reflect.has(options.value, key)) return undefined

      return { enumerable: true, configurable: true, value: Reflect.get(options.value, key) }
    },
  })
}

/** Creates the TanStack table from the props, its state slices bound to the `v-model`s. */
export const useRichTableApi = <T extends RichTableData>(
  props: RichTableProps<T>,
  models: StateModels,
) => {
  // A shallow copy that is replaced when `props.data` changes: in-place mutations are caught by the (deep) watcher.
  const data = shallowRef<T[]>(copyRows(props.data))

  watch(
    () => props.data,
    () => {
      data.value = copyRows(props.data)
    },
    props.watchOptions,
  )

  const columns = computed<RichTableColumn<T>[]>(() => {
    const definitions = props.columns ?? createColumnsFromRow(data.value[0], props.defaultColumn)

    return resolveColumnCells(definitions, props.defaultColumn)
  })

  // A model is written on every change (bound or not), so each slice is controlled by its model once it has a value;
  // until then TanStack keeps it in its internal state, seeded from `initialState`.
  const createStateUpdater = <K extends StateKey>(key: K) => {
    return (updater: Updater<TableState[K]>) => {
      const model = models[key]
      const current = model.value ?? tableApi.getState()[key]

      model.value = functionalUpdate(updater, current)
    }
  }

  const state = createModelState(models)

  // The `features` options are spread in, so the keys vary and the whole object is rebuilt.
  const tableOptions = computed<TableOptionsWithReactiveData<T>>(() => ({
    _features: props._features,
    autoResetAll: props.autoResetAll,
    debugAll: props.debug?.all,
    debugCells: props.debug?.cells,
    debugColumns: props.debug?.columns,
    debugHeaders: props.debug?.headers,
    debugRows: props.debug?.rows,
    debugTable: props.debug?.table,
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
    ...props.features?.globalFilter,
    onGlobalFilterChange: createStateUpdater('globalFilter'),
    ...props.features?.columnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: createStateUpdater('columnFilters'),
    onColumnOrderChange: createStateUpdater('columnOrder'),
    ...props.features?.visibility,
    onColumnVisibilityChange: createStateUpdater('columnVisibility'),
    ...props.features?.columnPinning,
    onColumnPinningChange: createStateUpdater('columnPinning'),
    ...props.features?.columnSizing,
    onColumnSizingChange: createStateUpdater('columnSizing'),
    onColumnSizingInfoChange: createStateUpdater('columnSizingInfo'),
    ...props.features?.rowSelection,
    onRowSelectionChange: createStateUpdater('rowSelection'),
    ...props.features?.rowPinning,
    onRowPinningChange: createStateUpdater('rowPinning'),
    ...props.features?.sorting,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: createStateUpdater('sorting'),
    ...props.features?.grouping,
    onGroupingChange: createStateUpdater('grouping'),
    ...props.features?.expanded,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: createStateUpdater('expanded'),
    ...props.features?.pagination,
    onPaginationChange: createStateUpdater('pagination'),
    ...props.features?.faceted,
    state,
  }))

  const tableApi = useVueTable<T>(toLiveOptions(tableOptions))

  return { tableApi, columns }
}
