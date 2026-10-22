import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ChartLegend from '../src/components/chart-legend/ChartLegend.vue'

const devices = [
  { name: 'Mobile', value: 600 },
  { name: 'Desktop', value: 300, fill: 'pink' },
  { name: 'Tablet', value: 100 },
]

function rows(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-slot="chart-legend-item"]').map(row => ({
    color: (row.get('[data-slot="chart-legend-indicator"]').element as HTMLElement).style.backgroundColor,
    label: row.get('[data-slot="chart-legend-label"]').text(),
  }))
}

describe('ChartLegend', () => {
  it('renders one row per series with the chart palette and names', () => {
    const wrapper = mount(ChartLegend, { props: { series: { organic: { name: 'Organic' }, paid: {}, direct: { color: 'red' } } } })
    expect(wrapper.element.tagName).toBe('UL')
    expect(rows(wrapper)).toEqual([
      { color: 'var(--chart-3)', label: 'Organic' },
      { color: 'var(--chart-1)', label: 'paid' },
      { color: 'red', label: 'direct' },
    ])
    expect(wrapper.get('[data-slot="chart-legend-indicator"]').attributes('aria-hidden')).toBe('true')
  })

  it('uses custom colors in order, like the chart', () => {
    const wrapper = mount(ChartLegend, { props: { series: ['a', 'b'], colors: ['blue', 'green'] } })
    expect(rows(wrapper).map(row => row.color)).toEqual(['blue', 'green'])
  })

  it('renders explicit items before series or data', () => {
    const wrapper = mount(ChartLegend, { props: { items: [{ key: 'x', name: 'X', color: 'blue' }], series: ['a'], data: devices, index: 'name' } })
    expect(rows(wrapper)).toEqual([{ color: 'blue', label: 'X' }])
  })

  it('renders pie slices from data and index with values and shares', () => {
    const wrapper = mount(ChartLegend, { props: { data: devices, index: 'name', showValue: true, showPercent: true, orientation: 'vertical' } })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
    expect(rows(wrapper)).toEqual([
      { color: 'var(--chart-3)', label: 'Mobile' },
      { color: 'pink', label: 'Desktop' },
      { color: 'var(--chart-4)', label: 'Tablet' },
    ])
    expect(wrapper.findAll('[data-slot="chart-legend-value"]').map(node => node.text())).toEqual(['600', '300', '100'])
    expect(wrapper.findAll('[data-slot="chart-legend-percent"]').map(node => node.text())).toEqual(['60%', '30%', '10%'])
  })

  it('hides values and shares unless asked, and applies formatters', () => {
    const plain = mount(ChartLegend, { props: { data: devices, index: 'name' } })
    expect(plain.find('[data-slot="chart-legend-value"]').exists()).toBe(false)
    expect(plain.find('[data-slot="chart-legend-percent"]').exists()).toBe(false)
    const formatted = mount(ChartLegend, {
      props: {
        data: devices,
        index: 'name',
        showValue: true,
        showPercent: true,
        valueFormatter: (value: number, key: string) => `${key}: ${value} units`,
        percentFormatter: (percent: number) => `(${percent.toFixed(1)}%)`,
      },
    })
    expect(formatted.findAll('[data-slot="chart-legend-value"]').map(node => node.text())).toEqual(['Mobile: 600 units', 'Desktop: 300 units', 'Tablet: 100 units'])
    expect(formatted.get('[data-slot="chart-legend-percent"]').text()).toBe('(60.0%)')
  })

  it('is a static list without toggleable', async () => {
    const wrapper = mount(ChartLegend, { props: { series: ['a', 'b'], hidden: ['b'] } })
    expect(wrapper.find('button').exists()).toBe(false)
    const items = wrapper.findAll('[data-slot="chart-legend-item"]')
    expect(items[0]!.attributes('data-hidden')).toBeUndefined()
    expect(items[1]!.attributes('data-hidden')).toBe('true')
    await wrapper.get('[data-slot="chart-legend-trigger"]').trigger('click')
    expect(wrapper.emitted('update:hidden')).toBeUndefined()
  })

  it('toggles rows as pressed buttons and updates v-model:hidden', async () => {
    const wrapper = mount(ChartLegend, {
      props: {
        'series': ['a', 'b'],
        'toggleable': true,
        'hidden': ['b'],
        'onUpdate:hidden': (value: string[]) => wrapper.setProps({ hidden: value }),
      },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons.map(button => button.attributes('type'))).toEqual(['button', 'button'])
    expect(buttons.map(button => button.attributes('aria-pressed'))).toEqual(['true', 'false'])

    await buttons[0]!.trigger('click')
    expect(wrapper.emitted('update:hidden')!.at(-1)).toEqual([['b', 'a']])
    expect(wrapper.findAll('button').map(button => button.attributes('aria-pressed'))).toEqual(['false', 'false'])

    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:hidden')!.at(-1)).toEqual([['a']])
    expect(wrapper.findAll('button').map(button => button.attributes('aria-pressed'))).toEqual(['false', 'true'])
  })

  it('keeps toggle state locally without a bound hidden', async () => {
    const wrapper = mount(ChartLegend, { props: { series: ['a'], toggleable: true } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')
    expect(wrapper.get('[data-slot="chart-legend-item"]').attributes('data-hidden')).toBe('true')
  })

  it('drops the hidden share from the other slices', () => {
    const wrapper = mount(ChartLegend, { props: { data: devices, index: 'name', showPercent: true, hidden: ['Mobile'] } })
    expect(wrapper.findAll('[data-slot="chart-legend-percent"]').map(node => node.text())).toEqual(['75%', '25%'])
  })

  it('renders custom row content through the item slot, inside the toggle button', async () => {
    const wrapper = mount(ChartLegend, {
      props: { series: { a: { name: 'Alpha' } }, toggleable: true },
      slots: {
        item: ({ item, index, toggle }: { item: { name: string, hidden: boolean }, index: number, toggle: () => void }) =>
          h('span', { class: 'custom', onClick: (event: Event) => { event.stopPropagation(); toggle() } }, `${index}:${item.name}:${item.hidden}`),
      },
    })
    expect(wrapper.find('[data-slot="chart-legend-label"]').exists()).toBe(false)
    expect(wrapper.get('button .custom').text()).toBe('0:Alpha:false')
    await wrapper.get('.custom').trigger('click')
    expect(wrapper.get('.custom').text()).toBe('0:Alpha:true')
  })

  it('merges class and ui overrides', () => {
    const wrapper = mount(ChartLegend, { props: { series: ['a'], class: 'mt-4', ui: { label: 'text-danger' } } })
    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.get('[data-slot="chart-legend-label"]').classes()).toContain('text-danger')
  })
})
