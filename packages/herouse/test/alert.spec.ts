import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from '../src/components/Alert.vue'

const order = (el: Element) => [...el.children].map(c => c.getAttribute('data-slot') ?? c.tagName.toLowerCase())

describe('Alert', () => {
  it('renders indicator, then content with title and description', () => {
    const wrapper = mount(Alert, { props: { title: 'T', description: 'D' } })
    expect(order(wrapper.element)).toEqual(['alert-indicator', 'alert-content'])
    expect(wrapper.find('[data-slot=alert-content] p[data-slot=alert-title]').text()).toBe('T')
    expect(wrapper.find('[data-slot=alert-content] span[data-slot=alert-description]').text()).toBe('D')
  })

  it('picks a different default icon per status', () => {
    const paths = (['default', 'accent', 'success', 'warning', 'danger'] as const).map(status =>
      mount(Alert, { props: { status } }).find('[data-slot=alert-default-icon] path').attributes('d'))
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
      slots: { leading: '<b>lead</b>', default: '<button>in</button>', trailing: '<button>out</button>' },
    })
    expect(order(wrapper.element)).toEqual(['b', 'alert-indicator', 'alert-content', 'button'])
    expect(order(wrapper.find('[data-slot=alert-content]').element)).toEqual(['alert-title', 'button'])
  })
})
