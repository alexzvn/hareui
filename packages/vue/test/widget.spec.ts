import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { WidgetLegendItem } from '@/components/widget'
import { Widget } from '@/components/widget'

const legend: WidgetLegendItem[] = [
  { label: 'Visits', color: 'rgb(255, 0, 0)' },
  { label: 'Signups', color: 'var(--chart-1)' },
]

const mountWidget = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(Widget, { props, slots: { default: 'Body', ...slots } })

describe('Widget', () => {
  it('renders the title prop', () => {
    const wrapper = mountWidget({ title: 'Orders' })

    expect(wrapper.get('[data-slot="widget-title"]').text()).toBe('Orders')
  })

  it('renders the description prop', () => {
    const wrapper = mountWidget({ description: 'Last 7 days' })

    expect(wrapper.get('[data-slot="widget-description"]').text()).toBe('Last 7 days')
  })

  it('replaces the title prop with the title slot', () => {
    const wrapper = mountWidget({ title: 'Orders' }, { title: '<b>Custom</b>' })

    expect(wrapper.get('[data-slot="widget-title"]').html()).toContain('<b>Custom</b>')
  })

  it('replaces the description prop with the description slot', () => {
    const wrapper = mountWidget({ description: 'Last 7 days' }, { description: '<i>Today</i>' })

    expect(wrapper.get('[data-slot="widget-description"]').html()).toContain('<i>Today</i>')
  })

  it('replaces the whole header with the header slot', () => {
    const wrapper = mountWidget({ title: 'Orders' }, { header: '<div id="own">Own</div>' })

    expect(wrapper.find('#own').exists()).toBe(true)
    expect(wrapper.find('[data-slot="widget-header"]').exists()).toBe(false)
  })

  it('renders no header without title, description or legend', () => {
    const wrapper = mountWidget()

    expect(wrapper.find('[data-slot="widget-header"]').exists()).toBe(false)
  })

  it('renders one legend item per entry', () => {
    const wrapper = mountWidget({ legend })

    const labels = wrapper.findAll('[data-slot="widget-legend-item"]').map((item) => item.text())
    expect(labels).toEqual(['Visits', 'Signups'])
  })

  it('colours each legend dot with its entry colour as inline style', () => {
    const wrapper = mountWidget({ legend })

    const dots = wrapper.findAll('[data-slot="widget-legend-item-dot"]')
    expect(dots[0]?.attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    expect(dots[1]?.attributes('style')).toContain('background-color: var(--chart-1)')
  })

  it('replaces the legend list with the legend slot', () => {
    const wrapper = mountWidget({ legend }, { legend: '<span id="own-legend">Live</span>' })

    expect(wrapper.find('#own-legend').exists()).toBe(true)
    expect(wrapper.find('[data-slot="widget-legend"]').exists()).toBe(false)
  })

  it('renders the default slot in the content area', () => {
    const wrapper = mountWidget()

    expect(wrapper.get('[data-slot="widget-content"]').text()).toBe('Body')
  })

  it('renders no footer without the footer slot', () => {
    const wrapper = mountWidget()

    expect(wrapper.find('[data-slot="widget-footer"]').exists()).toBe(false)
  })

  it('renders the footer slot', () => {
    const wrapper = mountWidget({}, { footer: 'Updated now' })

    expect(wrapper.get('[data-slot="widget-footer"]').text()).toBe('Updated now')
  })

  it('renders a div by default', () => {
    const wrapper = mountWidget()

    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders the element passed in as', () => {
    const wrapper = mountWidget({ as: 'section' })

    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
