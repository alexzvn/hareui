---
title: Table
description: Tables display structured data in rows and columns with support for sorting, selection, column resizing, and infinite scrolling.
links:
  source: table/Table.vue
  styles: table/theme.ts
  heroui: table
---

## Usage

```ts
import { Table } from '@hareui/vue'
```

::: tip
Table renders the rows you give it. To sort, filter, group, paginate or virtualize data in the browser, use [RichTable](./rich-table).
:::

<ComponentPreview name="table/basic" minHeight="320px" />

## Anatomy

HeroUI composes `Table.ScrollContainer`, `Table.Content`, `Table.Header`, `Table.Column`, `Table.Body`,
`Table.Row` and `Table.Cell`. HareUI renders the same `<table>` structure from two arrays: `columns`
(one entry per header) and `rows` (one object per row, looked up as `row[column.key]`). Per-column slots
replace the default header or cell content.

```vue
<Table aria-label="Team members" :columns="columns" :rows="rows">
  <template #status-header="{ column, sortDirection }" /> <!-- optional: header content for the `status` column -->
  <template #status-cell="{ row, value }" /> <!-- optional: cell content for the `status` column -->
  <template #empty /> <!-- optional: shown when `rows` is empty -->
  <template #load-more /> <!-- optional: shown while `loading` (defaults to a Spinner) -->
  <template #footer /> <!-- optional: below the table, e.g. pagination -->
</Table>
```

`ui` keys: `base`, `scrollContainer`, `resizableContainer`, `content`, `header`, `column`,
`sortableColumnHeader`, `sortableColumnIndicator`, `body`, `row`, `cell`, `footer`, `columnResizer`,
`loadMore`, `loadMoreContent`.

## Examples

### Secondary Variant

<ComponentPreview name="table/secondary-variant" minHeight="320px" />

### Async Loading

Set `has-more` to render a sentinel row that emits `loadMore` when scrolled into view. While `loading`
is `true`, the `#load-more` row is shown.

<ComponentPreview name="table/async-loading" minHeight="380px" />

### Sorting

Set `sortable` on a column to render the sort indicator and make the header toggle the sort. Bind
`v-model:sort-descriptor` and pass `rows` already sorted: the table displays the sort state, it does not
sort the data.

<ComponentPreview name="table/sorting" minHeight="380px" />

### Selection

Enable row selection with `selection-mode`. The table adds a checkbox column with a select-all checkbox
in the header; bind `v-model:selected-keys` to read or control the selection (`'all'` or a `Set` of row ids).
The table is a single tab stop: Arrow Up/Down, Home and End move between rows (Arrow Up from the first row enters
the header row), Space or Enter toggles the focused row, Shift+Arrow and Shift+click select a range, Meta/Ctrl+A
selects every row and Escape clears the selection.

<ComponentPreview name="table/selection" minHeight="380px" />

### Expandable Rows

Rows with `children` are nested. Use `tree-column` to designate the column that is indented by depth,
and render a toggle in that column's cell slot with the `toggle`, `isExpanded` and `hasChildItems` slot props.
Use `v-model:expanded-keys` to control which rows are expanded.

<ComponentPreview name="table/expandable-rows" minHeight="420px" />

### Column Resizing

Set `resizable` on a column to add a column resizer to its header. As with HeroUI's `ResizableContainer`, the columns of a resizable table share the container's width: `width` sets each column's initial size (pixels, `'25%'` or `'2fr'`, default `'1fr'`), clamped by `minWidth` (default 75) and `maxWidth`. Resizing a column fixes the columns to its left at their current width.

<ComponentPreview name="table/column-resizing" minHeight="420px" />

### Empty State

Use the `#empty` slot to display a custom message when the table has no data.

<ComponentPreview name="table/empty-state" minHeight="300px" />

### Custom Cells

<ComponentPreview name="table/custom-cells" minHeight="420px" />

## Customization

### Tailwind CSS

Use the `class` prop for the root, `ui` for every part, and `column.class` for one column's header and cells:

<ComponentPreview name="table/custom-styles" />

### Global theme override

Override the `table` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      table: {
        slots: {
          header: 'bg-gray-100',
          column: 'px-4 py-2.5 text-left text-xs font-medium text-gray-600',
          row: 'border-b border-gray-200',
          cell: 'bg-white px-4 py-3 text-sm',
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key                  | `data-slot`                       | Description                                      |
| ------------------------- | --------------------------------- | ------------------------------------------------ |
| `base`                    | `table`                           | Root container                                   |
| `scrollContainer`         | `table-scroll-container`          | Horizontal scroll wrapper                        |
| `resizableContainer`      | `table-resizable-container`       | Scroll wrapper used when a column is `resizable` |
| `content`                 | `table-content`                   | The `<table>` element                            |
| `header`                  | `table-header`                    | The `<thead>` element                            |
| `column`                  | `table-column`                    | Header cell                                      |
| `sortableColumnHeader`    | `table-sortable-column-header`    | Label and indicator of a sortable column         |
| `sortableColumnIndicator` | `table-sortable-column-indicator` | Sort direction chevron                           |
| `body`                    | `table-body`                      | The `<tbody>` element                            |
| `row`                     | `table-row`                       | Body row                                         |
| `cell`                    | `table-cell`                      | Body cell                                        |
| `columnResizer`           | `table-column-resizer`            | Column resize handle                             |
| `loadMore`                | `table-load-more`                 | Row shown while loading more                     |
| `loadMoreContent`         | `table-load-more-content`         | Content wrapper of the load-more row             |
| `footer`                  | `table-footer`                    | Footer below the table                           |

HeroUI's modifier classes correspond to props (HareUI renders utilities, not BEM classes, so
style through `class`, `ui` or `createHareUI`):

- `variant`: `primary` (default, rows on a secondary surface), `secondary` (`.table-root--{variant}`)

### Interactive States

- **Hover**: `:hover` (row background change)
- **Selected**: `[data-selected="true"]` (row highlight)
- **Focus**: `:focus-visible` (inset focus ring on rows and sortable columns)
- **Disabled**: `[aria-disabled="true"]` (reduced opacity)
- **Sortable**: `[data-allows-sorting="true"]` (interactive cursor on columns)

## API Reference

### Props

<ApiTable component="Table" kind="props" />

### Slots

<ApiTable component="Table" kind="slots" />

### Emits

<ApiTable component="Table" kind="emits" />

### Theme

<ApiTheme component="Table" />

### TableColumn

| Prop                    | Type                                      | Description                                                            |
| ----------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `key`                   | `string`                                  | Unique column key, looked up as `row[key]`                             |
| `label`                 | `string`                                  | Header text                                                            |
| `sortable`              | `boolean`                                 | Shows the sort indicator; clicking the header updates `sortDescriptor` |
| `isRowHeader`           | `boolean`                                 | Renders this column's cells as row headers (`role="rowheader"`)        |
| `align`                 | `'start' \| 'center' \| 'end'`            | Text alignment of the header and cells                                 |
| `width`                 | `number \| '${number}%' \| '${number}fr'` | Initial width; percentages and `fr` apply to resizable tables only     |
| `minWidth` / `maxWidth` | `number`                                  | Width limits in px for resizable tables (`minWidth` defaults to 75)    |
| `resizable`             | `boolean`                                 | Adds a column resizer                                                  |
| `class`                 | `any`                                     | Classes for this column's header and cells                             |

### TableRow

| Prop       | Type               | Description                                                         |
| ---------- | ------------------ | ------------------------------------------------------------------- |
| `id`       | `string \| number` | Row key used by selection and expansion (defaults to the row index) |
| `children` | `TableRow[]`       | Nested rows (with `tree-column`)                                    |
| `disabled` | `boolean`          | Excludes the row from selection                                     |
