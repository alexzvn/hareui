import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Disclosure from '../src/components/disclosure/Disclosure.vue'
import DisclosureGroup from '../src/components/disclosure-group/DisclosureGroup.vue'

const group = (props: Record<string, unknown> = {}) => mount(DisclosureGroup, {
  props,
  slots: {
    default: () => [
      h(Disclosure, { value: 'one', title: 'One' }, () => 'Panel one'),
      h(Disclosure, { value: 'two', title: 'Two' }, () => 'Panel two'),
    ],
  },
})

const states = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=disclosure-trigger]').map(t => t.attributes('aria-expanded'))

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
    expect(triggers.every(t => t.attributes('disabled') !== undefined)).toBe(true)
    await triggers[0]!.trigger('click')
    expect(states(wrapper)).toEqual(['false', 'false'])
  })
})
