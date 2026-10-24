<template>
  <RadioGroupRoot
    ref="root"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :orientation="orientation"
    data-slot="radio-button-group"
    :data-layout="layout"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @keydown.capture="onKeydownCapture"
  >
    <!-- A group label names the radiogroup via aria-labelledby, not a form control. -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <slot />
    <FieldError />
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { computed, provide, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import { radioButtonGroupKey } from './context'
import type { RadioButtonGroupProps, RadioButtonGroupSlots } from './RadioButtonGroup.types'
import theme from './theme'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<RadioButtonGroupProps>(), {
  layout: 'flex',
  variant: 'primary',
  invalid: undefined,
})

defineSlots<RadioButtonGroupSlots>()

/** The value of the selected item. Bind with `v-model`. */
const modelValue = defineModel<string>()
const slots = useSlots()

const ui = useComponentUI('radioButtonGroup', {
  theme,
  variantProps: () => ({
    layout: props.layout,
    variant: props.variant,
  }),
})

// `null` (not `undefined`) when nothing is selected: Reka self-manages its state when `modelValue` is undefined,
// which would let `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? null)

const root = useTemplateRef<InstanceType<typeof RadioGroupRoot>>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => selected.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value?.$el as Element | undefined,
  onReset: () => {
    modelValue.value = props.defaultValue
  },
})

const invalid = computed(() => validation.value.isInvalid)

const { labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome(
  {
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  },
)

provide(radioButtonGroupKey, {
  selected,
  disabled: isDisabled,
  readonly: computed(() => !!props.readonly),
  invalid,
  variant: computed(() => props.variant),
  layout: computed(() => props.layout),
  describedBy,
  ui: computed(() => props.ui),
})

// Reka's roving focus moves focus (without selecting) on Home / End / PageUp / PageDown; a native radio group
// ignores them, so stop them before they reach the focused item.
const onKeydownCapture = (event: KeyboardEvent) => {
  if (['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation()
}

const onUpdate = (value: unknown) => {
  if (props.readonly) return
  modelValue.value = value as string
  commitValidation()
}
</script>
