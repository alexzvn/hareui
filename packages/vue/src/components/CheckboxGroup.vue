<script lang="ts">
import type { ValidateFn, ValidationResult } from '../composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import type { ValidationBehavior } from './formContext'
import checkboxTheme from '../theme/checkbox'
import theme from '../theme/checkboxGroup'

type CheckboxGroup = typeof theme
type Checkbox = typeof checkboxTheme

export interface CheckboxGroupItem {
  /** The value added to / removed from `v-model` when the item is toggled. */
  value: string
  /** The item label. */
  label?: string
  /** Help text rendered below the item label. */
  description?: string
  /** Whether the item is disabled. */
  disabled?: boolean
}

export interface CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> {
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
  class?: any
  /** Per-slot class overrides. `item` is each checkbox's root; `content`, `control` and `indicator` are the `checkbox` theme's. */
  ui?: ComponentSlots<CheckboxGroup> & Pick<ComponentSlots<Checkbox>, 'content' | 'control' | 'indicator'> & { item?: any }
}

export interface CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> {
  /** The group label content. Replaces the `label` prop. */
  'label'?: () => any
  /** The group description content. Replaces the `description` prop. */
  'description'?: () => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  'error'?: (props: ValidationResult) => any
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: { item: T, index: number }) => any
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: { item: T, index: number }) => any
  /** Custom content inside each control. Replaces the default checkmark. */
  'indicator'?: (props: { item: T, checked: boolean }) => any
}
</script>

<script setup lang="ts" generic="T extends CheckboxGroupItem = CheckboxGroupItem">
import { CheckboxGroupRoot, CheckboxRoot as RekaCheckboxRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useId, useSlots, useTemplateRef } from 'vue'
import { forwardRootClick } from '../composables/forwardRootClick'
import { useComponentUI } from '../composables/useComponentUI'
import { useFieldValidation } from '../composables/useFieldValidation'
import Description from './Description.vue'
import FieldError from './FieldError.vue'
import Label from './Label.vue'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), { items: () => [], invalid: undefined })
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

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const labelId = computed(() => `${id.value}-label`)
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)

// `[]` (not `undefined`): Reka self-manages its state when `modelValue` is undefined, which would let
// `readonly` items change selection behind our back.
const selected = computed(() => modelValue.value ?? props.defaultValue ?? [])

const root = useTemplateRef<ComponentPublicInstance>('root')
const { validation, commitValidation } = useFieldValidation({
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

const hasLabel = computed(() => !!(props.label || slots.label))
const hasDescription = computed(() => !!(props.description || slots.description))
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const describedBy = computed(() => [hasDescription.value && descriptionId.value, hasError.value && errorId.value].filter(Boolean).join(' ') || undefined)

function hasItemDescription(item: CheckboxGroupItem) {
  return !!(item.description || slots['item-description'])
}

function onUpdate(value: string[]) {
  // `isReadOnly`: items stay focusable but the selection never changes
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
    :disabled="disabled"
    :required="required"
    :roving-focus="false"
    data-slot="checkbox-group"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="describedBy"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
  >
    <!-- `as` falls through to Reka `Label`: the group label names the group via aria-labelledby, not a form control -->
    <Label v-if="hasLabel" :id="labelId" as="span" :disabled="disabled">
      <slot name="label">{{ label }}</slot>
    </Label>
    <Description v-if="hasDescription" :id="descriptionId">
      <slot name="description">{{ description }}</slot>
    </Description>
    <div
      v-for="(item, index) in items"
      :key="item.value"
      data-slot="checkbox"
      :data-state="selected.includes(item.value) ? 'checked' : 'unchecked'"
      :data-selected="selected.includes(item.value) ? 'true' : undefined"
      :data-disabled="disabled || item.disabled ? 'true' : undefined"
      :data-invalid="invalid ? 'true' : undefined"
      :data-readonly="readonly ? 'true' : undefined"
      :class="itemUi.base({ class: props.ui?.item })"
    @click="forwardRootClick($event, '[data-slot=checkbox-content]')"
    >
      <RekaCheckboxRoot
        :id="`${id}-${index}`"
        :value="item.value"
        :disabled="item.disabled"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="[hasItemDescription(item) && `${id}-${index}-description`, describedBy].filter(Boolean).join(' ') || undefined"
        data-slot="checkbox-content"
        :data-selected="selected.includes(item.value) ? 'true' : undefined"
        :class="itemUi.content({ class: props.ui?.content })"
      >
        <span data-slot="checkbox-control" :class="itemUi.control({ class: props.ui?.control })">
          <span aria-hidden="true" data-slot="checkbox-indicator" :class="itemUi.indicator({ class: props.ui?.indicator })">
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
      <Description v-if="hasItemDescription(item)" :id="`${id}-${index}-description`">
        <slot name="item-description" :item="item" :index="index">{{ item.description }}</slot>
      </Description>
    </div>
    <FieldError v-if="hasError" :id="errorId">
      <slot name="error" v-bind="validation">{{ errorMessage ?? validation.validationErrors.join(' ') }}</slot>
    </FieldError>
  </CheckboxGroupRoot>
</template>
