<template>
  <div
    ref="root"
    :data-slot="($attrs['data-slot'] as string | undefined) ?? 'switch'"
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-selected="checked ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="forwardRootClick($event, '[data-slot=switch-content]')"
    @mousedown="keepFocusWhenReadonly($event, readonly, '[data-slot=switch-content]')"
  >
    <SwitchRoot
      v-bind="$attrs"
      :id="id"
      :model-value="checked"
      :name="name"
      :value="value"
      :required="required"
      :disabled="isDisabled"
      :aria-describedby="describedBy"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      data-slot="switch-content"
      :class="ui.content({ class: props.ui?.content })"
      @keydown.capture="submitOnEnter"
      @update:model-value="onUpdate"
    >
      <span data-slot="switch-control" :class="ui.control({ class: props.ui?.control })">
        <span data-slot="switch-thumb" :class="ui.thumb({ class: props.ui?.thumb })">
          <span
            v-if="slots.icon"
            data-slot="switch-icon"
            :class="ui.icon({ class: props.ui?.icon })"
          >
            <slot name="icon" :checked="checked" />
          </span>
        </span>
      </span>
      <slot name="label" :checked="checked">{{ label }}</slot>
    </SwitchRoot>
    <FieldDescription />
    <FieldError />
  </div>
</template>

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Switch = typeof theme

export type SwitchProps = {
  /** The checked state. Bind with `v-model`. */
  modelValue?: boolean
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean
  /** The label rendered next to the control. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Error message rendered below the label while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Size of the switch.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Switch>['size']
  /**
   * Whether the switch is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the switch is invalid. Sets `aria-invalid` on the control and `data-invalid` on the root. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the switch is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether user input is required on the switch before form submission.
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
  /** The id of the switch control. Generated when omitted; use it to point an external `Label` at the switch. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Switch>
} & FormFieldProps

export type SwitchSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: (props: { checked: boolean }) => any
  /** The description content. Replaces the `description` prop. */
  description?: (props: { checked: boolean }) => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /** Icon rendered inside the thumb. */
  icon?: (props: { checked: boolean }) => any
}
</script>

<script setup lang="ts">
import { SwitchRoot } from 'reka-ui'
import { computed, ref, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import {
  forwardRootClick,
  keepFocusWhenReadonly,
  submitOnEnter,
} from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

// Attributes go to the switch button; a `data-slot` attribute also renames the root, so a wrapper (CellSwitch) can
// claim it while the button keeps `switch-content`
defineOptions({ inheritAttrs: false })

// `undefined` defaults stop Vue casting absent boolean props to `false`: uncontrolled mode and `defaultValue` apply,
// and an unset `invalid` leaves validation in charge
const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: undefined,
  invalid: undefined,
})
const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean]
}>()
defineSlots<SwitchSlots>()
const slots = useSlots()

const ui = useComponentUI('switch', theme, () => ({
  size: props.size,
}))

const local = ref(props.defaultValue ?? false)
const checked = computed(() => props.modelValue ?? local.value)

const root = useTemplateRef<HTMLElement>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => checked.value,
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
  disabled: isDisabled,
  slotProps: () => ({ checked: checked.value }),
})

const onUpdate = (value: boolean) => {
  // RAC `isReadOnly`: the control stays focusable but never changes state
  if (props.readonly) return
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
}
</script>
