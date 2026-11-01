import type { VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Timeline = typeof theme

/**
 * The tone of an event's marker. `current` also marks the event with `aria-current`; `muted` fades the default
 * marker for events that no longer matter.
 */
export type TimelineStatus = 'default' | 'current' | 'success' | 'warning' | 'danger' | 'muted'

/** Progress of an event against the active value (`v-model`): the active event, or one already passed. */
export type TimelineItemState = 'active' | 'completed'

/** An event of the `Timeline`. */
export type TimelineItem = {
  /** Date or time shown above the title; on the opposite side of the rail with `axis="center"`. */
  date?: string
  /** Title of the event. */
  title?: string
  /** Text shown under the title. */
  description?: string
  /** Icon rendered in the marker: a class string or a component. */
  icon?: IconValue
  /** Avatar rendered in the marker, filling it, instead of the icon. */
  avatar?: AvatarProps
  /** The value matched against `v-model` / `defaultValue`, read from `valueKey`. */
  value?: string | number
  /** Marker tone. Overrides the tone the active value gives the event. */
  status?: TimelineStatus
  /** Side of the rail the content takes with `axis="center"`. Overrides `placement`. */
  side?: 'start' | 'end'
  /** Prefix of this event's own slots: `#<slot>-indicator`, `#<slot>-wrapper`, `#<slot>-date`, `#<slot>-title`, `#<slot>-description`. */
  slot?: string
  /** Classes of the event's `li`. */
  class?: ClassValue
  /** Per-slot classes of this event, applied over the `ui` prop. */
  ui?: Pick<
    ComponentSlots<Timeline>,
    'item' | 'container' | 'indicator' | 'separator' | 'wrapper' | 'date' | 'title' | 'description'
  >
  /** Any other data, read by `valueKey` and available in the slots. */
  [key: string]: unknown
}

/** Props of `Timeline`: an ordered list of events, each a marker on a rail with its date, title and description. */
export type TimelineProps<T extends TimelineItem = TimelineItem> = {
  /** The events, in display order. */
  items: T[]
  /**
   * Marker size (22, 28 or 36px) and text size of the events.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Timeline>['size']
  /**
   * Tone of the active and completed markers and of the connectors between completed events.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<Timeline>['color']
  /**
   * Whether the events stack down or run across.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<Timeline>['orientation']
  /**
   * Position of the rail in a vertical timeline: at the start, or centred between the content and the date.
   * @defaultValue 'start'
   */
  axis?: ComponentVariants<Timeline>['axis']
  /**
   * The side of the rail the content takes with `axis="center"`; `alternate` starts at the end and switches every event.
   * @defaultValue 'end'
   */
  placement?: 'start' | 'end' | 'alternate'
  /**
   * Space between events: 12px (`compact`) or 16px (`comfortable`).
   * @defaultValue 'comfortable'
   */
  density?: ComponentVariants<Timeline>['density']
  /**
   * The item key read from each event as its value.
   * @defaultValue 'value'
   */
  valueKey?: string
  /**
   * The active event when `v-model` isn't bound, read once: an item value, or an event index when no item has
   * that value (counted from the last event with `reverse`).
   */
  defaultValue?: string | number
  /** Whether progress runs from the last event to the first: the events after the active one are the completed ones. */
  reverse?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Timeline>
}

/** Props passed to the event slots. */
export type TimelineSlotProps<T extends TimelineItem = TimelineItem> = {
  /** The event being rendered. */
  item: T
  /** Index of the event in `items`. */
  index: number
  /** The event's progress against the active value; `undefined` when nothing is active or it is still ahead. */
  state: TimelineItemState | undefined
}

type TimelineSlot<T extends TimelineItem> = (props: TimelineSlotProps<T>) => VNode[]

/** Slots of `Timeline`. Each one also exists per event as `#<item.slot>-<name>`. */
export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
  /** Content of the marker, replacing the avatar or icon. */
  indicator?: TimelineSlot<T>
  /** The whole content next to the marker, replacing the date, title and description. */
  wrapper?: TimelineSlot<T>
  /** The date, replacing `item.date`. */
  date?: TimelineSlot<T>
  /** The title, replacing `item.title`. */
  title?: TimelineSlot<T>
  /** The description, replacing `item.description`. */
  description?: TimelineSlot<T>
  /** The marker of the events whose `slot` matches the name's prefix. */
  [slot: `${string}-indicator`]: TimelineSlot<T> | undefined
  /** The content of the events whose `slot` matches the name's prefix. */
  [slot: `${string}-wrapper`]: TimelineSlot<T> | undefined
  /** The date of the events whose `slot` matches the name's prefix. */
  [slot: `${string}-date`]: TimelineSlot<T> | undefined
  /** The title of the events whose `slot` matches the name's prefix. */
  [slot: `${string}-title`]: TimelineSlot<T> | undefined
  /** The description of the events whose `slot` matches the name's prefix. */
  [slot: `${string}-description`]: TimelineSlot<T> | undefined
}

/** Events emitted by `Timeline`. */
export type TimelineEmits<T extends TimelineItem = TimelineItem> = {
  /** An event was clicked. */
  select: [event: MouseEvent, item: T]
}
