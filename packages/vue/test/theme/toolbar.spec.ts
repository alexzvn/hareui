import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ButtonGroup from '@/components/button-group/ButtonGroup.vue'
import Button from '@/components/button/Button.vue'
import Separator from '@/components/separator/Separator.vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'

describe('Toolbar theme', () => {
  it('lays out Separators and ButtonGroups for a vertical toolbar', () => {
    const wrapper = mount(Toolbar, {
      props: { 'aria-label': 'Text formatting', orientation: 'vertical' },
      slots: {
        default: () => [
          h(Separator),
          h(ButtonGroup, null, () => h(Button, { 'aria-label': 'copy' }, () => 'C')),
        ],
      },
    })

    expect(wrapper.find('[data-slot=separator]').classes()).toEqual(
      expect.arrayContaining(['w-1/2', 'justify-self-center']),
    )

    expect(wrapper.find('[data-slot=button-group]').classes()).toEqual(
      expect.arrayContaining(['justify-start', 'flex-col']),
    )
  })

  it('lets classes on children win over the toolbar', () => {
    const wrapper = mount(Toolbar, {
      slots: { default: () => h(Separator, { orientation: 'horizontal', class: 'w-4' }) },
    })

    const separator = wrapper.find('[data-slot=separator]')
    expect(separator.classes()).toContain('w-4')
    expect(separator.classes()).not.toContain('w-1/2')
  })
})
