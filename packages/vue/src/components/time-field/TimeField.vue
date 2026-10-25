<template>
  <TimeFieldRoot
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
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :name="name"
    data-slot="time-field"
    :data-required="required ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="ui.base()"
    @update:model-value="onUpdate"
    @update:placeholder="emit('update:placeholder', $event)"
  >
    <template #default="{ segments }">
      <!-- `as` falls through to Reka `Label`: the group label names the input group via aria-labelledby, not a single form control (HeroUI renders a span) -->
      <FieldLabel :id="labelId" as="span" />
      <DateInputGroup
        :segments="wrapBidiIsolate(dropDanglingTimeZoneSeparator(segments))"
        :segment-input="TimeFieldInput"
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
  </TimeFieldRoot>
</template>

<script setup lang="ts">
import type { AnyTime } from '@internationalized/date'
import { TimeFieldInput, TimeFieldRoot } from 'reka-ui'
import type { TimeValue } from 'reka-ui'
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

import theme from './theme'
import type { TimeFieldEmits, TimeFieldProps, TimeFieldSlots } from './TimeField.types'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<TimeFieldProps>(), { invalid: undefined })
const emit = defineEmits<TimeFieldEmits>()
const slots = defineSlots<TimeFieldSlots>()
const disabled = useFieldsetDisabled(() => props.disabled)

/** The selected time. Bind with `v-model`. */
const modelValue = defineModel<TimeValue | null>()

const ui = useComponentUI('timeField', {
  theme,
  variantProps: () => ({ fullWidth: props.fullWidth }),
  props,
})

const root = useTemplateRef<ComponentPublicInstance>('root')

// `TimeValue.compare()` has incompatible call signatures across its `Time | CalendarDateTime | ZonedDateTime`
// members, so bounds are compared by time-of-day fields directly instead (matches HeroUI/React Aria semantics,
// where `minValue`/`maxValue` constrain the time of day regardless of any date part).
const compareTimeOfDay = (a: AnyTime, b: AnyTime) => {
  return (
    a.hour - b.hour || a.minute - b.minute || a.second - b.second || a.millisecond - b.millisecond
  )
}

const intlHourCycles = { 12: 'h12', 24: 'h23' } as const

const formatTimeBoundary = (value: AnyTime) => {
  const reference = new Date(2020, 0, 1, value.hour, value.minute, value.second, value.millisecond)
  const hourCycle = props.hourCycle ? intlHourCycles[props.hourCycle] : undefined

  return new Intl.DateTimeFormat(props.locale ?? 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle,
  }).format(reference)
}

// React Aria's `useTimeFieldState` treats an out-of-range value as a builtin validation error, combined with
// `validate`'s own errors the same way RAC's `mergeValidation` does (custom error wins when both apply); Reka
// only tracks this internally per-segment (unreachable from outside), so it's computed here instead and fed
// into `validate` so it follows `validationBehavior` like any other error.
const builtinValidate = (value: TimeValue) => {
  if (props.minValue && compareTimeOfDay(value, props.minValue) < 0)
    return `Value must be ${formatTimeBoundary(props.minValue)} or later.`

  if (props.maxValue && compareTimeOfDay(value, props.maxValue) > 0)
    return `Value must be ${formatTimeBoundary(props.maxValue)} or earlier.`

  return undefined
}

const validate = (value: TimeValue) => {
  const custom = props.validate?.(value)
  const hasCustomError = custom && custom !== true

  return hasCustomError ? custom : builtinValidate(value)
}

const { validation, commitValidation } = useFieldValidation({
  // Untouched + uncontrolled: `modelValue` is `undefined` until the first `onUpdate`, so fall back to
  // `defaultValue`. A controlled field explicitly cleared to `null` stays `null`, not fall back.
  value: () =>
    (modelValue.value === undefined ? props.defaultValue : modelValue.value) ?? undefined,
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

const onUpdate = (value: TimeValue | undefined) => {
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
