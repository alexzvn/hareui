import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Metric from '@/components/metric/Metric.vue'

import { expectAccessible } from './a11y'
import { settle } from './settle'

describe('Metric', () => {
  it('is accessible with an icon, trend and progress', async () => {
    const wrapper = mount(Metric, {
      props: {
        title: 'Orders',
        icon: 'i-test',
        status: 'success',
        value: 1280,
        trend: { label: '+4%' },
        progress: { value: 40 },
      },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('renders the title as a dt and the value as a dd inside a dl', () => {
    const wrapper = mount(Metric, { props: { title: 'Orders', value: 1280 } })
    const list = wrapper.get('dl')
    expect(list.get('dt').text()).toBe('Orders')
    expect(list.get('dd').text()).toBe('1,280')
    wrapper.unmount()
  })

  it('formats the value with format', () => {
    const wrapper = mount(Metric, {
      props: { title: 'Revenue', value: 4200, format: { format: 'currency', currency: 'USD' } },
    })

    expect(wrapper.get('dd').text()).toBe('$4,200.00')
    wrapper.unmount()
  })

  it('renders the trend as a TrendChip with data-trend', () => {
    const wrapper = mount(Metric, { props: { value: 1, trend: { label: '-2%', trend: 'down' } } })
    const chip = wrapper.get('[data-trend]')
    expect(chip.attributes('data-trend')).toBe('down')
    expect(chip.text()).toContain('-2%')
    wrapper.unmount()
  })

  it('renders progress as a progressbar with its value', () => {
    const wrapper = mount(Metric, { props: { title: 'Disk', value: 0.4, progress: { value: 40 } } })
    const bar = wrapper.get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('40')
    expect(bar.attributes('aria-label')).toBe('Disk')
    wrapper.unmount()
  })

  it('reflects status on the icon box as data-status', () => {
    const wrapper = mount(Metric, { props: { title: 'Errors', icon: 'i-test', status: 'danger' } })
    expect(wrapper.get('[data-slot="metric-icon"]').attributes('data-status')).toBe('danger')
    wrapper.unmount()
  })

  it('hides the icon from assistive technology', () => {
    const wrapper = mount(Metric, { props: { title: 'Errors', icon: 'i-test' } })
    expect(wrapper.get('.i-test').attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('replaces the title with the title slot', () => {
    const wrapper = mount(Metric, { props: { title: 'Orders' }, slots: { title: () => 'Custom' } })
    expect(wrapper.get('dt').text()).toBe('Custom')
    wrapper.unmount()
  })

  it('passes the formatted value to the value slot', () => {
    const wrapper = mount(Metric, {
      props: { value: 1280 },
      slots: {
        value: ({ formatted, value }: { formatted: string; value: number }) =>
          `${formatted}|${value}`,
      },
    })

    expect(wrapper.get('[data-slot="metric-value"]').text()).toBe('1,280|1280')
    wrapper.unmount()
  })

  it('replaces the trend chip with the trend slot', () => {
    const wrapper = mount(Metric, {
      props: { value: 1, trend: { label: '+1%' } },
      slots: { trend: () => h('span', { id: 'own-trend' }, 'flat') },
    })

    expect(wrapper.find('[data-trend]').exists()).toBe(false)
    expect(wrapper.find('#own-trend').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders the chart slot inside the chart area', () => {
    const wrapper = mount(Metric, {
      props: { value: 1 },
      slots: { chart: () => h('svg', { id: 'spark' }) },
    })

    expect(wrapper.get('[data-slot="metric-chart"]').find('#spark').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders the footer after a separator', () => {
    const wrapper = mount(Metric, { props: { value: 1 }, slots: { footer: () => 'View report' } })
    expect(wrapper.get('[data-slot="metric-footer"]').text()).toBe('View report')
    expect(wrapper.find('[role="separator"], hr').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders no actions button without actions', () => {
    const wrapper = mount(Metric, { props: { value: 1 } })
    expect(wrapper.find('button').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders a labelled menu button for actions', () => {
    const wrapper = mount(Metric, {
      props: { value: 1, actions: [{ value: 'export', label: 'Export' }] },
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('More actions')
    expect(button.attributes('aria-haspopup')).toBe('menu')
    wrapper.unmount()
  })

  it('replaces the actions menu with the actions slot', () => {
    const wrapper = mount(Metric, {
      props: { value: 1, actions: [{ value: 'export', label: 'Export' }] },
      slots: { actions: () => h('button', { id: 'own-action' }, 'Edit') },
    })

    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.find('#own-action').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders the chart slot under the content by default', () => {
    const wrapper = mount(Metric, {
      props: { title: 'Visits', value: 12 },
      slots: { chart: () => h('svg', { 'data-test': 'chart' }) },
    })

    expect(wrapper.attributes('data-chart-placement')).toBe('bottom')
    expect(wrapper.get('dd').find('[data-test="chart"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="chart"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders the chart slot inside the content area with chartPlacement="inline"', () => {
    const wrapper = mount(Metric, {
      props: { title: 'Visits', value: 12, chartPlacement: 'inline' },
      slots: { chart: () => h('svg', { 'data-test': 'chart' }) },
    })

    expect(wrapper.attributes('data-chart-placement')).toBe('inline')
    expect(wrapper.get('dd').find('[data-test="chart"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders no lone definition without a title', () => {
    const wrapper = mount(Metric, { props: { value: 12 } })

    expect(wrapper.find('dl').exists()).toBe(false)
    expect(wrapper.find('dd').exists()).toBe(false)
    expect(wrapper.get('[data-slot="metric-value"]').text()).toBe('12')
  })

  it('passes axe without a title', async () => {
    const wrapper = mount(Metric, { props: { value: 12 }, attachTo: document.body })

    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('emits action with the chosen menu item', async () => {
    const wrapper = mount(Metric, {
      props: { value: 1, actions: [{ value: 'export', label: 'Export' }] },
      attachTo: document.body,
    })

    const trigger = wrapper.get('[data-slot="metric-actions"] button').element as HTMLElement
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()
    document.querySelector<HTMLElement>('[data-slot=menu-item]')!.click()
    await settle()

    expect(wrapper.emitted('action')).toEqual([['export']])
    wrapper.unmount()
  })
})
