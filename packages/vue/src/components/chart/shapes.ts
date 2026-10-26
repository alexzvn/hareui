/** Corner radii: one value for all corners, or `[topLeft, topRight, bottomRight, bottomLeft]`. */
export type ChartRadius = number | [number, number, number, number]

type Rectangle = { x: number; y: number; width: number; height: number }

/**
 * SVG path of a rectangle with rounded corners. Width and height may be negative
 * (bars below the baseline or drawn leftwards); radii are clamped to half the shorter side.
 */
export const rectanglePath = (
  { x, y, width, height }: Rectangle,
  radius: ChartRadius = 0,
): string => {
  const maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2)
  const ySign = height >= 0 ? 1 : -1
  const xSign = width >= 0 ? 1 : -1
  const clockwise = (height >= 0 && width >= 0) || (height < 0 && width < 0) ? 1 : 0
  const corners = Array.isArray(radius) ? radius : [radius, radius, radius, radius]
  if (maxRadius > 0 && corners.some((value) => value > 0)) {
    const [tl, tr, br, bl] = corners.map((value) => Math.min(Math.max(value, 0), maxRadius)) as [
      number,
      number,
      number,
      number,
    ]

    let path = `M${x},${y + ySign * tl}`
    if (tl > 0) path += `A ${tl},${tl},0,0,${clockwise},${x + xSign * tl},${y}`
    path += `L ${x + width - xSign * tr},${y}`
    if (tr > 0) path += `A ${tr},${tr},0,0,${clockwise},${x + width},${y + ySign * tr}`
    path += `L ${x + width},${y + height - ySign * br}`
    if (br > 0) path += `A ${br},${br},0,0,${clockwise},${x + width - xSign * br},${y + height}`
    path += `L ${x + xSign * bl},${y + height}`
    if (bl > 0) path += `A ${bl},${bl},0,0,${clockwise},${x},${y + height - ySign * bl}`

    return `${path}Z`
  }

  return `M ${x},${y} h ${width} v ${height} h ${-width} Z`
}
