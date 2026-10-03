<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import theme from './theme'

type Switch = typeof theme

export interface SwitchProps {
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
}

export interface SwitchSlots {
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
import { computed, ref, useId, useSlots, useTemplateRef } from 'vue'
import { forwardRootClick, keepFocusWhenReadonly, submitOnEnter } from '../../composables/forwardRootClick'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldValidation } from '../../composables/useFieldValidation'
import Description from '../description/Description.vue'
import FieldError from '../field-error/FieldError.vue'

defineOptions({ inheritAttrs: false })

// `undefined` defaults stop Vue casting absent boolean props to `false`: uncontrolled mode and `defaultValue` apply,
// and an unset `invalid` leaves validation in charge
const props = withDefaults(defineProps<SwitchProps>(), { modelValue: undefined, invalid: undefined })
const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean]
}>()
defineSlots<SwitchSlots>()
const slots = useSlots()

const ui = useComponentUI('switch', theme, () => ({
  size: props.size,
}))

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)

const local = ref(props.defaultValue ?? false)
const checked = computed(() => props.modelValue ?? local.value)

const root = useTemplateRef<HTMLElement>('root')
const { validation, commitValidation } = useFieldValidation({
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

const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const describedBy = computed(() => [hasDescription.value && descriptionId.value, hasError.value && errorId.value].filter(Boolean).join(' ') || undefined)

function onUpdate(value: boolean) {
  // RAC `isReadOnly`: the control stays focusable but never changes state
  if (props.readonly)
    return
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
}
</script>

<template>
  <div
    ref="root"
    data-slot="switch"
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-selected="checked ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
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
      :disabled="disabled"
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
          <span v-if="slots.icon" data-slot="switch-icon" :class="ui.icon({ class: props.ui?.icon })">
            <slot name="icon" :checked="checked" />
          </span>
        </span>
      </span>
      <slot name="label" :checked="checked">{{ label }}</slot>
    </SwitchRoot>
    <Description v-if="hasDescription" :id="descriptionId">
      <slot name="description" :checked="checked">{{ description }}</slot>
    </Description>
    <FieldError v-if="hasError" :id="errorId">
      <slot name="error" v-bind="validation">{{ errorMessage ?? validation.validationErrors.join(' ') }}</slot>
    </FieldError>
  </div>
</template>
