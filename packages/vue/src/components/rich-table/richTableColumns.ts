import type { Cell, CellContext, Column, ColumnDef } from '@tanstack/vue-table'
import type { StyleValue } from 'vue'

import type { RichTableColumn, RichTableColumnMeta, RichTableData } from './RichTable.types'

type DefaultColumn<T extends RichTableData> = Partial<ColumnDef<T, unknown>> | undefined

type StyleProp<A> =
  | string
  | Record<string, string>
  | ((arg: A) => string | Record<string, string>)
  | undefined

/**
 * The fallback `cell`: the value as plain text, a non-breaking space when it is empty.
 * It renders plain text, so the template prints it inline instead of mounting a FlexRender
 * component plus a functional component per cell.
 */
export const defaultCell = <T extends RichTableData>({ getValue }: CellContext<T, unknown>) => {
  const value = getValue()
  if (value === '' || value === null || value === undefined) return '\u00A0'

  return String(value)
}

const toTitle = (key: string) => {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

/**
 * One column per key of `row`, titled by the key.
 * TanStack resolves each column as `{ ...defaultColumn, ...columnDef }`, so the fallback `header`
 * is only set when `defaultColumn` doesn't provide its own (it would shadow it).
 */
export const createColumnsFromRow = <T extends RichTableData>(
  row: T | undefined,
  defaultColumn: DefaultColumn<T>,
): RichTableColumn<T>[] => {
  const hasDefaultHeader = defaultColumn?.header !== undefined

  return Object.keys(row ?? {}).map((accessorKey: string) => {
    if (hasDefaultHeader) return { accessorKey }

    return { accessorKey, header: toTitle(accessorKey) }
  })
}

/** Copies `columns` (recursively) with the fallback `cell` on the ones that define none, unless `defaultColumn` has one. */
export const resolveColumnCells = <T extends RichTableData>(
  columns: RichTableColumn<T>[],
  defaultColumn: DefaultColumn<T>,
): RichTableColumn<T>[] => {
  return columns.map((column) => {
    const resolved = { ...column }

    if ('columns' in resolved && resolved.columns) {
      resolved.columns = resolveColumnCells(resolved.columns, defaultColumn)
    }

    if (!resolved.cell && !defaultColumn?.cell) {
      resolved.cell = defaultCell
    }

    return resolved
  })
}

/** Whether any column, nested ones included, defines a `footer`. */
export const hasColumnFooter = <T extends RichTableData>(
  columns: RichTableColumn<T>[],
): boolean => {
  return columns.some((column) => {
    if ('footer' in column) return true

    return 'columns' in column && !!column.columns && hasColumnFooter(column.columns)
  })
}

/**
 * The `meta` of a column definition.
 * TanStack types it as its (empty) `ColumnMeta`: `RichTableColumn` is what declares it as `RichTableColumnMeta`.
 */
export const getColumnMeta = <T extends RichTableData>(
  column: Column<T, unknown>,
): RichTableColumnMeta<T> | undefined => {
  return (column.columnDef as RichTableColumn<T>).meta
}

/**
 * The renderer of a cell.
 * Group rows render a column's `aggregatedCell` (falling back to `cell`) and leave the cells of
 * grouped-by columns in their rows empty. TanStack v8 also reports cells of rows with sub rows as
 * aggregated and gives every column a default `aggregatedCell`, so only group rows use it.
 */
export const getCellRenderer = <T extends RichTableData>(cell: Cell<T, unknown>) => {
  const { aggregatedCell, cell: render } = cell.column.columnDef
  const isGroupAggregate = cell.row.getIsGrouped() && cell.getIsAggregated()

  return isGroupAggregate ? (aggregatedCell ?? render) : render
}

/** A `meta` value, or what it returns for `arg` when it is a function. */
export const resolveValue = <V, A>(
  prop: V | ((arg: A) => V) | undefined,
  arg: A,
): V | undefined => {
  return typeof prop === 'function' ? (prop as (arg: A) => V)(arg) : prop
}

/** A `meta` style, or what it returns for `arg` when it is a function. */
export const resolveStyle = <A>(prop: StyleProp<A>, arg: A): StyleValue => {
  return resolveValue(prop, arg)
}
