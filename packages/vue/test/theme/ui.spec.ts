import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'

import Button from '@/components/button/Button.vue'
import Description from '@/components/description/Description.vue'
import Input from '@/components/input/Input.vue'
import type { HareUIConfig } from '@/config'
import { createHareUI, hareUIConfigKey } from '@/config'

describe('class precedence', () => {
  it('class prop beats :ui, which beats app config, which beats the theme', () => {
    const wrapper = mount(Button, {
      props: { ui: { base: 'px-2' }, class: 'px-3' },
      global: { plugins: [createHareUI({ ui: { button: { slots: { base: 'px-1' } } } })] },
    })

    const classes = wrapper.classes()
    expect(classes).toContain('px-3')
    expect(classes).not.toContain('px-1')
    expect(classes).not.toContain('px-2')
  })

  it('app config beats the theme default', () => {
    const wrapper = mount(Button, {
      global: { plugins: [createHareUI({ ui: { button: { slots: { base: 'px-1' } } } })] },
    })

    expect(wrapper.classes()).toContain('px-1')
  })

  it('app config can change default variants', () => {
    const wrapper = mount(Button, {
      global: { plugins: [createHareUI({ ui: { button: { defaultVariants: { size: 'lg' } } } })] },
    })

    expect(wrapper.classes()).toContain('h-button--lg')
  })

  it('uses the default theme without the plugin', () => {
    expect(mount(Button).classes()).toEqual(
      expect.arrayContaining(['h-button', 'h-button--primary']),
    )
  })
})

describe('font-size merging', () => {
  // HeroUI's `.description { @apply text-xs }` lives in a lower CSS layer, so a `text-[10px]` override keeps
  // text-xs's line-height. Both classes must survive the merge for HareUI to render the same.
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

describe('BEM classes under user utilities', () => {
  // The component styles live in `h-*` classes in `@layer components`; a user utility wins by layer order, so
  // tailwind-merge must keep the block class next to a conflicting-looking `h-*` / `text-*` utility.
  it('keeps the button block class under a height utility', () => {
    const classes = mount(Button, { props: { class: 'h-11' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['h-button', 'h-button--primary', 'h-11']))
  })

  it('keeps the input block class under a named text size', () => {
    const classes = mount(Input, { attrs: { class: 'text-lg' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['h-input', 'text-lg']))
  })

  it('keeps the input block class under an arbitrary length size', () => {
    const classes = mount(Input, { attrs: { class: 'text-[18px] h-12' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['h-input', 'text-[18px]', 'h-12']))
  })
})

describe('shared theme components', () => {
  it('restyles a mounted instance when the app config `ui` changes', async () => {
    const config: HareUIConfig = reactive({})
    const wrapper = mount(Button, { global: { provide: { [hareUIConfigKey as symbol]: config } } })
    expect(wrapper.classes()).not.toContain('px-1')
    config.ui = { button: { slots: { base: 'px-1' } } }
    await nextTick()
    expect(wrapper.classes()).toContain('px-1')
  })

  it('resolves variants per instance', async () => {
    const size = ref<'sm' | 'lg'>('sm')
    const wrapper = mount(
      defineComponent({
        components: { Button },
        setup: () => ({ size }),
        template: '<div><Button id="a" :size="size" /><Button id="b" size="lg" /></div>',
      }),
      { global: { plugins: [createHareUI()] } },
    )

    const lg = 'h-button--lg'
    expect(wrapper.find('#a').classes()).not.toContain(lg)
    expect(wrapper.find('#b').classes()).toContain(lg)
    size.value = 'lg'
    await nextTick()
    expect(wrapper.find('#a').classes()).toContain(lg)
    expect(wrapper.find('#b').classes()).toContain(lg)
    size.value = 'sm'
    await nextTick()
    expect(wrapper.find('#a').classes()).not.toContain(lg)
    expect(wrapper.find('#b').classes()).toContain(lg)
  })
})
