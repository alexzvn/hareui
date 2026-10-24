<template>
  <CheckboxGroupRoot
    ref="root"
    role="group"
    :model-value="selected"
    :name="name"
    :disabled="isDisabled"
    :required="required"
    :roving-focus="false"
    data-slot="checkbox-group"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
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
    <div
      v-for="(item, index) in items"
      :key="item.value"
      data-slot="checkbox"
      :data-state="selected.includes(item.value) ? 'checked' : 'unchecked'"
      :data-selected="selected.includes(item.value) ? 'true' : undefined"
      :data-disabled="isDisabled || item.disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :data-readonly="readonly ? 'true' : undefined"
      :class="itemUi.base({ class: props.ui?.item })"
      @click="forwardRootClick($event, '[data-slot=checkbox-content]')"
      @mousedown="keepFocusWhenReadonly($event, readonly, '[data-slot=checkbox-content]')"
    >
      <RekaCheckboxRoot
        :id="`${id}-${index}`"
        :value="item.value"
        :disabled="item.disabled"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-readonly="readonly ? 'true' : undefined"
        :aria-describedby="
          [hasItemDescription(item) && `${id}-${index}-description`, describedBy]
            .filter(Boolean)
            .join(' ') || undefined
        "
        data-slot="checkbox-content"
        :data-selected="selected.includes(item.value) ? 'true' : undefined"
        :class="itemUi.content({ class: props.ui?.content })"
        @keydown.capture="submitOnEnter"
      >
        <span data-slot="checkbox-control" :class="itemUi.control({ class: props.ui?.control })">
          <span
            aria-hidden="true"
            data-slot="checkbox-indicator"
            :class="itemUi.indicator({ class: props.ui?.indicator })"
          >
            <slot name="indicator" :item="item" :checked="selected.includes(item.value)">
              <svg
                aria-hidden="true"
                data-slot="checkbox-default-indicator--checkmark"
                fill="none"
                role="presentation"
                stroke="currentColor"
                stroke-dasharray="22"
                :stroke-dashoffset="selected.includes(item.value) ? 44 : 66"
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
        <slot name="item-label" :item="item" :index="index">{{ item.label }}</slot>
      </RekaCheckboxRoot>
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
  </CheckboxGroupRoot>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import checkboxTheme from '@/components/checkbox/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type CheckboxGroup = typeof theme
type Checkbox = typeof checkboxTheme

export type CheckboxGroupItem = {
  /** The value added to / removed from `v-model` when the item is toggled. */
  value: string
  /** The item label. */
  label?: string
  /** Help text rendered below the item label. */
  description?: string
  /** Whether the item is disabled. */
  disabled?: boolean
}

export type CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> = {
  /** The checkbox items. */
  items?: T[]
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
   * Visual style of the checkboxes.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<CheckboxGroup>['variant']
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
   * Whether the group is read only: items stay focusable and announced, but the selection can't change.
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
  /** Base id of the group; item controls get `${id}-${index}`. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `item` is each checkbox's root; `content`, `control` and `indicator` are the `checkbox` theme's. */
  ui?: ComponentSlots<CheckboxGroup> &
    Pick<ComponentSlots<Checkbox>, 'content' | 'control' | 'indicator'> & { item?: ClassValue }
} & FormFieldProps

export type CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> = {
  /** The group label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The group description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: { item: T; index: number }) => VNode[]
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: { item: T; index: number }) => VNode[]
  /** Custom content inside each control. Replaces the default checkmark. */
  indicator?: (props: { item: T; checked: boolean }) => VNode[]
}
</script>

<script setup lang="ts" generic="T extends CheckboxGroupItem = CheckboxGroupItem">
import { CheckboxGroupRoot, CheckboxRoot as RekaCheckboxRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useSlots, useTemplateRef } from 'vue'

import Description from '@/components/description/Description.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import {
  forwardRootClick,
  keepFocusWhenReadonly,
  submitOnEnter,
} from '@/composables/forwardRootClick'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), {
  items: () => [],
  invalid: undefined,
})

defineSlots<CheckboxGroupSlots<T>>()

/** The selected values. Bind with `v-model`. */
const modelValue = defineModel<string[]>()
const slots = useSlots()

const ui = useComponentUI('checkboxGroup', theme, () => ({
  variant: props.variant,
}))

// Items are literally HeroUI's `<Checkbox>` inside `<CheckboxGroup>`: reuse its theme/classes verbatim.
const itemUi = useComponentUI('checkbox', checkboxTheme, () => ({
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

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled: isDisabled,
  })

const hasItemDescription = (item: CheckboxGroupItem) => {
  return !!(item.description || slots['item-description'])
}

const onUpdate = (value: string[]) => {
  // `isReadOnly`: items stay focusable but the selection never changes
  if (props.readonly) return
  modelValue.value = value
  commitValidation()
}
</script>
