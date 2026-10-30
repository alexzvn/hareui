import type { Component, VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DateInputGroup = typeof theme

export type DateInputGroupSegment = {
  part: string
  value: string
}

/**
 * Internal part shared by `DateField` and `TimeField` (and later `DatePicker` / `DateRangePicker`).
 * Not exported from the package.
 */
export type DateInputGroupProps = {
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
   * Wraps the input(s) in a horizontally scrollable `date-input-group-input-container` for long ranges that overflow the group.
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
   * own name.
   */
  ariaLabel?: string
  /**
   * Id(s) of the field's label. Names the group, and is appended to every segment's own name
   * (VoiceOver on iOS doesn't announce groups).
   */
  labelledby?: string
  /**
   * Id(s) of the field's description/error. Describes the first segment of each input, or every segment while
   * invalid (so it isn't re-read on every segment).
   */
  describedby?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DateInputGroup>
}

export type DateInputGroupSlots = {
  /** Prefix content, rendered before the segments. */
  prefix?: () => VNode[]
  /** Suffix content, rendered after the segments. */
  suffix?: () => VNode[]
  /** Range mode only: rendered between the start and end inputs. */
  separator?: () => VNode[]
}
