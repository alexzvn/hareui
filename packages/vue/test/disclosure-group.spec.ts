import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import DisclosureGroup from '../src/components/disclosure-group/DisclosureGroup.vue'
import Disclosure from '../src/components/disclosure/Disclosure.vue'
import { expectAccessible } from './a11y'

const group = (props: Record<string, unknown> = {}) =>
  mount(DisclosureGroup, {
    props,
    slots: {
      default: () => [
        h(Disclosure, { value: 'one', title: 'One' }, () => 'Panel one'),
        h(Disclosure, { value: 'two', title: 'Two' }, () => 'Panel two'),
      ],
    },
    attachTo: document.body,
  })

enableAutoUnmount(afterEach)

const states = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=disclosure-trigger]').map((t) => t.attributes('aria-expanded'))

describe('disclosureGroup', () => {
  it('expanding one disclosure collapses the other unless multiple', async () => {
    const single = group({ defaultValue: ['one'] })
    expect(states(single)).toEqual(['true', 'false'])
    await single.findAll('[data-slot=disclosure-trigger]')[1]!.trigger('click')
    expect(states(single)).toEqual(['false', 'true'])
    expect(single.emitted('update:modelValue')!.at(-1)).toEqual([['two']])

    const multi = group({ defaultValue: ['one'], multiple: true })
    await multi.findAll('[data-slot=disclosure-trigger]')[1]!.trigger('click')
    expect(states(multi)).toEqual(['true', 'true'])
  })

  it('a controlled modelValue decides which disclosures are expanded', async () => {
    const wrapper = group({ modelValue: ['two'] })
    expect(states(wrapper)).toEqual(['false', 'true'])
    await wrapper.setProps({ modelValue: ['one'] })
    expect(states(wrapper)).toEqual(['true', 'false'])
  })

  it('disabling the group disables every disclosure', async () => {
    const wrapper = group({ disabled: true })
    const triggers = wrapper.findAll('[data-slot=disclosure-trigger]')
    expect(triggers.every((t) => t.attributes('disabled') !== undefined)).toBe(true)
    await triggers[0]!.trigger('click')
    expect(states(wrapper)).toEqual(['false', 'false'])
  })
})

describe('DisclosureGroup accessibility', () => {
  it('passes axe collapsed, with one or several expanded, and disabled', async () => {
    for (const props of [
      {},
      { defaultValue: ['two'] },
      { multiple: true, defaultValue: ['one', 'two'] },
      { disabled: true },
    ]) {
      const wrapper = group(props)
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('every trigger controls its own panel with unique ids, and aria-expanded follows the group state', async () => {
    const wrapper = group({ defaultValue: ['one'] })
    const triggers = wrapper.findAll('[data-slot=disclosure-trigger]')
    const panels = wrapper.findAll('[data-slot=disclosure-content]')
    const ids = [...triggers, ...panels].map((el) => el.attributes('id'))
    expect(new Set(ids).size).toBe(4)
    triggers.forEach((trigger, index) => {
      expect(trigger.attributes('aria-controls')).toBe(panels[index]!.attributes('id'))
      expect(panels[index]!.attributes('aria-labelledby')).toBe(trigger.attributes('id'))
    })
    expect(panels.map((p) => p.attributes('aria-hidden'))).toEqual(['false', 'true'])

    await triggers[1]!.trigger('click')
    expect(states(wrapper)).toEqual(['false', 'true'])
    expect(panels.map((p) => p.attributes('aria-hidden'))).toEqual(['true', 'false'])
    wrapper.unmount()
  })

  it('triggers stay in Tab order (no roving focus), a disabled group removes them, and focus stays on the toggled trigger', async () => {
    const wrapper = group({ defaultValue: ['one'] })
    const triggers = wrapper.findAll('[data-slot=disclosure-trigger]')
    expect(triggers.map((t) => t.attributes('tabindex'))).toEqual([undefined, undefined])
    ;(triggers[1]!.element as HTMLElement).focus()
    await triggers[1]!.trigger('click')
    expect(document.activeElement).toBe(triggers[1]!.element)
    wrapper.unmount()

    const off = group({ disabled: true })
    expect(
      off
        .findAll('[data-slot=disclosure-trigger]')
        .every((t) => (t.element as HTMLButtonElement).disabled),
    ).toBe(true)
    off.unmount()
  })
})
