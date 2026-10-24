import { describe, expect, it } from 'vitest'

import type { ChartAreaSeries } from '@/components/chart/series-config'
import {
  barEndRadius,
  CHART_PALETTE,
  chartColorAt,
  chartGradientId,
  inferValueKeys,
  isChartGenerated,
  resolveAreaFill,
  resolveChartLegend,
  resolveChartPart,
  resolveSeries,
  resolveSlices,
  seriesValueFormatter,
  toggleHiddenKey,
} from '@/components/chart/series-config'

type Row = Record<string, string | number | null>

const rows: Row[] = [
  { month: 'Jan', organic: 10, paid: 4, note: 'launch' },
  { month: 'Feb', organic: 12, paid: null, referral: 3 },
]

describe('isChartGenerated', () => {
  it('turns on with index, series or sparkline only', () => {
    expect(isChartGenerated({})).toBe(false)
    expect(isChartGenerated({ sparkline: false })).toBe(false)
    expect(isChartGenerated({ index: 'month' })).toBe(true)
    expect(isChartGenerated({ series: ['organic'] })).toBe(true)
    expect(isChartGenerated({ sparkline: true })).toBe(true)
  })
})

describe('inferValueKeys', () => {
  it('keeps numeric keys in first-appearance order, without the index or text fields', () => {
    expect(inferValueKeys(rows, 'month')).toEqual(['organic', 'paid', 'referral'])
  })

  it('skips a key once any of its values is not a number', () => {
    expect(
      inferValueKeys([
        { a: 1, b: 2 },
        { a: 'x', b: 3 },
      ]),
    ).toEqual(['b'])
  })
})

describe('resolveSeries', () => {
  it('infers series from the data and colors them in palette order', () => {
    const series = resolveSeries({ data: rows, index: 'month' })
    expect(series.map((item) => [item.key, item.name, item.color])).toEqual([
      ['organic', 'organic', 'var(--chart-3)'],
      ['paid', 'paid', 'var(--chart-1)'],
      ['referral', 'referral', 'var(--chart-4)'],
    ])

    expect(CHART_PALETTE).toEqual([
      'var(--chart-3)',
      'var(--chart-1)',
      'var(--chart-4)',
      'var(--chart-2)',
      'var(--chart-5)',
    ])
  })

  it('accepts the map and array forms with the same result', () => {
    const fromMap = resolveSeries({ data: rows, series: { paid: { name: 'Paid' }, organic: {} } })

    const fromArray = resolveSeries({
      data: rows,
      series: [{ key: 'paid', name: 'Paid' }, 'organic'],
    })

    expect(fromMap).toEqual(fromArray)

    expect(fromMap.map((item) => [item.key, item.name, item.position])).toEqual([
      ['paid', 'Paid', 0],
      ['organic', 'organic', 1],
    ])
  })

  it('keeps explicit colors and cycles custom colors by position', () => {
    const series = resolveSeries({
      data: rows,
      series: { organic: {}, paid: { color: 'red' }, referral: {} },
      colors: ['blue', 'green'],
    })

    expect(series.map((item) => item.color)).toEqual(['blue', 'red', 'blue'])
    expect(chartColorAt(7)).toBe('var(--chart-4)')
    expect(chartColorAt(1, [])).toBe('var(--chart-1)')
  })

  it('merges series config over chart defaults', () => {
    const [organic, paid] = resolveSeries<Row, ChartAreaSeries>({
      data: rows,
      series: { organic: { strokeWidth: 3 }, paid: {} },
      defaults: { strokeWidth: 2, curve: 'monotone' as const },
    })

    expect(organic).toMatchObject({ strokeWidth: 3, curve: 'monotone' })
    expect(paid).toMatchObject({ strokeWidth: 2, curve: 'monotone' })
  })

  it('marks series hidden from `hide` or the hidden list without changing colors', () => {
    const series = resolveSeries({
      data: rows,
      series: { organic: { hide: true }, paid: {}, referral: {} },
      hidden: ['paid'],
    })

    expect(series.map((item) => [item.key, item.hidden, item.color])).toEqual([
      ['organic', true, 'var(--chart-3)'],
      ['paid', true, 'var(--chart-1)'],
      ['referral', false, 'var(--chart-4)'],
    ])
  })

  it('stacks with `stacked`, a shared `stack: true`, named stacks and opt-outs', () => {
    const stacked = resolveSeries<Row, ChartAreaSeries>({
      data: rows,
      series: { organic: {}, paid: { stack: false }, referral: { stack: 'other' } },
      stacked: true,
    })

    expect(stacked.map((item) => item.stackId)).toEqual(['stack', undefined, 'other'])

    const opted = resolveSeries<Row, ChartAreaSeries>({
      data: rows,
      series: { organic: { stack: true }, paid: {} },
    })

    expect(opted.map((item) => item.stackId)).toEqual(['stack', undefined])
  })
})

describe('toggleHiddenKey', () => {
  it('adds and removes a key without mutating the list', () => {
    const hidden = ['a']
    expect(toggleHiddenKey(hidden, 'b')).toEqual(['a', 'b'])
    expect(toggleHiddenKey(hidden, 'a')).toEqual([])
    expect(hidden).toEqual(['a'])
  })
})

describe('barEndRadius', () => {
  it('rounds only the outer end of the last visible bar in each stack', () => {
    const bars = [
      { key: 'a', hidden: false, stackId: 'stack', radius: 4 },
      { key: 'b', hidden: false, stackId: 'stack', radius: 4 },
      { key: 'c', hidden: true, stackId: 'stack', radius: 4 },
      { key: 'd', hidden: false, radius: 4 },
    ]

    expect(barEndRadius(bars)).toEqual({ a: 0, b: [4, 4, 0, 0], c: 0, d: [4, 4, 0, 0] })
  })

  it('rounds the right end of horizontal bars and passes arrays through', () => {
    expect(barEndRadius([{ key: 'a', hidden: false, radius: 6 }], 'vertical')).toEqual({
      a: [0, 6, 6, 0],
    })

    expect(barEndRadius([{ key: 'a', hidden: false, radius: [1, 2, 3, 4] }])).toEqual({
      a: [1, 2, 3, 4],
    })

    expect(barEndRadius([{ key: 'a', hidden: false }])).toEqual({ a: 0 })
  })
})

describe('area fills', () => {
  it('builds a gradient with a valid id per chart and series', () => {
    expect(chartGradientId('v:1', 'paid ads')).toBe('v_1-fill-paid_ads')

    expect(resolveAreaFill({ key: 'organic', color: 'var(--chart-3)' }, 'c1')).toEqual({
      fill: 'url(#c1-fill-organic)',
      fillOpacity: 1,
      gradient: { id: 'c1-fill-organic', color: 'var(--chart-3)', from: 0.2, to: 0.02 },
    })

    expect(
      resolveAreaFill({ key: 'a', color: 'red', fillOpacity: 0.5 }, 'c1').gradient,
    ).toMatchObject({ from: 0.5, to: 0 })
  })

  it('supports solid, none and custom fills', () => {
    expect(
      resolveAreaFill({ key: 'a', color: 'red', fill: 'solid', fillOpacity: [0.3, 0.1] }, 'c'),
    ).toEqual({ fill: 'red', fillOpacity: 0.3 })

    expect(resolveAreaFill({ key: 'a', color: 'red', fill: 'none' }, 'c')).toEqual({
      fill: 'none',
      fillOpacity: 0,
    })

    expect(
      resolveAreaFill({ key: 'a', color: 'red', fill: 'url(#mine)', fillOpacity: 0.4 }, 'c'),
    ).toEqual({ fill: 'url(#mine)', fillOpacity: 0.4 })
  })
})

describe('seriesValueFormatter', () => {
  it('is undefined without any formatter', () => {
    expect(seriesValueFormatter([{ key: 'a' }])).toBeUndefined()
  })

  it('prefers the series formatter, then the root one with the key', () => {
    const format = seriesValueFormatter(
      [{ key: 'price', valueFormatter: (value) => `$${value}` }, { key: 'units' }],
      (value, key) => `${value} ${key}`,
    )!

    expect(format(5, { dataKey: 'price' })).toBe('$5')
    expect(format(5, { dataKey: 'units' })).toBe('5 units')
    expect(format('n/a', { dataKey: 'price' })).toBe('n/a')
  })
})

describe('resolveChartPart', () => {
  const defaults = { tickMargin: 8 }

  it('maps the boolean and object forms to part props or null', () => {
    expect(resolveChartPart(undefined, defaults)).toEqual({ tickMargin: 8 })
    expect(resolveChartPart(true, defaults)).toEqual({ tickMargin: 8 })
    expect(resolveChartPart(false, defaults)).toBeNull()

    expect(
      resolveChartPart(
        { tickMargin: 2, hide: true },
        defaults as { tickMargin: number; hide?: boolean },
      ),
    ).toEqual({ tickMargin: 2, hide: true })
  })

  it('leaves disabled parts off unless passed explicitly', () => {
    expect(resolveChartPart(undefined, defaults, false)).toBeNull()
    expect(resolveChartPart(true, defaults, false)).toEqual({ tickMargin: 8 })
  })
})

describe('resolveChartLegend', () => {
  it('maps off, boolean, position and object forms', () => {
    expect(resolveChartLegend(undefined)).toBeNull()
    expect(resolveChartLegend(false)).toBeNull()
    expect(resolveChartLegend(true)).toEqual({ position: 'bottom', props: {} })
    expect(resolveChartLegend('right')).toEqual({ position: 'right', props: {} })

    expect(resolveChartLegend({ position: 'top', showValue: true })).toEqual({
      position: 'top',
      props: { showValue: true },
    })

    expect(resolveChartLegend({ showValue: true }, 'top')).toEqual({
      position: 'top',
      props: { showValue: true },
    })
  })
})

describe('resolveSlices', () => {
  const devices = [
    { name: 'Mobile', value: 60 },
    { name: 'Desktop', value: 30, fill: 'pink' },
    { name: 'Tablet', value: 10 },
  ]

  it('names, colors and shares slices; the value key is inferred', () => {
    const slices = resolveSlices({ data: devices, index: 'name' })
    expect(slices.map((slice) => [slice.key, slice.color, slice.value, slice.percent])).toEqual([
      ['Mobile', 'var(--chart-3)', 60, 60],
      ['Desktop', 'pink', 30, 30],
      ['Tablet', 'var(--chart-4)', 10, 10],
    ])

    expect(slices[1]!.row).toBe(devices[1])
  })

  it('colors by a name map, with the row fill still winning', () => {
    const slices = resolveSlices({
      data: devices,
      index: 'name',
      colors: { Mobile: 'blue', Desktop: 'green' },
    })

    expect(slices.map((slice) => slice.color)).toEqual(['blue', 'pink', 'var(--chart-4)'])
  })

  it('computes shares of the visible total and none for hidden slices', () => {
    const slices = resolveSlices({ data: devices, index: 'name', hidden: ['Mobile'] })
    expect(slices.map((slice) => [slice.hidden, slice.percent])).toEqual([
      [true, undefined],
      [false, 75],
      [false, 25],
    ])

    expect(resolveSlices({ data: [{ name: 'A', value: 0 }], index: 'name' })[0]!.percent).toBe(0)
  })
})
