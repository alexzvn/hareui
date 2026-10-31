import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { Chip } from '@/components/chip'
import TrendChip from '@/components/trend-chip/TrendChip.vue'

import { expectAccessible } from './a11y'

describe('TrendChip', () => {
  it('is accessible with a prefix, value and suffix', async () => {
    const wrapper = mount(TrendChip, {
      props: { trend: 'down' },
      slots: { prefix: () => '$', default: () => '120', suffix: () => 'vs last week' },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('exposes the trend as data-trend, defaulting to up', () => {
    const wrapper = mount(TrendChip, { props: { label: '+1%' } })
    expect(wrapper.attributes('data-trend')).toBe('up')
    wrapper.unmount()
  })

  it.each(['up', 'down', 'neutral'] as const)('reflects trend="%s" in data-trend', (trend) => {
    const wrapper = mount(TrendChip, { props: { trend, label: '0%' } })
    expect(wrapper.attributes('data-trend')).toBe(trend)
    wrapper.unmount()
  })

  it('hides the default arrow from assistive technology', () => {
    const wrapper = mount(TrendChip, { props: { label: '+1%' } })
    expect(wrapper.get('[data-slot="trend-chip-indicator"]').attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('renders no default arrow for the neutral trend', () => {
    const wrapper = mount(TrendChip, { props: { trend: 'neutral', label: '0%' } })
    expect(wrapper.find('[data-slot="trend-chip-indicator"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders the indicator slot for the neutral trend', () => {
    const wrapper = mount(TrendChip, {
      props: { trend: 'neutral', label: '0%' },
      slots: { indicator: () => h('svg', { 'aria-hidden': 'true', 'data-testid': 'custom' }) },
    })

    expect(wrapper.find('[data-testid="custom"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('replaces the arrow with the indicator slot', () => {
    const wrapper = mount(TrendChip, {
      props: { label: '+1%' },
      slots: { indicator: () => h('svg', { 'aria-hidden': 'true', 'data-testid': 'custom' }) },
    })

    expect(wrapper.find('[data-slot="trend-chip-indicator"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="custom"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('reads prefix, value and suffix in order', () => {
    const wrapper = mount(TrendChip, {
      props: { label: '1,234' },
      slots: { prefix: () => '+$', suffix: () => 'MoM' },
    })

    expect(wrapper.get('[data-slot="trend-chip-prefix"]').text()).toBe('+$')
    expect(wrapper.get('[data-slot="trend-chip-value"]').text()).toBe('1,234')
    expect(wrapper.get('[data-slot="trend-chip-suffix"]').text()).toBe('MoM')
    wrapper.unmount()
  })

  it('separates the prefix, value and suffix with word spaces', () => {
    const wrapper = mount(TrendChip, {
      props: { trend: 'down', label: '-7.5%' },
      slots: { prefix: () => '$', suffix: () => 'vs last quarter' },
    })

    expect(wrapper.element.textContent).toBe('$ -7.5% vs last quarter')
    wrapper.unmount()
  })

  it('adds no spaces around a value without a prefix or suffix', () => {
    const wrapper = mount(TrendChip, { props: { label: '+1%' } })
    expect(wrapper.element.textContent).toBe('+1%')
    wrapper.unmount()
  })

  it('renders no prefix or suffix wrapper without those slots', () => {
    const wrapper = mount(TrendChip, { props: { label: '+1%' } })
    expect(wrapper.find('[data-slot="trend-chip-prefix"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="trend-chip-suffix"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('uses the default colour for the neutral trend', () => {
    const wrapper = mount(TrendChip, { props: { trend: 'neutral', label: '0%' } })

    expect(wrapper.getComponent(Chip).props('color')).toBe('default')
  })
})
