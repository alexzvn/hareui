---
title: RichTable
description: A data table built on TanStack Table for sorting, filtering, grouping, paginating and selecting rows.
links:
  source: rich-table/RichTable.vue
  styles: rich-table/theme.ts
---

## Usage

```ts
import { RichTable } from '@hareui/vue'
```

The RichTable component is built on [TanStack Table v8](https://tanstack.com/table/v8). Its state (sorting, filters, pagination, selection, expansion, grouping, pinning) is bound with `v-model`, and the TanStack instance is exposed for anything the props don't cover.

::: tip
Use [Table](./table) for a static list of rows. Use RichTable when the data needs to be sorted, filtered, grouped, paginated or virtualized in the browser.
:::

<ComponentPreview name="rich-table/basic" minHeight="420px" />

### Data

Use the `data` prop as an array of objects. Without `columns`, one column is generated for each key of the first row.

<ComponentPreview name="rich-table/auto-columns" minHeight="220px" />

### Columns

Use the `columns` prop as an array of [ColumnDef](https://tanstack.com/table/v8/docs/api/core/column-def) objects. Each column's `header`, `cell` and `footer` can be a string or a function returning a string, a VNode or a component created with Vue's `h` function. You can also render them with [slots](#with-slots).

### Meta

Use the `meta` property of a column to add classes, styles and spans to its header and cells: `meta.class.th`, `meta.class.td`, `meta.style.th`, `meta.style.td`, `meta.colspan.td` and `meta.rowspan.td`. Each value can be a function of the header or cell. The table's `meta` prop does the same for rows with `meta.class.tr` and `meta.style.tr`.

<ComponentPreview name="rich-table/meta" minHeight="360px" />

### Loading

Use the `loading` prop to show a loading bar under the header. Change its look with the `loading-bar` prop: `color` (`accent`, `success`, `warning`, `danger`, `neutral`) and `animation` (`carousel`, `carousel-inverse`, `swing`, `elastic`). When there are no rows yet, the `#loading` slot replaces the empty state.

<ComponentPreview name="rich-table/loading" minHeight="360px" />

### Async loading

Load more rows as the user scrolls: put a sentinel row in the `#body-bottom` slot, load the next page when an `IntersectionObserver` sees it, and show a `Spinner` in it while the page loads.

<ComponentPreview name="rich-table/async-loading" minHeight="460px" />

::: tip
The animation stops when the user prefers reduced motion.
:::

### Sticky

Use the `sticky` prop to keep the header and footer visible while the rows scroll. Set it to `header` or `footer` to pin only one of them. The table scrolls inside its root element, so give it a height.

<ComponentPreview name="rich-table/sticky" minHeight="460px" />

### Variant

Use the `variant` prop to change the style. The `secondary` variant removes the container background and renders the header as a pill.

<ComponentPreview name="rich-table/secondary-variant" minHeight="360px" />

## Anatomy

```vue
<RichTable :data="data" :columns="columns">
  <template #name-header="{ header, column, table }" /> <!-- optional: header content of the `name` column -->
  <template #name-cell="{ row, cell, column, getValue }" /> <!-- optional: cell content of the `name` column -->
  <template #name-footer="{ header, column, table }" /> <!-- optional: footer content of the `name` column -->
  <template #expanded="{ row }" /> <!-- optional: content below an expanded row -->
  <template #empty /> <!-- optional: shown when there are no rows -->
  <template #loading /> <!-- optional: shown instead of #empty while `loading` and there are no rows -->
  <template #caption /> <!-- optional: visually hidden caption -->
  <template #body-top /> <!-- optional: rows before the data rows -->
  <template #body-bottom /> <!-- optional: rows after the data rows -->
</RichTable>
```

## Examples

### With expandable rows

Set `getRowCanExpand` in `features.expanded`, toggle a row with `row.toggleExpanded()` and render its content in the `#expanded` slot. Bind `v-model:expanded` to read or control which rows are open.

<ComponentPreview name="rich-table/expandable" minHeight="460px" />

### With grouped rows

Bind `v-model:grouping` to the ids of the columns to group by, and pass `{ getGroupedRowModel: getGroupedRowModel() }` from `@tanstack/vue-table` to `features.grouping`. Give a column an `aggregationFn` such as `'sum'` or `'count'` and an `aggregatedCell` to summarize each group. In the `cell` function, `row.getIsGrouped()` tells you when to render a group header.

<ComponentPreview name="rich-table/grouping" minHeight="520px" />

### With row pinning

Bind `v-model:row-pinning` to `{ top, bottom }` arrays of row ids, or call `row.pin()`. Row pinning can't be combined with `virtualize`.

<ComponentPreview name="rich-table/row-pinning" minHeight="420px" />

### With row selection

Bind `v-model:row-selection` and render a [Checkbox](./checkbox) in the header and cells of a selection column. Rows are identified by their index unless you set `get-row-id`.

<ComponentPreview name="rich-table/selection" minHeight="420px" />

### With row events

Use the `on-select` prop to make rows focusable and clickable. Enter and Space select the focused row, and clicks on links, buttons and inputs inside a row are ignored. `on-hover` receives the row on enter and `null` on leave, and `on-contextmenu` accepts a function or an array of functions. For a context menu, call `preventDefault()` and open a [Dropdown](./dropdown) anchored where the pointer is, as this example does.

<ComponentPreview name="rich-table/row-interactions" minHeight="340px" />

### With slots

Use the `#<column>-header`, `#<column>-cell` and `#<column>-footer` slots to render a column's parts in the template instead of in its definition. The footer row appears once any column defines a `footer`, even an empty one.

<ComponentPreview name="rich-table/slots" minHeight="420px" />

### With column sorting

Bind `v-model:sorting` and render a header that calls `column.toggleSorting()`. Set `enableSorting: true` on a column to add `aria-sort` to its header.

<ComponentPreview name="rich-table/sorting" minHeight="460px" />

Set `sortingFn` on a column to a built-in name or a `(rowA, rowB, columnId) => number` function. To sort on the server, pass `{ manualSorting: true }` to `features.sorting`.

<ComponentPreview name="rich-table/custom-sort" minHeight="460px" />

### With column pinning

Bind `v-model:column-pinning` to `{ left, right }` arrays of column ids. A pinned column shows a border on its inner edge while other columns scroll under it.

<ComponentPreview name="rich-table/column-pinning" minHeight="420px" />

### With column visibility

Bind `v-model:column-visibility` to an object of column ids set to `false` to hide those columns.

<ComponentPreview name="rich-table/column-visibility" minHeight="420px" />

### With column sizing

Set `enableColumnResizing` in `features.columnSizing` and attach `header.getResizeHandler()` to a handle in the header. Bind `v-model:column-sizing` to read or restore the widths. A handle with `role="separator"` replaces the column's divider line; the one in this example also responds to the arrow keys and resets on double click.

<ComponentPreview name="rich-table/column-sizing" minHeight="360px" />

### With column filters

Bind `v-model:column-filters`, or set a column's filter with `tableApi.getColumn(id).setFilterValue()`.

<ComponentPreview name="rich-table/column-filters" minHeight="460px" />

### With global filter

Bind `v-model:global-filter` to match rows against every column. Pass `globalFilterFn` or `getColumnCanGlobalFilter` to `features.globalFilter` to change how values are matched.

<ComponentPreview name="rich-table/global-filter" minHeight="460px" />

### With pagination

Pass `{ getPaginationRowModel: getPaginationRowModel() }` from `@tanstack/vue-table` to `features.pagination` and bind `v-model:pagination` to `{ pageIndex, pageSize }`, where `pageIndex` starts at 0. Without the row model, every row is rendered. Use [Pagination](./pagination) for the controls, and put them with the table in a `bg-surface-secondary` wrapper so they sit in the table's gray footer.

<ComponentPreview name="rich-table/pagination" minHeight="420px" />

You can also drive the controls from the exposed `tableApi` instead of binding the state.

<ComponentPreview name="rich-table/pagination-api" minHeight="420px" />

To paginate on the server, pass `{ manualPagination: true, rowCount }` to `features.pagination` and load each page into `data`.

### With virtualization

Use the `virtualize` prop to render only the visible rows of a large dataset. Pass an object to configure the TanStack virtualizer (`estimateSize`, `overscan`, `getScrollElement`, `scrollMargin`). With `getScrollElement`, the page or another container scrolls the rows and the table grows to its full height.

<ComponentPreview name="rich-table/virtualize" minHeight="460px" />

### With tree data

Use the `get-sub-rows` prop to render nested rows. Use `row.depth` to indent them and `row.getCanExpand()` to show the toggle.

<ComponentPreview name="rich-table/sub-rows" minHeight="460px" />

### With empty state

Use the `#empty` slot to replace the message shown when there are no rows.

<ComponentPreview name="rich-table/empty" minHeight="480px" />

## Customization

Use the `class` prop to style the root and the `ui` prop to style each part.

<ComponentPreview name="rich-table/custom-styles" minHeight="360px" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      richTable: {
        slots: {
          th: 'bg-gray-100',
          td: 'px-6 py-4',
        },
      },
    },
  }),
)
```

## API

### Props

<ApiTable component="RichTable" kind="props" />

### Slots

<ApiTable component="RichTable" kind="slots" />

### Exposes

`tableApi` is the TanStack Table instance (sorting, filtering, pagination, selection and visibility methods), `tableRef` the `<table>` element and `$el` the root element.

## Theme

<ApiTheme component="RichTable" />

## Styling Reference

| `ui` key  | `data-slot`                                                                                   | Description                           |
| --------- | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| `root`    | `rich-table`                                                                                  | Scroll container                      |
| `base`    | `rich-table-content`                                                                          | The `<table>` element                 |
| `caption` | `rich-table-caption`                                                                          | The `<caption>` element               |
| `thead`   | `rich-table-header`                                                                           | The `<thead>` element                 |
| `tbody`   | `rich-table-body`                                                                             | The `<tbody>` element                 |
| `tfoot`   | `rich-table-footer`                                                                           | The `<tfoot>` element                 |
| `tr`      | `rich-table-row`, `rich-table-header-row`, `rich-table-footer-row`, `rich-table-expanded-row` | Every row                             |
| `th`      | `rich-table-column`                                                                           | Header and footer cells               |
| `td`      | `rich-table-cell`                                                                             | Body cells                            |
| `empty`   | `rich-table-empty`                                                                            | Cell shown when there are no rows     |
| `loading` | `rich-table-loading`                                                                          | Cell shown while loading with no rows |

Rows set `data-selected`, `data-expanded`, `data-selectable` and `data-pinned`; pinned cells set `data-pinned="left" | "right"` and, while content scrolls under them, `data-edge` on the column facing the scrolling columns.
