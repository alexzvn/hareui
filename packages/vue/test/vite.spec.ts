import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import * as charts from '@/charts'
import Button from '@/components/button/Button.vue'
import type { HareUIConfig } from '@/config'
import { createHareUI } from '@/config'
import * as lib from '@/index'
import { HareUIResolver } from '@/vite'

const globals = globalThis as { __HAREUI_UI__?: HareUIConfig['ui'] }

const resolve = (name: string, prefix?: string) => {
  const resolver = HareUIResolver({ prefix })
  return typeof resolver === 'function' ? resolver(name) : resolver.resolve(name)
}

describe('HareUIResolver', () => {
  it('resolves every component the package exports', () => {
    const exported = Object.entries(lib)
      .filter(
        ([, value]) =>
          typeof value === 'object' && value !== null && ('setup' in value || 'render' in value),
      )
      .map(([name]) => name)

    expect(exported.length).toBeGreaterThan(80)
    for (const name of exported) expect(resolve(name), name).toEqual({ name, from: '@hareui/vue' })
  })

  it('resolves chart components to the charts subpath', () => {
    const exported = Object.entries(charts)
      .filter(
        ([, value]) =>
          typeof value === 'object' && value !== null && ('setup' in value || 'render' in value),
      )
      .map(([name]) => name)

    expect(exported).toContain('AreaChart')
    expect(exported).toContain('ChartTooltipContent')

    for (const name of exported)
      expect(resolve(name), name).toEqual({ name, from: '@hareui/vue/charts' })

    expect(resolve('HChartArea', 'H')).toEqual({ name: 'ChartArea', from: '@hareui/vue/charts' })
  })

  it('resolves only names carrying the prefix, accepting a kebab-case prefix', () => {
    expect(resolve('HButton', 'H')).toEqual({ name: 'Button', from: '@hareui/vue' })
    expect(resolve('HButton', 'h-')).toEqual({ name: 'Button', from: '@hareui/vue' })
    expect(resolve('HareDatePicker', 'hare')).toEqual({ name: 'DatePicker', from: '@hareui/vue' })
    expect(resolve('Button', 'H')).toBeUndefined()
  })

  it('ignores non-component exports and unknown names', () => {
    expect(resolve('ToastQueue')).toBeUndefined()
    expect(resolve('RouterLink')).toBeUndefined()
    expect(resolve('HRouterLink', 'H')).toBeUndefined()
  })
})

describe('vite plugin ui option', () => {
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
