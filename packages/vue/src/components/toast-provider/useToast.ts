import type { VNodeChild } from 'vue'

import type { ToastAction, ToastContentValue } from './toastQueue'
import { ToastQueue } from './toastQueue'

const DEFAULT_TOAST_TIMEOUT = 4000

/** Options for a toast shown with `toast()` and its variant helpers. */
export type ToastOptions = {
  /** Secondary text rendered below the title. */
  description?: VNodeChild
  /** `null` hides the indicator. */
  indicator?: VNodeChild | null
  /** @defaultValue 'default' */
  variant?: ToastContentValue['variant']
  action?: ToastAction
  /** Shows a spinner in place of the indicator. */
  isLoading?: boolean
  /**
   * Auto-dismiss timeout in milliseconds; 0 keeps the toast open.
   * @defaultValue 4000
   */
  timeout?: number
  /** Called when the toast is dismissed, as its exit animation starts. */
  onClose?: () => void
}

/** Messages for each phase of `toast.promise()`. */
export type ToastPromiseOptions<T = unknown> = {
  /** Title shown while the promise is pending. */
  loading: VNodeChild
  /** Title shown when the promise resolves; a function receives the resolved value. */
  success: ((data: T) => VNodeChild) | VNodeChild
  /** Title shown when the promise rejects; a function receives the rejection error. */
  error: ((error: Error) => VNodeChild) | VNodeChild
}

/**
 * The `toast` function: call it to show a toast, or use its methods for variants,
 * updates, promise tracking and queue control.
 */
export type ToastFunction = {
  /** Shows a toast; returns its key. */
  (message: VNodeChild, options?: ToastOptions): string
  /** Shows a `success` variant toast. */
  success: (message: VNodeChild, options?: Omit<ToastOptions, 'variant'>) => string
  /** Shows a `danger` variant toast. */
  danger: (message: VNodeChild, options?: Omit<ToastOptions, 'variant'>) => string
  /** Shows an `accent` variant toast. */
  info: (message: VNodeChild, options?: Omit<ToastOptions, 'variant'>) => string
  /** Shows a `warning` variant toast. */
  warning: (message: VNodeChild, options?: Omit<ToastOptions, 'variant'>) => string
  /**
   * Updates a toast in place (same key, same stack position); falls back to
   * a new toast when the id no longer exists. Omitting `timeout` keeps the
   * existing countdown; omitting `onClose` keeps the existing handler.
   */
  // oxlint-disable-next-line eslint/max-params -- mirrors `toast(message, options)` with the target id in front; folding message into options would make the two calls differ
  update: (id: string, message: VNodeChild, options?: ToastOptions) => string
  /**
   * Shows a loading toast that settles in place when the promise resolves or
   * rejects; the auto-dismiss countdown starts at that point.
   */
  promise: <T>(promise: Promise<T> | (() => Promise<T>), options: ToastPromiseOptions<T>) => string
  /** Closes a toast by its key. */
  close: (key: string) => void
  /** Closes every toast; each animates out and fires its `onClose`. */
  clear: () => void
  /** Pauses every toast's auto-dismiss timer. */
  pauseAll: () => void
  /** Resumes every toast's auto-dismiss timer. */
  resumeAll: () => void
  /** The underlying queue instance. */
  getQueue: () => ToastQueue<ToastContentValue>
}

const createToastFunction = (queue: ToastQueue<ToastContentValue>): ToastFunction => {
  const createContent = (message: VNodeChild, options?: ToastOptions): ToastContentValue => ({
    title: message,
    description: options?.description,
    indicator: options?.indicator,
    variant: options?.variant || 'default',
    action: options?.action,
    isLoading: options?.isLoading,
  })

  const createAddOptions = (options?: ToastOptions) => ({
    timeout: options?.timeout ?? DEFAULT_TOAST_TIMEOUT,
    onClose: options?.onClose,
  })

  // update() distinguishes an absent key from an explicit undefined: it keeps the
  // current countdown and the current onClose for anything the caller left out.
  const createUpdateOptions = (options?: ToastOptions) => ({
    ...(options && 'timeout' in options ? { timeout: options.timeout } : null),
    ...(options && 'onClose' in options ? { onClose: options.onClose } : null),
  })

  const toastFn = ((message: VNodeChild, options?: ToastOptions): string => {
    return queue.add(createContent(message, options), createAddOptions(options))
  }) as ToastFunction

  toastFn.success = (message, options) => toastFn(message, { ...options, variant: 'success' })
  toastFn.danger = (message, options) => toastFn(message, { ...options, variant: 'danger' })

  // Maps to the accent variant.
  toastFn.info = (message, options) => toastFn(message, { ...options, variant: 'accent' })
  toastFn.warning = (message, options) => toastFn(message, { ...options, variant: 'warning' })

  // oxlint-disable-next-line eslint/max-params -- mirrors `toast(message, options)` with the target id in front; folding message into options would make the two calls differ
  toastFn.update = (id, message, options) => {
    const content = createContent(message, options)
    if (queue.update(id, content, createUpdateOptions(options))) return id

    // A brand new toast has nothing to inherit, so it resolves the defaults instead.
    return queue.add(content, createAddOptions(options))
  }

  toastFn.promise = (<T>(
    promise: Promise<T> | (() => Promise<T>),
    options: ToastPromiseOptions<T>,
  ): string => {
    const promiseFn = typeof promise === 'function' ? promise() : promise
    const loadingId = queue.add(createContent(options.loading, { isLoading: true }), { timeout: 0 })

    promiseFn
      .then((data) => {
        const message =
          typeof options.success === 'function'
            ? (options.success as (data: T) => VNodeChild)(data)
            : options.success

        toastFn.update(loadingId, message, {
          isLoading: false,
          timeout: DEFAULT_TOAST_TIMEOUT,
          variant: 'success',
        })
      })
      .catch((error: Error) => {
        const message =
          typeof options.error === 'function'
            ? (options.error as (error: Error) => VNodeChild)(error)
            : options.error

        toastFn.update(loadingId, message, {
          isLoading: false,
          timeout: DEFAULT_TOAST_TIMEOUT,
          variant: 'danger',
        })
      })

    return loadingId
  }) as ToastFunction['promise']

  toastFn.close = (key) => queue.close(key)
  toastFn.clear = () => queue.clear()
  toastFn.pauseAll = () => queue.pauseAll()
  toastFn.resumeAll = () => queue.resumeAll()
  toastFn.getQueue = () => queue

  return toastFn
}

/** The default queue used by every `ToastProvider` that doesn't set a `queue` prop. */
export const toastQueue = new ToastQueue<ToastContentValue>()

/**
 * Shows toasts on the default queue. Works anywhere, including outside
 * components: `import { toast } from '@hareui/vue'`.
 */
export const toast: ToastFunction = createToastFunction(toastQueue)

/**
 * Returns the `toast` function. Provided as a composable for symmetry with
 * other Vue libraries; `toast` itself is also exported directly and is
 * equivalent, since toast state lives outside any component instance.
 */
export const useToast = (): ToastFunction => {
  return toast
}
