<template>
  <div
    role="group"
    data-slot="date-input-group"
    :aria-labelledby="labelledby"
    :aria-label="ariaLabel"
    :aria-describedby="describedby"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <div
      v-if="$slots.prefix"
      data-slot="date-input-group-prefix"
      :class="ui.prefix({ class: props.ui?.prefix })"
    >
      <slot name="prefix" />
    </div>
    <component
      :is="inputContainer ? 'div' : Passthrough"
      v-bind="
        inputContainer
          ? {
              'data-slot': 'date-input-group-input-container',
              class: ui.inputContainer({ class: props.ui?.inputContainer }),
            }
          : {}
      "
    >
      <div
        data-slot="date-input-group-input"
        :slot="endSegments ? 'start' : undefined"
        :data-invalid="invalid ? 'true' : undefined"
        :class="ui.input({ class: props.ui?.input })"
        @keydown.capture="onSegmentKeydown"
      >
        <component
          :is="segmentInput"
          v-for="item in segments"
          :key="item.part"
          :part="item.part"
          v-bind="
            item.part === 'literal'
              ? endSegments
                ? { type: 'start' }
                : {}
              : segmentAttrs(item.part, endSegments ? 'start' : undefined)
          "
          data-slot="date-input-group-segment"
          :class="ui.segment({ class: props.ui?.segment })"
        >
          {{ item.value }}
        </component>
      </div>
      <template v-if="endSegments">
        <slot name="separator" />
        <div
          data-slot="date-input-group-input"
          slot="end"
          :data-invalid="invalid ? 'true' : undefined"
          :class="ui.input({ class: props.ui?.input })"
          @keydown.capture="onSegmentKeydown"
        >
          <component
            :is="segmentInput"
            v-for="item in endSegments"
            :key="item.part"
            :part="item.part"
            v-bind="item.part === 'literal' ? { type: 'end' } : segmentAttrs(item.part, 'end')"
            data-slot="date-input-group-segment"
            :class="ui.segment({ class: props.ui?.segment })"
          >
            {{ item.value }}
          </component>
        </div>
      </template>
    </component>
    <div
      v-if="$slots.suffix"
      data-slot="date-input-group-suffix"
      :class="ui.suffix({ class: props.ui?.suffix })"
    >
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import {
  injectDateFieldRootContext,
  injectDateRangeFieldRootContext,
  injectTimeFieldRootContext,
} from 'reka-ui'
import type { FunctionalComponent, Ref } from 'vue'
import { computed, useId } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type { DateInputGroupProps, DateInputGroupSlots } from './DateInputGroup.types'
import theme from './theme'

// Renders its children without a wrapper element (used when `inputContainer` is off)
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.()

const props = defineProps<DateInputGroupProps>()
defineSlots<DateInputGroupSlots>()

const ui = useComponentUI('dateInputGroup', theme, () => ({
  variant: props.variant,
  fullWidth: props.fullWidth,
}))

// React Aria's `useDateSegment` PAGE_STEP (PageUp/PageDown); its keys are exactly the numeric segments
const PAGE_STEP = {
  year: 5,
  month: 2,
  day: 7,
  hour: 2,
  minute: 15,
  second: 15,
} as const satisfies Record<string, number>

type NumericPart = keyof typeof PAGE_STEP
type DateFields = Partial<Record<NumericPart, number>>

type SegmentValues = Partial<Record<NumericPart, number | null>> & {
  dayPeriod?: 'AM' | 'PM' | null
}

const isNumericPart = (part: string): part is NumericPart => Object.hasOwn(PAGE_STEP, part)
type CompleteSegmentValues = { [K in keyof SegmentValues]: Exclude<SegmentValues[K], null> }

const isComplete = (values: SegmentValues): values is CompleteSegmentValues =>
  Object.values(values).every((value) => value !== null)

// The Reka root this group renders inside (whichever one `segmentInput` belongs to); the keyboard handling
// and ARIA fixes below read and write its segment state the same way Reka's own segment handlers do.
type SegmentState = {
  placeholder: Ref<DateValue>
  modelValue: Ref<DateValue | undefined>
  segmentValues: Ref<SegmentValues>
  step: Ref<DateFields>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  locale: Ref<string>
}

const rangeContext = injectDateRangeFieldRootContext(null)
const timeContext = injectTimeFieldRootContext(null)
const dateContext = injectDateFieldRootContext(null)
const segmentState = (type?: string | null): SegmentState | undefined => {
  if (!props.endSegments) return timeContext ?? dateContext ?? undefined
  if (!rangeContext) return undefined

  const isEnd = type === 'end'

  return {
    ...rangeContext,
    modelValue: isEnd ? rangeContext.endValue : rangeContext.startValue,
    segmentValues: isEnd ? rangeContext.segmentValues.end : rangeContext.segmentValues.start,
  }
}

// Reka keeps a `dayPeriod` segment value even for 24-hour fields; the rendered segments tell which cycle is shown
const is12Hour = computed(() => props.segments.some((s) => s.part === 'dayPeriod'))

type BoundsInput = { values: SegmentValues; placeholder: DateValue }

const monthBounds = ({ values, placeholder }: BoundsInput): [number, number] => {
  const yearDate = values.year ? placeholder.set({ year: values.year }) : placeholder

  return [1, placeholder.calendar.getMonthsInYear(yearDate)]
}

const dayBounds = ({ values, placeholder }: BoundsInput): [number, number] => {
  const fields: Record<string, number> = {}
  if (values.year) fields.year = values.year
  if (values.month) fields.month = values.month

  const date = placeholder.set({ ...fields, day: 1 })

  return [1, date.calendar.getDaysInMonth(date)]
}

// 12-hour fields keep the hour within the current AM/PM period, as React Aria does
const hourBounds = ({ values, placeholder }: BoundsInput): [number, number] => {
  if (!is12Hour.value) return [0, 23]

  const placeholderFields: DateFields = placeholder
  const hour = values.hour ?? placeholderFields.hour ?? 0
  const isPM = values.dayPeriod ? values.dayPeriod === 'PM' : hour >= 12

  return isPM ? [12, 23] : [0, 11]
}

// The `[min, max]` each numeric segment can hold, given the other segments' current values
const segmentBounds: Record<NumericPart, (input: BoundsInput) => [number, number]> = {
  year: () => [1, 9999],
  month: monthBounds,
  day: dayBounds,
  hour: hourBounds,
  minute: () => [0, 59],
  second: () => [0, 59],
}

type SegmentKey = { key: string; part: string; state: SegmentState }

// Home/End pick AM/PM; PageUp/PageDown switch to the other period
const dayPeriodTarget = (key: string, current: 'AM' | 'PM') => {
  if (key === 'Home') return 'AM'
  if (key === 'End') return 'PM'
  if (key === 'PageUp' || key === 'PageDown') return current === 'PM' ? 'AM' : 'PM'

  return undefined
}

const createDayPeriodPatch = (key: string, values: SegmentValues): SegmentValues | undefined => {
  const current = values.dayPeriod === 'PM' ? 'PM' : 'AM'
  const target = dayPeriodTarget(key, current)
  if (!target) return undefined

  const patch: SegmentValues = { dayPeriod: target }

  // The hour segment holds a 24-hour value, so switching period shifts it by 12
  if (values.hour != null && target !== current) {
    patch.hour = values.hour + (target === 'PM' ? 12 : -12)
  }

  return patch
}

const numericPatch = (part: NumericPart, value: number | undefined): SegmentValues => {
  const patch: SegmentValues = {}
  patch[part] = value

  return patch
}

const createNumericPatch = ({
  key,
  part,
  state,
}: SegmentKey & { part: NumericPart }): SegmentValues | undefined => {
  const values = state.segmentValues.value
  const [min, max] = segmentBounds[part]({ values, placeholder: state.placeholder.value })
  if (key === 'Home') return numericPatch(part, min)
  if (key === 'End') return numericPatch(part, max)

  const prev = values[part] ?? null
  const isArrow = key === 'ArrowUp' || key === 'ArrowDown'
  const isPage = key === 'PageUp' || key === 'PageDown'
  const isPeriodHourArrow = isArrow && part === 'hour' && is12Hour.value && prev !== null
  if (!isPage && !isPeriodHourArrow) return undefined

  // An empty segment takes the placeholder's value first
  if (prev === null) {
    const placeholderFields: DateFields = state.placeholder.value
    return numericPatch(part, placeholderFields[part])
  }

  // Step, then wrap around within [min, max]
  const step = isArrow ? (state.step.value[part] ?? 1) : PAGE_STEP[part]
  const direction = key === 'ArrowUp' || key === 'PageUp' ? 1 : -1
  const size = max - min + 1
  const offset = (prev - min + step * direction) % size

  return numericPatch(part, min + ((offset + size) % size))
}

// The segment values a key press sets, or `undefined` when the key is left to Reka
const createSegmentPatch = ({ key, part, state }: SegmentKey) => {
  if (part === 'dayPeriod') return createDayPeriodPatch(key, state.segmentValues.value)
  if (!isNumericPart(part)) return undefined

  return createNumericPatch({ key, part, state })
}

/**
 * Keys React Aria's `useDateSegment` handles that Reka's segments don't: Home/End (segment min/max) and
 * PageUp/PageDown (PAGE_STEP), plus ArrowUp/ArrowDown on a 12-hour hour segment, which React Aria cycles within
 * the current period (11 AM -> 12 AM) where Reka crosses into the other one. Runs in the capture phase so the
 * handled keys never reach Reka's own segment handler; every other key is left to Reka.
 */
const onSegmentKeydown = (event: KeyboardEvent) => {
  if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return

  const el = event.target as HTMLElement
  const part =
    el.getAttribute('data-reka-date-field-segment') ??
    el.getAttribute('data-reka-time-field-segment')

  if (!part) return

  const state = segmentState(el.getAttribute('data-reka-date-range-field-segment-type'))
  if (!state || state.disabled.value || state.readonly.value) return

  const values = state.segmentValues.value
  if (!(part in values)) return

  const patch = createSegmentPatch({ key: event.key, part, state })
  if (!patch) return

  event.preventDefault()
  event.stopPropagation()
  Object.assign(values, patch)

  // Same commit rule as Reka's segment handler: a complete set of segments becomes the value
  if (isComplete(values)) state.modelValue.value = state.placeholder.value.set({ ...values }).copy()
}

// React Aria's `useDateSegment` names each segment with its localized field name (`useDisplayNames`); Reka's are
// fixed English strings ("month, ")
const segmentIdBase = useId()

const displayNames = computed(() => {
  const locale = segmentState('start')?.locale.value
  return new Intl.DisplayNames(locale ?? 'en-US', { type: 'dateTimeField' })
})

// React Aria's `useDateRangePicker` start/end field labels
const RANGE_FIELD_NAMES = { start: 'Start Date', end: 'End Date' } as const

/**
 * ARIA fixes over Reka's segment attributes (fall-through attrs win over the component's own):
 * the forced `invalid` state on every segment (Reka only reflects its own min/max check), zero-padded
 * minute/second `aria-valuetext`, and the 12-hour hour's `aria-valuenow`/`aria-valuetext` (Reka reports 24-hour).
 * Also React Aria's segment naming (field name, range end, then the field label via `aria-labelledby`), the field
 * description on the first segment (every segment while invalid) and `aria-readonly`.
 */
const segmentAttrs = (part: string, type?: 'start' | 'end') => {
  const state = segmentState(type)
  const id = `${segmentIdBase}-${type ?? 'field'}-${part}`

  const name = [displayNames.value.of(part), type ? RANGE_FIELD_NAMES[type] : undefined]
    .filter(Boolean)
    .join(', ')

  const inputSegments = type === 'end' ? props.endSegments : props.segments
  const isFirstEditable = inputSegments?.find((s) => s.part !== 'literal')?.part === part

  const attrs: Record<string, unknown> = {
    id: id,
    'aria-label': `${[name, props.ariaLabel].filter(Boolean).join(', ')}${props.labelledby ? ', ' : ''}`,
    'aria-labelledby': props.labelledby ? `${id} ${props.labelledby}` : undefined,
    'aria-describedby':
      props.describedby && (isFirstEditable || props.invalid) ? props.describedby : undefined,
    'aria-readonly': state?.readonly.value ? 'true' : undefined,
    'aria-invalid': props.invalid ? 'true' : undefined,
    'data-invalid': props.invalid ? 'true' : undefined,
  }

  if (type) attrs.type = type

  const values = state?.segmentValues.value
  const value = values && isNumericPart(part) ? values[part] : undefined
  const isTwoDigitPart = part === 'minute' || part === 'second'
  if (isTwoDigitPart && typeof value === 'number') {
    attrs['aria-valuetext'] = String(value).padStart(2, '0')
  }

  if (part === 'hour' && is12Hour.value && typeof value === 'number') {
    const hour = value % 12 || 12
    attrs['aria-valuenow'] = hour
    attrs['aria-valuetext'] = values?.dayPeriod ? `${hour} ${values.dayPeriod}` : `${hour}`
  }

  return attrs
}
</script>
