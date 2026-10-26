import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h, inject } from 'vue'

import { surfaceContextKey } from '@/components/surface/context'
import Surface from '@/components/surface/Surface.vue'

import { expectAccessible } from './a11y'

const VariantReader = defineComponent({
  setup() {
    const ctx = inject(surfaceContextKey)
    return () => h('span', ctx?.variant.value)
  },
})

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('Surface', () => {
  it('carries data-slot', () => {
    const wrapper = mount(Surface)
    expect(wrapper.attributes('data-slot')).toBe('surface')
  })

  it('provides the current variant to descendants via surfaceContextKey', () => {
    const wrapper = mount(Surface, {
      props: { variant: 'secondary' },
      slots: { default: () => h(VariantReader) },
    })

    expect(wrapper.text()).toBe('secondary')
  })

  it('is accessible as a plain container and as a labelled section', async () => {
    const wrapper = mountAll(() => [
      h(Surface, null, () => h('p', 'Content')),
      h(Surface, { as: 'section', variant: 'secondary', 'aria-label': 'Settings' }, () =>
        h('p', 'Content'),
      ),
    ])

    expect(wrapper.get('section').attributes('aria-label')).toBe('Settings')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
