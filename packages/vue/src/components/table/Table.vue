<template>
  <div ref="table" data-slot="table" :class="ui.base()">
    <div
      ref="scrollRoot"
      :data-slot="hasResizableColumns ? 'table-resizable-container' : 'table-scroll-container'"
      :class="hasResizableColumns ? ui.resizableContainer() : ui.scrollContainer()"
    >
      <table :aria-label="ariaLabel" data-slot="table-content" :class="ui.content()">
        <thead data-slot="table-header" :class="ui.header()">
          <tr @keydown="onHeaderKeydown">
            <th
              v-if="hasSelectionColumn"
              scope="col"
              data-slot="table-column"
              :tabindex="headerTabindex(0)"
              :class="ui.column({ class: 'pe-0' })"
              @click.stop
              @focus="onHeaderFocus(0)"
            >
              <!-- Like React Aria's select-all checkbox: only multiple selection can select every row, so single selection disables it and names it "Select". -->
              <Checkbox
                :model-value="selectAllModel"
                :aria-label="selectionMode === 'multiple' ? 'Select all' : 'Select'"
                :disabled="selectionMode !== 'multiple' || selectableKeys.length === 0"
                tabindex="-1"
                @update:model-value="toggleSelectAll"
              />
            </th>
            <th
              v-for="(column, columnIndex) in columns"
              :id="column.resizable ? columnHeaderId(column) : undefined"
              :key="column.key"
              scope="col"
              data-slot="table-column"
              :data-allows-sorting="column.sortable ? 'true' : undefined"
              :aria-sort="column.sortable ? (sortDirectionFor(column) ?? 'none') : undefined"
              :tabindex="headerTabindex(headerIndexOf(columnIndex))"
              :style="widthStyle(column)"
              :class="ui.column({ override: [column.class, getAlignClass(column)] })"
              @click="toggleSort(column)"
              @focus="onHeaderFocus(headerIndexOf(columnIndex))"
              @keydown.enter.prevent="toggleSort(column)"
              @keydown.space.prevent="toggleSort(column)"
            >
              <span
                v-if="column.sortable"
                data-slot="table-sortable-column-header"
                :data-direction="sortDirectionFor(column)"
                :class="ui.sortableColumnHeader()"
              >
                <slot
                  :name="`${column.key}-header`"
                  :column="column"
                  :sort-direction="sortDirectionFor(column)"
                  >{{ column.label }}</slot
                >
                <!-- Like HeroUI's SortableColumnHeader: the indicator only shows on the sorted column. -->
                <svg
                  v-if="sortDirectionFor(column)"
                  aria-hidden="true"
                  data-slot="table-sortable-column-indicator"
                  :data-direction="sortDirectionFor(column)"
                  :class="ui.sortableColumnIndicator()"
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
              <slot
                v-else
                :name="`${column.key}-header`"
                :column="column"
                :sort-direction="undefined"
                >{{ column.label }}</slot
              >
              <!-- Named and valued like React Aria's ColumnResizer input: "Resizer <column>", its width in pixels. -->
              <div
                v-if="column.resizable"
                :id="`${columnHeaderId(column)}-resizer`"
                data-slot="table-column-resizer"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resizer"
                :aria-labelledby="`${columnHeaderId(column)}-resizer ${columnHeaderId(column)}`"
                :aria-valuenow="columnWidthOf(column)"
                :aria-valuetext="`${columnWidthOf(column)} pixels`"
                :aria-valuemin="minWidthOf(column)"
                :aria-valuemax="column.maxWidth"
                tabindex="0"
                :data-resizing="resizingKey === column.key ? 'true' : undefined"
                :class="ui.columnResizer()"
                @click.stop
                @pointerdown.stop="onResizerPointerDown(column, $event)"
                @keydown="onResizerKeydown(column, $event)"
              />
            </th>
          </tr>
        </thead>
        <tbody
          data-slot="table-body"
          :data-empty="flatRows.length === 0 || undefined"
          :class="ui.body()"
        >
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
            :aria-selected="hasSelectionColumn ? isSelected(flat.key) : undefined"
            :aria-disabled="flat.row.disabled ? 'true' : undefined"
            :tabindex="flat.key === activeRowKey ? 0 : -1"
            :style="{ '--table-row-level': flat.depth }"
            :class="ui.row()"
            @click="onRowClick(flat, $event)"
            @focus="onRowFocus(flat.key)"
            @keydown="onRowKeydown(flat, $event)"
          >
            <td
              v-if="hasSelectionColumn"
              data-slot="table-cell"
              :class="ui.cell({ class: 'pe-0' })"
              @click.stop
            >
              <Checkbox
                :model-value="isSelected(flat.key)"
                :disabled="!isSelectable(flat.key, flat.row)"
                :aria-label="`Select row ${flat.index + 1}`"
                variant="secondary"
                tabindex="-1"
                @update:model-value="manager.toggle(flat.key)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :role="column.isRowHeader ? 'rowheader' : undefined"
              data-slot="table-cell"
              :data-tree-column="treeColumn === column.key ? 'true' : undefined"
              :style="widthStyle(column)"
              :class="ui.cell({ override: [column.class, getAlignClass(column)] })"
            >
              <slot
                :name="`${column.key}-cell`"
                :row="flat.row"
                :column="column"
                :value="getCellValue(flat.row, column)"
                :index="flat.index"
                :depth="flat.depth"
                :is-expanded="isRowExpanded(flat.key)"
                :has-child-items="flat.hasChildItems"
                :toggle="() => toggleExpanded(flat.key)"
              >
                {{ getCellValue(flat.row, column) }}
              </slot>
            </td>
          </tr>
          <!-- React Aria's LoadMoreItem: an inert zero-height sentinel row, plus the content row only while loading. -->
          <tr v-if="hasMore" ref="sentinel" inert style="height: 0">
            <td style="padding: 0; border: 0">
              <div style="position: relative; height: 1px; width: 1px" />
            </td>
          </tr>
          <tr
            v-if="hasMore && loading"
            role="row"
            data-slot="table-load-more"
            :class="ui.loadMore()"
          >
            <td role="rowheader" :colspan="colSpan">
              <div data-slot="table-load-more-content" :class="ui.loadMoreContent()">
                <slot name="load-more">
                  <Spinner size="md" />
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!!slots.footer" data-slot="table-footer" :class="ui.footer()">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends TableRow = TableRow">
import { computed, useSlots, useTemplateRef } from 'vue'

import Checkbox from '@/components/checkbox/Checkbox.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import type {
  TableSelection,
  TableSortDescriptor,
  TableRow,
  TableProps,
  TableSlots,
} from './Table.types'
import type { FlatRow } from './table.utils'
import { flattenRows, getAlignClass, getCellValue } from './table.utils'
import theme from './theme'
import { useTableColumnResize } from './useTableColumnResize'
import { useTableExpansion } from './useTableExpansion'
import { useTableLoadMore } from './useTableLoadMore'
import { useTableNavigation } from './useTableNavigation'
import { useTableSelection } from './useTableSelection'
import { useTableSort } from './useTableSort'

const props = withDefaults(defineProps<TableProps<T>>(), {
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

defineSlots<TableSlots<T>>()
const slots = useSlots()

const ui = useComponentUI('table', {
  theme,
  variantProps: () => ({ variant: props.variant }),
  props,
})

const table = useTemplateRef<HTMLElement>('table')

/** The scroll (or resizable) container: the column layout's width and the load-more observer root. */
const scrollRoot = useTemplateRef<HTMLElement>('scrollRoot')

const sentinel = useTemplateRef<HTMLElement>('sentinel')

const { sortDirectionFor, toggleSort } = useTableSort({
  model: sortDescriptorModel,
  defaultSortDescriptor: props.defaultSortDescriptor,
})

const { isRowExpanded, toggleExpanded } = useTableExpansion({
  model: expandedKeysModel,
  defaultExpandedKeys: props.defaultExpandedKeys,
  parentKeys: () => flatRows.value.filter((flat) => flat.hasChildItems).map((flat) => flat.key),
})

const flatRows = computed<FlatRow<T>[]>(() =>
  flattenRows({
    rows: props.rows,
    isExpanded: (key) => !!props.treeColumn && isRowExpanded(key),
  }),
)

const { isSelected, isSelectable, selectableKeys, selectAllModel, toggleSelectAll, manager } =
  useTableSelection({
    model: selectedKeysModel,
    defaultSelectedKeys: props.defaultSelectedKeys,
    mode: () => props.selectionMode,
    disabledKeys: () => props.disabledKeys,
    rows: () => flatRows.value,
  })

const {
  hasResizableColumns,
  resizingKey,
  widthStyle,
  minWidthOf,
  columnWidthOf,
  columnHeaderId,
  onResizerPointerDown,
  onResizerKeydown,
} = useTableColumnResize({ columns: () => props.columns, container: scrollRoot })

useTableLoadMore({
  hasMore: () => props.hasMore,
  loading: () => props.loading,
  rowCount: () => props.rows.length,
  sentinel,
  root: scrollRoot,
  onLoadMore: () => emit('loadMore'),
})

const {
  activeRowKey,
  headerTabindex,
  onHeaderFocus,
  onRowFocus,
  onHeaderKeydown,
  onRowKeydown,
  onRowClick,
} = useTableNavigation({
  table,
  rows: () => flatRows.value,
  selectionMode: () => props.selectionMode,
  manager,
  toggleSelectAll,
})

const hasSelectionColumn = computed(() => props.selectionMode !== 'none')

/** A column's header index, counting the selection column. */
const headerIndexOf = (columnIndex: number) => {
  return columnIndex + (hasSelectionColumn.value ? 1 : 0)
}

const colSpan = computed(() => headerIndexOf(props.columns.length))
</script>
