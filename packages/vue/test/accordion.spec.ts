import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import Accordion from '@/components/accordion/Accordion.vue'
import { useDisclosureGroupNavigation } from '@/components/disclosure-group/useDisclosureGroupNavigation'

import { expectAccessible } from './a11y'

const items = [
  { value: 'a', label: 'A', content: 'Panel A' },
  { value: 'b', label: 'B', content: 'Panel B' },
  { value: 'c', label: 'C', content: 'Panel C' },
]

const expandedStates = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=accordion-trigger]').map((t) => t.attributes('aria-expanded'))

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

    expect(
      whole
        .findAll('[data-slot=accordion-trigger]')
        .every((t) => t.attributes('disabled') !== undefined),
    ).toBe(true)

    const one = mount(Accordion, {
      props: { items: [items[0]!, { ...items[1]!, disabled: true }] },
    })

    await one.findAll('[data-slot=accordion-trigger]')[1]!.trigger('click')
    expect(expandedStates(one)).toEqual(['false', 'false'])
    await one.findAll('[data-slot=accordion-trigger]')[0]!.trigger('click')
    expect(expandedStates(one)).toEqual(['true', 'false'])
  })

  it('v-model drives expansion and the navigation composable moves through items', async () => {
    const expanded = ref<(string | number)[]>(['a'])
    const nav = useDisclosureGroupNavigation({
      expandedKeys: expanded,
      itemIds: items.map((i) => i.value),
      onExpandedChange: (keys) => {
        expanded.value = keys
      },
    })

    const wrapper = mount({
      setup: () => () =>
        h(Accordion, {
          items: items,
          modelValue: expanded.value,
          'onUpdate:modelValue': (v: (string | number)[]) => {
            expanded.value = v
          },
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

  it('a single #indicator element becomes the indicator and carries the expanded state', async () => {
    const wrapper = mount(Accordion, {
      props: { items: [items[0]!], defaultValue: ['a'] },
      slots: { indicator: () => h('i', { class: 'custom' }) },
    })

    const indicator = wrapper.find('[data-slot=accordion-indicator]')
    expect(indicator.element.tagName).toBe('I')
    expect(indicator.attributes('data-expanded')).toBe('true')

    await wrapper.find('[data-slot=accordion-trigger]').trigger('click')

    expect(
      wrapper.find('[data-slot=accordion-indicator]').attributes('data-expanded'),
    ).toBeUndefined()
  })
})

describe('Accordion accessibility', () => {
  const triggers = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('[data-slot=accordion-trigger]')

  const panels = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('[data-slot=accordion-panel]')

  it('passes axe collapsed, expanded, multiple-expanded and disabled', async () => {
    const cases = [
      {},
      { defaultValue: ['b'] },
      { multiple: true, defaultValue: ['a', 'c'] },
      { disabled: true },
      { items: [items[0]!, { ...items[1]!, disabled: true }, items[2]!], defaultValue: ['a'] },
    ]

    for (const props of cases) {
      const wrapper = mount(Accordion, { props: { items, ...props }, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('each trigger is a button inside a heading that controls a group panel named by that trigger', () => {
    const wrapper = mount(Accordion, {
      props: { items, defaultValue: ['a'] },
      attachTo: document.body,
    })

    triggers(wrapper).forEach((trigger, index) => {
      const panel = panels(wrapper)[index]!
      expect(trigger.element.tagName).toBe('BUTTON')
      expect(trigger.attributes('type')).toBe('button')
      expect(trigger.element.parentElement!.tagName).toMatch(/^H[1-6]$/)
      expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
      expect(panel.attributes('role')).toBe('group')
      expect(document.getElementById(panel.attributes('aria-labelledby')!)).toBe(trigger.element)
      expect(trigger.text()).toBe(items[index]!.label)
    })

    wrapper.unmount()
  })

  it('collapsed panels are hidden from assistive tech and find-in-page searchable; expanded ones are exposed', async () => {
    const wrapper = mount(Accordion, {
      props: { items, defaultValue: ['a'] },
      attachTo: document.body,
    })

    const hiddenStates = () =>
      panels(wrapper).map((p) => [p.attributes('aria-hidden'), p.attributes('hidden') ?? null])

    expect(hiddenStates()).toEqual([
      ['false', null],
      ['true', 'until-found'],
      ['true', 'until-found'],
    ])

    await triggers(wrapper)[1]!.trigger('click')

    expect(panels(wrapper).map((p) => p.attributes('aria-hidden'))).toEqual([
      'true',
      'false',
      'true',
    ])

    expect(panels(wrapper)[1]!.attributes('hidden')).toBeUndefined()

    expect(triggers(wrapper).map((t) => t.attributes('aria-expanded'))).toEqual([
      'false',
      'true',
      'false',
    ])

    wrapper.unmount()
  })

  it('every enabled trigger is a Tab stop, disabled triggers are skipped, and focus stays on the trigger it toggles', async () => {
    const wrapper = mount(Accordion, {
      props: { items: [items[0]!, { ...items[1]!, disabled: true }, items[2]!] },
      attachTo: document.body,
    })

    const [first, disabled, last] = triggers(wrapper)
    expect([first, last].map((t) => t!.attributes('tabindex'))).toEqual([undefined, undefined])
    expect((disabled!.element as HTMLButtonElement).disabled).toBe(true)

    ;(last!.element as HTMLElement).focus()
    await last!.trigger('click')
    expect(last!.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(last!.element)
    await last!.trigger('click')
    expect(last!.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(last!.element)
    wrapper.unmount()
  })
})
