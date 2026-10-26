import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue'

const items = [
  { label: 'Home', href: '/home' },
  { label: 'Products', href: '/products' },
  { label: 'Laptop', href: '/laptop' },
]

describe('Breadcrumbs theme', () => {
  it('a single custom separator element receives the separator classes', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { items },
      slots: { separator: () => h('i', { class: 'dot' }) },
    })

    const sep = wrapper.find('[data-slot=breadcrumbs-separator]')
    expect(sep.classes()).toEqual(expect.arrayContaining(['dot', 'size-3', 'text-muted']))
  })
})
