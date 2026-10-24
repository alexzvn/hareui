<template>
  <RadioGroupRoot
    ref="root"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :orientation="orientation"
    data-slot="radio-group"
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
    <!-- `as` falls through to Reka `Label`: a group label names the radiogroup via aria-labelledby, not a form control (HeroUI renders a span).
         `disabled` is passed explicitly because Reka sets the root's `data-disabled` to "". -->
    <FieldLabel :id="labelId" as="span" :invalid="false" />
    <FieldDescription />
    <div
      v-for="(item, index) in items"
      :key="item.value"
      data-slot="radio"
      :data-state="selected === item.value ? 'checked' : 'unchecked'"
      :data-selected="selected === item.value ? 'true' : undefined"
      :data-disabled="isDisabled || item.disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :class="ui.item({ class: props.ui?.item })"
      @click="forwardRootClick($event, '[data-slot=radio-content]')"
    >
      <RekaRadioGroupItem
        :id="`${id}-${index}`"
        :value="item.value"
        :disabled="item.disabled"
        :aria-describedby="
          [hasItemDescription(item) && `${id}-${index}-description`, describedBy]
            .filter(Boolean)
            .join(' ') || undefined
        "
        data-slot="radio-content"
        :data-selected="selected === item.value ? 'true' : undefined"
        :class="ui.content({ class: props.ui?.content })"
        @keydown.capture="submitOnEnter"
      >
        <span data-slot="radio-control" :class="ui.control({ class: props.ui?.control })">
          <span
            aria-hidden="true"
            data-slot="radio-indicator"
            :class="ui.indicator({ class: props.ui?.indicator })"
            ><slot
              v-if="slots.indicator"
              name="indicator"
              :item="item"
              :checked="selected === item.value"
          /></span>
        </span>
        <slot name="item-label" :item="item" :index="index">{{ item.label }}</slot>
      </RekaRadioGroupItem>
      <Description
        v-if="hasItemDescription(item) && $slots['item-description']"
        :id="`${id}-${index}-description`"
      >
        <slot name="item-description" :item="item" :index="index">{{ item.description }}</slot>
      </Description>
      <Description v-else-if="hasItemDescription(item)" :id="`${id}-${index}-description`">{{
        item.description
      }}</Description>
    </div>
    <FieldError />
  </RadioGroupRoot>
</template>

<script lang="ts">
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type RadioGroup = typeof theme

export type RadioGroupItem = {
  /** The value submitted and bound to `v-model` when the item is selected. */
  value: string
  /** The item label. */
  label?: string
  /** Help text rendered below the item label. */
  description?: string
  /** Whether the item is disabled. */
  disabled?: boolean
}

export type RadioGroupProps<T extends RadioGroupItem = RadioGroupItem> = {
  /** The radio items. */
  items?: T[]
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
   * The axis the items are laid out along.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<RadioGroup>['orientation']
  /**
   * Visual style of the radios.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<RadioGroup>['variant']
  /** Base id of the group; item controls get `${id}-${index}`. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RadioGroup>
} & FormFieldProps

export type RadioGroupSlots<T extends RadioGroupItem = RadioGroupItem> = {
  /** The group label content. Replaces the `label` prop. */
  label?: () => any
  /** The group description content. Replaces the `description` prop. */
  description?: () => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: { item: T; index: number }) => any
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: { item: T; index: number }) => any
  /** Custom content inside each control. Replaces the default dot. */
  indicator?: (props: { item: T; checked: boolean }) => any
}
</script>

<script setup lang="ts" generic="T extends RadioGroupItem = RadioGroupItem">
import { RadioGroupItem as RekaRadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed, useSlots, useTemplateRef } from 'vue'

import Description from '@/components/description/Description.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { forwardRootClick, submitOnEnter } from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  items: () => [],
  orientation: 'vertical',
  invalid: undefined,
})
defineSlots<RadioGroupSlots<T>>()
/** The value of the selected item. Bind with `v-model`. */
const modelValue = defineModel<string>()
const slots = useSlots()

const ui = useComponentUI('radioGroup', theme, () => ({
  variant: props.variant,
  orientation: props.orientation,
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

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  })

function hasItemDescription(item: RadioGroupItem) {
  return !!(item.description || slots['item-description'])
}

// Reka's roving focus moves focus (without selecting) on Home / End / PageUp / PageDown; RAC's radio group
// ignores them, so stop them before they reach the focused radio.
function onKeydownCapture(event: KeyboardEvent) {
  if (['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation()
}

function onUpdate(value: unknown) {
  // RAC `isReadOnly`: items stay focusable but the selection never changes
  if (props.readonly) return
  modelValue.value = value as string
  commitValidation()
}
</script>
