/** Display text for any value: `null` and `undefined` give `''`, anything else goes through `String`. */
export const toText = (value: unknown): string =>
  value === undefined || value === null ? '' : String(value)
