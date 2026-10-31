type NumberFormatterInput = {
  /** BCP 47 locale passed to `Intl.NumberFormat`. */
  locale: string
  /** Options passed to `Intl.NumberFormat`. */
  options: Intl.NumberFormatOptions
}

/**
 * Creates a `format(value, { locale, options })` that keeps its `Intl.NumberFormat` while the locale and options
 * are unchanged: a displayed number can tick every frame, and building a formatter costs far more than formatting.
 */
export const createNumberFormatter = () => {
  let formatter: Intl.NumberFormat | undefined
  let formatterKey: string | undefined

  return (value: number, { locale, options }: NumberFormatterInput): string => {
    const key = `${locale}|${JSON.stringify(options)}`
    if (!formatter || key !== formatterKey) {
      formatter = new Intl.NumberFormat(locale, options)
      formatterKey = key
    }

    return formatter.format(value)
  }
}
