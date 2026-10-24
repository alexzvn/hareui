import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import ToastProvider from '@/components/toast-provider/ToastProvider.vue'
import { toast, toastQueue, useToast } from '@/components/toast-provider/useToast'

import { expectAccessible } from './a11y'

const mountProvider = () => {
  return mount(ToastProvider, { props: { portal: false } })
}

// Local stand-in for Promise.withResolvers, so the library's tsconfig `lib` doesn't need ES2024.
const withResolvers = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

const delay = (ms: number): Promise<void> => {
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

  it('forwards non-prop attributes to the region without an extraneous-attrs warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(ToastProvider, {
      props: { portal: false },
      attrs: { 'data-design-theme': 'kumo', id: 'toasts' },
    })

    toast('Scoped', { timeout: 0 })
    await nextTick()

    const region = wrapper.find('[data-slot=toast-region]')
    expect(region.attributes('data-design-theme')).toBe('kumo')
    expect(region.attributes('id')).toBe('toasts')
    expect(region.attributes('role')).toBe('region')
    expect(warn).not.toHaveBeenCalled()

    wrapper.unmount()
    warn.mockRestore()
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
      success: (data) => `Done: ${data}`,
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
      error: (error) => `Failed: ${error.message}`,
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

      trigger.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'F6', code: 'F6', bubbles: true, cancelable: true }),
      )

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

      const closing = toastEls().find((el) => el.textContent?.includes('First'))!
      const remaining = toastEls().find((el) => el.textContent?.includes('Second'))!
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

    it('closing the last focused toast returns focus to where it came from', async () => {
      trigger = document.createElement('button')
      document.body.appendChild(trigger)
      mounted = mount(ToastProvider, { props: { portal: false }, attachTo: document.body })
      toast('Only', { timeout: 0 })
      await nextTick()
      trigger.focus()
      const close = toastEls()[0]!.querySelector<HTMLButtonElement>('[data-slot=toast-close]')!
      close.focus()
      close.click()
      await nextTick()
      await nextTick()
      expect(document.activeElement).toBe(trigger)
    })

    it('labels the region with the toast count, like React Aria', async () => {
      // behaviour-final-check Q3
      mounted = mount(ToastProvider, { props: { portal: false }, attachTo: document.body })
      toast('One', { timeout: 0 })
      await nextTick()
      const region = () => document.querySelector<HTMLElement>('[data-slot=toast-region]')!
      expect(region().getAttribute('aria-label')).toBe('1 notification.')
      toast('Two', { timeout: 0 })
      await nextTick()
      expect(region().getAttribute('aria-label')).toBe('2 notifications.')
      await mounted.setProps({ ariaLabel: 'Alerts' })
      expect(region().getAttribute('aria-label')).toBe('Alerts')
    })
  })

  describe('accessibility', () => {
    let mounted: ReturnType<typeof mount> | undefined
    afterEach(() => {
      mounted?.unmount()
      mounted = undefined
      document.body.innerHTML = ''
    })

    type ToastSlotProps = {
      content: { title?: unknown; description?: unknown }
      close: () => void
      titleId: string
      descriptionId: string
    }

    const mountRegion = (
      props: Record<string, unknown> = {},
      slots: Record<string, (p: ToastSlotProps) => unknown> = {},
    ) => {
      mounted = mount(ToastProvider, {
        props: { portal: false, ...props },
        slots,
        attachTo: document.body,
      })

      return mounted
    }

    const toastEl = () => document.querySelector<HTMLElement>('[data-slot=toast]')!

    // The provider's root is a (possibly disabled) Teleport, so audit the region element itself.
    const region = () => document.querySelector<HTMLElement>('[data-slot=toast-region]')!

    const cases: Array<[string, () => void]> = [
      [
        'a title and description',
        () => toast('Saved', { description: 'Your changes are live.', timeout: 0 }),
      ],
      ['a title only', () => toast('Saved', { timeout: 0 })],
      [
        'a status variant',
        () => toast.danger('Upload failed', { description: 'Try again.', timeout: 0 }),
      ],
      [
        'an action button',
        () => toast('Message archived', { action: { label: 'Undo' }, timeout: 0 }),
      ],
      ['a loading indicator', () => toast('Uploading…', { isLoading: true, timeout: 0 })],
      [
        'more toasts than maxVisibleToasts',
        () => ['One', 'Two', 'Three', 'Four', 'Five'].forEach((t) => toast(t, { timeout: 0 })),
      ],
    ]

    it.each(cases)('has no axe violations with %s', async (_name, show) => {
      mountRegion()
      show()
      await nextTick()
      await nextTick()
      expect(toastEl()).not.toBeNull()
      await expectAccessible(region())
    })

    it('has no axe violations with a #toast slot that uses the title / description ids, which name and describe the toast', async () => {
      mountRegion(
        {},
        {
          toast: ({ content, close, titleId, descriptionId }) => [
            h('div', { role: 'alert', 'aria-atomic': 'true' }, [
              h('p', { id: titleId }, String(content.title)),
              h('p', { id: descriptionId }, String(content.description)),
            ]),
            h('button', { onClick: close }, 'Dismiss'),
          ],
        },
      )

      toast('Custom', { description: 'Rendered by the slot', timeout: 0 })
      await nextTick()
      await nextTick()
      await expectAccessible(region())

      expect(document.getElementById(toastEl().getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Custom',
      )

      expect(
        document.getElementById(toastEl().getAttribute('aria-describedby')!)?.textContent,
      ).toBe('Rendered by the slot')
    })

    it('a #toast slot that ignores the ids leaves no dangling aria-labelledby / aria-describedby', async () => {
      mountRegion(
        {},
        {
          toast: ({ content }) => h('p', String(content.title)),
        },
      )

      toast('Custom', { description: 'Detail', timeout: 0 })
      await nextTick()
      await nextTick()
      expect(toastEl().hasAttribute('aria-labelledby')).toBe(false)
      expect(toastEl().hasAttribute('aria-describedby')).toBe(false)
    })

    it('has no axe violations while a toast is exiting', async () => {
      mountRegion()
      const key = toast('Leaving', { timeout: 0 })
      toast('Staying', { timeout: 0 })
      await nextTick()
      toast.close(key)
      await nextTick()
      expect(document.querySelector('[data-exiting=true]')).not.toBeNull()
      await expectAccessible(region())
    })

    it('exposes each toast as a non-modal alertdialog named by its title and described by its description', async () => {
      mountRegion()
      toast('Saved', { description: 'Your changes are live.', timeout: 0 })
      await nextTick()
      const el = toastEl()
      expect(el.getAttribute('role')).toBe('alertdialog')
      expect(el.getAttribute('aria-modal')).toBe('false')

      expect(document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Saved',
      )

      expect(document.getElementById(el.getAttribute('aria-describedby')!)?.textContent).toBe(
        'Your changes are live.',
      )
    })

    it('has no dangling aria-describedby without a description', async () => {
      mountRegion()
      toast('Saved', { timeout: 0 })
      await nextTick()
      expect(toastEl().hasAttribute('aria-describedby')).toBe(false)

      expect(document.getElementById(toastEl().getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Saved',
      )
    })

    it('announces the content through an atomic role="alert" live region revealed after mount, like React Aria', async () => {
      mountRegion()
      toast('Saved', { description: 'Your changes are live.', timeout: 0 })
      await nextTick()
      await nextTick()
      const content = toastEl().querySelector<HTMLElement>('[data-slot=toast-content]')!
      expect(content.getAttribute('role')).toBe('alert')
      expect(content.getAttribute('aria-atomic')).toBe('true')
      expect(content.hasAttribute('aria-hidden')).toBe(false)
      expect(content.textContent).toContain('Saved')
      expect(content.textContent).toContain('Your changes are live.')
    })

    it('names the close button "Close" and hides the decorative icon', async () => {
      mountRegion()
      toast('Saved', { timeout: 0 })
      await nextTick()
      const close = toastEl().querySelector<HTMLButtonElement>('[data-slot=toast-close]')!
      expect(close.tagName).toBe('BUTTON')
      expect(close.getAttribute('aria-label')).toBe('Close')

      expect(
        toastEl().querySelector('[data-slot=toast-default-icon]')!.getAttribute('aria-hidden'),
      ).toBe('true')
    })

    it('the frontmost toast is tabbable and toasts past maxVisibleToasts are hidden and inert', async () => {
      mountRegion({ maxVisibleToasts: 2 })
      toast('One', { timeout: 0 })
      toast('Two', { timeout: 0 })
      toast('Three', { timeout: 0 })
      await nextTick()
      await nextTick()
      const els = [...document.querySelectorAll<HTMLElement>('[data-slot=toast]')]
      const byTitle = (t: string) => els.find((el) => el.textContent?.includes(t))!
      expect(byTitle('Three').getAttribute('data-frontmost')).toBe('true')
      expect(byTitle('Three').tabIndex).toBe(0)
      const hidden = els.filter((el) => el.getAttribute('data-hidden') === 'true')
      expect(hidden.length).toBeGreaterThan(0)

      for (const el of hidden) {
        expect(el.getAttribute('aria-hidden')).toBe('true')
        expect(el.hasAttribute('inert')).toBe(true)
      }
    })

    it('an exiting toast is hidden from assistive tech and its controls leave the tab order', async () => {
      mountRegion()
      const key = toast('Leaving', { action: { label: 'Undo' }, timeout: 0 })
      await nextTick()
      toast.close(key)
      await nextTick()
      expect(toastEl().getAttribute('aria-hidden')).toBe('true')

      for (const control of toastEl().querySelectorAll<HTMLElement>('button'))
        expect(control.tabIndex).toBe(-1)
    })

    it('the Alt+T hotkey focuses the region, and Escape inside it moves focus out', async () => {
      mountRegion()
      toast('Saved', { timeout: 0 })
      await nextTick()
      const region = document.querySelector<HTMLElement>('[data-slot=toast-region]')!

      document.body.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: '†',
          code: 'KeyT',
          altKey: true,
          bubbles: true,
          cancelable: true,
        }),
      )

      expect(document.activeElement).toBe(region)

      const close = toastEl().querySelector<HTMLButtonElement>('[data-slot=toast-close]')!
      close.focus()

      close.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )

      expect(region.contains(document.activeElement)).toBe(false)
    })
  })
})
