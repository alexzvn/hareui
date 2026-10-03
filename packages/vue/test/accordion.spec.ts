import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Accordion from '../src/components/accordion/Accordion.vue'
import { useDisclosureGroupNavigation } from '../src/components/disclosure-group/useDisclosureGroupNavigation'

const items = [
  { value: 'a', label: 'A', content: 'Panel A' },
  { value: 'b', label: 'B', content: 'Panel B' },
  { value: 'c', label: 'C', content: 'Panel C' },
]

const expandedStates = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=accordion-trigger]').map(t => t.attributes('aria-expanded'))

describe('accordion', () => {
  it('single mode: expanding an item collapses the previously expanded one', async () => {
    const wrapper = mount(Accordion, { props: { items, defaultValue: ['a'] } })
    expect(expandedStates(wrapper)).toEqual(['true', 'false', 'false'])

    await wrapper.findAll('[data-slot=accordion-trigger]')[1]!.trigger('click')
    expect(expandedStates(wrapper)).toEqual(['false', 'true', 'false'])

    await wrapper.findAll('[data-slot=accordion-trigger]')[1]!.trigger('click')
    expect(expandedStates(wrapper)).toEqual(['false', 'false', 'false'])
  })

  it('multiple mode keeps other items expanded', async () => {
    const wrapper = mount(Accordion, { props: { items, multiple: true, defaultValue: ['a'] } })
    await wrapper.findAll('[data-slot=accordion-trigger]')[2]!.trigger('click')
    expect(expandedStates(wrapper)).toEqual(['true', 'false', 'true'])
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([['a', 'c']])
  })

  it('disabled accordion and disabled items cannot be toggled', async () => {
    const whole = mount(Accordion, { props: { items, disabled: true } })
    await whole.findAll('[data-slot=accordion-trigger]')[0]!.trigger('click')
    expect(expandedStates(whole)).toEqual(['false', 'false', 'false'])
    expect(whole.findAll('[data-slot=accordion-trigger]').every(t => t.attributes('disabled') !== undefined)).toBe(true)

    const one = mount(Accordion, { props: { items: [items[0]!, { ...items[1]!, disabled: true }] } })
    await one.findAll('[data-slot=accordion-trigger]')[1]!.trigger('click')
    expect(expandedStates(one)).toEqual(['false', 'false'])
    await one.findAll('[data-slot=accordion-trigger]')[0]!.trigger('click')
    expect(expandedStates(one)).toEqual(['true', 'false'])
  })

  it('v-model drives expansion and the navigation composable moves through items', async () => {
    const expanded = ref<(string | number)[]>(['a'])
    const nav = useDisclosureGroupNavigation({
      expandedKeys: expanded,
      itemIds: items.map(i => i.value),
      onExpandedChange: (keys) => { expanded.value = keys },
    })
    const wrapper = mount({
      setup: () => () => h(Accordion, {
        'items': items,
        'modelValue': expanded.value,
        'onUpdate:modelValue': (v: (string | number)[]) => { expanded.value = v },
      }),
    })
    expect(nav.isPrevDisabled.value).toBe(true)

    nav.onNext()
    await nextTick()
    expect(expandedStates(wrapper)).toEqual(['false', 'true', 'false'])

    nav.onNext()
    await nextTick()
    expect(nav.isNextDisabled.value).toBe(true)
    nav.onNext()
    expect(expanded.value).toEqual(['c'])

    await wrapper.findAll('[data-slot=accordion-trigger]')[0]!.trigger('click')
    expect(expanded.value).toEqual(['a'])
  })

  it('a single #indicator element receives the indicator classes and expanded state', async () => {
    const wrapper = mount(Accordion, {
      props: { items: [items[0]!], defaultValue: ['a'] },
      slots: { indicator: () => h('i', { class: 'custom' }) },
    })
    const indicator = wrapper.find('[data-slot=accordion-indicator]')
    expect(indicator.element.tagName).toBe('I')
    expect(indicator.classes()).toContain('custom')
    expect(indicator.classes()).toContain('size-4')
    expect(indicator.attributes('data-expanded')).toBe('true')

    await wrapper.find('[data-slot=accordion-trigger]').trigger('click')
    expect(wrapper.find('[data-slot=accordion-indicator]').attributes('data-expanded')).toBeUndefined()
  })
})
