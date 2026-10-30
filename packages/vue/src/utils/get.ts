/** Reads a field by name or dotted path (`meta.title`); a missing step gives `undefined`. */
export const get = (source: unknown, path: string): unknown => {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object') return undefined

    return (value as Record<string, unknown>)[key]
  }, source)
}
