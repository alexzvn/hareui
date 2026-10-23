import type { HareUIConfig } from '../src/config'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import Button from '../src/components/button/Button.vue'
import Input from '../src/components/input/Input.vue'
import Description from '../src/components/description/Description.vue'
import { createHareUI, hareUIConfigKey } from '../src/config'

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
    expect(classes).not.toContain('px-4')
  })

  it('app config beats the theme default', () => {
    const wrapper = mount(Button, {
      global: { plugins: [createHareUI({ ui: { button: { slots: { base: 'px-1' } } } })] },
    })
    expect(wrapper.classes()).toContain('px-1')
    expect(wrapper.classes()).not.toContain('px-4')
  })

  it('app config can change default variants', () => {
    const wrapper = mount(Button, {
      global: { plugins: [createHareUI({ ui: { button: { defaultVariants: { size: 'lg' } } } })] },
    })
    expect(wrapper.classes()).toContain('[--button-height:--spacing(11)]')
  })

  it('uses the default theme without the plugin', () => {
    expect(mount(Button).classes()).toContain('px-4')
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

describe('responsive sizes', () => {
  // Breakpoint values only set CSS variables; a single unprefixed class consumes them, so one user
  // class evicts it and wins at every breakpoint.
  it('lets a plain height class replace the responsive button height', () => {
    const classes = mount(Button, { props: { class: 'h-11' } }).classes()
    expect(classes.filter(c => /(^|:)h-/.test(c))).toEqual(['h-11'])
  })

  it('lets a named text size replace the responsive input font size and line-height', () => {
    const classes = mount(Input, { attrs: { class: 'text-lg' } }).classes()
    expect(classes.filter(c => /(^|:)text-(xs|sm|base|lg|xl|\(length)/.test(c))).toEqual(['text-lg'])
  })

  it('keeps the responsive line-height under an arbitrary length size, like HeroUI', () => {
    // HeroUI's `.input` sizes sit in a lower layer, so `text-[18px]` only replaces the font-size.
    // Tailwind sorts `text-[18px]` after the variable class, so its font-size wins.
    const classes = mount(Input, { attrs: { class: 'text-[18px]' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['text-[18px]', 'text-(length:--input-font-size)/(--input-line-height)']))
  })
})

describe('shared theme components', () => {
  it('restyles a mounted instance when the app config `ui` changes', async () => {
    const config: HareUIConfig = reactive({})
    const wrapper = mount(Button, { global: { provide: { [hareUIConfigKey as symbol]: config } } })
    expect(wrapper.classes()).toContain('px-4')
    config.ui = { button: { slots: { base: 'px-1' } } }
    await nextTick()
    expect(wrapper.classes()).toContain('px-1')
    expect(wrapper.classes()).not.toContain('px-4')
  })

  it('resolves variants per instance', async () => {
    const wrapper = mount(defineComponent({
      components: { Button },
      setup: () => ({ size: ref<'sm' | 'lg'>('sm') }),
      template: '<div><Button id="a" :size="size" /><Button id="b" size="lg" /></div>',
    }), { global: { plugins: [createHareUI()] } })
    const lg = '[--button-height:--spacing(11)]'
    expect(wrapper.find('#a').classes()).not.toContain(lg)
    expect(wrapper.find('#b').classes()).toContain(lg)
    ;(wrapper.vm as unknown as { size: 'sm' | 'lg' }).size = 'lg'
    await nextTick()
    expect(wrapper.find('#a').classes()).toContain(lg)
    expect(wrapper.find('#b').classes()).toContain(lg)
    ;(wrapper.vm as unknown as { size: 'sm' | 'lg' }).size = 'sm'
    await nextTick()
    expect(wrapper.find('#a').classes()).not.toContain(lg)
    expect(wrapper.find('#b').classes()).toContain(lg)
  })
})
