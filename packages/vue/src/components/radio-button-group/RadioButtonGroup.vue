<template>
  <RadioGroupRoot
    ref="root"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :orientation="orientation"
    data-slot="radio-button-group"
    :data-layout="layout"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @keydown.capture="onKeydownCapture"
  >
    <!-- A group label names the radiogroup via aria-labelledby, not a form control. -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <slot />
    <FieldError />
  </RadioGroupRoot>
</template>

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type RadioButtonGroup = typeof theme

export type RadioButtonGroupProps = {
  /** The value selected initially when uncontrolled. */
  defaultValue?: string
  /** The group label. */
  label?: string
  /** Help text rendered below the group label. */
  description?: string
  /** Error message rendered below the items while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the group is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is read only: items stay focusable and announced, but the selection can't change.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether a selection is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selected value (not called while nothing is selected). Return an error message (or several) when invalid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the group, used when submitting an HTML form. */
  name?: string
  /**
   * How the items are laid out. `grid` makes the root a CSS grid: set the columns with a class such as `grid-cols-3`.
   * @defaultValue 'flex'
   */
  layout?: ComponentVariants<RadioButtonGroup>['layout']
  /**
   * Visual style of the default radio indicator. Use `secondary` on a surface.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<RadioButtonGroup>['variant']
  /** The arrow keys that move focus. Both axes work when omitted. */
  orientation?: 'horizontal' | 'vertical'
  /** Base id of the group. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides, applied to every item. */
  ui?: ComponentSlots<RadioButtonGroup>
} & FormFieldProps

export type RadioButtonGroupSlots = {
  /** The `RadioButtonGroupItem` components. */
  default?: () => any
  /** The group label content. Replaces the `label` prop. */
  label?: () => any
  /** The group description content. Replaces the `description` prop. */
  description?: () => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}
</script>

<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui'
import { computed, provide, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import { radioButtonGroupKey } from './context'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<RadioButtonGroupProps>(), {
  layout: 'flex',
  variant: 'primary',
  invalid: undefined,
})
defineSlots<RadioButtonGroupSlots>()
/** The value of the selected item. Bind with `v-model`. */
const modelValue = defineModel<string>()
const slots = useSlots()

const ui = useComponentUI('radioButtonGroup', theme, () => ({
  layout: props.layout,
  variant: props.variant,
}))

// `null` (not `undefined`) when nothing is selected: Reka self-manages its state when `modelValue` is undefined,
// which would let `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? null)

const root = useTemplateRef<InstanceType<typeof RadioGroupRoot>>('root')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => selected.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value?.$el as Element | undefined,
  onReset: () => {
    modelValue.value = props.defaultValue
  },
})
const invalid = computed(() => validation.value.isInvalid)

const { labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome(
  {
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  },
)

provide(radioButtonGroupKey, {
  selected,
  disabled: isDisabled,
  readonly: computed(() => !!props.readonly),
  invalid,
  variant: computed(() => props.variant),
  layout: computed(() => props.layout),
  describedBy,
  ui: computed(() => props.ui),
})

// Reka's roving focus moves focus (without selecting) on Home / End / PageUp / PageDown; a native radio group
// ignores them, so stop them before they reach the focused item.
function onKeydownCapture(event: KeyboardEvent) {
  if (['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation()
}

function onUpdate(value: unknown) {
  if (props.readonly) return
  modelValue.value = value as string
  commitValidation()
}
</script>
