import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Kbd from '@/components/kbd/Kbd.vue'

describe('Kbd theme', () => {
  it('applies the light variant and per-slot overrides', () => {
    const wrapper = mount(Kbd, {
      props: { variant: 'light', keys: 'up', ui: { abbr: 'font-bold' } },
    })

    expect(wrapper.classes()).toContain('bg-transparent')
    expect(wrapper.classes()).not.toContain('bg-default')
    expect(wrapper.get('abbr').classes()).toContain('font-bold')
  })
})
