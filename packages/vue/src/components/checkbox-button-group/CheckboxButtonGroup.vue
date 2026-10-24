<template>
  <CheckboxGroupRoot
    ref="root"
    role="group"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :roving-focus="false"
    data-slot="checkbox-button-group"
    :data-layout="layout ?? 'flex'"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
  >
    <!-- `as` falls through to Reka `Label`: the group label names the group via aria-labelledby, not a form control -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <slot />
    <FieldError />
  </CheckboxGroupRoot>
</template>

<script setup lang="ts">
import { CheckboxGroupRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, provide, toRef, useSlots, useTemplateRef } from 'vue'

import checkboxTheme from '@/components/checkbox/theme'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type {
  CheckboxButtonGroupProps,
  CheckboxButtonGroupSlots,
} from './CheckboxButtonGroup.types'
import { checkboxButtonGroupContextKey } from './context'
import theme from './theme'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<CheckboxButtonGroupProps>(), { invalid: undefined })
defineSlots<CheckboxButtonGroupSlots>()

/** The selected values. Bind with `v-model`. */
const modelValue = defineModel<string[]>()
const slots = useSlots()

const ui = useComponentUI('checkboxButtonGroup', theme, () => ({
  layout: props.layout,
  variant: props.variant,
}))

const checkboxUi = useComponentUI('checkbox', checkboxTheme, () => ({
  variant: props.variant,
}))

// `[]` (not `undefined`): Reka self-manages its state when `modelValue` is undefined, which would let
// `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? [])

const root = useTemplateRef<ComponentPublicInstance>('root')
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

provide(checkboxButtonGroupContextKey, {
  selected,
  disabled: isDisabled,
  invalid,
  readonly: toRef(() => props.readonly),
  describedBy,
  layout: toRef(() => props.layout),
  variant: toRef(() => props.variant),
  checkboxUi,
  uiOverrides: toRef(() => props.ui),
})

const onUpdate = (value: string[]) => {
  if (props.readonly) return
  modelValue.value = value
  commitValidation()
}
</script>
