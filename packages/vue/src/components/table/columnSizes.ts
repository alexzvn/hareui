// Port of React Stately's `calculateColumnSizes` (table/TableUtils), used by React Aria's
// ResizableTableContainer: CSS flexbox's "resolving flexible lengths" over the columns.

/** A column width: pixels, a percentage of the table (`'25%'`) or a fraction of the free space (`'2fr'`). */
export type ColumnWidth = number | `${number}%` | `${number}fr`

/** React Aria's default column min width in pixels. */
export const DEFAULT_MIN_COLUMN_WIDTH = 75

export type ColumnSizeInput = {
  width?: ColumnWidth
  minWidth?: ColumnWidth
  maxWidth?: ColumnWidth
}

const isStatic = (width: ColumnWidth): boolean => {
  return typeof width === 'number' || /^\d+(?:\.\d+)?%$/.test(width)
}

const staticWidth = (width: ColumnWidth, tableWidth: number): number => {
  return typeof width === 'number' ? width : tableWidth * (Number.parseFloat(width) / 100)
}

const flexFactor = (width: ColumnWidth): number => {
  if (typeof width === 'number') return 1
  const match = width.match(/^(.+)(?=fr$)/)

  return match ? Number.parseFloat(match[0]) : 1
}

/** Rounds floats summing to an integer into integers with the same sum. */
const cascadeRounding = (sizes: number[]): number[] => {
  let fpTotal = 0
  let intTotal = 0

  return sizes.map((size) => {
    const integer = Math.round(size + fpTotal) - intTotal
    fpTotal += size
    intTotal += integer

    return integer
  })
}

type ColumnSizeItem = {
  isFrozen: boolean
  baseSize: number
  min: number
  max: number
  flex: number
  target: number
  violation: number
}

const createSizeItem = (column: ColumnSizeInput, tableWidth: number): ColumnSizeItem => {
  const width = column.width ?? '1fr'
  const isStaticWidth = isStatic(width)
  const baseSize = isStaticWidth ? staticWidth(width, tableWidth) : 0
  const flex = isStaticWidth ? 0 : flexFactor(width)
  const min = staticWidth(column.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, tableWidth)

  const max =
    column.maxWidth != null ? staticWidth(column.maxWidth, tableWidth) : Number.MAX_SAFE_INTEGER

  const hypothetical = Math.max(min, Math.min(baseSize, max))

  // Static and zero-flex columns sit at their clamped size from the start, as does a column whose
  // base size already overflows its max.
  const isFrozen = isStaticWidth || flex <= 0 || baseSize > hypothetical

  return { isFrozen, baseSize, min, max, flex, target: isFrozen ? hypothetical : 0, violation: 0 }
}

/**
 * Resolves each column's pixel width for a table `availableWidth` wide. Widths default to
 * `'1fr'`, min widths to {@link DEFAULT_MIN_COLUMN_WIDTH}.
 */
export const calculateColumnSizes = (
  availableWidth: number,
  columns: ColumnSizeInput[],
): number[] => {
  const tableWidth = Math.floor(availableWidth)
  const fraction = availableWidth - tableWidth
  const items = columns.map((column) => createSizeItem(column, tableWidth))
  let hasNonFrozenItems = items.some((item) => !item.isFrozen)

  while (hasNonFrozenItems) {
    let used = 0
    let flexFactors = 0
    for (const item of items) {
      used += item.isFrozen ? item.target : item.baseSize
      if (!item.isFrozen) flexFactors += item.flex
    }

    const free = tableWidth - used
    for (const item of items) {
      if (free > 0 && !item.isFrozen) item.target = item.baseSize + (item.flex / flexFactors) * free
    }

    let totalViolation = 0
    for (const item of items) {
      item.violation = 0
      if (item.isFrozen) continue

      const clamped = Math.max(item.min, Math.min(item.target, item.max))
      item.violation = clamped - item.target
      item.target = clamped
      totalViolation += item.violation
    }

    hasNonFrozenItems = false

    for (const item of items) {
      const shouldFreeze =
        totalViolation === 0 || Math.sign(totalViolation) === Math.sign(item.violation)

      if (shouldFreeze) {
        item.isFrozen = true
        continue
      }

      if (!item.isFrozen) hasNonFrozenItems = true
    }
  }

  const sizes = cascadeRounding(items.map((item) => item.target))

  // The last column takes the sub-pixel remainder so the columns sum to the exact width.
  if (fraction > 0 && sizes.length) sizes[sizes.length - 1] += fraction

  return sizes
}
