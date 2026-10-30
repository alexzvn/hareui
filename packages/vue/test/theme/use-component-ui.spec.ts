import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, reactive } from 'vue'

import buttonTheme from '@/components/button/theme'
import { useComponentUI } from '@/composables/useComponentUI'
import type { HareUIConfig } from '@/config'
import { createHareUI } from '@/config'
import type { SlotClasses } from '@/types/tv'

const globals = globalThis as { __HAREUI_UI__?: HareUIConfig['ui'] }

type Layers = {
  buildUi?: string
  appUi?: string
  call?: SlotClasses
  props?: { ui?: { base?: string }; class?: string }
}

// Renders the button theme's `base` slot with every layer set as given; returns its class list.
const render = ({ buildUi, appUi, call, props }: Layers) => {
  if (buildUi) globals.__HAREUI_UI__ = { button: { slots: { base: buildUi } } }

  const userProps: Layers['props'] = props && reactive(props)
  const Probe = defineComponent(() => {
    const ui = useComponentUI('button', {
      theme: buttonTheme,
      variantProps: () => ({}),
      props: userProps,
    })

    return () => h('div', { class: ui.value.base(call) })
  })

  const plugins = appUi ? [createHareUI({ ui: { button: { slots: { base: appUi } } } })] : []

  return mount(Probe, { global: { plugins } }).classes()
}

describe('useComponentUI layer precedence (tailwind-merge: last wins)', () => {
  afterEach(() => {
    delete globals.__HAREUI_UI__
  })

  it('build-time ui beats the theme', () => {
    const classes = render({ buildUi: 'px-1' })
    expect(classes).toContain('px-1')
    expect(classes).not.toContain('px-4')
  })

  it('app ui beats build-time ui', () => {
    const classes = render({ buildUi: 'px-1', appUi: 'px-2' })
    expect(classes).toContain('px-2')
    expect(classes).not.toContain('px-1')
  })

  it('a call’s class beats app ui', () => {
    const classes = render({ appUi: 'px-2', call: { class: 'px-3' } })
    expect(classes).toContain('px-3')
    expect(classes).not.toContain('px-2')
  })

  it('props.ui beats a call’s class', () => {
    const classes = render({ call: { class: 'px-3' }, props: { ui: { base: 'px-5' } } })
    expect(classes).toContain('px-5')
    expect(classes).not.toContain('px-3')
  })

  it('props.class beats props.ui on the class slot', () => {
    const classes = render({ props: { ui: { base: 'px-5' }, class: 'px-6' } })
    expect(classes).toContain('px-6')
    expect(classes).not.toContain('px-5')
  })

  it('a call’s override beats props.class', () => {
    const classes = render({ call: { override: 'px-7' }, props: { class: 'px-6' } })
    expect(classes).toContain('px-7')
    expect(classes).not.toContain('px-6')
  })
})
