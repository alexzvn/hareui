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
    :aria-describedby="field?.describedBy.value"
    data-slot="input"
    :data-invalid="invalid ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base()"
    @update:model-value="value = $event"
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { textFieldContextKey } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'
import type { ModelModifier } from '@/utils/modelModifiers'
import { emptyModelValue, textModelDirective } from '@/utils/modelModifiers'

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
  set: (v) => emptyModelValue(v, ownModifiers),
})

const field = inject(textFieldContextKey, null)

// Inside a TextField, an Input without its own v-model uses the field's value; with one, it mirrors into the field
// so the field's `validate` and form reset see what the user typed
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const ownModel =
  !field || ['modelValue', 'model-value', 'onUpdate:modelValue'].some((key) => key in vnodeProps)

// `lazy` / `trim` / `number` act on the native input, so without its own v-model the Input takes the field's
const vTextModel = textModelDirective(() => (ownModel ? ownModifiers : field!.modelModifiers))

const value = computed<string | number | null | undefined>({
  get: () => (ownModel ? modelValue.value : field!.model.value),
  set: (v) => {
    if (ownModel) modelValue.value = v
    if (field) field.model.value = v ?? undefined
  },
})

if (value.value === undefined && props.defaultValue !== undefined) value.value = props.defaultValue

if (field && ownModel) {
  watch(
    modelValue,
    (v) => {
      field.model.value = v ?? undefined
    },
    { immediate: true },
  )

  // The field writes its model on form reset; pass that back to the parent's v-model
  watch(field.model, (v) => {
    if (v !== modelValue.value) modelValue.value = v
  })
}

const type = computed(() => props.type ?? field?.type.value ?? 'text')
const name = computed(() => props.name ?? field?.name.value)

const id = computed(() => props.id ?? field?.id.value)
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
