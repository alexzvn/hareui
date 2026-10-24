/** Inclusive numeric limits; an absent bound doesn't limit. */
export type NumberBounds = { min?: number | undefined; max?: number | undefined }

/** `value` limited to `[min, max]`; an absent bound doesn't limit. */
export const clamp = (value: number, { min = -Infinity, max = Infinity }: NumberBounds = {}) => {
  return Math.min(Math.max(value, min), max)
}

/** Digits after the decimal point, also in exponent notation (`1e-7` → 7, `1.5e-7` → 8). */
const decimalPlaces = (value: number) => {
  const [mantissa = '', exponent = '0'] = String(value).toLowerCase().split('e')
  const point = mantissa.indexOf('.')

  return Math.max(0, (point >= 0 ? mantissa.length - point - 1 : 0) - Number(exponent))
}

// react-stately's `roundToStepPrecision` keeps one digit more than the step has; kept for identical results.
const precisionOf = (value: number) => {
  const decimals = decimalPlaces(value)
  return decimals > 0 ? decimals + 1 : 0
}

/** Rounds away floating-point noise (`0.1 + 0.2`); a precision of 0 leaves the value untouched. */
const roundToPrecision = (value: number, precision: number) => {
  if (precision <= 0) return value
  const pow = 10 ** precision

  return Math.round(value * pow) / pow
}

type SnapLimits = { lo: number; hi: number; step: number; stepPrecision: number }

// Above `max` the value takes the last step at or below `max`; below `min` it takes `min`.
const limitSnapped = (snapped: number, { lo, hi, step, stepPrecision }: SnapLimits) => {
  const isAboveMax = !Number.isNaN(hi) && snapped > hi
  if (Number.isNaN(lo)) {
    return isAboveMax ? Math.floor(roundToPrecision(hi / step, stepPrecision)) * step : snapped
  }

  if (snapped < lo) return lo
  if (!isAboveMax) return snapped

  return lo + Math.floor(roundToPrecision((hi - lo) / step, stepPrecision)) * step
}

/**
 * react-stately's (and Reka's internal) `snapValueToStep`; reka-ui doesn't export it. Snaps to the nearest
 * `min + k·step` (halves round away from `min`), then limits to `[min, max]`: above `max` it takes the last step
 * at or below `max`. An absent `min` snaps relative to 0.
 * Unlike react-stately, the result keeps `min`'s decimals too when it has more than `step` (`min` 0.05, `step` 0.1).
 */
export const snapValueToStep = (
  value: number,
  { min, max, step }: NumberBounds & { step: number },
) => {
  const lo = Number(min)
  const hi = Number(max)
  const stepPrecision = precisionOf(step)
  const precision = Number.isNaN(lo) ? stepPrecision : Math.max(stepPrecision, precisionOf(lo))
  const remainder = (value - (Number.isNaN(lo) ? 0 : lo)) % step
  const snapped = roundToPrecision(
    Math.abs(remainder) * 2 >= step
      ? value + Math.sign(remainder) * (step - Math.abs(remainder))
      : value - remainder,
    precision,
  )

  return roundToPrecision(limitSnapped(snapped, { lo, hi, step, stepPrecision }), precision)
}

/**
 * As in react-stately's useNumberFieldState: clamps a value into `min`/`max`, and snaps it to `step`
 * (relative to `min`) when a step is given. Empty values (`null`, `undefined`, `NaN`) pass through.
 */
export const snapNumber = <T extends number | null | undefined>(
  value: T,
  { min, max, step }: NumberBounds & { step?: number },
): T => {
  if (value == null || Number.isNaN(value)) return value
  if (step === undefined) return clamp(value, { min, max }) as T

  return snapValueToStep(value, { min, max, step }) as T
}
