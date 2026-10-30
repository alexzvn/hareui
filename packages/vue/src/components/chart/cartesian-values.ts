import type { ChartAxisId } from './cartesian.types'

/** A datum value as a finite number; empty and non-numeric values give `null`. */
export const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null

  const number = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(number) ? number : null
}

/** Whether two axis ids name the same axis; an unset id means `0`. */
export const isSameAxisId = (a: ChartAxisId | undefined, b: ChartAxisId | undefined) =>
  String(a ?? 0) === String(b ?? 0)
