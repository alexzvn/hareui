<script lang="ts">
import type { Component } from 'vue'
import type { ComponentSlots } from '../../types/tv'
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
  return last && last.part === 'literal' && last.value.trim() === '' ? segments.slice(0, -1) : segments
}

/**
 * React Aria's `useDateFieldState` (`processSegments`) wraps the `hour`/`minute`/`second` run of a time
 * field in U+2066/U+2069 (LRI/PDI) bidi-isolation literal segments, to force LTR rendering of the time in
 * RTL locales. Reka's `shared/date/parser.ts` doesn't add these, so they're inserted here to keep the
 * segment list (and therefore the `gap-px`-driven group width) identical to HeroUI's React output.
 */
export function wrapBidiIsolate(segments: DateInputGroupSegment[]) {
  const open = segments.findIndex(s => s.part === 'hour')
  if (open === -1)
    return segments
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
import type { FunctionalComponent } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'

// Renders its children without a wrapper element (used when `inputContainer` is off)
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.()

const props = defineProps<DateInputGroupProps>()
defineSlots<DateInputGroupSlots>()

const ui = useComponentUI('dateInputGroup', theme, () => ({ variant: props.variant, fullWidth: props.fullWidth }))
</script>

<template>
  <div
    role="group"
    data-slot="date-input-group"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <div v-if="$slots.prefix" data-slot="date-input-group-prefix" :class="ui.prefix({ class: props.ui?.prefix })">
      <slot name="prefix" />
    </div>
    <component :is="inputContainer ? 'div' : Passthrough" v-bind="inputContainer ? { 'data-slot': 'date-input-group-input-container', 'class': ui.inputContainer({ class: props.ui?.inputContainer }) } : {}">
      <div data-slot="date-input-group-input" :slot="endSegments ? 'start' : undefined" :class="ui.input({ class: props.ui?.input })">
        <component
          :is="segmentInput"
          v-for="item in segments"
          :key="item.part"
          :part="item.part"
          v-bind="endSegments ? { type: 'start' } : {}"
          data-slot="date-input-group-segment"
          :class="ui.segment({ class: props.ui?.segment })"
        >
          {{ item.value }}
        </component>
      </div>
      <template v-if="endSegments">
        <slot name="separator" />
        <div data-slot="date-input-group-input" slot="end" :class="ui.input({ class: props.ui?.input })">
          <component
            :is="segmentInput"
            v-for="item in endSegments"
            :key="item.part"
            :part="item.part"
            type="end"
            data-slot="date-input-group-segment"
            :class="ui.segment({ class: props.ui?.segment })"
          >
            {{ item.value }}
          </component>
        </div>
      </template>
    </component>
    <div v-if="$slots.suffix" data-slot="date-input-group-suffix" :class="ui.suffix({ class: props.ui?.suffix })">
      <slot name="suffix" />
    </div>
  </div>
</template>
