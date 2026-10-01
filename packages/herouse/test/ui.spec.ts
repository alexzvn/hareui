import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '../src/components/Button.vue'
import { createHeroUse } from '../src/config'

describe('class precedence', () => {
  it('class prop beats :ui, which beats app config, which beats the theme', () => {
    const wrapper = mount(Button, {
      props: { ui: { base: 'px-2' }, class: 'px-3' },
      global: { plugins: [createHeroUse({ ui: { button: { slots: { base: 'px-1' } } } })] },
    })
    const classes = wrapper.classes()
    expect(classes).toContain('px-3')
    expect(classes).not.toContain('px-1')
    expect(classes).not.toContain('px-2')
    expect(classes).not.toContain('px-4')
  })

  it('app config beats the theme default', () => {
    const wrapper = mount(Button, {
      global: { plugins: [createHeroUse({ ui: { button: { slots: { base: 'px-1' } } } })] },
    })
    expect(wrapper.classes()).toContain('px-1')
    expect(wrapper.classes()).not.toContain('px-4')
  })

  it('app config can change default variants', () => {
    const wrapper = mount(Button, {
      global: { plugins: [createHeroUse({ ui: { button: { defaultVariants: { size: 'lg' } } } })] },
    })
    expect(wrapper.classes()).toContain('h-11')
  })

  it('uses the default theme without the plugin', () => {
    expect(mount(Button).classes()).toContain('px-4')
  })
})
