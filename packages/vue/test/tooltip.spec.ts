import { enableAutoUnmount, mount } from '@vue/test-utils'
import { TooltipRoot } from 'reka-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Tooltip from '../src/components/tooltip/Tooltip.vue'
import { expectAccessible } from './a11y'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

function mountTooltip(props: Record<string, unknown> = {}) {
  return mount(Tooltip, {
    props: { text: 'Tip', delay: 0, ...props },
    slots: { default: () => h('button', { id: 'trigger' }, 'Trigger') },
    attachTo: document.body,
  })
}

function pointer(el: Element, type: string) {
  el.dispatchEvent(new PointerEvent(type, { bubbles: type !== 'pointerleave' && type !== 'pointerenter', pointerType: 'mouse' }))
}

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.useRealTimers()
})

describe('Tooltip', () => {
  it('opens on hover after `delay` and on focus with the default trigger', async () => {
    const wrapper = mountTooltip()
    pointer(wrapper.get('#trigger').element, 'pointermove')
    await sleep(10)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    wrapper.unmount()

    const focused = mountTooltip()
    ;(focused.get('#trigger').element as HTMLElement).focus()
    await nextTick()
    expect(focused.emitted('update:open')?.at(-1)).toEqual([true])
  })

  it('closeDelay keeps a hover-opened tooltip open until the delay ends', async () => {
    vi.useFakeTimers()
    const wrapper = mountTooltip({ defaultOpen: true, closeDelay: 300 })
    pointer(wrapper.get('#trigger').element, 'pointerleave')
    wrapper.findComponent(TooltipRoot).vm.$emit('update:open', false)
    await nextTick()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    vi.advanceTimersByTime(299)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('re-entering the trigger cancels a pending delayed close', async () => {
    vi.useFakeTimers()
    const wrapper = mountTooltip({ defaultOpen: true, closeDelay: 300 })
    const trigger = wrapper.get('#trigger').element
    pointer(trigger, 'pointerleave')
    wrapper.findComponent(TooltipRoot).vm.$emit('update:open', false)
    pointer(trigger, 'pointerenter')
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('closes immediately on press or Escape even with a closeDelay, and with closeDelay 0', async () => {
    const wrapper = mountTooltip({ defaultOpen: true, closeDelay: 300 })
    const trigger = wrapper.get('#trigger').element
    pointer(trigger, 'pointerleave')
    pointer(trigger, 'pointerdown')
    wrapper.findComponent(TooltipRoot).vm.$emit('update:open', false)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    wrapper.unmount()

    const noDelay = mountTooltip({ defaultOpen: true, closeDelay: 0 })
    pointer(noDelay.get('#trigger').element, 'pointerleave')
    noDelay.findComponent(TooltipRoot).vm.$emit('update:open', false)
    expect(noDelay.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('trigger="focus" ignores hover but opens on focus and closes on blur', async () => {
    const wrapper = mountTooltip({ trigger: 'focus' })
    const trigger = wrapper.get('#trigger').element as HTMLElement
    pointer(trigger, 'pointermove')
    await sleep(10)
    expect(wrapper.emitted('update:open')).toBeUndefined()

    trigger.focus()
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])

    // Hover leaving does not close a focus-only tooltip.
    pointer(trigger, 'pointerleave')
    wrapper.findComponent(TooltipRoot).vm.$emit('update:open', false)
    expect(wrapper.emitted('update:open')).toHaveLength(1)

    trigger.blur()
    await nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('still honours v-model:open', async () => {
    const wrapper = mountTooltip({ open: false })
    expect(document.body.textContent).not.toContain('Tip')
    await wrapper.setProps({ open: true })
    await sleep(0)
    expect(document.body.textContent).toContain('Tip')
  })

  it('passes axe while closed and while open', async () => {
    const closed = mountTooltip()
    await expectAccessible(closed)
    closed.unmount()

    mountTooltip({ defaultOpen: true, arrow: true })
    await sleep(0)
    expect(document.querySelector('[role=tooltip]')).not.toBeNull()
    await expectAccessible()
  })

  it('describes the trigger by the tooltip text only while open', async () => {
    const wrapper = mountTooltip()
    const trigger = wrapper.get('#trigger').element as HTMLElement
    expect(trigger.hasAttribute('aria-describedby')).toBe(false)

    trigger.focus()
    await sleep(0)
    const describedBy = trigger.getAttribute('aria-describedby')!
    const tooltip = document.getElementById(describedBy)!
    expect(tooltip.getAttribute('role')).toBe('tooltip')
    expect(tooltip.textContent?.trim()).toBe('Tip')

    trigger.blur()
    await sleep(0)
    expect(trigger.hasAttribute('aria-describedby')).toBe(false)
  })

  it('opens on keyboard focus, and Escape closes it while focus stays on the trigger', async () => {
    const wrapper = mountTooltip()
    const trigger = wrapper.get('#trigger').element as HTMLElement
    trigger.focus()
    await sleep(0)
    expect(document.querySelector('[role=tooltip]')).not.toBeNull()

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await sleep(0)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    expect(document.querySelector('[role=tooltip]')).toBeNull()
    expect(trigger.hasAttribute('aria-describedby')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('a disabled tooltip never opens or describes its trigger', async () => {
    const wrapper = mountTooltip({ disabled: true })
    const trigger = wrapper.get('#trigger').element as HTMLElement
    trigger.focus()
    pointer(trigger, 'pointermove')
    await sleep(10)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(document.querySelector('[role=tooltip]')).toBeNull()
    expect(trigger.hasAttribute('aria-describedby')).toBe(false)
  })
})
