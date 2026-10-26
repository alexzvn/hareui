import { describe, expect, it } from 'vitest'

import * as charts from '@/charts'
import * as lib from '@/index'
import { HareUIResolver } from '@/vite'

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

    expect(exported.map((name) => [name, resolve(name)])).toEqual(
      exported.map((name) => [name, { name, from: '@hareui/vue' }]),
    )
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

    expect(exported.map((name) => [name, resolve(name)])).toEqual(
      exported.map((name) => [name, { name, from: '@hareui/vue/charts' }]),
    )

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
