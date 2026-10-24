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
            :role="isEmptyHeader(header, slots) ? 'cell' : undefined"
            :scope="getHeaderScope(header, slots)"
            :colspan="header.colSpan > 1 ? header.colSpan : undefined"
            :rowspan="header.rowSpan > 1 ? header.rowSpan : undefined"
            :aria-sort="getAriaSort(tableApi, header)"
            data-slot="rich-table-column"
            :class="
              ui.th({
                class: [
                  props.ui?.th,
                  resolveValue(getColumnMeta(header.column)?.class?.th, header),
                ],
              })
            "
            :style="[
              getColumnStyles(header.column, header.getSize()),
              resolveStyle(getColumnMeta(header.column)?.style?.th, header),
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
                  :colspan="resolveValue(getColumnMeta(cell.column)?.colspan?.td, cell)"
                  :rowspan="resolveValue(getColumnMeta(cell.column)?.rowspan?.td, cell)"
                  data-slot="rich-table-cell"
                  :class="
                    ui.td({
                      class: [
                        props.ui?.td,
                        resolveValue(getColumnMeta(cell.column)?.class?.td, cell),
                      ],
                    })
                  "
                  :style="[
                    columnLayouts.get(cell.column.id)?.styles,
                    resolveStyle(getColumnMeta(cell.column)?.style?.td, cell),
                  ]"
                >
                  <slot :name="`${cell.column.id}-cell`" v-bind="cell.getContext()">
                    <template v-if="!cell.getIsPlaceholder()">
                      <template v-if="getCellRenderer(cell) === defaultCell">{{
                        defaultCell(cell.getContext())
                      }}</template>
                      <FlexRender
                        v-else
                        :render="getCellRenderer(cell)"
                        :props="cell.getContext()"
                      />
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
            :role="isEmptyFooter(header, slots) ? 'cell' : undefined"
            data-slot="rich-table-column"
            :class="
              ui.th({
                class: [
                  props.ui?.th,
                  resolveValue(getColumnMeta(header.column)?.class?.th, header),
                ],
              })
            "
            :style="[
              getColumnStyles(header.column, header.getSize()),
              resolveStyle(getColumnMeta(header.column)?.style?.th, header),
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

<script setup lang="ts" generic="T extends RichTableData">
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingInfoState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  PaginationState,
  Row,
  RowPinningState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { Primitive } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type { RichTableData, RichTableProps, RichTableSlots } from './RichTable.types'
import {
  defaultCell,
  getCellRenderer,
  getColumnMeta,
  hasColumnFooter,
  resolveStyle,
  resolveValue,
} from './richTableColumns'
import { getAriaSort, getHeaderScope, isEmptyFooter, isEmptyHeader } from './richTableHeaders'
import theme from './theme'
import { useRichTableApi } from './useRichTableApi'
import { useRichTableBodyRows } from './useRichTableBodyRows'
import { useRichTableColumnLayout } from './useRichTableColumnLayout'
import { useRichTablePinnedEdges } from './useRichTablePinnedEdges'

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

const getRootElement = () => rootRef.value?.$el as HTMLElement | undefined

const { tableApi, columns } = useRichTableApi(props, {
  globalFilter: globalFilterState,
  columnFilters: columnFiltersState,
  columnOrder: columnOrderState,
  columnVisibility: columnVisibilityState,
  columnPinning: columnPinningState,
  expanded: expandedState,
  rowSelection: rowSelectionState,
  sorting: sortingState,
  grouping: groupingState,
  rowPinning: rowPinningState,
  columnSizing: columnSizingState,
  columnSizingInfo: columnSizingInfoState,
  pagination: paginationState,
})

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

const hasFooter = computed(() => hasColumnFooter(columns.value))

const rows = computed(() => tableApi.getRowModel().rows)
const columnCount = computed(() => tableApi.getVisibleLeafColumns().length)

const { bodyEntries, indexAttribute, measureRowRef, onExpandedRowMounted, onExpandedRowUnmounted } =
  useRichTableBodyRows({
    table: tableApi,
    rows,
    virtualize: () => props.virtualize,
    isExternalScroll,
    getRootElement,
  })

const detached = useRichTablePinnedEdges({
  getScrollElement: getRootElement,
  getTableElement: () => tableRef.value,
  isExternalScroll,
})

const { getColumnEdge, getColumnStyles, columnLayouts } = useRichTableColumnLayout({
  table: tableApi,
  detached,
  isResizingEnabled: () => !!props.columnSizingOptions?.enableColumnResizing,
})

const onRowSelect = (e: Event, row: Row<T>) => {
  if (!props.onSelect) return

  const target = e.target as HTMLElement
  const isOnInteractive = target.closest('a, button, input, label, select, textarea') !== null
  if (isOnInteractive) return

  e.preventDefault()
  e.stopPropagation()

  if ((e as KeyboardEvent).repeat) return

  props.onSelect(e, row)
}

const onRowHover = (e: Event, row: Row<T> | null) => {
  props.onHover?.(e, row)
}

const onRowContextmenu = (e: Event, row: Row<T>) => {
  if (!props.onContextmenu) return

  const handlers = Array.isArray(props.onContextmenu) ? props.onContextmenu : [props.onContextmenu]

  handlers.forEach((handler) => handler(e, row))
}

defineExpose({
  get $el() {
    return getRootElement() as HTMLElement
  },
  tableRef,
  tableApi,
})
</script>
