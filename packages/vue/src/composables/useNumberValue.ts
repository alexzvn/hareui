import type { ComputedRef, Ref } from 'vue'
import { computed, getCurrentInstance, readonly, ref, watch } from 'vue'

import { snapNumber } from '@/utils/number'

export type NumberValueOptions = {
  /** The component's `defineModel<number | null>()` ref. */
  model: Ref<number | null | undefined>
  defaultValue: () => number | undefined
  min: () => number | undefined
  max: () => number | undefined
  /** The `step` prop; values snap to it only when it is set. */
  step: () => number | undefined
  formatOptions: () => Intl.NumberFormatOptions | undefined
  /** Runs after every committed change (RAC commits validation on blur / Enter and on every stepper press). */
  onCommit?: () => void
}

export type NumberValue = {
  /** Step handed to Reka: `step`, or 0.01 for percent formats. */
  effectiveStep: ComputedRef<number | undefined>
  /** The model value, clamped and snapped; `undefined` while uncontrolled. */
  displayValue: ComputedRef<number | null | undefined>
  /** `defaultValue`, clamped and snapped. */
  defaultDisplayValue: ComputedRef<number | undefined>
  /** The committed number the form submits; `null` / `undefined` while empty. */
  formValue: Readonly<Ref<number | null | undefined>>
  /** Commits a value from Reka's `update:modelValue`. */
  commit: (value: number | undefined) => void
  /** Commits an emptied input as "no value"; does nothing when already empty. */
  commitEmpty: () => void
  /** Restores the (snapped) default, for form reset. */
  reset: () => void
}

/**
 * The numeric value pipeline shared by NumberField and NumberStepper, as in react-stately's useNumberFieldState:
 * the incoming value and default are clamped into range (and snapped to `step` when one is given) before display,
 * and the committed number is tracked for the form.
 */
export function useNumberValue(options: NumberValueOptions): NumberValue {
  const { model, onCommit } = options
  // A second `defineEmits` for `update:modelValue` would clash with defineModel's emit type, so the forced emit in
  // `commitEmpty` goes through the instance.
  const instance = getCurrentInstance()

  function snap<T extends number | null | undefined>(value: T): T {
    return snapNumber(value, options.min(), options.max(), options.step())
  }

  const effectiveStep = computed(
    () => options.step() ?? (options.formatOptions()?.style === 'percent' ? 0.01 : undefined),
  )
  const displayValue = computed(() => snap(model.value))
  const defaultDisplayValue = computed(() => snap(options.defaultValue()))

  // The form value is submitted by a sibling `<input type="hidden">` after the root, as in RAC (not Reka's in-root
  // input): form data carries the raw number, and layouts like `space-y-*` treat the field exactly as HeroUI's.
  // Tracked locally so uncontrolled fields submit `defaultValue` without emitting an update on mount.
  const formValue = ref<number | null | undefined>(displayValue.value ?? defaultDisplayValue.value)
  watch(displayValue, (value) => {
    formValue.value = value
  })

  function commit(value: number | undefined) {
    formValue.value = value
    model.value = value
    onCommit?.()
  }

  // RAC commits an emptied input as "no value" (`onChange(NaN)`, an empty form value). Reka's applyInputValue
  // clears its own state but, in uncontrolled mode, never emits `undefined` (its passive v-model only emits values
  // that differ from the absent prop), so commit the empty value here.
  function commitEmpty() {
    if (formValue.value == null) return
    formValue.value = undefined
    if (model.value == null) instance?.emit('update:modelValue', undefined)
    else model.value = undefined
    onCommit?.()
  }

  function reset() {
    formValue.value = defaultDisplayValue.value
    model.value = formValue.value
  }

  return {
    effectiveStep,
    displayValue,
    defaultDisplayValue,
    formValue: readonly(formValue),
    commit,
    commitEmpty,
    reset,
  }
}
