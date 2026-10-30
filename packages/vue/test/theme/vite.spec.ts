import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import Button from '@/components/button/Button.vue'
import type { HareUIConfig } from '@/config'
import { createHareUI } from '@/config'

const globals = globalThis as { __HAREUI_UI__?: HareUIConfig['ui'] }

describe('Vite plugin ui theme', () => {
  afterEach(() => {
    delete globals.__HAREUI_UI__
  })

  it('extends the default theme, including default variants', () => {
    globals.__HAREUI_UI__ = { button: { slots: { base: 'px-1' }, defaultVariants: { size: 'lg' } } }
    const classes = mount(Button).classes()
    expect(classes).toContain('px-1')
    expect(classes).toContain('text-base')
  })

  it('sits below createHareUI({ ui }) and the class prop', () => {
    globals.__HAREUI_UI__ = { button: { slots: { base: 'px-1 uppercase' } } }
    const plugins = [createHareUI({ ui: { button: { slots: { base: 'px-2' } } } })]
    const fromApp = mount(Button, { global: { plugins } }).classes()
    expect(fromApp).toContain('px-2')
    expect(fromApp).not.toContain('px-1')
    expect(fromApp).toContain('uppercase')

    expect(mount(Button, { props: { class: 'px-3' }, global: { plugins } }).classes()).toContain(
      'px-3',
    )
  })
})
