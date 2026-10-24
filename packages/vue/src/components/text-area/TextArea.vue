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

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type TextArea = typeof theme

export type TextAreaProps = {
  /** The id of the textarea. Defaults to the id provided by a surrounding `TextField`. */
  id?: string
  /** The name of the textarea, used when submitting a form. */
  name?: string
  /** Temporary text shown when the textarea is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * Visual variant of the textarea. Defaults to the surrounding `TextField` variant.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<TextArea>['variant']
  /**
   * Whether the textarea takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the textarea is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the textarea is invalid.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the textarea is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the textarea can be selected but not changed. Defaults to the surrounding `TextField`.
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
  ui?: ComponentSlots<TextArea>
} & FormFieldProps
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, useTemplateRef, watch } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { textFieldContextKey } from '@/components/text-field/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldValidation } from '@/composables/useFieldValidation'

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
