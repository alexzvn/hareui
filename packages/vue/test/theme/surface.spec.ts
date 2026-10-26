import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Surface from '@/components/surface/Surface.vue'

describe('Surface theme', () => {
  it('defaults to the default variant background', () => {
    expect(mount(Surface).classes()).toContain('bg-surface')
  })

  it('applies variant-specific background classes', () => {
    expect(mount(Surface, { props: { variant: 'secondary' } }).classes()).toContain(
      'bg-surface-secondary',
    )

    expect(mount(Surface, { props: { variant: 'tertiary' } }).classes()).toContain(
      'bg-surface-tertiary',
    )

    expect(mount(Surface, { props: { variant: 'transparent' } }).classes()).toContain(
      'bg-transparent',
    )
  })
})
