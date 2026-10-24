import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import type { NumberValue, NumberValueOptions } from '@/composables/useNumberValue'
import { useNumberValue } from '@/composables/useNumberValue'
import { clamp, snapNumber, snapValueToStep } from '@/utils/number'

describe('clamp', () => {
  it('limits to the bounds and treats an absent bound as unlimited', () => {
    expect(clamp(150, 0, 100)).toBe(100)
    expect(clamp(-5, 0, 100)).toBe(0)
    expect(clamp(50, 0, 100)).toBe(50)
    expect(clamp(-1e9, undefined, 10)).toBe(-1e9)
    expect(clamp(1e9, 0, undefined)).toBe(1e9)
  })
})

describe('snapValueToStep', () => {
  it('snaps relative to min, rounding halves away from min', () => {
    expect(snapValueToStep(7, 1, 100, 5)).toBe(6)
    expect(snapValueToStep(8.5, 1, 100, 5)).toBe(11)
    expect(snapValueToStep(-7, -10, 10, 5)).toBe(-5)
    expect(snapValueToStep(-8, -10, 10, 5)).toBe(-10)
    expect(snapValueToStep(12, undefined, undefined, 5)).toBe(10)
  })

  it('returns decimal steps without floating-point noise', () => {
    expect(snapValueToStep(0.1 + 0.2, 0, 1, 0.1)).toBe(0.3)
    expect(snapValueToStep(0.7, 0, 1, 0.1)).toBe(0.7)
    expect(snapValueToStep(1.2, 0, 10, 0.25)).toBe(1.25)
    expect(snapValueToStep(1.1, 0, 10, 0.25)).toBe(1)
    expect(snapValueToStep(0.123, 0, 1, 0.01)).toBe(0.12)
    expect(snapValueToStep(-0.64, -1, 1, 0.1)).toBe(-0.6)
    expect(snapValueToStep(-0.66, -1, 1, 0.1)).toBe(-0.7)
    expect(snapValueToStep(3.1e-7, 0, 1, 1e-7)).toBe(3e-7)
  })

  it('keeps the grid of a min with more decimals than the step', () => {
    expect(snapValueToStep(2, 0.5, 9.5, 1)).toBe(2.5)
    expect(snapValueToStep(0.31, 0.05, 1, 0.1)).toBe(0.35)
  })

  it('limits to min, and above max takes the last step at or below max', () => {
    expect(snapValueToStep(-3, 0, 10, 1)).toBe(0)
    expect(snapValueToStep(12, 0, 10, 3)).toBe(9)
    expect(snapValueToStep(1.5, 0.1, 1, 0.2)).toBe(0.9)
    expect(snapValueToStep(12, undefined, 10, 3)).toBe(9)
    // no max: a page past an off-grid max stays on the grid (Slider clamps it afterwards)
    expect(snapValueToStep(12, 0, undefined, 3)).toBe(12)
  })
})

describe('snapNumber', () => {
  it('only clamps without a step', () => {
    expect(snapNumber(3.14159, 0, 10, undefined)).toBe(3.14159)
    expect(snapNumber(42, 0, 10, undefined)).toBe(10)
    expect(snapNumber(-42, 0, undefined, undefined)).toBe(0)
  })

  it('snaps and clamps with a step', () => {
    expect(snapNumber(42, 0, 10, 3)).toBe(9)
    expect(snapNumber(4.4, 0, 10, 3)).toBe(3)
  })

  it('passes empty values through', () => {
    expect(snapNumber(null, 0, 10, 1)).toBeNull()
    expect(snapNumber(undefined, 0, 10, 1)).toBeUndefined()
    expect(snapNumber(Number.NaN, 0, 10, 1)).toBeNaN()
  })
})

type Setup = {
  modelValue?: number | null
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  formatOptions?: Intl.NumberFormatOptions
}

function setup(initial: Setup = {}) {
  const props = ref<Setup>({ ...initial })
  const model = ref<number | null | undefined>(initial.modelValue)
  const onCommit = vi.fn()
  let value!: NumberValue
  const options: NumberValueOptions = {
    model,
    defaultValue: () => props.value.defaultValue,
    min: () => props.value.min,
    max: () => props.value.max,
    step: () => props.value.step,
    formatOptions: () => props.value.formatOptions,
    onCommit,
  }
  const wrapper = mount(
    defineComponent({
      emits: ['update:modelValue'],
      setup() {
        value = useNumberValue(options)
        return () => null
      },
    }),
  )
  return { wrapper, props, model, onCommit, value }
}

describe('useNumberValue', () => {
  it('falls back to a 0.01 step for percent formats, without snapping to it', () => {
    const { props, value } = setup({ defaultValue: 0.123, formatOptions: { style: 'percent' } })
    expect(value.effectiveStep.value).toBe(0.01)
    expect(value.defaultDisplayValue.value).toBe(0.123)
    props.value = { ...props.value, step: 0.05 }
    expect(value.effectiveStep.value).toBe(0.05)
    expect(value.defaultDisplayValue.value).toBe(0.1)
    props.value = { formatOptions: { style: 'decimal' } }
    expect(value.effectiveStep.value).toBeUndefined()
  })

  it('displays the model and default clamped and snapped, and passes an empty model through', () => {
    const { model, value } = setup({
      modelValue: 0.1 + 0.2,
      defaultValue: 99,
      min: 0,
      max: 1,
      step: 0.1,
    })
    expect(value.displayValue.value).toBe(0.3)
    expect(value.defaultDisplayValue.value).toBe(1)
    model.value = null
    expect(value.displayValue.value).toBeNull()
    model.value = undefined
    expect(value.displayValue.value).toBeUndefined()
  })

  it('submits the snapped default while uncontrolled, and the model when controlled', () => {
    expect(setup({ defaultValue: 7, step: 5 }).value.formValue.value).toBe(5)
    expect(setup({ modelValue: 13, defaultValue: 7, step: 5 }).value.formValue.value).toBe(15)
    expect(setup().value.formValue.value).toBeUndefined()
  })

  it('tracks committed values and external model changes in the form value', async () => {
    const { model, onCommit, value, wrapper } = setup({ defaultValue: 2, min: 0, max: 10 })
    value.commit(4)
    expect(model.value).toBe(4)
    expect(value.formValue.value).toBe(4)
    expect(onCommit).toHaveBeenCalledTimes(1)
    model.value = 42
    await nextTick()
    expect(value.formValue.value).toBe(10)
    expect(onCommit).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('commits an emptied value once, emitting it when the model has no value to clear', () => {
    const uncontrolled = setup({ defaultValue: 3 })
    uncontrolled.value.commitEmpty()
    expect(uncontrolled.value.formValue.value).toBeUndefined()
    expect(uncontrolled.wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    expect(uncontrolled.onCommit).toHaveBeenCalledTimes(1)
    uncontrolled.value.commitEmpty()
    expect(uncontrolled.wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(uncontrolled.onCommit).toHaveBeenCalledTimes(1)

    const controlled = setup({ modelValue: 3 })
    controlled.value.commitEmpty()
    expect(controlled.model.value).toBeUndefined()
    expect(controlled.value.formValue.value).toBeUndefined()
    expect(controlled.wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(controlled.onCommit).toHaveBeenCalledTimes(1)
  })

  it('reset restores the snapped default to the model and the form value, without committing', () => {
    const { model, onCommit, value } = setup({ defaultValue: 0.26, min: 0, max: 1, step: 0.25 })
    value.commit(0.75)
    value.reset()
    expect(model.value).toBe(0.25)
    expect(value.formValue.value).toBe(0.25)
    expect(onCommit).toHaveBeenCalledTimes(1)

    const empty = setup({ modelValue: 5 })
    empty.value.reset()
    expect(empty.model.value).toBeUndefined()
    expect(empty.value.formValue.value).toBeUndefined()
  })
})
