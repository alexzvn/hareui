import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ScrollShadow from '../src/components/ScrollShadow.vue'

describe('scrollShadow', () => {
  it('manual visibility sets the matching data flag and manual mode', async () => {
    const wrapper = mount(ScrollShadow, { props: { visibility: 'both' } })
    const root = wrapper.find('[data-slot=scroll-shadow]')
    expect(root.attributes('data-scroll-shadow-mode')).toBe('manual')
    expect(root.attributes('data-top-bottom-scroll')).toBe('true')

    await wrapper.setProps({ orientation: 'horizontal', visibility: 'left' })
    expect(root.attributes('data-left-scroll')).toBe('true')
    expect(root.attributes('data-top-bottom-scroll')).toBeUndefined()

    await wrapper.setProps({ visibility: 'none' })
    expect(Object.keys(root.attributes()).filter(a => a.endsWith('-scroll'))).toEqual([])
  })

  it('auto mode publishes no flags until measured, and disabled detection is manual', () => {
    const auto = mount(ScrollShadow)
    expect(auto.attributes('data-scroll-shadow-mode')).toBe('auto')
    expect(Object.keys(auto.attributes()).filter(a => a.endsWith('-scroll'))).toEqual([])
    expect(mount(ScrollShadow, { props: { enabled: false } }).attributes('data-scroll-shadow-mode')).toBe('manual')
  })
})
