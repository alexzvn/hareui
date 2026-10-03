import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ToastProvider from '../src/components/toast-provider/ToastProvider.vue'
import { toast, toastQueue, useToast } from '../src/components/toast-provider/useToast'

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

  describe('keyboard focus management', () => {
    let mounted: ReturnType<typeof mount> | undefined
    let trigger: HTMLButtonElement | undefined
    const toastEls = () => [...document.querySelectorAll<HTMLElement>('[data-slot=toast]')]

    afterEach(() => {
      mounted?.unmount()
      mounted = undefined
      trigger?.remove()
      trigger = undefined
    })

    it('F6 moves focus into the toast region', async () => {
      // behaviour-final-check Q1
      trigger = document.createElement('button')
      document.body.appendChild(trigger)
      mounted = mount(ToastProvider, { props: { portal: false }, attachTo: document.body })
      toast('Persistent', { timeout: 0 })
      await nextTick()
      trigger.focus()
      expect(document.activeElement).toBe(trigger)

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'F6', code: 'F6', bubbles: true, cancelable: true }))
      await nextTick()

      const region = document.querySelector<HTMLElement>('[data-slot=toast-region]')!
      expect(region.contains(document.activeElement)).toBe(true)
    })

    it('dismissing the focused toast with its close button moves focus to the remaining toast', async () => {
      // behaviour-final-check Q2
      mounted = mount(ToastProvider, { props: { portal: false }, attachTo: document.body })
      toast('First', { timeout: 0 })
      toast('Second', { timeout: 0 })
      await nextTick()
      expect(toastEls()).toHaveLength(2)

      const closing = toastEls().find(el => el.textContent?.includes('First'))!
      const remaining = toastEls().find(el => el.textContent?.includes('Second'))!
      const close = closing.querySelector<HTMLButtonElement>('[data-slot=toast-close]')!
      close.focus()
      expect(document.activeElement).toBe(close)
      // Enter / Space on a focused button activates it as a click
      close.click()
      await nextTick()
      await nextTick()

      expect(closing.getAttribute('data-exiting')).toBe('true')
      expect(remaining.contains(document.activeElement)).toBe(true)
    })
  })
})
