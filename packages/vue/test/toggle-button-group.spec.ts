import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ToggleButtonGroup from '@/components/toggle-button-group/ToggleButtonGroup.vue'
import ToggleButton from '@/components/toggle-button/ToggleButton.vue'

import { expectAccessible } from './a11y'

const IDS = ['left', 'center', 'right']

const group = (props: Record<string, unknown> = {}, disabled: string[] = []) => {
  return mount(ToggleButtonGroup, {
    props,
    attrs: { 'aria-label': 'Text alignment' },
    attachTo: document.body,
    slots: {
      default: () =>
        IDS.map((id) =>
          h(
            ToggleButton,
            { id, value: id, disabled: disabled.includes(id) || undefined },
            () => id,
          ),
        ),
    },
  })
}

const el = (id: string) => document.getElementById(id)!

const key = (target: Element, k: string) => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
}

describe('ToggleButtonGroup', () => {
  // behaviour-final-check T2: RAC's toggle button group only moves focus with the arrow keys
  it('Home / End do not move focus to the first / last button', async () => {
    const wrapper = mount(ToggleButtonGroup, {
      props: { selectionMode: 'multiple' },
      slots: {
        default: () =>
          ['bold', 'italic', 'underline'].map((id) => h(ToggleButton, { id }, () => id)),
      },
      attachTo: document.body,
    })

    await flushPromises()
    const middle = wrapper.get('#italic').element as HTMLElement
    middle.focus()

    for (const key of ['Home', 'End']) {
      middle.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      await flushPromises()
      expect(document.activeElement).toBe(middle)
    }

    middle.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    )

    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('#underline').element)
    wrapper.unmount()
  })

  it.each([
    ['single selection, nothing selected', {}],
    ['single selection with a selected button', { defaultValue: ['center'] }],
    [
      'multiple selection with selected buttons',
      { selectionMode: 'multiple', defaultValue: ['left', 'right'] },
    ],
    ['disabled', { disabled: true, defaultValue: ['left'] }],
    [
      'vertical with separators',
      { orientation: 'vertical', separator: true, defaultValue: ['left'] },
    ],
  ])('is accessible: %s', async (_, props) => {
    const wrapper = group(props)
    await flushPromises()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('single selection exposes a radiogroup of radios whose aria-checked follows the selection', async () => {
    const wrapper = group({ defaultValue: ['left'] })
    expect(wrapper.attributes()).toMatchObject({
      role: 'radiogroup',
      'aria-orientation': 'horizontal',
      'aria-label': 'Text alignment',
    })

    expect(IDS.map((id) => el(id).getAttribute('aria-checked'))).toEqual(['true', 'false', 'false'])
    el('right').click()
    await flushPromises()
    expect(IDS.map((id) => el(id).getAttribute('aria-checked'))).toEqual(['false', 'false', 'true'])
    wrapper.unmount()
  })

  it('multiple selection exposes toggle buttons whose aria-pressed follows the selection', async () => {
    const wrapper = group({ selectionMode: 'multiple', defaultValue: ['left'] })
    expect(wrapper.attributes('role')).toBe('toolbar')
    expect(IDS.map((id) => el(id).getAttribute('role'))).toEqual([null, null, null])
    expect(IDS.map((id) => el(id).getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false'])
    el('center').click()
    await flushPromises()
    expect(IDS.map((id) => el(id).getAttribute('aria-pressed'))).toEqual(['true', 'true', 'false'])
    wrapper.unmount()
  })

  it('is a single tab stop that lands on the selected button', async () => {
    const wrapper = group({ defaultValue: ['center'] })
    await flushPromises()

    // Tab reaches the group's one tab stop; the roving group hands focus to the selected button.
    const tabbable = [wrapper.element, ...IDS.map(el)].filter(
      (node) => (node as HTMLElement).tabIndex >= 0,
    )

    expect(tabbable).toHaveLength(1)
    ;(tabbable[0] as HTMLElement).focus()
    await flushPromises()
    expect(document.activeElement).toBe(el('center'))
    expect(IDS.map((id) => el(id).tabIndex)).toEqual([-1, 0, -1])
    wrapper.unmount()
  })

  it('arrow keys move focus without wrapping or changing the selection, skipping disabled buttons', async () => {
    const wrapper = group({ defaultValue: ['left'] }, ['center'])
    await flushPromises()
    el('left').focus()
    key(el('left'), 'ArrowRight')
    await flushPromises()
    expect(document.activeElement).toBe(el('right'))
    key(el('right'), 'ArrowRight')
    await flushPromises()
    expect(document.activeElement).toBe(el('right'))
    key(el('right'), 'ArrowLeft')
    await flushPromises()
    expect(document.activeElement).toBe(el('left'))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(el('center').hasAttribute('disabled')).toBe(true)
    wrapper.unmount()
  })

  it('vertical groups move focus with ArrowUp / ArrowDown', async () => {
    const wrapper = group({ orientation: 'vertical' })
    await flushPromises()
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    el('left').focus()
    key(el('left'), 'ArrowDown')
    await flushPromises()
    expect(document.activeElement).toBe(el('center'))
    key(el('center'), 'ArrowUp')
    await flushPromises()
    expect(document.activeElement).toBe(el('left'))
    wrapper.unmount()
  })

  it('pressing the focused button (Enter / Space dispatch click) selects it and keeps focus', async () => {
    const wrapper = group()
    await flushPromises()
    el('center').focus()
    el('center').click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['center']])
    expect(el('center').getAttribute('aria-checked')).toBe('true')
    expect(document.activeElement).toBe(el('center'))
    wrapper.unmount()
  })

  it('a disabled group is aria-disabled and its buttons leave the focus order', async () => {
    const wrapper = group({ disabled: true })
    await flushPromises()
    expect(wrapper.attributes('aria-disabled')).toBe('true')

    for (const id of IDS) {
      expect(el(id).hasAttribute('disabled')).toBe(true)
      el(id).focus()
      expect(document.activeElement).not.toBe(el(id))
    }

    wrapper.unmount()
  })
})
