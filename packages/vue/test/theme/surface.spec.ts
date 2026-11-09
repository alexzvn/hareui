import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Surface from '@/components/surface/Surface.vue'

describe('Surface theme', () => {
  it('defaults to the default variant background', () => {
    expect(mount(Surface).classes()).toContain('h-surface--default')
  })

  it('applies variant-specific background classes', () => {
    expect(mount(Surface, { props: { variant: 'secondary' } }).classes()).toContain(
      'h-surface--secondary',
    )

    expect(mount(Surface, { props: { variant: 'tertiary' } }).classes()).toContain(
      'h-surface--tertiary',
    )

    expect(mount(Surface, { props: { variant: 'transparent' } }).classes()).toContain(
      'h-surface--transparent',
    )
  })
})
