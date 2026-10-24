import { angleDistance, angleInSweep, cartesianToPolar } from './polar-geometry'
import type { PieItemGroup, PieSector } from './polar-pie'
import type { ChartPoint } from './types'

/** A pie registered with the root, under its series id. */
export type RegisteredPie = {
  seriesId: string
  group: PieItemGroup
}

/** The pies to test, in template order, and the series the tooltip currently shows. */
export type PieHitTestInput = {
  pies: RegisteredPie[]
  activeSeriesId: string | null
}

/** A pie whose sweep contains the pointer. */
type PieCandidate = {
  seriesId: string
  sectors: PieSector[]
  /** Pointer angle around the pie's center. */
  angle: number
  /** Pointer distance from the pie's ring band, 0 inside it. */
  distance: number
  /** True when the pointer lies outside the ring, false inside the hole. */
  isBeyond: boolean
}

const distanceToBand = (radius: number, band: { inner: number; outer: number }) => {
  if (radius < band.inner) return band.inner - radius
  if (radius > band.outer) return radius - band.outer

  return 0
}

/** The pointer seen from `pie`, or `null` outside its sweep (or for an empty pie). */
const toCandidate = (pie: RegisteredPie, point: ChartPoint): PieCandidate | null => {
  const { group } = pie
  const first = group.sectors[0]
  if (!first) return null

  const { radius, angle } = cartesianToPolar({ x: first.cx, y: first.cy }, point)
  if (!angleInSweep(angle, group)) return null

  const inner = Math.min(first.innerRadius, first.outerRadius)
  const outer = Math.max(first.innerRadius, first.outerRadius)
  const distance = distanceToBand(radius, { inner, outer })

  return {
    seriesId: pie.seriesId,
    sectors: group.sectors,
    angle,
    distance,
    isBeyond: radius > outer,
  }
}

/** The candidate closest to the pointer; the first one wins ties. */
const nearestCandidate = (candidates: PieCandidate[]) => {
  return candidates.reduce<PieCandidate | undefined>(
    (best, item) => (!best || item.distance < best.distance ? item : best),
    undefined,
  )
}

const pickPie = (candidates: PieCandidate[], activeSeriesId: string | null) => {
  // Pies later in the template draw on top, so they win where bands overlap.
  const underPointer = candidates.filter((item) => item.distance === 0).at(-1)
  if (underPointer) return underPointer

  // Between nested rings: one band lies inside the pointer and another outside it.
  const below = nearestCandidate(candidates.filter((item) => item.isBeyond))
  const above = nearestCandidate(candidates.filter((item) => !item.isBeyond))
  if (!below || !above) return undefined

  // The ring the pointer came from keeps the tooltip until the pointer reaches the other one, so it doesn't
  // flicker midway.
  const previous = [below, above].find((item) => item.seriesId === activeSeriesId)
  if (previous) return previous

  return below.distance <= above.distance ? below : above
}

const sectorDistance = (sector: PieSector, angle: number) => {
  if (angleInSweep(angle, sector)) return 0

  return Math.min(angleDistance(angle, sector.startAngle), angleDistance(angle, sector.endAngle))
}

/** The slice with the nearest angle, so the tooltip stays up across padding gaps. */
const nearestSector = (sectors: PieSector[], angle: number) => {
  let hit: PieSector | undefined
  let best = Infinity

  for (const sector of sectors) {
    if (sector.startAngle === sector.endAngle) continue

    const distance = sectorDistance(sector, angle)

    // `<=`: overlapping slices (negative padding) resolve to the later one, which is drawn on top.
    if (distance <= best) {
      best = distance
      hit = sector
    }
  }

  return hit
}

/**
 * Slice under a point. Inside a pie's ring band, or in the space between two nested rings, the slice with
 * the nearest angle wins, so the tooltip stays up across padding gaps. The hole and the outside return `null`.
 */
export const hitTestPies = (
  point: ChartPoint,
  input: PieHitTestInput,
): { index: number; seriesId: string; coordinate: ChartPoint } | null => {
  const candidates = input.pies.flatMap((pie) => toCandidate(pie, point) ?? [])
  const pie = pickPie(candidates, input.activeSeriesId)
  if (!pie) return null

  const hit = nearestSector(pie.sectors, pie.angle)
  if (!hit) return null

  return { index: hit.index, seriesId: pie.seriesId, coordinate: hit.tooltipPosition }
}
