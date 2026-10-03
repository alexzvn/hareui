import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ToastProvider from '../src/components/ToastProvider.vue'
import { toast, toastQueue, useToast } from '../src/composables/useToast'

function mountProvider() {
  return mount(ToastProvider, { props: { portal: false } })
}

// Local stand-in for Promise.withResolvers, so the library's tsconfig `lib` doesn't need ES2024.
function withResolvers<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

function delay(ms: number): Promise<void> {
  const { promise, resolve } = withResolvers<void>()
  setTimeout(resolve, ms)
  return promise
}

describe('toast', () => {
  afterEach(() => {
    vi.useRealTimers()
    toastQueue.destroy()
  })

  it('toast() shows a toast with title and description', async () => {
    const wrapper = mountProvider()
    toast('Simple message', { description: 'Extra detail' })
    await nextTick()

    expect(wrapper.find('[data-slot=toast-title]').text()).toBe('Simple message')
    expect(wrapper.find('[data-slot=toast-description]').text()).toBe('Extra detail')

    wrapper.unmount()
  })

  it('useToast() returns the same singleton as the `toast` export', () => {
    expect(useToast()).toBe(toast)
  })

  it('close removes the toast after its exit animation', async () => {
    toastQueue.destroy()
    const wrapper = mountProvider()

    const key = toast('Dismiss me')
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').exists()).toBe(true)

    toast.close(key)
    // exitDuration defaults to 300ms; the toast stays mounted (exiting) until it elapses.
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').attributes('data-exiting')).toBe('true')
    await delay(320)
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('auto-dismisses after its timeout elapses', async () => {
    vi.useFakeTimers()
    const wrapper = mountProvider()

    toast('Times out', { timeout: 1000 })
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').exists()).toBe(true)

    vi.advanceTimersByTime(999)
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').attributes('data-exiting')).toBeUndefined()

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').attributes('data-exiting')).toBe('true')

    wrapper.unmount()
  })

  it('timeout: 0 keeps the toast open indefinitely', async () => {
    vi.useFakeTimers()
    const wrapper = mountProvider()

    toast('Stays open', { timeout: 0 })
    await nextTick()

    vi.advanceTimersByTime(60_000)
    await nextTick()
    expect(wrapper.find('[data-slot=toast]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=toast]').attributes('data-exiting')).toBeUndefined()

    wrapper.unmount()
  })

  it('promise() shows a loading toast then transitions to success', async () => {
    const wrapper = mountProvider()

    const { promise: pending, resolve: resolvePromise } = withResolvers<string>()
    toast.promise(pending, {
      loading: 'Loading…',
      success: data => `Done: ${data}`,
      error: 'Failed',
    })
    await nextTick()
    expect(wrapper.find('[data-slot=toast-title]').text()).toBe('Loading…')
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(true)

    resolvePromise('ok')
    await pending
    await nextTick()
    expect(wrapper.find('[data-slot=toast-title]').text()).toBe('Done: ok')
    expect(wrapper.find('[data-slot=spinner]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('promise() transitions to error on rejection', async () => {
    const wrapper = mountProvider()

    const { promise: pending, reject: rejectPromise } = withResolvers<string>()

    toast.promise(pending, {
      loading: 'Loading…',
      success: 'Done',
      error: error => `Failed: ${error.message}`,
    })
    await nextTick()

    rejectPromise(new Error('boom'))
    await pending.catch(() => {})
    await nextTick()
    expect(wrapper.find('[data-slot=toast-title]').text()).toBe('Failed: boom')

    wrapper.unmount()
  })
})
