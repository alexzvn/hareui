import type { VNodeChild } from 'vue'
import { markRaw, reactive } from 'vue'

import type { ClassValue } from '@/utils/tv'

// How long a closing toast stays mounted for its exit animation, in milliseconds.
const DEFAULT_EXIT_DURATION = 300

// Auto-dismiss timeout in milliseconds.
const DEFAULT_TOAST_TIMEOUT = 4000

/** Monotonic clock: Date.now() can jump on wall-clock adjustments. */
const now: () => number =
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? () => performance.now()
    : () => Date.now()

const prefersReducedMotion = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  )
}

let keySeq = 0
const generateKey = (): string => {
  keySeq += 1
  return `toast-${keySeq}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * A timer that can be paused and resumed without losing its remaining delay,
 * used for toast auto-dismiss countdowns (paused while the stack is hovered,
 * focused, or the page is hidden).
 */
class ManagedToastTimer {
  private timerId: ReturnType<typeof setTimeout> | null = null
  private startTime: number | null = null
  private remaining: number
  private readonly callback: () => void

  constructor(callback: () => void, delay: number) {
    this.remaining = delay
    this.callback = callback
  }

  reset(delay: number): void {
    this.pause()
    this.remaining = delay
    this.resume()
  }

  pause(): void {
    if (this.timerId == null) return
    clearTimeout(this.timerId)
    this.timerId = null
    this.remaining -= now() - (this.startTime ?? now())
  }

  resume(): void {
    if (this.remaining <= 0 || this.timerId != null) return
    this.startTime = now()

    this.timerId = setTimeout(() => {
      this.timerId = null
      this.remaining = 0
      this.callback()
    }, this.remaining)
  }
}

export type QueuedToast<T> = {
  /** Unique key identifying this toast in the queue. */
  key: string
  /** The toast's content. */
  content: T
  /** Auto-dismiss timeout in milliseconds; 0 means persistent. */
  timeout?: number
  /** Called when the toast is dismissed, as its exit animation starts. */
  onClose?: () => void
  /** @internal */
  timer?: ManagedToastTimer
}

export type ToastQueueOptions = {
  /**
   * How long a closing toast stays mounted for its exit animation, in
   * milliseconds. Set to 0 to remove toasts immediately.
   * @defaultValue 300
   */
  exitDuration?: number
  /**
   * The maximum number of toasts to display at a time (visual only).
   * @defaultValue 3
   */
  maxVisibleToasts?: number
}

/**
 * Manages toast state outside any component so toasts can be triggered from
 * anywhere in the app. Pass a custom instance to `ToastProvider`'s `queue`
 * prop to run an independent stack (see the Custom Queues example); otherwise
 * every `ToastProvider` shares the module-level default queue used by `toast()`.
 */
export class ToastQueue<T extends object = ToastContentValue> {
  private readonly _visibleToasts: QueuedToast<T>[] = reactive([])
  private readonly _exitingKeys: Set<string> = reactive(new Set())
  private readonly exitTimers = new Map<string, ReturnType<typeof setTimeout>>()
  private readonly suspensions = new Set<string>()
  private readonly exitDuration: number
  readonly maxVisibleToasts?: number

  constructor(options?: ToastQueueOptions) {
    this.exitDuration = options?.exitDuration ?? DEFAULT_EXIT_DURATION
    this.maxVisibleToasts = options?.maxVisibleToasts
  }

  /** The currently rendered toasts, newest first. */
  get visibleToasts(): QueuedToast<T>[] {
    return this._visibleToasts
  }

  /** Keys of toasts currently playing their exit animation. */
  get exitingKeys(): Set<string> {
    return this._exitingKeys
  }

  /** Adds a toast and returns its key; explicit timeout 0 keeps it open. */
  add(content: T, options?: { timeout?: number; onClose?: () => void }): string {
    const key = generateKey()
    const timeout = options?.timeout ?? DEFAULT_TOAST_TIMEOUT
    const toast: QueuedToast<T> = { key, content, timeout, onClose: options?.onClose }
    if (timeout > 0) {
      const timer = new ManagedToastTimer(() => this.close(key), timeout)
      toast.timer = markRaw(timer)
      if (this.suspensions.size === 0) timer.resume()
    }

    this._visibleToasts.unshift(toast)

    return key
  }

  /**
   * Updates a toast in place, preserving its stack position. `timeout`
   * restarts the countdown (0 keeps it open); omit it to keep the current
   * countdown. Returns `false` if the toast no longer exists or is exiting.
   */
  update(key: string, content: T, options?: { onClose?: () => void; timeout?: number }): boolean {
    if (this._exitingKeys.has(key)) return false
    const toast = this._visibleToasts.find((t) => t.key === key)
    if (!toast) return false

    toast.content = content
    if (options && 'onClose' in options) toast.onClose = options.onClose

    if (options?.timeout !== undefined) {
      toast.timer?.pause()
      toast.timeout = options.timeout

      if (options.timeout > 0) {
        const timer = new ManagedToastTimer(() => this.close(key), options.timeout)
        toast.timer = markRaw(timer)
        if (this.suspensions.size === 0) timer.resume()
      } else {
        toast.timer = undefined
      }
    }

    return true
  }

  /** Closes a toast by its key; it animates out and fires its `onClose`. */
  close(key: string): void {
    if (this._exitingKeys.has(key)) return
    const index = this._visibleToasts.findIndex((t) => t.key === key)
    if (index === -1) return
    const toast = this._visibleToasts[index]!
    const onClose = toast.onClose
    const canAnimate = this.exitDuration > 0 && !prefersReducedMotion()

    toast.timer?.pause()

    if (!canAnimate) {
      this._visibleToasts.splice(index, 1)
      onClose?.()

      return
    }

    toast.onClose = undefined
    this._exitingKeys.add(key)

    this.exitTimers.set(
      key,
      setTimeout(() => {
        this.exitTimers.delete(key)
        this._exitingKeys.delete(key)
        const i = this._visibleToasts.findIndex((t) => t.key === key)
        if (i !== -1) this._visibleToasts.splice(i, 1)
      }, this.exitDuration),
    )

    onClose?.()
  }

  /** Closes all toasts; each animates out and fires its `onClose`. */
  clear(): void {
    for (const t of [...this._visibleToasts]) this.close(t.key)
  }

  /** Pauses every toast's auto-dismiss timer. */
  pauseAll(): void {
    this.suspendTimers('external')
  }

  /** Resumes every toast's auto-dismiss timer. */
  resumeAll(): void {
    this.resumeTimers('external')
  }

  /** @internal Sources form a set: timers pause once it becomes non-empty, resume once it empties. */
  suspendTimers(source: string): void {
    const wasEmpty = this.suspensions.size === 0
    this.suspensions.add(source)

    if (wasEmpty) {
      for (const t of this._visibleToasts) t.timer?.pause()
    }
  }

  /** @internal */
  resumeTimers(source: string): void {
    this.suspensions.delete(source)

    if (this.suspensions.size === 0) {
      for (const t of this._visibleToasts) t.timer?.resume()
    }
  }

  /** Releases pending timeouts and running timers, for HMR and test teardown. */
  destroy(): void {
    for (const timer of this.exitTimers.values()) clearTimeout(timer)
    this.exitTimers.clear()
    this._exitingKeys.clear()
    this.suspensions.clear()
    for (const t of this._visibleToasts) t.timer?.pause()
    this._visibleToasts.length = 0
  }
}

/* ------------------------------------------------------------------------------------------------
 * Toast content
 * --------------------------------------------------------------------------------------------- */

export type ToastContentValue = {
  /** `null` hides the indicator. */
  indicator?: VNodeChild | null
  title?: VNodeChild
  description?: VNodeChild
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  action?: ToastAction
  /** Shows a spinner in place of the indicator. */
  isLoading?: boolean
}

export type ToastAction = {
  /** The action button's label. */
  label: VNodeChild
  /** Called when the action button is clicked. */
  onClick?: (event: MouseEvent) => void
  /** @defaultValue 'secondary' */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline' | 'danger' | 'danger-soft'
  class?: ClassValue
}
