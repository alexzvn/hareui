<template>
  <ol data-slot="timeline" :data-orientation="orientation" :class="ui.root()">
    <li
      v-for="entry in entries"
      :key="entry.index"
      data-slot="timeline-item"
      :data-state="entry.state"
      :data-status="entry.status"
      :aria-current="entry.isCurrent ? 'true' : undefined"
      :class="ui.item({ override: [entry.item.ui?.item, entry.item.class] })"
      @click="emit('select', $event, entry.item)"
    >
      <span
        data-slot="timeline-container"
        :class="ui.container({ override: entry.item.ui?.container })"
      >
        <span
          data-slot="timeline-indicator"
          :aria-hidden="slots[entry.names.indicator] ? undefined : 'true'"
          :class="
            ui.indicator({
              status: entry.status,
              hasAvatar: !!entry.item.avatar,
              override: entry.item.ui?.indicator,
            })
          "
        >
          <slot :name="entry.names.indicator" v-bind="entry.slotProps">
            <Avatar
              v-if="entry.item.avatar"
              v-bind="entry.item.avatar"
              :class="ui.avatar({ override: entry.item.avatar.class })"
            />
            <IconRenderer v-else-if="entry.item.icon" :icon="entry.item.icon" />
          </slot>
        </span>

        <span
          v-if="entry.index < items.length - 1"
          data-slot="timeline-separator"
          aria-hidden="true"
          :class="ui.separator({ filled: entry.isFilled, override: entry.item.ui?.separator })"
        />
      </span>

      <div
        v-if="isCentered && hasPart(entry, 'date')"
        data-slot="timeline-date"
        :class="ui.date({ side: entry.side, override: entry.item.ui?.date })"
      >
        <slot :name="entry.names.date" v-bind="entry.slotProps">{{ entry.item.date }}</slot>
      </div>

      <div
        data-slot="timeline-wrapper"
        :class="ui.wrapper({ side: entry.side, override: entry.item.ui?.wrapper })"
      >
        <slot :name="entry.names.wrapper" v-bind="entry.slotProps">
          <div
            v-if="!isCentered && hasPart(entry, 'date')"
            data-slot="timeline-date"
            :class="ui.date({ override: entry.item.ui?.date })"
          >
            <slot :name="entry.names.date" v-bind="entry.slotProps">{{ entry.item.date }}</slot>
          </div>

          <div
            v-if="hasPart(entry, 'title')"
            data-slot="timeline-title"
            :class="ui.title({ override: entry.item.ui?.title })"
          >
            <slot :name="entry.names.title" v-bind="entry.slotProps">{{ entry.item.title }}</slot>
          </div>

          <div
            v-if="hasPart(entry, 'description')"
            data-slot="timeline-description"
            :class="ui.description({ override: entry.item.ui?.description })"
          >
            <slot :name="entry.names.description" v-bind="entry.slotProps">
              {{ entry.item.description }}
            </slot>
          </div>
        </slot>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts" generic="T extends TimelineItem = TimelineItem">
import { computed } from 'vue'

import Avatar from '@/components/avatar/Avatar.vue'
import { useActiveIndex } from '@/composables/useActiveIndex'
import { useComponentUI } from '@/composables/useComponentUI'
import { IconRenderer } from '@/utils/icon'

import theme from './theme'
import type {
  TimelineEmits,
  TimelineItem,
  TimelineItemState,
  TimelineProps,
  TimelineSlotProps,
  TimelineSlots,
  TimelineStatus,
} from './Timeline.types'

type SlotName = 'indicator' | 'wrapper' | 'date' | 'title' | 'description'

type TextPart = 'date' | 'title' | 'description'

type Entry = {
  item: T
  index: number
  state: TimelineItemState | undefined
  status: TimelineStatus
  side: 'start' | 'end'
  isCurrent: boolean
  isFilled: boolean
  names: Record<SlotName, keyof TimelineSlots<T>>
  slotProps: TimelineSlotProps<T>
}

const props = withDefaults(defineProps<TimelineProps<T>>(), {
  orientation: 'vertical',
  axis: 'start',
  placement: 'end',
  color: 'accent',
  valueKey: 'value',
})

const emit = defineEmits<TimelineEmits<T>>()
const slots = defineSlots<TimelineSlots<T>>()

/** The active event: an item value, or an event index when no item has that value. Use `v-model`. */
const modelValue = defineModel<string | number>()

const ui = useComponentUI('timeline', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    axis: props.axis,
    size: props.size,
    density: props.density,
    color: props.color,
  }),
  props,
  classSlot: 'root',
})

const colorStatus = {
  accent: 'current',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
} as const satisfies Record<NonNullable<TimelineProps['color']>, TimelineStatus>

const isCentered = computed(() => props.orientation === 'vertical' && props.axis === 'center')

const { activeIndex } = useActiveIndex({
  items: () => props.items,
  valueKey: () => props.valueKey,
  modelValue: () => modelValue.value,
  defaultValue: props.defaultValue,
  reverse: () => props.reverse,
})

const getItemState = (index: number): TimelineItemState | undefined => {
  const active = activeIndex.value
  if (active === -1) return undefined
  if (index === active) return 'active'

  const isPassed = props.reverse ? index > active : index < active

  return isPassed ? 'completed' : undefined
}

// The connector after an event leads to the next one: filled once that next event is reached.
const isConnectorFilled = (index: number) => {
  const state = getItemState(index)
  if (props.reverse) return state !== undefined

  return state === 'completed'
}

const resolveSide = (item: T, index: number) => {
  if (item.side) return item.side
  if (props.placement !== 'alternate') return props.placement

  return index % 2 === 0 ? 'end' : 'start'
}

const getSlotNames = (item: T) => {
  const prefix = item.slot ? `${item.slot}-` : ''
  const name = (part: SlotName) => `${prefix}${part}` as keyof TimelineSlots<T>

  return {
    indicator: name('indicator'),
    wrapper: name('wrapper'),
    date: name('date'),
    title: name('title'),
    description: name('description'),
  }
}

const createEntry = (item: T, index: number): Entry => {
  const state = getItemState(index)
  const status = item.status ?? (state ? colorStatus[props.color] : 'default')

  return {
    item,
    index,
    state,
    status,
    side: resolveSide(item, index),
    isCurrent: state === 'active' || item.status === 'current',
    isFilled: isConnectorFilled(index),
    names: getSlotNames(item),
    slotProps: { item, index, state },
  }
}

const entries = computed(() => props.items.map((item, index) => createEntry(item, index)))

const hasPart = (entry: Entry, part: TextPart) => !!entry.item[part] || !!slots[entry.names[part]]
</script>
