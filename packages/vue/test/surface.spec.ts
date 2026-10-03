import { mount } from '@vue/test-utils'
import { defineComponent, inject, h } from 'vue'
import { describe, expect, it } from 'vitest'
import Surface from '../src/components/surface/Surface.vue'
import { surfaceContextKey } from '../src/components/surface/context'

const VariantReader = defineComponent({
  setup() {
    const ctx = inject(surfaceContextKey)
    return () => h('span', ctx?.variant.value)
  },
})

describe('Surface', () => {
  it('defaults to the default variant and carries data-slot', () => {
    const wrapper = mount(Surface)
    expect(wrapper.attributes('data-slot')).toBe('surface')
    expect(wrapper.classes()).toContain('bg-surface')
  })

  it('applies variant-specific background classes', () => {
    expect(mount(Surface, { props: { variant: 'secondary' } }).classes()).toContain('bg-surface-secondary')
    expect(mount(Surface, { props: { variant: 'tertiary' } }).classes()).toContain('bg-surface-tertiary')
    expect(mount(Surface, { props: { variant: 'transparent' } }).classes()).toContain('bg-transparent')
  })

  it('provides the current variant to descendants via surfaceContextKey', () => {
    const wrapper = mount(Surface, {
      props: { variant: 'secondary' },
      slots: { default: () => h(VariantReader) },
    })
    expect(wrapper.text()).toBe('secondary')
  })
})
