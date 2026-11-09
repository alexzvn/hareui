import { describe, expect, it } from 'vitest'

import * as charts from '@/charts'
import * as lib from '@/index'
import type { HareUIResolverOptions } from '@/vite'
import { HareUIResolver } from '@/vite'

const resolve = (name: string, options: string | HareUIResolverOptions = {}) => {
  const resolver = HareUIResolver(typeof options === 'string' ? { prefix: options } : options)
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

describe('HareUIResolver aliases', () => {
  const options = { prefix: 'H', aliases: { Btn: 'Button', 'area-graph': 'AreaChart' } }

  it('resolves an alias tag to its target component', () => {
    expect(resolve('Btn', options)).toEqual({ name: 'Button', from: '@hareui/vue' })
  })

  it('resolves an alias to a chart component to the charts subpath', () => {
    expect(resolve('AreaGraph', options)).toEqual({ name: 'AreaChart', from: '@hareui/vue/charts' })
  })

  it('does not apply the prefix to an alias', () => {
    expect(resolve('HBtn', options)).toBeUndefined()
  })

  it('still resolves prefixed names when aliases are set', () => {
    expect(resolve('HButton', options)).toEqual({ name: 'Button', from: '@hareui/vue' })
  })

  it('throws when an alias targets an unknown component', () => {
    expect(() => HareUIResolver({ aliases: { Btn: 'Buton' } })).toThrow(
      '[hareui] alias "Btn" targets "Buton", which is not a HareUI component.',
    )
  })
})
