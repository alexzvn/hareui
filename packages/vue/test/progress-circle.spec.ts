import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProgressCircle from '../src/components/progress-circle/ProgressCircle.vue'

const CIRCUMFERENCE = 2 * Math.PI * 16

function fill(wrapper: ReturnType<typeof mount>) {
  return wrapper.get('[data-slot="progress-circle-fill-circle"]')
}

describe('ProgressCircle', () => {
  it('exposes React Aria progressbar values for a custom range', () => {
    const wrapper = mount(ProgressCircle, { props: { 'aria-label': 'Loading', 'minValue': 50, 'maxValue': 150, 'value': 75 } })
    expect(wrapper.get('[data-slot="progress-circle"]').attributes()).toMatchObject({
      'role': 'progressbar',
      'aria-label': 'Loading',
      'aria-valuemin': '50',
      'aria-valuemax': '150',
      'aria-valuenow': '75',
      'aria-valuetext': '25%',
    })
    expect(Number(fill(wrapper).attributes('stroke-dashoffset'))).toBeCloseTo(CIRCUMFERENCE * 0.75)
  })

  it('clamps the arc to the range', () => {
    expect(Number(fill(mount(ProgressCircle, { props: { value: 140 } })).attributes('stroke-dashoffset'))).toBeCloseTo(0)
    expect(Number(fill(mount(ProgressCircle, { props: { value: -5 } })).attributes('stroke-dashoffset'))).toBeCloseTo(CIRCUMFERENCE)
  })

  it('indeterminate drops aria-valuenow/valuetext, shows a quarter arc and spins the track', () => {
    const wrapper = mount(ProgressCircle, { props: { indeterminate: true, value: 60 } })
    const root = wrapper.get('[data-slot="progress-circle"]')
    expect(root.attributes('aria-valuenow')).toBeUndefined()
    expect(root.attributes('aria-valuetext')).toBeUndefined()
    expect(Number(fill(wrapper).attributes('stroke-dashoffset'))).toBeCloseTo(CIRCUMFERENCE * 0.75)
    expect(wrapper.get('[data-slot="progress-circle-track"]').classes()).toContain('animate-progress-circle-spin')
  })

  it('strokeWidth moves the radius but keeps HeroUI\'s default dash length', () => {
    const wrapper = mount(ProgressCircle, { props: { strokeWidth: 6, value: 60 } })
    for (const circle of wrapper.findAll('circle'))
      expect(circle.attributes()).toMatchObject({ 'r': '15', 'stroke-width': '6' })
    expect(Number(fill(wrapper).attributes('stroke-dasharray'))).toBeCloseTo(CIRCUMFERENCE)
  })

  it('ui stroke classes replace the themed stroke colors', () => {
    const wrapper = mount(ProgressCircle, { props: { ui: { trackCircle: 'stroke-neutral-200', fillCircle: 'stroke-neutral-700' } } })
    expect(wrapper.get('[data-slot="progress-circle-track-circle"]').classes()).toEqual(['stroke-neutral-200'])
    expect(fill(wrapper).classes()).toContain('stroke-neutral-700')
    expect(fill(wrapper).classes()).not.toContain('stroke-(--progress-circle-stroke)')
  })
})
