import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import Alert from '../src/components/alert/Alert.vue'
import { expectAccessible } from './a11y'

const order = (el: Element) =>
  [...el.children].map((c) => c.getAttribute('data-slot') ?? c.tagName.toLowerCase())

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('Alert', () => {
  it('renders indicator, then content with title and description', () => {
    const wrapper = mount(Alert, { props: { title: 'T', description: 'D' } })
    expect(order(wrapper.element)).toEqual(['alert-indicator', 'alert-content'])
    expect(wrapper.find('[data-slot=alert-content] p[data-slot=alert-title]').text()).toBe('T')
    expect(wrapper.find('[data-slot=alert-content] span[data-slot=alert-description]').text()).toBe(
      'D',
    )
  })

  it('picks a different default icon per status', () => {
    const paths = (['default', 'accent', 'success', 'warning', 'danger'] as const).map((status) =>
      mount(Alert, { props: { status } })
        .find('[data-slot=alert-default-icon] path')
        .attributes('d'),
    )
    // default and accent share the info icon; the other statuses each have their own
    expect(paths[0]).toBe(paths[1])
    expect(new Set(paths).size).toBe(4)
  })

  it('#indicator replaces the default icon', () => {
    const wrapper = mount(Alert, { slots: { indicator: '<i>spin</i>' } })
    expect(wrapper.find('[data-slot=alert-indicator] i').exists()).toBe(true)
    expect(wrapper.find('[data-slot=alert-default-icon]').exists()).toBe(false)
  })

  it('omits the indicator when indicator is false', () => {
    const wrapper = mount(Alert, { props: { indicator: false, title: 'T' } })
    expect(wrapper.find('[data-slot=alert-indicator]').exists()).toBe(false)
  })

  it('omits title and description when not given', () => {
    const wrapper = mount(Alert)
    expect(wrapper.find('[data-slot=alert-title]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=alert-description]').exists()).toBe(false)
  })

  it('places default slot inside the content and #leading/#trailing around it', () => {
    const wrapper = mount(Alert, {
      props: { title: 'T' },
      slots: {
        leading: '<b>lead</b>',
        default: '<button>in</button>',
        trailing: '<button>out</button>',
      },
    })
    expect(order(wrapper.element)).toEqual(['b', 'alert-indicator', 'alert-content', 'button'])
    expect(order(wrapper.find('[data-slot=alert-content]').element)).toEqual([
      'alert-title',
      'button',
    ])
  })

  it.each(['default', 'accent', 'success', 'warning', 'danger'] as const)(
    'is accessible with status %s, title and description',
    async (status) => {
      const wrapper = mount(Alert, {
        props: { status, title: 'Update available', description: 'Restart to apply it.' },
        attachTo: document.body,
      })
      await expectAccessible(wrapper)
      wrapper.unmount()
    },
  )

  it('is accessible as a live alert with an action and a labelled close button, and without an indicator', async () => {
    const wrapper = mountAll(() => [
      h(
        Alert,
        { role: 'alert', status: 'danger', title: 'Payment failed' },
        {
          default: () => h('button', { type: 'button' }, 'Retry'),
          trailing: () => h('button', { type: 'button', 'aria-label': 'Dismiss' }, '×'),
        },
      ),
      h(Alert, { indicator: false, title: 'Heads up' }),
    ])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('hides the default status icon from assistive tech so the text is the announcement', () => {
    const wrapper = mount(Alert, { props: { status: 'warning', title: 'Low disk space' } })
    expect(wrapper.get('[data-slot=alert-default-icon]').attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('Low disk space')
    wrapper.unmount()
  })

  it('forwards role, aria-live and labelling attributes to the root element', () => {
    const wrapper = mount(Alert, {
      props: { as: 'section' },
      attrs: { role: 'status', 'aria-live': 'polite', 'aria-labelledby': 'alert-title' },
      slots: { title: () => h('span', { id: 'alert-title' }, 'Saved') },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.attributes()).toMatchObject({
      role: 'status',
      'aria-live': 'polite',
      'aria-labelledby': 'alert-title',
    })
    expect(wrapper.get('#alert-title').text()).toBe('Saved')
    wrapper.unmount()
  })
})
