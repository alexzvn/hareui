<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type Checkbox = typeof theme

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate'

export interface CheckboxProps extends FormFieldProps {
  /** The checked state (`true`, `false` or `'indeterminate'`). Bind with `v-model`. */
  modelValue?: boolean | 'indeterminate'
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean | 'indeterminate'
  /** The label rendered next to the control. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Error message rendered below the label while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Visual style of the checkbox.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Checkbox>['variant']
  /**
   * Whether the checkbox is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the checkbox is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the checkbox is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether user input is required on the checkbox before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selection (`true` when checked). Return an error message (or several) when invalid. */
  validate?: ValidateFn<boolean>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the checkbox, used when submitting an HTML form. */
  name?: string
  /**
   * The value of the checkbox, used when submitting an HTML form.
   * @defaultValue 'on'
   */
  value?: string
  /** The id of the checkbox control. Generated when omitted; use it to point an external `Label` at the checkbox. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Checkbox>
}

export interface CheckboxSlots {
  /** The label content. Replaces the `label` prop. */
  label?: (props: { state: CheckboxState }) => any
  /** The description content. Replaces the `description` prop. */
  description?: (props: { state: CheckboxState }) => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /** Custom indicator inside the control. Replaces the default checkmark / dash icons. */
  indicator?: (props: { state: CheckboxState }) => any
}
</script>

<script setup lang="ts">
import { CheckboxRoot } from 'reka-ui'
import { computed, ref, useSlots, useTemplateRef } from 'vue'

import {
  forwardRootClick,
  keepFocusWhenReadonly,
  submitOnEnter,
} from '../../composables/forwardRootClick'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { useFieldValidation } from '../../composables/useFieldValidation'
import { useFieldsetDisabled } from '../fieldset/context'

defineOptions({ inheritAttrs: false })

// `undefined` defaults stop Vue casting absent boolean props to `false`: uncontrolled mode and `defaultValue` apply,
// and an unset `invalid` leaves validation in charge
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: undefined,
  invalid: undefined,
})
const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean | 'indeterminate']
}>()
defineSlots<CheckboxSlots>()
const slots = useSlots()

const ui = useComponentUI('checkbox', theme, () => ({
  variant: props.variant,
}))

const local = ref(props.defaultValue ?? false)
const checked = computed(() => props.modelValue ?? local.value)
const state = computed<CheckboxState>(() =>
  checked.value === 'indeterminate' ? 'indeterminate' : checked.value ? 'checked' : 'unchecked',
)

const root = useTemplateRef<HTMLElement>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => checked.value === true,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    local.value = props.defaultValue ?? false
    emit('update:modelValue', local.value)
  },
})
const invalid = computed(() => validation.value.isInvalid)

const { id, describedBy, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  slotProps: () => ({ state: state.value }),
})

function onUpdate(value: boolean | 'indeterminate') {
  // RAC `isReadOnly`: the control stays focusable but never changes state
  if (props.readonly) return
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
}
</script>

<template>
  <div
    ref="root"
    data-slot="checkbox"
    :data-state="state"
    :data-selected="state === 'checked' ? 'true' : undefined"
    :data-indeterminate="state === 'indeterminate' ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="forwardRootClick($event, '[data-slot=checkbox-content]')"
    @mousedown="keepFocusWhenReadonly($event, readonly, '[data-slot=checkbox-content]')"
  >
    <CheckboxRoot
      v-bind="$attrs"
      :id="id"
      :model-value="checked"
      :name="name"
      :value="value"
      :required="required"
      :disabled="isDisabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-describedby="describedBy"
      data-slot="checkbox-content"
      :class="ui.content({ class: props.ui?.content })"
      @keydown.capture="submitOnEnter"
      @update:model-value="onUpdate"
    >
      <span data-slot="checkbox-control" :class="ui.control({ class: props.ui?.control })">
        <span
          aria-hidden="true"
          data-slot="checkbox-indicator"
          :class="ui.indicator({ class: props.ui?.indicator })"
        >
          <slot name="indicator" :state="state">
            <svg
              v-if="state === 'indeterminate'"
              aria-hidden="true"
              data-slot="checkbox-default-indicator--indeterminate"
              fill="none"
              role="presentation"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="3"
              viewBox="0 0 24 24"
            >
              <line x1="21" x2="3" y1="12" y2="12" />
            </svg>
            <svg
              v-else
              aria-hidden="true"
              data-slot="checkbox-default-indicator--checkmark"
              fill="none"
              role="presentation"
              stroke="currentColor"
              stroke-dasharray="22"
              :stroke-dashoffset="state === 'checked' ? 44 : 66"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 17 18"
            >
              <polyline points="1 9 7 14 15 4" />
            </svg>
          </slot>
        </span>
      </span>
      <slot name="label" :state="state">{{ label }}</slot>
    </CheckboxRoot>
    <FieldDescription />
    <FieldError />
  </div>
</template>
