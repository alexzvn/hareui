/** `value` limited to `[min, max]`; an absent bound doesn't limit. */
export function clamp(value: number, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max)
}

/** Digits after the decimal point, also in exponent notation (`1e-7` → 7, `1.5e-7` → 8). */
function decimalPlaces(value: number) {
  const [mantissa = '', exponent = '0'] = String(value).toLowerCase().split('e')
  const point = mantissa.indexOf('.')
  return Math.max(0, (point >= 0 ? mantissa.length - point - 1 : 0) - Number(exponent))
}

// react-stately's `roundToStepPrecision` keeps one digit more than the step has; kept for identical results.
function precisionOf(value: number) {
  const decimals = decimalPlaces(value)
  return decimals > 0 ? decimals + 1 : 0
}

/** Rounds away floating-point noise (`0.1 + 0.2`); a precision of 0 leaves the value untouched. */
function roundToPrecision(value: number, precision: number) {
  if (precision <= 0) return value
  const pow = 10 ** precision
  return Math.round(value * pow) / pow
}

/**
 * react-stately's (and Reka's internal) `snapValueToStep`; reka-ui doesn't export it. Snaps to the nearest
 * `min + k·step` (halves round away from `min`), then limits to `[min, max]`: above `max` it takes the last step
 * at or below `max`. An absent `min` snaps relative to 0.
 * Unlike react-stately, the result keeps `min`'s decimals too when it has more than `step` (`min` 0.05, `step` 0.1).
 */
export function snapValueToStep(
  value: number,
  min: number | undefined,
  max: number | undefined,
  step: number,
) {
  const lo = Number(min)
  const hi = Number(max)
  const stepPrecision = precisionOf(step)
  const precision = Number.isNaN(lo) ? stepPrecision : Math.max(stepPrecision, precisionOf(lo))
  const remainder = (value - (Number.isNaN(lo) ? 0 : lo)) % step
  let snapped = roundToPrecision(
    Math.abs(remainder) * 2 >= step
      ? value + Math.sign(remainder) * (step - Math.abs(remainder))
      : value - remainder,
    precision,
  )
  if (!Number.isNaN(lo)) {
    if (snapped < lo) snapped = lo
    else if (!Number.isNaN(hi) && snapped > hi)
      snapped = lo + Math.floor(roundToPrecision((hi - lo) / step, stepPrecision)) * step
  } else if (!Number.isNaN(hi) && snapped > hi) {
    snapped = Math.floor(roundToPrecision(hi / step, stepPrecision)) * step
  }
  return roundToPrecision(snapped, precision)
}

/**
 * As in react-stately's useNumberFieldState: clamps a value into `min`/`max`, and snaps it to `step`
 * (relative to `min`) when a step is given. Empty values (`null`, `undefined`, `NaN`) pass through.
 */
export function snapNumber<T extends number | null | undefined>(
  value: T,
  min: number | undefined,
  max: number | undefined,
  step: number | undefined,
): T {
  if (value == null || Number.isNaN(value)) return value
  if (step === undefined) return clamp(value, min, max) as T
  return snapValueToStep(value, min, max, step) as T
}
