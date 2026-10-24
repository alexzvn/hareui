<template>
  <input
    v-bind="field?.inputAttrs.value"
    :id="id"
    ref="input"
    v-model="value"
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
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Input = typeof theme

export type InputProps = {
  /**
   * The native input type.
   * @defaultValue 'text'
   */
  type?: string
  /** The id of the input. Defaults to the id provided by a surrounding `TextField`. */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * Visual variant of the input. Defaults to the surrounding `TextField` variant.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Input>['variant']
  /**
   * Whether the input takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the input is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the input is invalid.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the input is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the input can be selected but not changed. Defaults to the surrounding `TextField`.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the value when used without a `TextField` (inside one, set `validate` on the TextField). */
  validate?: ValidateFn<string | number>
  /**
   * Validation behavior when used without a `TextField`. Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Input>
} & FormFieldProps
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { textFieldContextKey } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'

const props = withDefaults(defineProps<InputProps>(), {
  type: undefined,
  fullWidth: undefined,
  disabled: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
})
/** The input value. */
const modelValue = defineModel<string | number>()

const field = inject(textFieldContextKey, null)

// Inside a TextField, an Input without its own v-model uses the field's value; with one, it mirrors into the field
// so the field's `validate` and form reset see what the user typed
const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
const ownModel =
  !field || ['modelValue', 'model-value', 'onUpdate:modelValue'].some((key) => key in vnodeProps)
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

const ui = useComponentUI('input', theme, () => ({
  variant: variant.value,
  fullWidth: fullWidth.value,
}))
</script>
