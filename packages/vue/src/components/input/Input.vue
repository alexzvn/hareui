<template>
  <input
    v-bind="field?.inputAttrs.value"
    :id="id"
    ref="input"
    v-text-model="value"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :disabled="disabled || undefined"
    :required="required || undefined"
    :readonly="readonly || undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    data-slot="input"
    :data-invalid="invalid ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base()"
    @update:model-value="value = $event"
  />
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useFormField } from '@/composables/useFormField'
import { useTextControlModel } from '@/composables/useTextControlModel'
import type { ModelModifier } from '@/utils/modelModifiers'
import { toEmptyModelValue } from '@/utils/modelModifiers'

import type { InputProps } from './Input.types'
import theme from './theme'

const props = withDefaults(defineProps<InputProps>(), {
  type: undefined,
  fullWidth: undefined,
  disabled: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
})

/** The input value. */
const [modelValue, ownModifiers] = defineModel<string | number | null, ModelModifier>({
  set: (v) => toEmptyModelValue(v, ownModifiers),
})

const { field, value, vTextModel } = useTextControlModel({
  model: modelValue,
  modifiers: ownModifiers,
  defaultValue: props.defaultValue,
})

// A bare Input inside a FormField takes its id, name and description ids, and shows its errors there
const formField = useFormField({
  id: () => props.id,
  name: () => props.name,
  validation: () => own?.validation.value,
  disabled: () => disabled.value,
  required: () => props.required,
})

const type = computed(() => props.type ?? field?.type.value ?? 'text')
const name = computed(() => props.name ?? field?.name.value ?? formField.name.value)

const id = computed(() => props.id ?? field?.id.value ?? formField.id.value)
const describedBy = computed(() => field?.describedBy.value ?? formField.describedBy.value)
const variant = computed(() => props.variant ?? field?.variant.value)
const fullWidth = computed(() => props.fullWidth ?? field?.fullWidth.value ?? false)
const disabled = useFieldsetDisabled(() => props.disabled ?? field?.disabled.value ?? false)
const required = computed(() => props.required ?? field?.required.value ?? false)
const readonly = computed(() => props.readonly ?? field?.readonly.value ?? false)

// Inside a TextField the field owns validation; a bare Input validates itself
const input = useTemplateRef<HTMLInputElement>('input')
const own = field
  ? null
  : useFieldValidation({
      value: () => value.value ?? '',
      validate: () => props.validate,
      invalid: () => props.invalid,
      validationBehavior: () => props.validationBehavior,
      name: () => props.name,
      root: () => input.value,
      formField: props,
      onReset: () => {
        value.value = props.defaultValue ?? ''
      },
    })

const invalid = computed(() =>
  own ? own.validation.value.isInvalid : (props.invalid ?? field?.invalid.value ?? false),
)

const ui = useComponentUI('input', {
  theme,
  variantProps: () => ({
    variant: variant.value,
    fullWidth: fullWidth.value,
  }),
  props,
})
</script>
