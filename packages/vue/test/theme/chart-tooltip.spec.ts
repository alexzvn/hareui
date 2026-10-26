import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import ChartTooltipContent from '@/components/chart-tooltip/ChartTooltipContent.vue'
import PieChart from '@/components/pie-chart/PieChart.vue'

const payload = [
  { name: 'Revenue', color: 'var(--chart-3)', value: 18200 },
  { name: 'Expenses', stroke: 'var(--chart-1)', value: 9800 },
  { dataKey: 'referral', fill: 'var(--chart-2)', value: 'n/a' },
]

const browsers = [
  { name: 'Chrome', visits: 1 },
  { name: 'Safari', visits: 3 },
  { name: 'Edge', visits: 4, fill: 'red' },
]

const settle = async () => {
  await flushPromises()
  await nextTick()
}

describe('ChartTooltip theme', () => {
  // Reduced motion: no tooltip slide, so the live region is final after one settle.
  beforeAll(() => vi.stubGlobal('matchMedia', () => ({ matches: true })))
  afterAll(() => vi.unstubAllGlobals())

  it('merges class and ui into the panel', () => {
    const wrapper = mount(ChartTooltipContent, {
      props: { payload, class: 'min-w-48', ui: { base: 'rounded-2xl' } },
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['min-w-48', 'rounded-2xl']))
  })

  it('without a panel, keeps the live region visually hidden', async () => {
    const wrapper = mount(PieChart, {
      props: {
        data: browsers,
        index: 'name',
        width: 200,
        height: 200,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        hidden: ['Chrome'],
        tooltip: { panel: false },
        'aria-label': 'Visits by browser',
      },
      attachTo: document.body,
    })

    await settle()
    ;(wrapper.find('[data-slot=chart-surface]').element as SVGElement).focus()
    await settle()
    expect(wrapper.find('[data-slot=chart-tooltip-wrapper]').classes()).toContain('sr-only')
    wrapper.unmount()
  })
})
