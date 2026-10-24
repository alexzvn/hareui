<script lang="ts">
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type CheckboxButtonGroup = typeof theme

export interface CheckboxButtonGroupProps extends FormFieldProps {
  /**
   * The values selected initially when uncontrolled.
   * @defaultValue []
   */
  defaultValue?: string[]
  /** The group label. */
  label?: string
  /** Help text rendered below the group label. */
  description?: string
  /** Error message rendered below the items while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * How the items are laid out. `grid` lets you set columns with a `grid-cols-*` class.
   * @defaultValue 'flex'
   */
  layout?: ComponentVariants<CheckboxButtonGroup>['layout']
  /**
   * Visual style of the default checkbox indicator. Use `secondary` on a surface.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<CheckboxButtonGroup>['variant']
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the group is read only: items stay focusable, but the selection can't change.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether at least one item must be selected before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selected values. Return an error message (or several) when invalid. */
  validate?: ValidateFn<string[]>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the group, used when submitting an HTML form. */
  name?: string
  /** Base id of the group. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides, applied to every item. */
  ui?: ComponentSlots<CheckboxButtonGroup>
}

export interface CheckboxButtonGroupSlots {
  /** The `CheckboxButtonGroupItem` components. */
  'default'?: () => any
  /** The group label content. Replaces the `label` prop. */
  'label'?: () => any
  /** The group description content. Replaces the `description` prop. */
  'description'?: () => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  'error'?: (props: ValidationResult) => any
}
</script>

<script setup lang="ts">
import { CheckboxGroupRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, provide, toRef, useSlots, useTemplateRef } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { useFieldValidation } from '../../composables/useFieldValidation'
import { useFieldsetDisabled } from '../fieldset/context'
import checkboxTheme from '../checkbox/theme'
import { checkboxButtonGroupContextKey } from './context'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<CheckboxButtonGroupProps>(), { invalid: undefined })
defineSlots<CheckboxButtonGroupSlots>()
/** The selected values. Bind with `v-model`. */
const modelValue = defineModel<string[]>()
const slots = useSlots()

const ui = useComponentUI('checkboxButtonGroup', theme, () => ({
  layout: props.layout,
  variant: props.variant,
}))
const checkboxUi = useComponentUI('checkbox', checkboxTheme, () => ({
  variant: props.variant,
}))

// `[]` (not `undefined`): Reka self-manages its state when `modelValue` is undefined, which would let
// `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? [])

const root = useTemplateRef<ComponentPublicInstance>('root')
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

const { labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled: isDisabled,
})

provide(checkboxButtonGroupContextKey, {
  selected,
  disabled: isDisabled,
  invalid,
  readonly: toRef(() => props.readonly),
  describedBy,
  layout: toRef(() => props.layout),
  variant: toRef(() => props.variant),
  checkboxUi,
  uiOverrides: toRef(() => props.ui),
})

function onUpdate(value: string[]) {
  if (props.readonly)
    return
  modelValue.value = value
  commitValidation()
}
</script>

<template>
  <CheckboxGroupRoot
    ref="root"
    role="group"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :roving-focus="false"
    data-slot="checkbox-button-group"
    :data-layout="layout ?? 'flex'"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :data-disabled="isDisabled ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
  >
    <!-- `as` falls through to Reka `Label`: the group label names the group via aria-labelledby, not a form control -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <slot />
    <FieldError />
  </CheckboxGroupRoot>
</template>
