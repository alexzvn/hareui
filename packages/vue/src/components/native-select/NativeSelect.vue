<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="native-select"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <FieldLabel :for="id" />
    <div data-slot="native-select-trigger" :class="ui.trigger({ class: props.ui?.trigger })">
      <select
        v-bind="selectAttrs"
        :id="id"
        ref="select"
        data-slot="native-select-select"
        :value="current"
        :name="name"
        :autocomplete="autocomplete"
        :required="required && (validationBehavior ?? 'native') === 'native'"
        :aria-required="required ? 'true' : undefined"
        :disabled="isDisabled"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        :data-placeholder="current === '' ? 'true' : undefined"
        :class="ui.select({ class: props.ui?.select })"
        @change="onChange"
      >
        <option v-if="placeholder !== undefined" value="">
          {{ placeholder }}
        </option>
        <template v-for="(item, index) in items" :key="index">
          <optgroup v-if="isGroup(item)" :label="item.label" :disabled="item.disabled">
            <option
              v-for="option in item.items.map(optionOf)"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </option>
          </optgroup>
          <option v-else :value="optionOf(item).value" :disabled="optionOf(item).disabled">
            {{ optionOf(item).label }}
          </option>
        </template>
        <slot />
      </select>
      <span
        aria-hidden="true"
        data-slot="native-select-indicator"
        :class="ui.indicator({ class: props.ui?.indicator })"
      >
        <slot name="indicator">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </slot>
      </span>
    </div>
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

type NativeSelect = typeof theme

/** An `<option>`: a plain string is used as both value and label. */
export type NativeSelectOption =
  | string
  | {
      /** The submitted value. */
      value: string
      /** The visible text. Defaults to `value`. */
      label?: string
      /** Whether the option can't be chosen. */
      disabled?: boolean
    }

/** An `<optgroup>` holding options. */
export type NativeSelectGroup = {
  /** The group heading. */
  label: string
  /** The options in the group. */
  items: NativeSelectOption[]
  /** Whether every option in the group is disabled. */
  disabled?: boolean
}

export type NativeSelectItem = NativeSelectOption | NativeSelectGroup

export type NativeSelectProps = {
  /** The selected value. Bind with `v-model`. */
  modelValue?: string
  /** The initial value when uncontrolled. */
  defaultValue?: string
  /** The options and groups to render. Options in the default slot render after them. */
  items?: NativeSelectItem[]
  /** Text of a first empty option (`value=""`), shown while nothing is selected. */
  placeholder?: string
  /** The label rendered above the select. */
  label?: string
  /** Help text rendered below the select. Hidden while invalid. */
  description?: string
  /** Error message rendered below the select while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Visual style. Use `secondary` on surfaces.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<NativeSelect>['variant']
  /**
   * Whether the select fills the width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the select is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the select is invalid. Sets `aria-invalid` on the select and `data-invalid` on the root. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether a non-empty value is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the value. Return an error message (or several) when invalid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the select, used when submitting an HTML form. */
  name?: string
  /** The `autocomplete` hint of the select, e.g. `country`. */
  autocomplete?: string
  /** The id of the select. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NativeSelect>
} & FormFieldProps

export type NativeSelectSlots = {
  /** `<option>` and `<optgroup>` elements, rendered after `items`. */
  default?: () => any
  /** The label content. Replaces the `label` prop. */
  label?: () => any
  /** The description content. Replaces the `description` prop. */
  description?: () => any
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /** The icon at the end of the select. Replaces the chevron. */
  indicator?: () => any
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, useSlots, useTemplateRef } from 'vue'

import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

defineOptions({ inheritAttrs: false })

// `undefined` defaults keep an absent `invalid` from counting as controlled-valid
const props = withDefaults(defineProps<NativeSelectProps>(), { invalid: undefined })
const emit = defineEmits<{
  /** Emitted when the user picks an option. */
  'update:modelValue': [value: string]
}>()
defineSlots<NativeSelectSlots>()
const slots = useSlots()
const attrs = useAttrs()

const ui = useComponentUI('nativeSelect', theme, () => ({
  variant: props.variant,
  fullWidth: props.fullWidth,
}))

const root = useTemplateRef<HTMLElement>('root')
const select = useTemplateRef<HTMLSelectElement>('select')
const isDisabled = useFieldsetDisabled(() => props.disabled)

const local = ref(props.defaultValue ?? '')
const current = computed(() => props.modelValue ?? local.value)
// The value form reset restores: `defaultValue`, or the option the browser picked at mount
let initial = local.value

// Without a default, the value form reset restores is the first enabled option, as for a native `<select>`.
// Read it from the DOM: binding `value=""` with no empty option leaves the browser with nothing selected.
onMounted(() => {
  if (props.defaultValue !== undefined || !select.value) return
  const first = [...select.value.options].find(
    (option) =>
      !option.disabled &&
      !(option.parentElement instanceof HTMLOptGroupElement && option.parentElement.disabled),
  )
  initial = first?.value ?? ''
  if (props.modelValue === undefined) local.value = initial
})

const { validation, commitValidation } = useFieldValidation({
  formField: props,
  value: () => current.value,
  validate: () => props.validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value,
  onReset: () => {
    local.value = props.defaultValue ?? initial
    emit('update:modelValue', local.value)
    // The browser resets the `<select>` after the `reset` listeners run, and microtasks run in between
    // when the reset comes from a user click, so restore the bound value in a new task
    setTimeout(() => {
      if (select.value) select.value.value = current.value
    })
  },
})
const invalid = computed(() => validation.value.isInvalid)

const { id, describedBy, FieldLabel, FieldDescription, FieldError } = useFieldChrome({
  props,
  slots,
  invalid,
  validation,
  disabled: isDisabled,
  required: () => props.required,
  hideDescriptionWhenInvalid: true,
  ariaDescribedBy: () => attrs['aria-describedby'] as string | undefined,
})

const rootAttrs = computed(() => ({ style: attrs.style }))
const selectAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

function optionOf(option: NativeSelectOption) {
  return typeof option === 'string'
    ? { value: option, label: option, disabled: false }
    : { ...option, label: option.label ?? option.value }
}
function isGroup(item: NativeSelectItem): item is NativeSelectGroup {
  return typeof item === 'object' && 'items' in item
}

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  local.value = value
  emit('update:modelValue', value)
  commitValidation()
}
</script>
