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

<script lang="ts">
import type { DateFieldRootProps, DateValue } from 'reka-ui'

import type { DateInputGroupProps } from '@/components/date-input-group/DateInputGroup.vue'
import dateInputGroupTheme from '@/components/date-input-group/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type DateField = typeof theme
type DateInputGroup = typeof dateInputGroupTheme

// Reka doesn't export these as standalone types; derive them from the (exported) root props instead.
type Granularity = NonNullable<DateFieldRootProps['granularity']>
type HourCycle = NonNullable<DateFieldRootProps['hourCycle']>
type DateStep = NonNullable<DateFieldRootProps['step']>
type DateUnavailableMatcher = NonNullable<DateFieldRootProps['isDateUnavailable']>

export type DateFieldProps = {
  /** Label text rendered above the group. */
  label?: string
  /** Helper text rendered below the group. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the group while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the field; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the value, used when submitting a form. */
  name?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: DateValue
  /** The placeholder date, used to determine which segments to show when no date is selected. Use `v-model:placeholder` to control it. */
  placeholder?: DateValue
  /** The placeholder date when uncontrolled. */
  defaultPlaceholder?: DateValue
  /**
   * The granularity of the field: which segments are rendered, up to and including this unit.
   * @defaultValue 'day' (a `CalendarDate` value), otherwise 'minute'
   */
  granularity?: Granularity
  /** The hour cycle used to format times. Defaults to the locale's preference. */
  hourCycle?: HourCycle
  /**
   * The stepping interval for the time segments.
   * @defaultValue 1
   */
  step?: DateStep
  /**
   * Whether to snap the time value to the nearest `step` increment after input.
   * @defaultValue false
   */
  stepSnapping?: boolean
  /** Whether to hide the time zone segment. */
  hideTimeZone?: boolean
  /** The minimum selectable date. */
  minValue?: DateValue
  /** The maximum selectable date. */
  maxValue?: DateValue
  /** The locale used to format the field. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /** A function that returns whether a given date is unavailable for selection. */
  isDateUnavailable?: DateUnavailableMatcher
  /**
   * Visual variant of the group.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the field takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the field is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the value can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the committed value. Return an error message (or several) when invalid. */
  validate?: ValidateFn<DateValue>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. `group`, `input`, `segment`, `prefix` and `suffix` are the internal `date-input-group`'s. */
  ui?: ComponentSlots<DateField> & { group?: ComponentSlots<DateInputGroup>['base'] } & Pick<
      ComponentSlots<DateInputGroup>,
      'input' | 'segment' | 'prefix' | 'suffix'
    >
} & FormFieldProps

export type DateFieldSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Prefix content, rendered before the segments (e.g. an icon). */
  prefix?: () => any
  /** Suffix content, rendered after the segments (e.g. an icon). */
  suffix?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
}

export type DateFieldEmits = {
  /** Emitted when the displayed placeholder date changes. */
  'update:placeholder': [value: DateValue]
}
</script>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useTemplateRef } from 'vue'

import DateInputGroup, {
  dropDanglingTimeZoneSeparator,
  wrapBidiIsolate,
} from '@/components/date-input-group/DateInputGroup.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'

// `invalid: undefined`: an absent boolean would cast to `false`, which counts as controlled-valid and hides validation errors
const props = withDefaults(defineProps<DateFieldProps>(), { invalid: undefined })
const emit = defineEmits<DateFieldEmits>()
const slots = defineSlots<DateFieldSlots>()
const disabled = useFieldsetDisabled(() => props.disabled)
/** The selected date. Bind with `v-model`. */
const modelValue = defineModel<DateValue | null>()

const ui = useComponentUI('dateField', theme, () => ({ fullWidth: props.fullWidth }))

const root = useTemplateRef<ComponentPublicInstance>('root')

// React Aria's `useDateFieldState` treats an out-of-range/unavailable value as a builtin validation error,
// combined with `validate`'s own errors the same way RAC's `mergeValidation` does (custom error wins when both
// apply); Reka only tracks this internally per-segment (unreachable from outside), so it's computed here instead
// and fed into `validate` so it follows `validationBehavior` like any other error.
function formatDateBoundary(value: DateValue) {
  return new DateFormatter(props.locale ?? 'en-US', { dateStyle: 'medium' }).format(
    value.toDate(getLocalTimeZone()),
  )
}
function builtinValidate(value: DateValue) {
  if (props.minValue && value.compare(props.minValue) < 0)
    return `Value must be ${formatDateBoundary(props.minValue)} or later.`
  if (props.maxValue && value.compare(props.maxValue) > 0)
    return `Value must be ${formatDateBoundary(props.maxValue)} or earlier.`
  if (props.isDateUnavailable?.(value)) return 'Selected date unavailable.'
  return undefined
}
function validate(value: DateValue) {
  const custom = props.validate?.(value)
  return custom && custom !== true ? custom : builtinValidate(value)
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

function onUpdate(value: DateValue | undefined) {
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
