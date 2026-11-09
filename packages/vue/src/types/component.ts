/** The props of a component: the `$props` of an SFC, or the first argument of a functional or generic component. */
export type ComponentProps<T> = T extends new (...args: never[]) => { $props: infer P }
  ? NonNullable<P>
  : T extends (props: infer P, ...args: never[]) => unknown
    ? P
    : Record<string, unknown>
