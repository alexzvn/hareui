<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type CellSwitch = typeof theme

export interface CellSwitchProps extends FormFieldProps {
  /** The checked state. Bind with `v-model`. */
  modelValue?: boolean
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean
  /** The text at the start of the row. */
  label?: string
  /**
   * Visual style of the row. Use `secondary` on a surface or card.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<CellSwitch>['variant']
  /** Error message rendered below the row while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the switch is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the switch is invalid. Sets `aria-invalid` on the row and `data-invalid` on the root. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the switch is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether the switch must be on before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selection (`true` when on). Return an error message (or several) when invalid. */
  validate?: ValidateFn<boolean>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the switch, used when submitting an HTML form. */
  name?: string
  /**
   * The value of the switch, used when submitting an HTML form.
   * @defaultValue 'on'
   */
  value?: string
  /** The id of the row's switch button. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CellSwitch>
}

export interface CellSwitchEmits {
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean]
}

export interface CellSwitchSlots {
  /** The content at the start of the row. Replaces the `label` prop. */
  label?: (props: { checked: boolean }) => any
  /** The error content, rendered below the row while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /** Icon rendered inside the switch thumb. */
  icon?: (props: { checked: boolean }) => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '../../composables/useComponentUI'
import Switch from '../switch/Switch.vue'

// `undefined` defaults keep uncontrolled mode and validation working, as in Switch
const props = withDefaults(defineProps<CellSwitchProps>(), { modelValue: undefined, invalid: undefined })
const emit = defineEmits<CellSwitchEmits>()
const slots = defineSlots<CellSwitchSlots>()

const ui = useComponentUI('cellSwitch', theme, () => ({
  variant: props.variant,
}))
// The row is Switch's own button, so a click anywhere on it toggles the switch. The root's `data-slot` replaces
// Switch's, so the theme repeats the Switch rules that key off `[data-slot=switch]`.
// No comment above `<Switch>` in the template: in dev it would make the root a fragment and stop attribute fallthrough.
</script>

<template>
  <Switch
    :id="id"
    data-slot="cell-switch"
    :model-value="modelValue"
    :default-value="defaultValue"
    :error-message="errorMessage"
    :disabled="disabled"
    :invalid="invalid"
    :readonly="readonly"
    :required="required"
    :validate="validate"
    :validation-behavior="validationBehavior"
    :name="name"
    :value="value"
    :eager-validation="eagerValidation"
    :validate-on-input-delay="validateOnInputDelay"
    :error-pattern="errorPattern"
    :ui="{
      base: ui.base({ class: [props.ui?.base, props.class] }),
      content: ui.trigger({ class: props.ui?.trigger }),
      control: ui.control({ class: props.ui?.control }),
      thumb: ui.thumb({ class: props.ui?.thumb }),
    }"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #label="{ checked }">
      <span data-slot="cell-switch-label" :class="ui.label({ class: props.ui?.label })">
        <slot name="label" :checked="checked">{{ label }}</slot>
      </span>
    </template>
    <template v-if="slots.error" #error="validation">
      <slot name="error" v-bind="validation" />
    </template>
    <template v-if="slots.icon" #icon="{ checked }">
      <slot name="icon" :checked="checked" />
    </template>
  </Switch>
</template>
