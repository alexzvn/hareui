type PercentOptions = {
  /** What a percentage is relative to. */
  total: number
  /** Result for empty or unparseable input. @defaultValue 0 */
  fallback?: number
  /** Return non-finite input as is instead of `fallback`. @defaultValue false */
  keepNonFinite?: boolean
}

/**
 * A length prop in px (`12`, `'12'`) or as a percentage of `total` (`'80%'`). Empty input (`undefined`, `null`,
 * `''`) and strings that don't start with a number give `fallback`.
 *
 * Non-finite input (`NaN`/`Infinity`, or `'abc%'`) gives `fallback` too, unless `keepNonFinite` is set: then it
 * comes back as is (`'abc%'` as `NaN`). Polar layout falls back; cartesian bar layout keeps it (its sizes and gaps
 * have always passed such values through).
 */
export const percentValue = (
  value: number | string | undefined | null,
  { total, fallback = 0, keepNonFinite = false }: PercentOptions,
): number => {
  if (value === undefined || value === null || value === '') return fallback

  if (typeof value === 'number') return Number.isFinite(value) || keepNonFinite ? value : fallback

  const text = value.trim()
  const number = Number.parseFloat(text)
  if (text.endsWith('%'))
    return Number.isFinite(number) || keepNonFinite ? (number / 100) * total : fallback

  return Number.isFinite(number) ? number : fallback
}
