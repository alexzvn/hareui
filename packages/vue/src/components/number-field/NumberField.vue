<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="number-field"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <FieldLabel :for="id" />
    <NumberFieldRoot
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
      data-slot="number-field-group"
      :data-invalid="invalid ? 'true' : undefined"
      :data-focus-within="focusWithin ? 'true' : undefined"
      :data-focus-visible="focusVisible ? 'true' : undefined"
      :class="ui.group({ class: props.ui?.group })"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      @update:model-value="commit"
    >
      <NumberFieldDecrement
        v-if="decrement"
        slot="decrement"
        data-slot="number-field-decrement-button"
        :aria-label="decrementLabel"
        :aria-controls="id"
        :class="ui.decrementButton({ class: props.ui?.decrementButton })"
      >
        <DecrementOutlet>
          <svg
            aria-hidden="true"
            data-slot="number-field-decrement-button-icon"
            fill="none"
            height="16"
            role="presentation"
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
      <NumberFieldInput
        data-slot="number-field-input"
        :placeholder="placeholder"
        :required="required || undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="attrs['aria-labelledby']"
        :class="ui.input({ class: props.ui?.input })"
        @blur="onCommitEmpty"
        @keydown="onKeydown"
      />
      <NumberFieldIncrement
        v-if="increment"
        slot="increment"
        data-slot="number-field-increment-button"
        :aria-label="incrementLabel"
        :aria-controls="id"
        :class="ui.incrementButton({ class: props.ui?.incrementButton })"
      >
        <IncrementOutlet>
          <svg
            aria-hidden="true"
            data-slot="number-field-increment-button-icon"
            fill="none"
            height="16"
            role="presentation"
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

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type NumberField = typeof theme

export interface NumberFieldProps extends FormFieldProps {
  /** Label text rendered above the group. */
  label?: string
  /** Helper text rendered below the group. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the group while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the value, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: number
  /** The smallest allowed value. */
  min?: number
  /** The largest allowed value. */
  max?: number
  /**
   * The amount the value changes per increment/decrement. When set, values are also snapped to it
   * (relative to `min`); when unset, they're only clamped to `min`/`max`.
   * @defaultValue 1 (0.01 with `formatOptions.style: 'percent'`)
   */
  step?: number
  /** Formatting options for the displayed value (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale used to format and parse the value. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /**
   * Visual variant of the group.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the field takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether to render the increment button.
   * @defaultValue true
   */
  increment?: boolean
  /**
   * Whether to render the decrement button.
   * @defaultValue true
   */
  decrement?: boolean
  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the field is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the value can be selected but not changed.
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
  ui?: ComponentSlots<NumberField>
}

export interface NumberFieldSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Increment button content. Defaults to a plus icon. */
  increment?: () => any
  /** Decrement button content. Defaults to a minus icon. */
  decrement?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}
</script>

<script setup lang="ts">
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useNumberValue } from '@/composables/useNumberValue'
import { useSlotOutlet } from '@/composables/useSlotOutlet'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<NumberFieldProps>(), {
  increment: true,
  decrement: true,
  invalid: undefined,
})
const slots = defineSlots<NumberFieldSlots>()
const DecrementOutlet = useSlotOutlet(slots, 'decrement')
const IncrementOutlet = useSlotOutlet(slots, 'increment')
/** The numeric value; `undefined` while the input is empty. */
const modelValue = defineModel<number | null>()

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
  // As in RAC: the committed number, `NaN` while empty
  value: () => formValue.value ?? Number.NaN,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: reset,
})
const invalid = computed(() => validation.value.isInvalid)

// Runs after Reka's blur / Enter handler, which has already applied a non-empty input
function onCommitEmpty(event: Event) {
  if ((event.target as HTMLInputElement).value === '') commitEmpty()
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.isComposing) onCommitEmpty(event)
}

// RAC's spin button moves PageUp / PageDown by a single step (`onIncrementPage` = `onIncrement`); Reka moves 10 steps.
// A capture listener on the root runs ahead of Reka's handler on the input and hands Reka the matching arrow key.
// It is attached natively: a Vue `@keydown.capture` invoker would timestamp the re-dispatched event, and Vue's
// invoker on the input then drops it as "dispatched before attach" when the key lands right after mount.
function onKeydownCapture(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  if (
    (event.key !== 'PageUp' && event.key !== 'PageDown') ||
    event.isComposing ||
    target.dataset.slot !== 'number-field-input'
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

// `aria-label` / `aria-labelledby` name the input (as in HeroUI), not the wrapper div
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

// As in RAC: the stepper buttons are named after the field ("Increase Width") and control its input
const fieldName = computed(() => (attrs['aria-label'] as string | undefined) ?? props.label)
const incrementLabel = computed(() =>
  fieldName.value ? `Increase ${fieldName.value}` : 'Increase',
)
const decrementLabel = computed(() =>
  fieldName.value ? `Decrease ${fieldName.value}` : 'Decrease',
)

const ui = useComponentUI('numberField', theme, () => ({
  variant: props.variant,
  fullWidth: props.fullWidth,
}))

// RAC Group's `data-focus-within` / `data-focus-visible`
const focusWithin = ref(false)
const focusVisible = ref(false)
function onFocusIn(event: FocusEvent) {
  focusWithin.value = true
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}
function onFocusOut(event: FocusEvent) {
  if (
    event.currentTarget instanceof Element &&
    event.relatedTarget instanceof Node &&
    event.currentTarget.contains(event.relatedTarget)
  )
    return
  focusWithin.value = false
  focusVisible.value = false
}
</script>
