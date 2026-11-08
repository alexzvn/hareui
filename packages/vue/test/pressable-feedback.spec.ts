import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PressableFeedback } from '@/components/pressable-feedback'

const pointer = { button: 0, pointerId: 1, pointerType: 'mouse' }

const mountHold = (props: Record<string, unknown> = {}) => {
  return mount(PressableFeedback, {
    props: { hold: true, ...props },
    slots: { default: 'Hold to delete' },
    attachTo: document.body,
  })
}

const holdLayer = (wrapper: ReturnType<typeof mountHold>) => {
  return wrapper.get('[data-slot="pressable-feedback-hold"]')
}

describe('PressableFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders a native button with the content by default', () => {
    const wrapper = mount(PressableFeedback, { slots: { default: 'Publish' } })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.text()).toBe('Publish')
  })

  it('emits confirm once held for the full duration', async () => {
    const wrapper = mountHold({ hold: { duration: 1000 } })

    await wrapper.trigger('pointerdown', pointer)
    expect(holdLayer(wrapper).attributes('data-state')).toBe('holding')

    vi.advanceTimersByTime(999)
    expect(wrapper.emitted('confirm')).toBeUndefined()

    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(holdLayer(wrapper).attributes('data-state')).toBe('complete')
  })

  it('waits 2 seconds by default', async () => {
    const wrapper = mountHold()

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(1999)
    expect(wrapper.emitted('confirm')).toBeUndefined()

    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('cancels the hold when released early', async () => {
    const wrapper = mountHold({ hold: { duration: 1000 } })

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(600)
    await wrapper.trigger('pointerup', pointer)
    expect(holdLayer(wrapper).attributes('data-state')).toBe('idle')

    vi.advanceTimersByTime(2000)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('cancels the hold when the pointer leaves or the press is cancelled', async () => {
    const wrapper = mountHold({ hold: { duration: 1000 } })

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(500)
    await wrapper.trigger('pointerleave', pointer)

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(500)
    await wrapper.trigger('pointercancel', pointer)

    vi.advanceTimersByTime(2000)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('starts the full duration again after a cancelled hold', async () => {
    const wrapper = mountHold({ hold: { duration: 1000 } })

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(800)
    await wrapper.trigger('pointerup', pointer)

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(800)
    expect(wrapper.emitted('confirm')).toBeUndefined()

    vi.advanceTimersByTime(200)
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('confirms a hold of Space or Enter and cancels on an early keyup', async () => {
    const wrapper = mountHold({ hold: { duration: 1000 } })

    await wrapper.trigger('keydown', { key: ' ' })
    vi.advanceTimersByTime(500)
    await wrapper.trigger('keyup', { key: ' ' })
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('confirm')).toBeUndefined()

    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: 'Enter', repeat: true })
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('resets a confirmed hold on release unless resetOnComplete is off', async () => {
    const wrapper = mountHold({ hold: { duration: 500 } })

    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(500)
    await wrapper.trigger('pointerup', pointer)
    expect(holdLayer(wrapper).attributes('data-state')).toBe('idle')
    expect(wrapper.emitted('reset')).toHaveLength(1)

    await wrapper.setProps({ hold: { duration: 500, resetOnComplete: false } })
    await wrapper.trigger('pointerdown', pointer)
    vi.advanceTimersByTime(500)
    await wrapper.trigger('pointerup', pointer)
    expect(holdLayer(wrapper).attributes('data-state')).toBe('complete')

    wrapper.vm.reset()
    await wrapper.vm.$nextTick()
    expect(holdLayer(wrapper).attributes('data-state')).toBe('idle')
  })

  it('ignores presses while disabled', async () => {
    const wrapper = mountHold({ hold: { duration: 500 }, disabled: true })

    await wrapper.trigger('pointerdown', pointer)
    await wrapper.trigger('keydown', { key: 'Enter' })
    vi.advanceTimersByTime(1000)

    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('completes a progress sweep after a click and resets on its own', async () => {
    const wrapper = mount(PressableFeedback, {
      props: { progress: { duration: 1000, resetDelay: 500 } },
      slots: { default: 'Send' },
    })

    const layer = () => wrapper.get('[data-slot="pressable-feedback-progress"]')

    await wrapper.trigger('click')
    expect(layer().attributes('data-state')).toBe('progressing')

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('complete')).toHaveLength(1)
    expect(layer().attributes('data-state')).toBe('complete')

    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()
    expect(layer().attributes('data-state')).toBe('idle')
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('shows the hold slot in the overlay', () => {
    const wrapper = mount(PressableFeedback, {
      props: { hold: true },
      slots: { default: 'Delete', hold: 'Keep holding' },
    })

    expect(holdLayer(wrapper).text()).toBe('Keep holding')
  })

  it('makes a plain element a keyboard-operable button', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(PressableFeedback, {
      props: { as: 'div' },
      attrs: { onClick },
      slots: { default: 'Open' },
    })

    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)
    await wrapper.trigger('keyup', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)

    await wrapper.trigger('keydown', { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(1)
    await wrapper.trigger('keyup', { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('adds a ripple wave on press', async () => {
    const wrapper = mount(PressableFeedback, {
      props: { ripple: true },
      slots: { default: 'Send' },
      attachTo: document.body,
    })

    await wrapper.trigger('pointerdown', pointer)
    expect(wrapper.findAll('[data-wave]')).toHaveLength(1)

    await wrapper.trigger('pointerup', pointer)
    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('[data-wave]')).toHaveLength(0)
  })
})
