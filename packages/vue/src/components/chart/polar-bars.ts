import { percentValue } from './percent'

/** Size limits of one radial bar series. */
type RadialBarSizing = {
  barSize?: number | string
  maxBarSize?: number
}

/** A ring band and the bars sharing it. */
export type RadialBand = {
  bandSize: number
  bars: RadialBarSizing[]
}

/** Chart-wide bar sizing; a bar's own `barSize` / `maxBarSize` win. */
export type RadialBandOptions = {
  barSize?: number | string
  barGap?: number | string
  barCategoryGap?: number | string
  maxBarSize?: number
}

/** Offset of a bar from the start of its band, and its thickness. */
export type RadialBarPosition = {
  offset: number
  size: number
}

type BandSpacing = {
  bandSize: number
  /** Gap between neighboring bars, px. */
  gap: number
}

/** Fixed-size bars centered in the band; when they don't fit, each takes 90% of an equal share. */
const centerFixedBars = (spacing: BandSpacing, sizes: number[]): RadialBarPosition[] => {
  const { bandSize } = spacing
  const count = sizes.length
  let { gap } = spacing
  let width = sizes.reduce((total, size) => total + size, 0) + (count - 1) * gap

  // Bars too wide for the band lose their gaps first.
  if (width >= bandSize) {
    width -= (count - 1) * gap
    gap = 0
  }

  const shrunkSize = (bandSize / count) * 0.9
  const isShrunk = width >= bandSize && bandSize / count > 0
  const barSizes = isShrunk ? sizes.map(() => shrunkSize) : sizes

  if (isShrunk) width = count * shrunkSize

  // The centering offset is truncated to an integer, which keeps bar edges on whole pixels.
  let offset = Math.trunc((bandSize - width) / 2) - gap
  let previousSize = 0

  return barSizes.map((size) => {
    offset += previousSize + gap
    previousSize = size

    return { offset, size }
  })
}

/** Bars without a fixed size: `categoryGap` stays free on both sides, the rest is shared equally. */
const shareBand = (
  spacing: BandSpacing & { categoryGap: number },
  maxSizes: Array<number | undefined>,
): RadialBarPosition[] => {
  const { bandSize, categoryGap } = spacing
  const count = maxSizes.length
  const isCrowded = bandSize - 2 * categoryGap - (count - 1) * spacing.gap <= 0
  const gap = isCrowded ? 0 : spacing.gap
  const share = Math.max(0, (bandSize - 2 * categoryGap - (count - 1) * gap) / count)

  // Whole-pixel bars, unless they are thinner than a pixel.
  const barSize = share > 1 ? Math.trunc(share) : share

  return maxSizes.map((maxSize, index) => {
    const size = maxSize !== undefined ? Math.min(barSize, maxSize) : barSize
    const offset = categoryGap + (barSize + gap) * index + (barSize - size) / 2

    return { offset, size }
  })
}

/**
 * Offset and thickness of each bar inside a band: fixed sizes are centered
 * with `barGap` between them, otherwise `barCategoryGap` is left on both sides and the rest is shared.
 */
export const bandBarPositions = (
  band: RadialBand,
  options: RadialBandOptions = {},
): RadialBarPosition[] => {
  const { bandSize, bars } = band
  if (!bars.length || bandSize <= 0) return bars.map(() => ({ offset: 0, size: 0 }))

  const gap = percentValue(options.barGap ?? 4, { total: bandSize })
  const sizes = bars.map((bar) => bar.barSize ?? options.barSize)
  const firstSize = sizes[0]

  const isFixed =
    firstSize !== undefined &&
    Number.isFinite(percentValue(firstSize, { total: bandSize, fallback: Number.NaN }))

  if (isFixed) {
    const fixedSizes = sizes.map((size) => percentValue(size, { total: bandSize }))

    return centerFixedBars({ bandSize, gap }, fixedSizes)
  }

  const categoryGap = percentValue(options.barCategoryGap ?? '10%', { total: bandSize })
  const maxSizes = bars.map((bar) => bar.maxBarSize ?? options.maxBarSize)

  return shareBand({ bandSize, gap, categoryGap }, maxSizes)
}
