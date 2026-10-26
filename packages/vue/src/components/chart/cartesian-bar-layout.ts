import { defu } from 'defu'

import type { ChartBarPosition } from './cartesian.types'
import { percentValue } from './percent'
import type { ChartBarSizing, ChartSeries } from './types'
import { CHART_BAR_SIZING_DEFAULTS } from './types'

/** One bar position in a band: an unstacked bar, or every bar of a stack. */
type BarSlot = { ids: string[]; size?: number; max?: number }

type BarEntry = [string, ChartBarPosition]

// Bar sizes and gaps pass non-finite values (`Infinity`, `'abc%'`) through instead of falling back, unlike polar layout.
const toBarLength = (value: number | string, bandSize: number) =>
  percentValue(value, { total: bandSize, keepNonFinite: true })

// Unstacked bars get one slot each; a stack shares one slot, sized by the first of its bars that sets a size.
const collectBarSlots = (series: ChartSeries[], bandSize: number): BarSlot[] => {
  const slots: BarSlot[] = []
  const stackSlots = new Map<string, BarSlot>()

  for (const entry of series) {
    if (entry.kind !== 'bar') continue

    const size = entry.barSize === undefined ? undefined : toBarLength(entry.barSize, bandSize)
    const stackKey = entry.stackId === undefined ? undefined : String(entry.stackId)
    const stackSlot = stackKey === undefined ? undefined : stackSlots.get(stackKey)

    if (stackSlot) {
      stackSlot.ids.push(entry.id)
      stackSlot.size ??= size
      stackSlot.max ??= entry.maxBarSize
      continue
    }

    const slot: BarSlot = { ids: [entry.id], size, max: entry.maxBarSize }
    if (stackKey !== undefined) stackSlots.set(stackKey, slot)
    slots.push(slot)
  }

  return slots
}

// Sized bars sit centered in the band. When they overflow it, the gaps go first, then every bar shrinks to 90% of an
// equal share.
const layoutSizedSlots = (slots: BarSlot[], options: { bandSize: number; gap: number }) => {
  const { bandSize } = options
  const count = slots.length
  let gap = options.gap
  let total = slots.reduce((sum, slot) => sum + (slot.size ?? 0), 0) + (count - 1) * gap
  let full = 0

  if (total >= bandSize) {
    total -= (count - 1) * gap
    gap = 0
  }

  if (total >= bandSize) {
    full = (bandSize / count) * 0.9
    total = count * full
  }

  const entries: BarEntry[] = []
  let cursor = Math.trunc((bandSize - total) / 2) - gap
  let previous = 0

  for (const slot of slots) {
    const size = full || (slot.size ?? 0)
    cursor += previous + gap
    previous = size
    for (const id of slot.ids) entries.push([id, { offset: cursor, size }])
  }

  return entries
}

// Unsized bars share the band left between the two category gaps equally, each capped by its max size.
const layoutAutoSlots = (
  slots: BarSlot[],
  options: { bandSize: number; gap: number; categoryGap: number; maxBarSize?: number },
) => {
  const { bandSize, categoryGap, maxBarSize } = options
  const count = slots.length
  const room = (gap: number) => bandSize - 2 * categoryGap - (count - 1) * gap
  const gap = room(options.gap) <= 0 ? 0 : options.gap

  // A category gap over half the band leaves no room: bars collapse to 0 instead of drawing inverted.
  const share = Math.max(0, room(gap) / count)
  const original = share > 1 ? Math.trunc(share) : share

  return slots.flatMap((slot, index) => {
    const limit = slot.max ?? maxBarSize
    const size = limit !== undefined ? Math.min(original, limit) : original
    const offset = categoryGap + (original + gap) * index + (original - size) / 2

    return slot.ids.map((id): BarEntry => [id, { offset, size }])
  })
}

/** Offset and size of every visible bar series within its band, by series id. */
export const createBarLayout = (options: {
  series: ChartSeries[]
  bandSize: number
  /** The root's bar sizing; a series' own `barSize` / `maxBarSize` win. */
  bar?: ChartBarSizing
}): Map<string, ChartBarPosition> => {
  const { bandSize } = options
  if (!bandSize) return new Map()

  const slots = collectBarSlots(options.series, bandSize)
  if (!slots.length) return new Map()

  const bar = defu(options.bar, CHART_BAR_SIZING_DEFAULTS)
  const rootSize = bar.size === undefined ? undefined : toBarLength(bar.size, bandSize)
  for (const slot of slots) slot.size ??= rootSize

  const gap = toBarLength(bar.gap, bandSize)
  if (slots[0]!.size !== undefined) return new Map(layoutSizedSlots(slots, { bandSize, gap }))

  const categoryGap = toBarLength(bar.categoryGap, bandSize)

  return new Map(layoutAutoSlots(slots, { bandSize, gap, categoryGap, maxBarSize: bar.maxSize }))
}
