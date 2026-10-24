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

<script lang="ts">
import type { Component } from 'vue'

import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type DateInputGroup = typeof theme

export interface DateInputGroupSegment {
  part: string
  value: string
}

/**
 * reka-limitation (`shared/date/utils.ts` `getOptsByGranularity`): every granularity except
 * `'day'` always requests `timeZoneName: 'short'` from `Intl.DateTimeFormat`, even for a plain
 * (non-zoned) value. `shared/date/parser.ts` `createContentArr` drops the resulting
 * `timeZoneName` segment when there's no zone to show, but not the literal separator space
 * `Intl` inserts right before it, leaving a dangling whitespace-only segment trailing. Unlike the
 * bidi-isolation mark gap above, this one is NOT zero-width (it renders as a real space), so it's
 * stripped here before the segments reach `DateInputGroup`.
 */
export function dropDanglingTimeZoneSeparator(segments: DateInputGroupSegment[]) {
  const last = segments.at(-1)
  return last && last.part === 'literal' && last.value.trim() === ''
    ? segments.slice(0, -1)
    : segments
}

/**
 * React Aria's `useDateFieldState` (`processSegments`) wraps the `hour`/`minute`/`second` run of a time
 * field in U+2066/U+2069 (LRI/PDI) bidi-isolation literal segments, to force LTR rendering of the time in
 * RTL locales. Reka's `shared/date/parser.ts` doesn't add these, so they're inserted here to keep the
 * segment list (and therefore the `gap-px`-driven group width) identical to HeroUI's React output.
 */
export function wrapBidiIsolate(segments: DateInputGroupSegment[]) {
  const open = segments.findIndex((s) => s.part === 'hour')
  if (open === -1) return segments
  let close = open
  for (let i = segments.length - 1; i > open; i--) {
    if (isTimeUnitPart(segments[i].part)) {
      close = i
      break
    }
  }
  const result = segments.slice()
  result.splice(close + 1, 0, { part: 'literal', value: '\u2069' })
  result.splice(open, 0, { part: 'literal', value: '\u2066' })
  return result
}
function isTimeUnitPart(part: string) {
  return part === 'hour' || part === 'minute' || part === 'second'
}

/**
 * Internal part shared by `DateField` and `TimeField` (and later `DatePicker` / `DateRangePicker`).
 * Not exported from the package: HeroUI's docs don't show `DateInputGroup` standalone.
 */
export interface DateInputGroupProps {
  /** Segment contents from the parent `DateFieldRoot` / `TimeFieldRoot` default slot. */
  segments: DateInputGroupSegment[]
  /** `DateFieldInput` or `TimeFieldInput` from `reka-ui`, matching whichever root this is rendered inside. */
  segmentInput: Component
  /**
   * Range mode (`DateRangePicker`): the end input's segments. When set, `segments` are the start input's, each
   * segment gets Reka's `type="start"|"end"`, and the `#separator` slot renders between the two inputs.
   */
  endSegments?: DateInputGroupSegment[]
  /**
   * Wraps the input(s) in a horizontally scrollable `date-input-group-input-container`
   * (HeroUI's `DateField.InputContainer`), for long ranges that overflow the group.
   * @defaultValue false
   */
  inputContainer?: boolean
  /**
   * Visual variant of the group.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the group takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /** Whether the group is disabled. */
  disabled?: boolean
  /** Whether the group is invalid. */
  invalid?: boolean
  /**
   * The field's `aria-label` (fields without a visible label). Names the group and is appended to every segment's
   * own name, as React Aria does.
   */
  ariaLabel?: string
  /**
   * Id(s) of the field's label. Names the group, and is appended to every segment's own name, as React Aria does
   * (VoiceOver on iOS doesn't announce groups).
   */
  labelledby?: string
  /**
   * Id(s) of the field's description/error. Describes the first segment of each input, or every segment while
   * invalid, as React Aria does (so it isn't re-read on every segment).
   */
  describedby?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DateInputGroup>
}

export interface DateInputGroupSlots {
  /** Prefix content, rendered before the segments. */
  prefix?: () => any
  /** Suffix content, rendered after the segments. */
  suffix?: () => any
  /** Range mode only: rendered between the start and end inputs. */
  separator?: () => any
}
</script>

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

// Renders its children without a wrapper element (used when `inputContainer` is off)
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.()

const props = defineProps<DateInputGroupProps>()
defineSlots<DateInputGroupSlots>()

const ui = useComponentUI('dateInputGroup', theme, () => ({
  variant: props.variant,
  fullWidth: props.fullWidth,
}))

// The Reka root this group renders inside (whichever one `segmentInput` belongs to); the keyboard handling
// and ARIA fixes below read and write its segment state the same way Reka's own segment handlers do.
type SegmentValues = Record<string, any>
interface SegmentState {
  placeholder: Ref<DateValue>
  modelValue: Ref<DateValue | undefined>
  segmentValues: Ref<SegmentValues>
  step: Ref<Record<string, number | undefined>>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  locale: Ref<string>
}
const rangeContext = injectDateRangeFieldRootContext(null as any)
const timeContext = injectTimeFieldRootContext(null as any)
const dateContext = injectDateFieldRootContext(null as any)
function segmentState(type?: string | null): SegmentState | undefined {
  if (props.endSegments) {
    if (!rangeContext) return undefined
    const end = type === 'end'
    return {
      ...rangeContext,
      modelValue: end ? rangeContext.endValue : rangeContext.startValue,
      segmentValues: end ? rangeContext.segmentValues.end : rangeContext.segmentValues.start,
    } as any
  }
  return (timeContext ?? dateContext ?? undefined) as any
}

// React Aria's `useDateSegment` PAGE_STEP (PageUp/PageDown)
const PAGE_STEP: Record<string, number> = {
  year: 5,
  month: 2,
  day: 7,
  hour: 2,
  minute: 15,
  second: 15,
}

// Reka keeps a `dayPeriod` segment value even for 24-hour fields; the rendered segments tell which cycle is shown
const is12Hour = computed(() => props.segments.some((s) => s.part === 'dayPeriod'))

function segmentBounds(
  part: string,
  values: SegmentValues,
  placeholder: DateValue,
): [number, number] | undefined {
  switch (part) {
    case 'year':
      return [1, 9999]
    case 'month':
      return [
        1,
        placeholder.calendar.getMonthsInYear(
          values.year ? placeholder.set({ year: values.year }) : placeholder,
        ),
      ]
    case 'day': {
      const fields: Record<string, number> = {}
      if (values.year) fields.year = values.year
      if (values.month) fields.month = values.month
      const date = placeholder.set({ ...fields, day: 1 })
      return [1, date.calendar.getDaysInMonth(date)]
    }
    case 'hour': {
      // 12-hour fields keep the hour within the current AM/PM period, as React Aria does
      if (!is12Hour.value) return [0, 23]
      const hour = values.hour ?? (placeholder as any).hour ?? 0
      const pm = values.dayPeriod ? values.dayPeriod === 'PM' : hour >= 12
      return pm ? [12, 23] : [0, 11]
    }
    case 'minute':
    case 'second':
      return [0, 59]
  }
  return undefined
}

/**
 * Keys React Aria's `useDateSegment` handles that Reka's segments don't: Home/End (segment min/max) and
 * PageUp/PageDown (PAGE_STEP), plus ArrowUp/ArrowDown on a 12-hour hour segment, which React Aria cycles within
 * the current period (11 AM -> 12 AM) where Reka crosses into the other one. Runs in the capture phase so the
 * handled keys never reach Reka's own segment handler; every other key is left to Reka.
 */
function onSegmentKeydown(event: KeyboardEvent) {
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
  const key = event.key
  const patch: SegmentValues = {}
  if (part === 'dayPeriod') {
    const isPM = values.dayPeriod === 'PM'
    const toPM =
      key === 'Home'
        ? false
        : key === 'End'
          ? true
          : key === 'PageUp' || key === 'PageDown'
            ? !isPM
            : undefined
    if (toPM === undefined) return
    patch.dayPeriod = toPM ? 'PM' : 'AM'
    if (values.hour != null && toPM !== isPM) patch.hour = values.hour + (toPM ? 12 : -12)
  } else {
    const bounds = segmentBounds(part, values, state.placeholder.value)
    if (!bounds) return
    const [min, max] = bounds
    const prev: number | null = values[part]
    const arrow = key === 'ArrowUp' || key === 'ArrowDown'
    if (key === 'Home') patch[part] = min
    else if (key === 'End') patch[part] = max
    else if (
      key === 'PageUp' ||
      key === 'PageDown' ||
      (arrow && part === 'hour' && is12Hour.value && prev !== null)
    ) {
      if (prev === null) {
        patch[part] = (state.placeholder.value as any)[part]
      } else {
        const amount =
          (arrow ? (state.step.value[part] ?? 1) : PAGE_STEP[part]!) *
          (key === 'ArrowUp' || key === 'PageUp' ? 1 : -1)
        const size = max - min + 1
        patch[part] = min + ((((prev - min + amount) % size) + size) % size)
      }
    } else {
      return
    }
  }
  event.preventDefault()
  event.stopPropagation()
  Object.assign(values, patch)
  // Same commit rule as Reka's segment handler: a complete set of segments becomes the value
  if (Object.values(values).every((value) => value !== null))
    state.modelValue.value = state.placeholder.value.set({ ...values }).copy()
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
function segmentAttrs(part: string, type?: 'start' | 'end') {
  const state = segmentState(type)
  const id = `${segmentIdBase}-${type ?? 'field'}-${part}`
  const name = [displayNames.value.of(part), type ? RANGE_FIELD_NAMES[type] : undefined]
    .filter(Boolean)
    .join(', ')
  const firstEditable =
    (type === 'end' ? props.endSegments : props.segments)?.find((s) => s.part !== 'literal')
      ?.part === part
  const attrs: Record<string, unknown> = {
    id: id,
    'aria-label': `${[name, props.ariaLabel].filter(Boolean).join(', ')}${props.labelledby ? ', ' : ''}`,
    'aria-labelledby': props.labelledby ? `${id} ${props.labelledby}` : undefined,
    'aria-describedby':
      props.describedby && (firstEditable || props.invalid) ? props.describedby : undefined,
    'aria-readonly': state?.readonly.value ? 'true' : undefined,
    'aria-invalid': props.invalid ? 'true' : undefined,
    'data-invalid': props.invalid ? 'true' : undefined,
  }
  if (type) attrs.type = type
  const values = state?.segmentValues.value
  const value = values?.[part]
  if ((part === 'minute' || part === 'second') && typeof value === 'number')
    attrs['aria-valuetext'] = String(value).padStart(2, '0')
  if (part === 'hour' && is12Hour.value && typeof value === 'number') {
    const hour = value % 12 || 12
    attrs['aria-valuenow'] = hour
    attrs['aria-valuetext'] = values?.dayPeriod ? `${hour} ${values.dayPeriod}` : `${hour}`
  }
  return attrs
}
</script>
