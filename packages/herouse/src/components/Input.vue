<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/input'

type Input = typeof theme

export interface InputProps {
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
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Input>
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { textFieldContextKey } from './textFieldContext'

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  fullWidth: undefined,
  disabled: undefined,
  invalid: undefined,
  required: undefined,
  readonly: undefined,
})
/** The input value. */
const modelValue = defineModel<string | number>()
if (modelValue.value === undefined && props.defaultValue !== undefined)
  modelValue.value = props.defaultValue

const field = inject(textFieldContextKey, null)

const id = computed(() => props.id ?? field?.id.value)
const variant = computed(() => props.variant ?? field?.variant.value)
const fullWidth = computed(() => props.fullWidth ?? field?.fullWidth.value ?? false)
const disabled = computed(() => props.disabled ?? field?.disabled.value ?? false)
const invalid = computed(() => props.invalid ?? field?.invalid.value ?? false)
const required = computed(() => props.required ?? field?.required.value ?? false)
const readonly = computed(() => props.readonly ?? field?.readonly.value ?? false)

const ui = useComponentUI('input', theme, () => ({ variant: variant.value, fullWidth: fullWidth.value }))
</script>

<template>
  <input
    :id="id"
    v-model="modelValue"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :disabled="disabled || undefined"
    :required="required || undefined"
    :readonly="readonly || undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="field?.describedBy.value"
    :aria-label="field?.ariaLabel.value"
    :aria-labelledby="field?.ariaLabelledby.value"
    data-slot="input"
    :data-invalid="invalid ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
</template>
