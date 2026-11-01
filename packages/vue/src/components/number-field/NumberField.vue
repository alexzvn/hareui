<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="number-field"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :class="ui.base()"
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
      :data-focus-within="isFocusWithin ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :class="ui.group()"
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
        :class="ui.decrementButton()"
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
        v-bind="fieldAttrs.focus"
        data-slot="number-field-input"
        :placeholder="placeholder"
        :required="required || undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-roledescription="t('numberField.roledescription')"
        :aria-describedby="describedBy"
        :aria-label="attrs['aria-label']"
        :aria-labelledby="attrs['aria-labelledby']"
        :class="ui.input()"
        @blur="commitIfEmptied"
        @keydown="onKeydown"
      />
      <NumberFieldIncrement
        v-if="increment"
        slot="increment"
        data-slot="number-field-increment-button"
        :aria-label="incrementLabel"
        :aria-controls="id"
        :class="ui.incrementButton()"
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
import { useLocale } from '@/composables/useLocale'
import { useNumberValue } from '@/composables/useNumberValue'
import { useSlotOutlet } from '@/composables/useSlotOutlet'
import { splitFocusListeners } from '@/utils/formControlEvents'
import type { ModelModifier } from '@/utils/modelModifiers'
import { toEmptyModelValue } from '@/utils/modelModifiers'

import type { NumberFieldProps, NumberFieldSlots } from './NumberField.types'
import theme from './theme'

defineOptions({ inheritAttrs: false })

const { t } = useLocale()

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<NumberFieldProps>(), {
  increment: true,
  decrement: true,
  invalid: undefined,
})

const slots = defineSlots<NumberFieldSlots>()
const DecrementOutlet = useSlotOutlet(slots, 'decrement')
const IncrementOutlet = useSlotOutlet(slots, 'increment')

type NumberModifier = Extract<ModelModifier, 'nullable' | 'optional'>

/** The numeric value; `undefined` while the input is empty (`null` with `v-model.nullable`). */
const [modelValue, modifiers] = defineModel<number | null, NumberModifier>({
  set: (v) => toEmptyModelValue(v, modifiers),
})

const {
  effectiveStep,
  displayValue,
  defaultDisplayValue,
  formValue,
  commit,
  captureInputText,
  commitIfEmptied,
  reset,
} = useNumberValue({
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

const { validation, invalid, commitValidation } = useFieldValidation({
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

// Runs after Reka's blur / Enter handler, which has already applied a non-empty input
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.isComposing) commitIfEmptied()
}

// RAC's spin button moves PageUp / PageDown by a single step (`onIncrementPage` = `onIncrement`); Reka moves 10 steps.
// A capture listener on the root runs ahead of Reka's handler on the input and hands Reka the matching arrow key.
// It is attached natively: a Vue `@keydown.capture` invoker would timestamp the re-dispatched event, and Vue's
// invoker on the input then drops it as "dispatched before attach" when the key lands right after mount.
const onKeydownCapture = (event: KeyboardEvent) => {
  captureInputText(event)
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

onMounted(() => {
  root.value?.addEventListener('keydown', onKeydownCapture, true)
  root.value?.addEventListener('blur', captureInputText, true)
})

onBeforeUnmount(() => {
  root.value?.removeEventListener('keydown', onKeydownCapture, true)
  root.value?.removeEventListener('blur', captureInputText, true)
})

// `aria-label` / `aria-labelledby` name the input, which a labelled wrapper would leave unnamed, and `@focus` / `@blur`
// listen on it; the rest stays on the wrapper div
const attrs = useAttrs()
const fieldAttrs = computed(() => splitFocusListeners(attrs))
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = fieldAttrs.value.rest
  return rest
})

const { name, id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
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
  fieldName.value
    ? t('numberField.incrementField', { label: fieldName.value })
    : t('numberField.increment'),
)

const decrementLabel = computed(() =>
  fieldName.value
    ? t('numberField.decrementField', { label: fieldName.value })
    : t('numberField.decrement'),
)

const ui = useComponentUI('numberField', {
  theme,
  variantProps: () => ({
    variant: props.variant,
    fullWidth: props.fullWidth,
  }),
  props,
})

// RAC Group's `data-focus-within` / `data-focus-visible`
const isFocusWithin = ref(false)
const isFocusVisible = ref(false)
const onFocusIn = (event: FocusEvent) => {
  isFocusWithin.value = true
  isFocusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}

const onFocusOut = (event: FocusEvent) => {
  if (
    event.currentTarget instanceof Element &&
    event.relatedTarget instanceof Node &&
    event.currentTarget.contains(event.relatedTarget)
  )
    return

  isFocusWithin.value = false
  isFocusVisible.value = false
}
</script>
