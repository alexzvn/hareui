import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import type { ActionBarSlotProps } from '@/components/action-bar'
import ActionBar from '@/components/action-bar/ActionBar.vue'
import Button from '@/components/button/Button.vue'

import { expectAccessible } from './a11y'

const mounted: { unmount: () => void }[] = []

afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount())
  vi.restoreAllMocks()
})

// Reka's Presence reads the animation name on the tick after `present` changes, then switches state.
const waitPresence = async () => {
  await nextTick()
  await nextTick()
  await nextTick()
}

// happy-dom has no CSS animations: a closing bar reports the exit animation its theme declares, so Presence keeps it
// mounted until `animationend`.
const stubExitAnimation = () => {
  const original = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    const real = original(el, pseudo)

    const isClosing =
      el.getAttribute?.('data-slot') === 'action-bar' && el.getAttribute('data-state') === 'closed'

    if (!isClosing) return real

    return new Proxy(real, {
      get: (target, key) => (key === 'animationName' ? 'exit' : Reflect.get(target, key)),
    })
  })
}

const sections = {
  prefix: () => h('span', '3 selected'),
  default: () => [
    h(Button, { 'aria-label': 'Edit' }, () => 'Edit'),
    h(Button, { 'aria-label': 'Archive' }, () => 'Archive'),
  ],
  suffix: () => h(Button, { 'aria-label': 'Clear' }, () => 'Clear'),
}

type SlotRenderers = Record<string, (props: ActionBarSlotProps) => unknown>

const mountBar = (props: Record<string, unknown> = {}, slots: SlotRenderers = sections) => {
  const wrapper = mount(ActionBar, { props, slots, attachTo: document.body })
  mounted.push(wrapper)

  return wrapper
}

const toolbar = () => document.querySelector<HTMLElement>('[role=toolbar]')

const button = (label: string) => document.querySelector<HTMLElement>(`[aria-label="${label}"]`)!

const press = (el: Element, key: string) => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

describe('ActionBar', () => {
  it('renders nothing while closed', () => {
    mountBar({ open: false })
    expect(toolbar()).toBeNull()
  })

  it('renders the toolbar when open', () => {
    mountBar({ open: true })
    expect(toolbar()).not.toBeNull()
    expect(toolbar()?.getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('appears when the open prop turns true', async () => {
    const wrapper = mountBar({ open: false })
    await wrapper.setProps({ open: true })
    await waitPresence()
    expect(toolbar()).not.toBeNull()
  })

  it('stays mounted during its exit animation and leaves on animationend', async () => {
    stubExitAnimation()
    const wrapper = mountBar({ open: true })
    await wrapper.setProps({ open: false })
    await waitPresence()
    const bar = document.querySelector('[data-slot=action-bar]')
    expect(bar?.getAttribute('data-state')).toBe('closed')

    const event = Object.assign(new Event('animationend'), { animationName: 'exit' })
    bar?.dispatchEvent(event)
    await waitPresence()
    expect(document.querySelector('[data-slot=action-bar]')).toBeNull()
  })

  it('labels the toolbar "Actions" by default', () => {
    mountBar({ open: true })
    expect(toolbar()?.getAttribute('aria-label')).toBe('Actions')
  })

  it('takes an aria-label override', () => {
    mountBar({ open: true, 'aria-label': 'Bulk actions' })
    expect(toolbar()?.getAttribute('aria-label')).toBe('Bulk actions')
  })

  it('arrow keys move focus between the buttons of every section', () => {
    mountBar({ open: true })
    button('Edit').focus()
    press(button('Edit'), 'ArrowRight')
    expect(document.activeElement).toBe(button('Archive'))
    press(button('Archive'), 'ArrowRight')
    expect(document.activeElement).toBe(button('Clear'))
    press(button('Clear'), 'ArrowLeft')
    expect(document.activeElement).toBe(button('Archive'))
  })

  it('vertical bars move focus with ArrowUp/ArrowDown', () => {
    mountBar({ open: true, orientation: 'vertical' })
    expect(toolbar()?.getAttribute('aria-orientation')).toBe('vertical')
    button('Edit').focus()
    press(button('Edit'), 'ArrowDown')
    expect(document.activeElement).toBe(button('Archive'))
  })

  it('opens from defaultOpen without a bound open prop', () => {
    mountBar({ defaultOpen: true })
    expect(toolbar()).not.toBeNull()
  })

  it('the close slot prop emits update:open with false and hides an uncontrolled bar', async () => {
    const wrapper = mountBar(
      { defaultOpen: true },
      {
        suffix: ({ close }) => h(Button, { 'aria-label': 'Clear', onClick: close }, () => 'Clear'),
      },
    )

    // Vue drops events stamped in the same millisecond its listeners were attached; a real click never lands that fast.
    const tick = Promise.withResolvers<void>()
    setTimeout(tick.resolve, 2)
    await tick.promise

    button('Clear').click()
    await waitPresence()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(toolbar()).toBeNull()
  })

  it('renders prefix, content and suffix with a separator between each pair', () => {
    mountBar({ open: true })
    const children = [...toolbar()!.children].map((el) => el.getAttribute('data-slot'))

    expect(children).toEqual([
      'action-bar-prefix',
      'separator',
      'action-bar-content',
      'separator',
      'action-bar-suffix',
    ])

    expect(toolbar()?.querySelector('[data-slot=action-bar-prefix]')?.textContent).toBe(
      '3 selected',
    )
  })

  it('omits the separators of absent sections', () => {
    mountBar({ open: true }, { default: sections.default })
    const children = [...toolbar()!.children].map((el) => el.getAttribute('data-slot'))
    expect(children).toEqual(['action-bar-content'])
  })

  it('separators are vertical in a horizontal bar', () => {
    mountBar({ open: true })
    const separator = toolbar()?.querySelector('[role=separator]')
    expect(separator?.getAttribute('aria-orientation')).toBe('vertical')
  })

  it('has no axe violations', async () => {
    mountBar({ open: true })
    await expectAccessible(toolbar()!)
  })
})
