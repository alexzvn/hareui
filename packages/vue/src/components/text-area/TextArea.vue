<template>
  <textarea
    v-bind="field?.inputAttrs.value"
    :id="id"
    ref="textarea"
    v-model="value"
    :name="name"
    :placeholder="placeholder"
    :disabled="disabled || undefined"
    :required="required || undefined"
    :readonly="readonly || undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="field?.describedBy.value"
    data-slot="textarea"
    :data-invalid="invalid ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { textFieldContextKey } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type { TextAreaProps } from './TextArea.types'
import theme from './theme'

const props = withDefaults(defineProps<TextAreaProps>(), {
  fullWidth: undefined,
  disabled: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
})

/** The textarea value. */
const modelValue = defineModel<string | number>()

const field = inject(textFieldContextKey, null)

// Inside a TextField, a TextArea without its own v-model uses the field's value; with one, it mirrors into the field
// so the field's `validate` and form reset see what the user typed
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const hasVModel = ['modelValue', 'model-value', 'onUpdate:modelValue'].some(
  (key) => key in vnodeProps,
)

const ownModel = !field || hasVModel

const value = computed({
  get: () => (ownModel ? modelValue.value : field!.model.value),
  set: (v) => {
    if (ownModel) modelValue.value = v
    if (field) field.model.value = v
  },
})

if (value.value === undefined && props.defaultValue !== undefined) value.value = props.defaultValue

if (field && ownModel) {
  watch(
    modelValue,
    (v) => {
      field.model.value = v
    },
    { immediate: true },
  )

  // The field writes its model on form reset; pass that back to the parent's v-model
  watch(field.model, (v) => {
    if (v !== modelValue.value) modelValue.value = v
  })
}

const name = computed(() => props.name ?? field?.name.value)
const id = computed(() => props.id ?? field?.id.value)
const variant = computed(() => props.variant ?? field?.variant.value)
const fullWidth = computed(() => props.fullWidth ?? field?.fullWidth.value ?? false)
const disabled = useFieldsetDisabled(() => props.disabled ?? field?.disabled.value ?? false)
const required = computed(() => props.required ?? field?.required.value ?? false)
const readonly = computed(() => props.readonly ?? field?.readonly.value ?? false)

// Inside a TextField the field owns validation; a bare TextArea validates itself
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const own = field
  ? null
  : useFieldValidation({
      value: () => value.value ?? '',
      validate: () => props.validate,
      invalid: () => props.invalid,
      validationBehavior: () => props.validationBehavior,
      name: () => props.name,
      root: () => textarea.value,
      formField: props,
      onReset: () => {
        value.value = props.defaultValue ?? ''
      },
    })

const invalid = computed(() =>
  own ? own.validation.value.isInvalid : (props.invalid ?? field?.invalid.value ?? false),
)

const ui = useComponentUI('textArea', theme, () => ({
  variant: variant.value,
  fullWidth: fullWidth.value,
}))
</script>
