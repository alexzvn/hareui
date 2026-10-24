import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import DashboardResizeHandle from '@/components/dashboard-resize-handle/DashboardResizeHandle.vue'

import { expectAccessible } from './a11y'

describe('DashboardResizeHandle', () => {
  it('is a static separator on its own: not focusable and passes axe', async () => {
    const wrapper = mount(DashboardResizeHandle, { attachTo: document.body })
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('becomes a focusable window splitter with the attributes the sidebar and panel hand it, and passes axe', async () => {
    const wrapper = mount(
      {
        render: () => [
          h('div', { id: 'pane' }, 'Pane'),
          h(DashboardResizeHandle, {
            tabindex: 0,
            'aria-label': 'Resize pane',
            'aria-controls': 'pane',
            'aria-orientation': 'vertical',
            'aria-valuenow': 30,
            'aria-valuemin': 10,
            'aria-valuemax': 60,
          }),
        ],
      },
      { attachTo: document.body },
    )
    const handle = document.querySelector<HTMLElement>('[data-slot=dashboard-resize-handle]')!
    expect(handle.getAttribute('role')).toBe('separator')
    expect(handle.getAttribute('aria-valuenow')).toBe('30')
    expect(document.getElementById(handle.getAttribute('aria-controls')!)!.textContent).toBe('Pane')
    handle.focus()
    expect(document.activeElement).toBe(handle)
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
