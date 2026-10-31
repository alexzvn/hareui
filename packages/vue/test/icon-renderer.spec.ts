import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, reactive } from 'vue'

import { IconRenderer } from '@/utils/icon'

const SvgIcon = defineComponent({ render: () => h('svg', { 'data-testid': 'svg' }) })

describe('IconRenderer', () => {
  it('renders a string as a hidden span', () => {
    const wrapper = mount(IconRenderer, { props: { icon: 'i-lucide-x' } })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('renders a component hidden from assistive technology', () => {
    const wrapper = mount(IconRenderer, { props: { icon: SvgIcon } })

    expect(wrapper.get('[data-testid=svg]').attributes('aria-hidden')).toBe('true')
  })

  it('passes attributes on to the rendered icon', () => {
    const wrapper = mount(IconRenderer, {
      props: { icon: SvgIcon },
      attrs: { 'data-slot': 'leading-icon' },
    })

    expect(wrapper.get('svg').attributes('data-slot')).toBe('leading-icon')
  })

  it('renders a component read from reactive state without a Vue warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const state = reactive({ icon: SvgIcon })

    const wrapper = mount(IconRenderer, { props: { icon: state.icon } })

    expect(wrapper.find('[data-testid=svg]').exists()).toBe(true)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})
