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

    // `.h-toolbar--vertical` aligns its ButtonGroups and `.h-toolbar .h-separator--horizontal` sizes the Separator.
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-toolbar', 'h-toolbar--vertical']))
    expect(wrapper.find('[data-slot=separator]').classes()).toContain('h-separator--horizontal')

    expect(wrapper.find('[data-slot=button-group]').classes()).toEqual(
      expect.arrayContaining(['h-button-group', 'h-button-group--vertical']),
    )
  })

  it('lets classes on children win over the toolbar', () => {
    const wrapper = mount(Toolbar, {
      slots: { default: () => h(Separator, { orientation: 'horizontal', class: 'w-4' }) },
    })

    const separator = wrapper.find('[data-slot=separator]')
    expect(separator.classes()).toContain('w-4')
  })
})
