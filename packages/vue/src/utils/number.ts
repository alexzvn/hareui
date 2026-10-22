function roundToStepPrecision(value: number, step: number) {
  const pointIndex = step.toString().indexOf('.')
  const precision = pointIndex >= 0 ? step.toString().length - pointIndex : 0
  return precision > 0 ? Math.round(value * 10 ** precision) / 10 ** precision : value
}

/** react-stately's (and Reka's internal) `snapValueToStep`; reka-ui doesn't export it. */
export function snapValueToStep(value: number, min: number | undefined, max: number | undefined, step: number) {
  const lo = Number(min)
  const hi = Number(max)
  const remainder = (value - (Number.isNaN(lo) ? 0 : lo)) % step
  let snapped = roundToStepPrecision(Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder, step)
  if (!Number.isNaN(lo)) {
    if (snapped < lo)
      snapped = lo
    else if (!Number.isNaN(hi) && snapped > hi)
      snapped = lo + Math.floor(roundToStepPrecision((hi - lo) / step, step)) * step
  }
  else if (!Number.isNaN(hi) && snapped > hi) {
    snapped = Math.floor(roundToStepPrecision(hi / step, step)) * step
  }
  return roundToStepPrecision(snapped, step)
}

/**
 * As in react-stately's useNumberFieldState: clamps a value into `min`/`max`, and snaps it to `step`
 * (relative to `min`) when a step is given. Empty values (`null`, `undefined`, `NaN`) pass through.
 */
export function snapNumber<T extends number | null | undefined>(value: T, min: number | undefined, max: number | undefined, step: number | undefined): T {
  if (value == null || Number.isNaN(value))
    return value
  if (step === undefined)
    return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value)) as T
  return snapValueToStep(value, min, max, step) as T
}
