import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { IconRenderer } from '@/utils/icon'

describe('IconRenderer theme', () => {
  it('renders a string icon as the class of its span', () => {
    const wrapper = mount(IconRenderer, { props: { icon: 'i-lucide-x' } })
    expect(wrapper.classes()).toContain('i-lucide-x')
  })
})
