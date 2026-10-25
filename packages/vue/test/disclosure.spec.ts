import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Component, VNode } from 'vue'
import { h, nextTick, ref } from 'vue'

import type { DisclosureProps } from '@/components/disclosure/Disclosure.types'
import Disclosure from '@/components/disclosure/Disclosure.vue'

import { expectAccessible } from './a11y'

describe('disclosure', () => {
  it('uncontrolled: starts collapsed and toggles on trigger click', async () => {
    const wrapper = mount(Disclosure, {
      props: { title: 'Toggle content' },
      slots: { default: () => 'Panel content' },
    })

    const trigger = wrapper.find('[data-slot=disclosure-trigger]')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    expect(
      wrapper.find('[data-slot=disclosure-content]').attributes('data-expanded'),
    ).toBeUndefined()

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-slot=disclosure-content]').attributes('data-expanded')).toBe('true')

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    expect(
      wrapper.find('[data-slot=disclosure-content]').attributes('data-expanded'),
    ).toBeUndefined()
  })

  it('defaultOpen starts expanded', () => {
    const wrapper = mount(Disclosure, { props: { title: 'Toggle', defaultOpen: true } })
    expect(wrapper.find('[data-slot=disclosure-trigger]').attributes('aria-expanded')).toBe('true')
  })

  it('v-model:open stays in sync with external state in both directions', async () => {
    const isOpen = ref(false)
    const Wrapper = {
      setup() {
        return () =>
          h(
            Disclosure,
            {
              title: 'Toggle',
              open: isOpen.value,
              'onUpdate:open': (value: boolean) => {
                isOpen.value = value
              },
            },
            { default: () => 'Content' },
          )
      },
    }

    const wrapper = mount(Wrapper)
    expect(wrapper.find('[data-slot=disclosure-trigger]').attributes('aria-expanded')).toBe('false')

    isOpen.value = true
    await nextTick()
    expect(wrapper.find('[data-slot=disclosure-trigger]').attributes('aria-expanded')).toBe('true')

    await wrapper.find('[data-slot=disclosure-trigger]').trigger('click')
    expect(isOpen.value).toBe(false)
  })

  it('disabled blocks toggling', async () => {
    const wrapper = mount(Disclosure, { props: { title: 'Toggle', disabled: true } })
    const trigger = wrapper.find('[data-slot=disclosure-trigger]')
    expect(trigger.attributes('disabled')).toBeDefined()
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('#trigger replaces the interactive element with the slotted root, keeping toggle behavior', async () => {
    const wrapper = mount(Disclosure, {
      slots: {
        trigger: ({ open }: { open: boolean }) =>
          h('button', { class: 'custom-trigger' }, open ? 'Collapse' : 'Expand'),
        default: () => 'Content',
      },
    })

    expect(wrapper.find('[data-slot=disclosure-trigger]').exists()).toBe(false)
    const trigger = wrapper.find('button.custom-trigger')
    expect(trigger.text()).toBe('Expand')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    expect(wrapper.find('button.custom-trigger').text()).toBe('Collapse')
    expect(wrapper.find('button.custom-trigger').attributes('aria-expanded')).toBe('true')
  })

  it('renders disclosure-body/bodyInner only when the default slot is used', () => {
    const empty = mount(Disclosure, { props: { title: 'Toggle' } })
    expect(empty.find('[data-slot=disclosure-body]').exists()).toBe(false)

    const withContent = mount(Disclosure, {
      props: { title: 'Toggle' },
      slots: { default: () => 'Content' },
    })

    expect(withContent.find('[data-slot=disclosure-body]').exists()).toBe(true)
  })

  it("#trigger keeps the slotted element's own data-slot and can render the themed indicator", async () => {
    const wrapper = mount(Disclosure, {
      slots: {
        trigger: ({ indicator }: { indicator: Component }) =>
          h('button', { 'data-slot': 'button' }, ['Toggle', h(indicator, { class: 'extra' })]),
        default: () => 'Content',
      },
    })

    const trigger = wrapper.find('button')
    expect(trigger.attributes('data-slot')).toBe('button')
    const indicator = trigger.find('[data-slot=disclosure-indicator]')
    expect(indicator.attributes('data-expanded')).toBeUndefined()
    await trigger.trigger('click')

    expect(wrapper.find('[data-slot=disclosure-indicator]').attributes('data-expanded')).toBe(
      'true',
    )
  })

  it('collapsed panel is aria-hidden and hidden until found; expanding reveals it', async () => {
    const wrapper = mount(Disclosure, {
      props: { title: 'T' },
      slots: { default: () => 'Content' },
      attachTo: document.body,
    })

    const panel = () => wrapper.find('[data-slot=disclosure-content]')
    expect(panel().attributes('aria-hidden')).toBe('true')
    expect(panel().attributes('hidden')).toBe('until-found')
    await wrapper.find('[data-slot=disclosure-trigger]').trigger('click')
    expect(panel().attributes('aria-hidden')).toBe('false')
    expect(panel().attributes('hidden')).toBeUndefined()

    expect(wrapper.find('[data-slot=disclosure-trigger]').attributes('aria-controls')).toBe(
      panel().attributes('id'),
    )

    wrapper.unmount()
  })
})

describe('Disclosure accessibility', () => {
  it('passes axe collapsed, expanded, disabled and with a custom #trigger', async () => {
    const cases: {
      props: DisclosureProps
      trigger?: (slotProps: { indicator: Component }) => VNode
    }[] = [
      { props: { title: 'Details' } },
      { props: { title: 'Details', defaultOpen: true } },
      { props: { title: 'Details', disabled: true } },
      {
        props: { defaultOpen: true },
        trigger: ({ indicator }) => h('button', null, ['Details', h(indicator)]),
      },
    ]

    for (const { props, trigger } of cases) {
      const wrapper = mount(Disclosure, {
        props,
        slots: { default: () => 'Panel content', ...(trigger ? { trigger } : {}) },
        attachTo: document.body,
      })

      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('the trigger is a button in a heading, and the panel is a group named by the trigger', () => {
    const wrapper = mount(Disclosure, {
      props: { title: 'Details', defaultOpen: true },
      slots: { default: () => 'Content' },
      attachTo: document.body,
    })

    const trigger = wrapper.get('[data-slot=disclosure-trigger]')
    const panel = wrapper.get('[data-slot=disclosure-content]')
    expect(trigger.element.tagName).toBe('BUTTON')
    expect(trigger.attributes('type')).toBe('button')
    expect(trigger.element.parentElement!.tagName).toMatch(/^H[1-6]$/)
    expect(panel.attributes('role')).toBe('group')
    expect(document.getElementById(panel.attributes('aria-labelledby')!)).toBe(trigger.element)
    expect(trigger.text()).toBe('Details')
    expect(wrapper.get('[data-slot=disclosure-indicator]').attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('a custom #trigger receives the id, aria-controls and disabled state', () => {
    const wrapper = mount(Disclosure, {
      props: { disabled: true },
      slots: {
        trigger: () => h('button', { class: 'custom' }, 'Details'),
        default: () => 'Content',
      },
      attachTo: document.body,
    })

    const trigger = wrapper.get('button.custom')
    const panel = wrapper.get('[data-slot=disclosure-content]')
    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(document.getElementById(panel.attributes('aria-labelledby')!)).toBe(trigger.element)
    expect((trigger.element as HTMLButtonElement).disabled).toBe(true)
    wrapper.unmount()
  })

  it('the trigger is a Tab stop and keeps focus while it toggles the panel', async () => {
    const wrapper = mount(Disclosure, {
      props: { title: 'Details' },
      slots: { default: () => 'Content' },
      attachTo: document.body,
    })

    const trigger = wrapper.get('[data-slot=disclosure-trigger]')
    expect(trigger.attributes('tabindex')).toBeUndefined()
    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(trigger.element)
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })
})
