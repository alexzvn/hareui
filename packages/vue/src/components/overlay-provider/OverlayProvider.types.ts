import type { Component } from 'vue'

/** The props of a component: the `$props` of an SFC, or the first argument of a functional component. */
type ComponentProps<T> = T extends new (...args: never[]) => { $props: infer P }
  ? NonNullable<P>
  : T extends (props: infer P, ...args: never[]) => unknown
    ? P
    : Record<string, unknown>

/** The typed `emit` of a component. */
type ComponentEmit<T> = T extends new (...args: never[]) => { $emit: infer E }
  ? NonNullable<E>
  : T extends (...args: [props: never, context: { emit: infer E }, ...rest: never[]]) => unknown
    ? NonNullable<E>
    : unknown

type CloseEventArgTypeSimple<T> = T extends (
  ...args: [event: 'close', value: infer Arg, ...rest: never[]]
) => void
  ? Arg
  : never

/**
 * Conditional types infer only from the last overload of an overloaded function, and a component's `emit` is one
 * overload per event. Matching against a list of overloads lets the `close` signature be found wherever it sits.
 * @see https://github.com/microsoft/TypeScript/issues/32164
 */
type CloseEventArgTypeComplex<T> = T extends {
  (event: 'close', value: infer Arg, ...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
  (...args: never[]): void
}
  ? Arg
  : never

/**
 * The value an overlay's `open()` promise resolves with: the payload of the component's `close` event, or `undefined`
 * when the overlay is dismissed (Escape, outside press, `closeAll()`) or closed without a value.
 */
export type OverlayResult<T extends Component> =
  | CloseEventArgTypeSimple<ComponentEmit<T>>
  | CloseEventArgTypeComplex<ComponentEmit<T>>
  | undefined

/** Options of `useOverlay().create()`. */
export type OverlayOptions<OverlayProps = Record<string, unknown>> = {
  /**
   * Opens the overlay as soon as it is created.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /** Props passed to the rendered component. `open(props)` merges its own props over these. */
  props?: OverlayProps
  /**
   * Removes the overlay from `overlays` once it has closed and finished its exit animation. Otherwise it stays
   * registered, ready for the next `open()`.
   * @defaultValue false
   */
  destroyOnClose?: boolean
}

/** An overlay registered with `useOverlay().create()`, as listed in `overlays` and rendered by `OverlayProvider`. */
export type Overlay = {
  /** The overlay's identifier, accepted by the id-based methods of `useOverlay()`. */
  id: symbol
  /** The rendered component. */
  component: Component
  /** Whether the overlay is open; bound to the component's `open` prop. */
  isOpen: boolean
  /** Whether `OverlayProvider` renders the component: from `open()` until the exit animation after closing ends. */
  isMounted: boolean
  /** Whether the overlay is removed from `overlays` once it unmounts. */
  destroyOnClose: boolean
  /** The props given to `create()`; every `open()` starts from these. */
  originalProps: Record<string, unknown>
  /** The props the component is currently rendered with. */
  props: Record<string, unknown>
  /** Resolves the promises returned by `open()` since the last close. */
  resolvers: ((value: unknown) => void)[]
}

/**
 * The promise returned by `open()`: it resolves with the overlay's close value. Its `result` field holds the same
 * promise, for code that destructures the return value.
 */
export type OpenedOverlay<Result = unknown> = Promise<Result> & {
  /** The overlay's identifier. */
  id: symbol
  /** The promise itself, resolving with the overlay's close value. */
  result: Promise<Result>
}

/** The handle returned by `useOverlay().create()`. */
export type OverlayInstance<T extends Component> = {
  /** The overlay's identifier, accepted by the id-based methods of `useOverlay()`. */
  readonly id: symbol
  /** Whether the overlay is open. */
  readonly isOpen: boolean
  /** Whether the component is rendered: from `open()` until the exit animation after closing ends. */
  readonly isMounted: boolean
  /**
   * Opens the overlay. `props` are merged over the props given to `create()`. Resolves with the value of the
   * component's `close` event, or `undefined` when the overlay is dismissed.
   */
  open: (props?: Partial<ComponentProps<T>>) => OpenedOverlay<OverlayResult<T>>
  /** Closes the overlay, resolving every pending `open()` promise with `value`. */
  close: (value?: OverlayResult<T>) => void
  /** Merges `props` into the props the component is currently rendered with. */
  patch: (props: Partial<ComponentProps<T>>) => void
  /** Stops rendering the component at once, without waiting for an exit animation. */
  unmount: () => void
}

/** What `useOverlay()` returns: the shared overlay registry and its id-based methods. */
export type UseOverlayReturn = {
  /** Every overlay created and not yet destroyed. */
  overlays: Overlay[]
  /** Registers `component` as an overlay and returns its handle. */
  create: <T extends Component>(
    component: T,
    options?: OverlayOptions<Partial<ComponentProps<T>>>,
  ) => OverlayInstance<T>
  /** Opens the overlay `id`, with `props` merged over the props given to `create()`. */
  open: (id: symbol, props?: Record<string, unknown>) => OpenedOverlay
  /** Closes the overlay `id`, resolving its pending `open()` promises with `value`. */
  close: (id: symbol, value?: unknown) => void
  /** Closes every overlay; their pending `open()` promises resolve with `undefined`. */
  closeAll: () => void
  /** Merges `props` into the props the overlay `id` is currently rendered with. */
  patch: (id: symbol, props: Record<string, unknown>) => void
  /** Stops rendering the overlay `id`, and removes it from `overlays` when created with `destroyOnClose`. */
  unmount: (id: symbol) => void
  /** Whether the overlay `id` is open. */
  isOpen: (id: symbol) => boolean
}
