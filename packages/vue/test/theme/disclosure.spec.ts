import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { h } from 'vue'

import Disclosure from '@/components/disclosure/Disclosure.vue'

describe('Disclosure theme', () => {
  it('#trigger: the themed indicator merges a class passed to it', () => {
    const wrapper = mount(Disclosure, {
      slots: {
        trigger: ({ indicator }: { indicator: Component }) =>
          h('button', { 'data-slot': 'button' }, ['Toggle', h(indicator, { class: 'extra' })]),
        default: () => 'Content',
      },
    })

    expect(wrapper.get('[data-slot=disclosure-indicator]').classes()).toContain('extra')
  })
})
