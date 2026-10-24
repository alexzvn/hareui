import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { ChartTooltipContentEntry } from '@/components/chart-tooltip/ChartTooltipContent.vue'
import ChartTooltipContent from '@/components/chart-tooltip/ChartTooltipContent.vue'
import ChartTooltipHeader from '@/components/chart-tooltip/ChartTooltipHeader.vue'
import ChartTooltipIndicator from '@/components/chart-tooltip/ChartTooltipIndicator.vue'
import ChartTooltipItem from '@/components/chart-tooltip/ChartTooltipItem.vue'
import ChartTooltipLabel from '@/components/chart-tooltip/ChartTooltipLabel.vue'
import ChartTooltipValue from '@/components/chart-tooltip/ChartTooltipValue.vue'

import { expectAccessible } from './a11y'

const payload = [
  { name: 'Revenue', color: 'var(--chart-3)', value: 18200 },
  { name: 'Expenses', stroke: 'var(--chart-1)', value: 9800 },
  { dataKey: 'referral', fill: 'var(--chart-2)', value: 'n/a' },
]

const rows = (wrapper: ReturnType<typeof mount>) => {
  return wrapper.findAll('[data-slot="chart-tooltip-item"]').map((row) => ({
    color: (row.get('[data-slot="chart-tooltip-indicator"]').element as HTMLElement).style
      .backgroundColor,
    label: row.get('[data-slot="chart-tooltip-label"]').text(),
    value: row.get('[data-slot="chart-tooltip-value"]').text(),
  }))
}

describe('ChartTooltipContent', () => {
  it('builds the header and one row per payload entry', () => {
    const wrapper = mount(ChartTooltipContent, { props: { label: 'February', payload } })
    expect(wrapper.attributes('data-slot')).toBe('chart-tooltip')
    expect(wrapper.get('[data-slot="chart-tooltip-header"]').text()).toBe('February')

    expect(rows(wrapper)).toEqual([
      { color: 'var(--chart-3)', label: 'Revenue', value: '18200' },
      { color: 'var(--chart-1)', label: 'Expenses', value: '9800' },
      { color: 'var(--chart-2)', label: 'referral', value: 'n/a' },
    ])
  })

  it('applies label and value formatters', () => {
    const wrapper = mount(ChartTooltipContent, {
      props: {
        label: 'Jan',
        payload: [{ name: 'Portfolio', color: 'red', value: 24801.32 }],
        labelFormatter: (label: number | string) => `Month: ${label}`,
        valueFormatter: (value: number | string) => `$${Number(value).toFixed(1)}`,
      },
    })

    expect(wrapper.get('[data-slot="chart-tooltip-header"]').text()).toBe('Month: Jan')
    expect(wrapper.get('[data-slot="chart-tooltip-value"]').text()).toBe('$24801.3')
  })

  it('hides the header with hideHeader or without a label', () => {
    expect(
      mount(ChartTooltipContent, { props: { label: 'Jan', payload, hideHeader: true } })
        .find('[data-slot="chart-tooltip-header"]')
        .exists(),
    ).toBe(false)

    expect(
      mount(ChartTooltipContent, { props: { payload } })
        .find('[data-slot="chart-tooltip-header"]')
        .exists(),
    ).toBe(false)
  })

  it('renders nothing when inactive', () => {
    const wrapper = mount(ChartTooltipContent, { props: { active: false, label: 'Jan', payload } })
    expect(wrapper.find('[data-slot="chart-tooltip"]').exists()).toBe(false)
  })

  it('reports the indicator variant and hides the swatch from screen readers', () => {
    const dot = mount(ChartTooltipContent, { props: { payload } })
    expect(dot.attributes('data-indicator')).toBe('dot')
    const line = mount(ChartTooltipContent, { props: { payload, indicator: 'line' } })
    expect(line.attributes('data-indicator')).toBe('line')
    expect(line.get('[data-slot="chart-tooltip-indicator"]').attributes('aria-hidden')).toBe('true')
  })

  it('keeps one row per entry when entries share a dataKey, and prints null as empty', () => {
    const wrapper = mount(ChartTooltipContent, {
      props: {
        payload: [
          { dataKey: 'sales', name: 'Bars', color: 'red', value: 4 },
          { dataKey: 'sales', name: 'Trend', color: 'blue', value: null as unknown as number },
        ],
      },
    })

    expect(rows(wrapper)).toEqual([
      { color: 'red', label: 'Bars', value: '4' },
      { color: 'blue', label: 'Trend', value: '' },
    ])
  })

  it('renders manual composition from the default slot instead of the payload', () => {
    const wrapper = mount(ChartTooltipContent, {
      props: { indicator: 'line', label: 'ignored', payload, ui: { value: 'text-accent' } },
      slots: {
        default: () => [
          h(ChartTooltipHeader, () => 'March 2025'),
          h(ChartTooltipItem, () => [
            h(ChartTooltipIndicator, { color: 'var(--chart-3)' }),
            h(ChartTooltipLabel, () => 'Organic'),
            h(ChartTooltipValue, { class: 'tabular-nums' }, () => '15,200'),
          ]),
        ],
      },
    })

    expect(wrapper.get('[data-slot="chart-tooltip-header"]').text()).toBe('March 2025')
    expect(rows(wrapper)).toEqual([{ color: 'var(--chart-3)', label: 'Organic', value: '15,200' }])

    expect(wrapper.get('[data-slot="chart-tooltip-indicator"]').attributes('aria-hidden')).toBe(
      'true',
    )
  })

  it('renders the footer slot under the payload rows with label and payload', () => {
    const wrapper = mount(ChartTooltipContent, {
      props: { label: 'Jan', payload },
      slots: {
        footer: ({
          label,
          payload: rows,
        }: {
          label?: string | number
          payload: ChartTooltipContentEntry[]
        }) =>
          h(
            'div',
            { 'data-test': 'footer' },
            `${label} total ${rows.reduce((sum, row) => sum + Number(row.value), 0)}`,
          ),
      },
    })

    const children = [...wrapper.element.children]
    expect(children.at(-1)?.getAttribute('data-test')).toBe('footer')

    expect(wrapper.get('[data-test=footer]').text()).toBe(
      `Jan total ${payload.reduce((sum, row) => sum + Number(row.value), 0)}`,
    )
  })

  it('is accessible with payload rows, each indicator variant and a footer', async () => {
    for (const indicator of ['dot', 'line'] as const) {
      const wrapper = mount(ChartTooltipContent, {
        props: { label: 'Jan', payload, indicator },
        slots: { footer: () => h('div', 'Total 28,000') },
        attachTo: document.body,
      })

      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('is accessible when composed by hand', async () => {
    const wrapper = mount(ChartTooltipContent, {
      slots: {
        default: () => [
          h(ChartTooltipHeader, () => 'March 2025'),
          h(ChartTooltipItem, () => [
            h(ChartTooltipIndicator, { color: 'var(--chart-3)' }),
            h(ChartTooltipLabel, () => 'Organic'),
            h(ChartTooltipValue, () => '15,200'),
          ]),
        ],
      },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('merges class and ui into the panel', () => {
    const wrapper = mount(ChartTooltipContent, {
      props: { payload, class: 'min-w-48', ui: { base: 'rounded-2xl' } },
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['min-w-48', 'rounded-2xl']))
  })

  it('throws when a part is used outside ChartTooltipContent', () => {
    expect(() => mount(ChartTooltipItem)).toThrow(/inside ChartTooltipContent/)
  })
})
