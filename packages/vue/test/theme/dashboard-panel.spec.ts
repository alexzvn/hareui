import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DashboardPanel from '@/components/dashboard-panel/DashboardPanel.vue'

describe('DashboardPanel theme', () => {
  it('fills the space until sized, then takes the --width', () => {
    const unsized = mount(DashboardPanel, { props: { id: 'inbox' } })
    const sized = mount(DashboardPanel, { props: { id: 'drafts', defaultSize: 50 } })
    expect(unsized.get('[data-slot=dashboard-panel]').element.className).toContain('flex-1')
    expect(sized.get('[data-slot=dashboard-panel]').element.className).toContain('md:w-(--width)')
  })
})
