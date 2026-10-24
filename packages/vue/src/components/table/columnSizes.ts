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

/**
 * Resolves each column's pixel width for a table `availableWidth` wide. Widths default to
 * `'1fr'`, min widths to `defaultMinWidth`.
 */
export const calculateColumnSizes = (
  availableWidth: number,
  columns: ColumnSizeInput[],
  defaultMinWidth = DEFAULT_MIN_COLUMN_WIDTH,
): number[] => {
  const flooredWidth = Math.floor(availableWidth)
  const fraction = availableWidth - flooredWidth
  availableWidth = flooredWidth

  let hasNonFrozenItems = false
  const items = columns.map((column) => {
    const width = column.width ?? '1fr'
    let frozen = false
    let baseSize = 0
    let flex = 0
    let target = 0

    if (isStatic(width)) {
      baseSize = staticWidth(width, availableWidth)
      frozen = true
    } else {
      flex = flexFactor(width)
      if (flex <= 0) frozen = true
    }

    const min = staticWidth(column.minWidth ?? defaultMinWidth, availableWidth)

    const max =
      column.maxWidth != null
        ? staticWidth(column.maxWidth, availableWidth)
        : Number.MAX_SAFE_INTEGER

    const hypothetical = Math.max(min, Math.min(baseSize, max))
    if (frozen) {
      target = hypothetical
    } else if (baseSize > hypothetical) {
      frozen = true
      target = hypothetical
    }

    if (!frozen) hasNonFrozenItems = true

    return { frozen, baseSize, min, max, flex, target, violation: 0 }
  })

  while (hasNonFrozenItems) {
    let used = 0
    let flexFactors = 0
    for (const item of items) {
      if (item.frozen) {
        used += item.target
      } else {
        used += item.baseSize
        flexFactors += item.flex
      }
    }

    const free = availableWidth - used
    if (free > 0) {
      for (const item of items) {
        if (!item.frozen) item.target = item.baseSize + (item.flex / flexFactors) * free
      }
    }

    let totalViolation = 0
    for (const item of items) {
      item.violation = 0

      if (!item.frozen) {
        const clamped = Math.max(item.min, Math.min(item.target, item.max))
        item.violation = clamped - item.target
        item.target = clamped
        totalViolation += item.violation
      }
    }

    hasNonFrozenItems = false

    for (const item of items) {
      if (totalViolation === 0 || Math.sign(totalViolation) === Math.sign(item.violation))
        item.frozen = true
      else if (!item.frozen) hasNonFrozenItems = true
    }
  }

  const sizes = cascadeRounding(items.map((item) => item.target))

  // The last column takes the sub-pixel remainder so the columns sum to the exact width.
  if (fraction > 0 && sizes.length) sizes[sizes.length - 1] += fraction

  return sizes
}
