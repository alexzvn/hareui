import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { useVisualViewportHeight } from '@/composables/useVisualViewportHeight'

const Probe = defineComponent({
  setup() {
    const height = useVisualViewportHeight()
    return () => h('div', { style: { '--visual-viewport-height': height.value } })
  },
})

const resizeCalls = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter(([type]) => type === 'resize')

describe('useVisualViewportHeight', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shares one resize listener across instances and removes it after the last unmount', async () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const a = mount(Probe)
    const b = mount(Probe)
    expect(resizeCalls(add)).toHaveLength(1)

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(432)
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    for (const w of [a, b])
      expect((w.element as HTMLElement).style.getPropertyValue('--visual-viewport-height')).toBe(
        '432px',
      )

    a.unmount()
    expect(resizeCalls(remove)).toHaveLength(0)
    b.unmount()
    expect(resizeCalls(remove)).toHaveLength(1)
    expect(resizeCalls(remove)[0][1]).toBe(resizeCalls(add)[0][1])
  })
})
