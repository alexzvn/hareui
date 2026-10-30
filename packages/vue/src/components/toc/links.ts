import type { TocLink } from './Toc.types'

/** A link with its nesting level, `0` for top-level links. */
export type FlatTocLink<T extends TocLink> = {
  link: T
  level: number
}

/** The links in document order, children right after their parent. */
export const flattenLinks = <T extends TocLink>(links: T[], level = 0): FlatTocLink<T>[] => {
  return links.flatMap((link) => [
    { link, level },
    ...flattenLinks((link.children ?? []) as T[], level + 1),
  ])
}

/** The height of a `list` row in rem: 20px line-height plus `py-1`. */
export const LINK_HEIGHT = 1.75

// SVG units per rem, and the rail's x for top-level and nested links in a 12-unit-wide box.
const SVG_UNIT = 16
const RAIL_X = 0.5
const NESTED_RAIL_X = 10.5
const BEND = 6

/**
 * The `circuit` rail: a vertical line at `RAIL_X` for top-level links and `NESTED_RAIL_X` for nested ones, bending
 * between them over `BEND` units where the level changes. Returns the path of a `12 × height` SVG.
 */
export const createCircuitPath = (levels: number[]) => {
  const rowHeight = LINK_HEIGHT * SVG_UNIT
  let path = ''
  let currentX = RAIL_X

  levels.forEach((level, index) => {
    const y = index * rowHeight
    const targetX = level > 0 ? NESTED_RAIL_X : RAIL_X
    const next = levels[index + 1]

    if (index === 0) {
      path += `M${targetX} ${y}`
      currentX = targetX
    }

    if (targetX !== currentX) {
      path += ` L${targetX} ${y + BEND}`
      currentX = targetX
    }

    const isNestedNow = level > 0
    const isNestedNext = next !== undefined && next > 0
    const isLevelChanging = next !== undefined && isNestedNext !== isNestedNow
    path += ` L${currentX} ${y + rowHeight - (isLevelChanging ? BEND : 0)}`
  })

  return { path, height: levels.length * rowHeight }
}

/** The inline mask that cuts the `circuit` indicator to the rail. */
export const createCircuitMaskStyle = (levels: number[]) => {
  const { path, height } = createCircuitPath(levels)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${height}'><path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`

  return {
    width: '0.75rem',
    height: `${levels.length * LINK_HEIGHT}rem`,
    maskImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
  }
}
