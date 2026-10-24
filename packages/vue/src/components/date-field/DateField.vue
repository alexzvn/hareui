<template>
  <DateFieldRoot
    :id="id"
    ref="root"
    :model-value="modelValue"
    :default-value="defaultValue"
    :placeholder="placeholder"
    :default-placeholder="defaultPlaceholder"
    :granularity="granularity"
    :hour-cycle="hourCycle"
    :step="step"
    :step-snapping="stepSnapping"
    :hide-time-zone="hideTimeZone"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :is-date-unavailable="isDateUnavailable"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :name="name"
    data-slot="date-field"
    :data-required="required ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @update:placeholder="emit('update:placeholder', $event)"
  >
    <template #default="{ segments }">
      <!-- `as="span"`: the group label names the input group via aria-labelledby, not a single form control (HeroUI renders a span) -->
      <FieldLabel :id="labelId" as="span" />
      <DateInputGroup
        :segments="wrapBidiIsolate(dropDanglingTimeZoneSeparator(segments))"
        :segment-input="DateFieldInput"
        :variant="variant"
        :full-width="fullWidth"
        :disabled="disabled"
        :invalid="invalid"
        :aria-label="$attrs['aria-label'] as string | undefined"
        :labelledby="hasLabel ? labelId : undefined"
        :describedby="describedBy"
        :ui="{ base: props.ui?.group, ...groupUiProps }"
      >
        <template v-if="slots.prefix" #prefix>
          <slot name="prefix" />
        </template>
        <template v-if="slots.suffix" #suffix>
          <slot name="suffix" />
        </template>
      </DateInputGroup>
      <FieldDescription />
      <FieldError />
    </template>
  </DateFieldRoot>
</template>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useTemplateRef } from 'vue'

import type { DateInputGroupProps } from '@/components/date-input-group/DateInputGroup.types'
import {
  dropDanglingTimeZoneSeparator,
  wrapBidiIsolate,
} from '@/components/date-input-group/dateInputGroup.utils'
import DateInputGroup from '@/components/date-input-group/DateInputGroup.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

import type { DateFieldEmits, DateFieldProps, DateFieldSlots } from './DateField.types'
import theme from './theme'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<DateFieldProps>(), { invalid: undefined })
const emit = defineEmits<DateFieldEmits>()
const slots = defineSlots<DateFieldSlots>()
const disabled = useFieldsetDisabled(() => props.disabled)

/** The selected date. Bind with `v-model`. */
const modelValue = defineModel<DateValue | null>()

const ui = useComponentUI('dateField', theme, () => ({ fullWidth: props.fullWidth }))

const root = useTemplateRef<ComponentPublicInstance>('root')

const formatDateBoundary = (value: DateValue) => {
  const formatter = new DateFormatter(props.locale ?? 'en-US', { dateStyle: 'medium' })

  return formatter.format(value.toDate(getLocalTimeZone()))
}

// React Aria's `useDateFieldState` treats an out-of-range/unavailable value as a builtin validation error,
// combined with `validate`'s own errors the same way RAC's `mergeValidation` does (custom error wins when both
// apply); Reka only tracks this internally per-segment (unreachable from outside), so it's computed here instead
// and fed into `validate` so it follows `validationBehavior` like any other error.
const builtinValidate = (value: DateValue) => {
  if (props.minValue && value.compare(props.minValue) < 0)
    return `Value must be ${formatDateBoundary(props.minValue)} or later.`

  if (props.maxValue && value.compare(props.maxValue) > 0)
    return `Value must be ${formatDateBoundary(props.maxValue)} or earlier.`

  if (props.isDateUnavailable?.(value)) return 'Selected date unavailable.'

  return undefined
}

const validate = (value: DateValue) => {
  const custom = props.validate?.(value)
  return custom && custom !== true ? custom : builtinValidate(value)
}

// Untouched + uncontrolled: `modelValue` is `undefined` until the first `onUpdate`, so fall back to
// `defaultValue`. A controlled field explicitly cleared to `null` stays `null`, not fall back.
const currentValue = () => {
  const value = modelValue.value === undefined ? props.defaultValue : modelValue.value
  return value ?? undefined
}

const { validation, commitValidation } = useFieldValidation({
  value: currentValue,
  validate: () => validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value?.$el as Element | undefined,
  formField: props,
  onReset: () => {
    modelValue.value = props.defaultValue
  },
})

const invalid = computed(() => props.invalid ?? validation.value.isInvalid)

const onUpdate = (value: DateValue | undefined) => {
  modelValue.value = value

  // No real `change` event bubbles from Reka's hidden mirror input while typing segments
  commitValidation()
}

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
    // HeroUI's CSS always hides the description while invalid, regardless of whether an error message exists
    hideDescriptionWhenInvalid: true,
  })

const groupUiProps = computed<DateInputGroupProps['ui']>(() => ({
  input: props.ui?.input,
  segment: props.ui?.segment,
  prefix: props.ui?.prefix,
  suffix: props.ui?.suffix,
}))
</script>
