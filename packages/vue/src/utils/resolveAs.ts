/**
 * Resolves an `as` prop that is either one element/component for the root, or an object naming the element of
 * each part (`{ root: 'section', title: 'h2' }`), against the part defaults.
 */
export function resolveAs<T extends { root: unknown }>(as: unknown, defaults: T): T {
  if (as === undefined || as === null)
    return defaults
  // A string, a functional component or a component definition (`render`/`setup`) targets the root only.
  if (typeof as !== 'object' || 'render' in as || 'setup' in as)
    return { ...defaults, root: as }
  return { ...defaults, ...as }
}
