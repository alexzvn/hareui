import type { Row, Table } from '@tanstack/vue-table'
import type { Virtualizer, VirtualizerOptions } from '@tanstack/vue-virtual'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { ComponentPublicInstance, Ref } from 'vue'
import { computed, onBeforeUnmount, toRef } from 'vue'

import type { RichTableData, RichTableProps } from './RichTable.types'

/** A body `<tr>`: a data row, or a spacer standing in for the virtualized rows outside the window. */
type BodyEntry<T extends RichTableData> =
  | { kind: 'row'; key: string; row: Row<T>; index?: number }
  | { kind: 'spacer'; key: string; height: number }

type MeasureElementArgs = Parameters<
  NonNullable<VirtualizerOptions<Element, Element>['measureElement']>
>

type UseRichTableBodyRowsOptions<T extends RichTableData> = {
  table: Table<T>
  /** All rows of the row model. */
  rows: Ref<Row<T>[]>
  virtualize: () => RichTableProps<T>['virtualize']
  /** Whether `virtualize.getScrollElement` owns the scroll instead of the root. */
  isExternalScroll: Ref<boolean>
  getRootElement: () => Element | undefined
}

const DEFAULT_ESTIMATE_SIZE = 65
const DEFAULT_OVERSCAN = 12

const toRowEntry = <T extends RichTableData>(row: Row<T>): BodyEntry<T> => {
  return { kind: 'row', key: row.id, row }
}

/**
 * The body rows to render: pinned-top rows, the center rows (only the visible window between two
 * spacers when virtualized), then pinned-bottom rows. Also measures the rendered rows for the virtualizer.
 */
export const useRichTableBodyRows = <T extends RichTableData>(
  options: UseRichTableBodyRowsOptions<T>,
) => {
  const { table, rows, isExternalScroll } = options

  const topRows = computed(() => (options.virtualize() ? [] : table.getTopRows()))
  const bottomRows = computed(() => (options.virtualize() ? [] : table.getBottomRows()))
  const centerRows = computed(() => {
    const hasPinnedRows = topRows.value.length > 0 || bottomRows.value.length > 0

    return hasPinnedRows ? table.getCenterRows() : rows.value
  })

  const virtualizerOptions = toRef(() => {
    const virtualize = options.virtualize()
    const custom = typeof virtualize === 'object' ? virtualize : {}

    return {
      ...custom,
      estimateSize: custom.estimateSize ?? DEFAULT_ESTIMATE_SIZE,
      overscan: custom.overscan ?? DEFAULT_OVERSCAN,
    }
  })

  // Rows must carry the attribute the virtualizer reads their index from when measuring them.
  const indexAttribute = computed(() => virtualizerOptions.value.indexAttribute ?? 'data-index')

  const getScrollElement = () => {
    const element = isExternalScroll.value
      ? virtualizerOptions.value.getScrollElement?.()
      : options.getRootElement()

    return element ?? null
  }

  // The table's offset within the scroll element (0 unless set).
  const scrollMargin = computed(() => virtualizerOptions.value.scrollMargin ?? 0)

  // Key measurements by row id so cached heights follow their rows through sorting and filtering.
  // The virtualizer memoizes measurements on the `getItemKey` reference, so a new function (wrapping a custom one too) is created for each set of rows.
  const getItemKey = computed(() => {
    const centerRowList = centerRows.value
    const getKey = virtualizerOptions.value.getItemKey
    if (getKey) return (index: number) => getKey(index)

    return (index: number) => centerRowList[index]?.id ?? index
  })

  // An expanded `<tr>` belongs to its row's virtual item, so its height is added to the row's
  // (measured by a custom `measureElement` if given). Maps it to its row's `<tr>`.
  const expandedRows = new WeakMap<Element, Element>()
  let expandedRowsObserver: ResizeObserver | undefined

  const getExpandedRowHeight = (row: Element) => {
    const next = row.nextElementSibling
    const isRowExpansion = next !== null && expandedRows.get(next) === row

    return isRowExpansion ? (next as HTMLElement).offsetHeight : 0
  }

  const measureRowElement = (...[el, entry, instance]: MeasureElementArgs) => {
    const customMeasure = virtualizerOptions.value.measureElement
    const rowHeight = customMeasure
      ? customMeasure(el, entry, instance)
      : (entry?.borderBoxSize?.[0]?.blockSize ?? (el as HTMLElement).offsetHeight)

    return Math.round(rowHeight + getExpandedRowHeight(el))
  }

  const virtualizer =
    !!options.virtualize() &&
    useVirtualizer<Element, Element>({
      ...virtualizerOptions.value,
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
        const estimate = virtualizerOptions.value.estimateSize

        return typeof estimate === 'function' ? estimate(index) : estimate
      },
    })

  const virtualItems = computed(() => (virtualizer ? virtualizer.value.getVirtualItems() : []))

  // `start`/`end` include `scrollMargin`; exclude it from the spacers so the rows sit inline below preceding content.
  const virtualPaddingTop = computed(() => (virtualItems.value[0]?.start ?? 0) - scrollMargin.value)

  const virtualPaddingBottom = computed(() => {
    if (!virtualizer || !virtualItems.value.length) return 0

    const lastItemEnd = virtualItems.value[virtualItems.value.length - 1]?.end ?? 0

    return virtualizer.value.getTotalSize() - lastItemEnd + scrollMargin.value
  })

  // The instance never changes: reading it once keeps the row template from subscribing to every virtualizer update (e.g. on scroll).
  const virtualizerInstance: Virtualizer<Element, Element> | undefined = virtualizer
    ? virtualizer.value
    : undefined

  // Register each rendered row with the virtualizer so its actual height is measured (and re-measured on resize).
  // Vue calls a function ref on every patch, and `measureElement` reads `offsetHeight`, forcing a layout
  // between row patches. An element already registered under the same item key is observed by the virtualizer's
  // ResizeObserver, so it is skipped.
  const registeredRows = new WeakMap<Element, unknown>()

  const measureRow = (el: Element | ComponentPublicInstance | null) => {
    if (!(el instanceof Element) || !virtualizerInstance) return

    const index = virtualizerInstance.indexFromElement(el)
    const key = virtualizerInstance.options.getItemKey(index)
    const isRegistered =
      registeredRows.get(el) === key && virtualizerInstance.elementsCache.get(key) === el

    if (isRegistered) return

    registeredRows.set(el, key)
    virtualizerInstance.measureElement(el)
  }

  const measureRowRef = virtualizerInstance ? measureRow : undefined

  const remeasureRow = (el: Element | null | undefined) => {
    if (!el?.isConnected || !virtualizer) return

    const instance = virtualizer.value
    const size = instance.options.measureElement(el, undefined, instance)

    instance.resizeItem(instance.indexFromElement(el), size)
  }

  const remeasureExpandedRows = (entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => remeasureRow(expandedRows.get(entry.target)))
  }

  const onExpandedRowMounted = ({ el }: { el: unknown }) => {
    if (!virtualizer || !(el instanceof Element) || !el.previousElementSibling) return

    expandedRows.set(el, el.previousElementSibling)
    remeasureRow(el.previousElementSibling)

    if (typeof ResizeObserver === 'undefined') return

    // Keep the row's size in sync when the expanded content resizes (e.g. async content).
    expandedRowsObserver ??= new ResizeObserver(remeasureExpandedRows)
    expandedRowsObserver.observe(el)
  }

  const onExpandedRowUnmounted = ({ el }: { el: unknown }) => {
    if (!(el instanceof Element)) return

    const row = expandedRows.get(el)

    expandedRows.delete(el)
    expandedRowsObserver?.unobserve(el)

    // Collapsed while its row stays rendered: shrink it back to the row's own height.
    remeasureRow(row)
  }

  onBeforeUnmount(() => expandedRowsObserver?.disconnect())

  const createVirtualEntries = (): BodyEntry<T>[] => {
    const entries: BodyEntry<T>[] = []

    if (virtualPaddingTop.value > 0) {
      entries.push({ kind: 'spacer', key: 'spacer-top', height: virtualPaddingTop.value })
    }

    for (const virtualRow of virtualItems.value) {
      const row = centerRows.value[virtualRow.index]
      if (row) entries.push({ kind: 'row', key: row.id, row, index: virtualRow.index })
    }

    if (virtualPaddingBottom.value > 0) {
      entries.push({ kind: 'spacer', key: 'spacer-bottom', height: virtualPaddingBottom.value })
    }

    return entries
  }

  const bodyEntries = computed<BodyEntry<T>[]>(() => {
    const centerEntries = virtualizer
      ? createVirtualEntries()
      : centerRows.value.map((row) => toRowEntry(row))

    return [
      ...topRows.value.map((row) => toRowEntry(row)),
      ...centerEntries,
      ...bottomRows.value.map((row) => toRowEntry(row)),
    ]
  })

  return {
    bodyEntries,
    indexAttribute,
    measureRowRef,
    onExpandedRowMounted,
    onExpandedRowUnmounted,
  }
}
