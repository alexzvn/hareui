/**
 * A length prop in px (`12`, `'12'`) or as a percentage of `total` (`'80%'`). Empty input (`undefined`, `null`,
 * `''`) and strings that don't start with a number give `fallback`.
 *
 * Non-finite input (`NaN`/`Infinity`, or `'abc%'`) gives `fallback` too, unless `keepNonFinite` is set: then it
 * comes back as is (`'abc%'` as `NaN`). Polar layout falls back; cartesian bar layout keeps it (its sizes and gaps
 * have always passed such values through).
 */
export function percentValue(
  value: number | string | undefined | null,
  total: number,
  fallback = 0,
  options: { keepNonFinite?: boolean } = {},
): number {
  if (value === undefined || value === null || value === '') return fallback
  if (typeof value === 'number')
    return Number.isFinite(value) || options.keepNonFinite ? value : fallback
  const text = value.trim()
  const number = Number.parseFloat(text)
  if (text.endsWith('%'))
    return Number.isFinite(number) || options.keepNonFinite ? (number / 100) * total : fallback
  return Number.isFinite(number) ? number : fallback
}
