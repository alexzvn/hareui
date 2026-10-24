<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots } from '../../types/tv'
import type { ButtonProps } from '../button/Button.vue'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type NumberStepper = typeof theme

export interface NumberStepperProps extends FormFieldProps {
  /** Label text rendered above the stepper. */
  label?: string
  /** Helper text rendered below the stepper. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the stepper while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the value, used when submitting a form. */
  name?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: number
  /** The smallest allowed value. The decrement button is disabled at this value. */
  min?: number
  /** The largest allowed value. The increment button is disabled at this value. */
  max?: number
  /**
   * The amount the value changes per press. When set, values are also snapped to it (relative to `min`).
   * @defaultValue 1 (0.01 with `formatOptions.style: 'percent'`)
   */
  step?: number
  /** Formatting options for the displayed value (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale used to format the value. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /**
   * Size of the buttons and the value.
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Places the increment button first and the decrement button last.
   * @defaultValue false
   */
  reversed?: boolean
  /**
   * Renders the increment button. Pass `Button` props (`variant`, `size`, …) to render a `Button` instead of the built-in one.
   * @defaultValue true
   */
  increment?: boolean | Omit<ButtonProps, 'as' | 'type' | 'disabled' | 'pending'>
  /**
   * Renders the decrement button. Pass `Button` props (`variant`, `size`, …) to render a `Button` instead of the built-in one.
   * @defaultValue true
   */
  decrement?: boolean | Omit<ButtonProps, 'as' | 'type' | 'disabled' | 'pending'>
  /**
   * Whether the stepper is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the stepper is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether a value is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the value can be read but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the committed value (`NaN` while empty). Return an error message (or several) when invalid. */
  validate?: ValidateFn<number>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NumberStepper>
}

export interface NumberStepperSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Decrement button content. Defaults to a minus icon. */
  decrement?: () => any
  /** Value content. Defaults to the formatted value. */
  value?: (props: { value: number | undefined; formattedValue: string }) => any
  /** Increment button content. Defaults to a plus icon. */
  increment?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}
</script>

<script setup lang="ts">
import type { Format } from '@number-flow/vue'
import NumberFlow from '@number-flow/vue'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  useLocale,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, toRef, useAttrs, useTemplateRef } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { useFieldValidation } from '../../composables/useFieldValidation'
import { useNumberValue } from '../../composables/useNumberValue'
import { useSlotOutlet } from '../../composables/useSlotOutlet'
import Button from '../button/Button.vue'
import { useFieldsetDisabled } from '../fieldset/context'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<NumberStepperProps>(), {
  increment: true,
  decrement: true,
  invalid: undefined,
})
const slots = defineSlots<NumberStepperSlots>()
const DecrementOutlet = useSlotOutlet(slots, 'decrement')
const IncrementOutlet = useSlotOutlet(slots, 'increment')
const ValueOutlet = useSlotOutlet(slots, 'value')
/** The numeric value; `undefined` while empty. */
const modelValue = defineModel<number | null>()

// Same value pipeline as NumberField, submitted through the same sibling `<input type="hidden">`
const { effectiveStep, displayValue, defaultDisplayValue, formValue, commit, commitEmpty, reset } =
  useNumberValue({
    model: modelValue,
    defaultValue: () => props.defaultValue,
    min: () => props.min,
    max: () => props.max,
    step: () => props.step,
    formatOptions: () => props.formatOptions,
    onCommit: () => commitValidation(),
  })

const root = useTemplateRef<HTMLElement>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => formValue.value ?? Number.NaN,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: reset,
})
const invalid = computed(() => validation.value.isInvalid)

// The value rolls digit by digit (number-flow, as in HeroUI Pro), with the same locale and format as the spin button.
// number-flow skips the motion under `prefers-reduced-motion`.
const locale = useLocale(toRef(() => props.locale))
const flowFormat = computed<Format | undefined>(() => {
  if (!props.formatOptions) return undefined
  // number-flow supports only standard and compact notation
  const { notation, ...rest } = props.formatOptions
  return notation === 'standard' || notation === 'compact' ? { ...rest, notation } : rest
})

// An emptied input commits "no value" (see NumberField)
function onCommitEmpty(event: Event) {
  if ((event.target as HTMLInputElement).value === '') commitEmpty()
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.isComposing) onCommitEmpty(event)
}
// PageUp / PageDown move by a single step, as in NumberField (Reka moves 10). Attached natively on the root for the
// same reason as NumberField: a Vue capture invoker would make Vue drop the re-dispatched key right after mount.
function onKeydownCapture(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (
    (event.key !== 'PageUp' && event.key !== 'PageDown') ||
    event.isComposing ||
    target.dataset.slot !== 'number-stepper-input'
  )
    return
  event.preventDefault()
  event.stopImmediatePropagation()
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: event.key === 'PageUp' ? 'ArrowUp' : 'ArrowDown',
      cancelable: true,
    }),
  )
}
onMounted(() => root.value?.addEventListener('keydown', onKeydownCapture, true))
onBeforeUnmount(() => root.value?.removeEventListener('keydown', onKeydownCapture, true))

// `aria-label` / `aria-labelledby` name the input, not the wrapper div
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
  return rest
})

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled: isDisabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
})

// The buttons are named after the field: "Increase Quantity"
const fieldName = computed(() => (attrs['aria-label'] as string | undefined) ?? props.label)
const incrementLabel = computed(() =>
  fieldName.value ? `Increase ${fieldName.value}` : 'Increase',
)
const decrementLabel = computed(() =>
  fieldName.value ? `Decrease ${fieldName.value}` : 'Decrease',
)
const incrementButton = computed(() =>
  typeof props.increment === 'object' ? props.increment : undefined,
)
const decrementButton = computed(() =>
  typeof props.decrement === 'object' ? props.decrement : undefined,
)

const ui = useComponentUI('numberStepper', theme, () => ({
  size: props.size,
  reversed: props.reversed,
}))
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="number-stepper"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <FieldLabel :for="id" />
    <NumberFieldRoot
      v-slot="{ modelValue: current, textValue }"
      :id="id"
      :model-value="displayValue"
      :default-value="defaultDisplayValue"
      :min="min"
      :max="max"
      :step="effectiveStep"
      :step-snapping="step !== undefined"
      :format-options="formatOptions"
      :locale="locale"
      :disabled="isDisabled"
      :readonly="readonly"
      :required="required"
      data-slot="number-stepper-group"
      :data-disabled="isDisabled ? 'true' : undefined"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :class="ui.group({ class: props.ui?.group })"
      @update:model-value="commit"
    >
      <!-- Slots inside the root's content go through `useSlotOutlet` components: a `<slot>` outlet here would make Vue flag the root's slots as forwarded and re-render the root and its buttons on every render -->
      <template v-if="decrement">
        <NumberFieldDecrement
          v-if="decrementButton"
          as-child
          :aria-label="decrementLabel"
          :aria-controls="id"
        >
          <Button
            v-bind="decrementButton"
            icon-only
            data-slot="number-stepper-decrement-button"
            :class="props.ui?.decrementButton"
          >
            <DecrementOutlet>
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M1.75 8a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11A.75.75 0 0 1 1.75 8"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </DecrementOutlet>
          </Button>
        </NumberFieldDecrement>
        <NumberFieldDecrement
          v-else
          data-slot="number-stepper-decrement-button"
          :aria-label="decrementLabel"
          :aria-controls="id"
          :class="ui.decrementButton({ class: props.ui?.decrementButton })"
        >
          <DecrementOutlet>
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M1.75 8a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11A.75.75 0 0 1 1.75 8"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </DecrementOutlet>
        </NumberFieldDecrement>
      </template>
      <span
        data-slot="number-stepper-value"
        aria-hidden="true"
        :class="ui.value({ class: props.ui?.value })"
      >
        <ValueOutlet v-bind="{ value: current ?? undefined, formattedValue: textValue }">
          <NumberFlow
            v-if="current != null"
            :value="current"
            :format="flowFormat"
            :locales="locale"
          />
          <template v-else>
            {{ textValue }}
          </template>
        </ValueOutlet>
      </span>
      <template v-if="increment">
        <NumberFieldIncrement
          v-if="incrementButton"
          as-child
          :aria-label="incrementLabel"
          :aria-controls="id"
        >
          <Button
            v-bind="incrementButton"
            icon-only
            data-slot="number-stepper-increment-button"
            :class="props.ui?.incrementButton"
          >
            <IncrementOutlet>
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75"
                  fill="currentColor"
                  fill-rule="evenodd"
                />
              </svg>
            </IncrementOutlet>
          </Button>
        </NumberFieldIncrement>
        <NumberFieldIncrement
          v-else
          data-slot="number-stepper-increment-button"
          :aria-label="incrementLabel"
          :aria-controls="id"
          :class="ui.incrementButton({ class: props.ui?.incrementButton })"
        >
          <IncrementOutlet>
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </IncrementOutlet>
        </NumberFieldIncrement>
      </template>
      <NumberFieldInput
        data-slot="number-stepper-input"
        :required="required || undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="attrs['aria-labelledby']"
        :class="ui.input({ class: props.ui?.input })"
        @blur="onCommitEmpty"
        @keydown="onKeydown"
      />
    </NumberFieldRoot>
    <FieldDescription />
    <FieldError />
  </div>
  <input
    v-if="name"
    type="hidden"
    :name="name"
    :value="formValue ?? ''"
    :disabled="isDisabled || undefined"
  />
</template>
