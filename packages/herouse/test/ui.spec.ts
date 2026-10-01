import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '../src/components/Button.vue'
import Description from '../src/components/Description.vue'
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
    expect(wrapper.classes()).toContain('[--button-height:--spacing(11)]')
  })

  it('uses the default theme without the plugin', () => {
    expect(mount(Button).classes()).toContain('px-4')
  })
})

describe('font-size merging', () => {
  // HeroUI's `.description { @apply text-xs }` lives in a lower CSS layer, so a `text-[10px]` override keeps
  // text-xs's line-height. Both classes must survive the merge for herouse to render the same.
  it('keeps the named size (and its line-height) under an arbitrary length size', () => {
    const classes = mount(Description, { props: { class: 'text-[10px]' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['text-xs', 'text-muted', 'text-[10px]']))
  })

  it('lets a later named size evict both the base size and an earlier arbitrary size', () => {
    const classes = mount(Description, { props: { class: 'text-[10px] text-sm' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['text-sm', 'text-muted']))
    expect(classes).not.toContain('text-xs')
    expect(classes).not.toContain('text-[10px]')
  })

  it('still treats arbitrary colors as colors', () => {
    const classes = mount(Description, { props: { class: 'text-[#fff]' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['text-xs', 'text-[#fff]']))
    expect(classes).not.toContain('text-muted')
  })
})
