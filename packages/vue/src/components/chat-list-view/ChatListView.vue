<template>
  <ListView
    data-slot="chat-list-view"
    :data-density="density"
    :items="items"
    :model-value="selection"
    :selectable="selectable"
    :multiple="multiple"
    :selection-behavior="selectionBehavior"
    :variant="variant"
    :virtualize="virtualize"
    :aria-label="ariaLabel"
    :ui="{ base: ui.base(), item: ui.item(), selectionCell: ui.selectionCell() }"
    v-bind="actionListener"
    @update:model-value="onUpdate"
  >
    <template v-for="name in getContentSlotNames()" :key="name" #[name]="scope">
      <slot :name="name" v-bind="toScope(scope)">
        <slot :name="partSlot(scope.item, 'leading')" v-bind="toScope(scope)">
          <IconRenderer
            v-if="resolveIcon(scope.item)"
            :icon="resolveIcon(scope.item)!"
            data-slot="chat-list-view-icon"
            :class="ui.icon()"
          />
        </slot>
        <span data-slot="chat-list-view-text" :class="ui.text()">
          <span data-slot="chat-list-view-title" :class="ui.title()">
            <slot :name="partSlot(scope.item, 'label')" v-bind="toScope(scope)">
              {{ scope.item.label }}
            </slot>
          </span>
          <span
            v-if="
              !isCompact && (scope.item.description || slots[partSlot(scope.item, 'description')])
            "
            data-slot="chat-list-view-preview"
            :class="ui.preview()"
          >
            <slot :name="partSlot(scope.item, 'description')" v-bind="toScope(scope)">
              {{ scope.item.description }}
            </slot>
          </span>
        </span>
        <span
          v-if="!isCompact && (scope.item.meta || slots[partSlot(scope.item, 'meta')])"
          data-slot="chat-list-view-meta"
          :class="ui.meta()"
        >
          <slot :name="partSlot(scope.item, 'meta')" v-bind="toScope(scope)">
            {{ scope.item.meta }}
          </slot>
        </span>
      </slot>
    </template>
    <template v-for="name in getActionSlotNames()" :key="name" #[name]="scope">
      <slot :name="name" v-bind="toScope(scope)" />
    </template>
    <template v-if="slots.empty" #empty>
      <slot name="empty" />
    </template>
  </ListView>
</template>

<script setup lang="ts" generic="T extends ChatListViewItem = ChatListViewItem">
import { computed, getCurrentInstance, ref } from 'vue'

import type { ListViewItemSlotProps } from '@/components/list-view/ListView.types'
import ListView from '@/components/list-view/ListView.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { IconRenderer } from '@/utils/icon'
import { resolveSlotName } from '@/utils/slotName'

import type {
  ChatListViewEmits,
  ChatListViewItem,
  ChatListViewItemSlotProps,
  ChatListViewProps,
  ChatListViewSlots,
} from './ChatListView.types'
import { CommentIcon } from './icons'
import theme from './theme'

const props = withDefaults(defineProps<ChatListViewProps<T>>(), {
  modelValue: undefined,
  defaultValue: undefined,
  selectionBehavior: 'replace',
  density: 'comfortable',
  variant: 'secondary',
  icon: () => CommentIcon,
})

const emit = defineEmits<ChatListViewEmits>()
const slots = defineSlots<ChatListViewSlots<T>>()
const instance = getCurrentInstance()

const ui = useComponentUI('chatListView', {
  theme,
  variantProps: () => ({
    density: props.density,
    multiple: props.multiple,
    variant: props.variant,
  }),
  props,
})

const isCompact = computed(() => props.density === 'compact')

const resolveIcon = (item: T) => (props.icon === false ? item.icon : (item.icon ?? props.icon))

// Kept here rather than in ListView, so pressing the open thread again can keep it open
const uncontrolled = ref(props.defaultValue ?? null)
const selection = computed(() =>
  props.modelValue === undefined ? uncontrolled.value : props.modelValue,
)

const onUpdate = (value: ChatListViewEmits['update:modelValue'][0]) => {
  const isDeselect = !props.multiple && value === null && selection.value !== null

  if (isDeselect) return

  uncontrolled.value = value
  emit('update:modelValue', value)
}

// ListView makes rows actionable only when `action` has a listener, so it is forwarded only when ours has one
const actionListener = computed(() =>
  instance?.vnode.props?.onAction ? { onAction: (value: T['value']) => emit('action', value) } : {},
)

const toScope = (scope: ListViewItemSlotProps<T>): ChatListViewItemSlotProps<T> => ({
  item: scope.item,
  index: scope.index,
  selected: scope.selected,
  disabled: scope.disabled,
  ui: ui.value,
})

type ItemPart = 'leading' | 'label' | 'description' | 'meta'

const partSlot = (item: T, part: ItemPart) => resolveSlotName({ slot: item.slot, suffix: part })

// ListView renders a row's content through `#item`, or `#{slot}` for an item with a `slot` field
const getContentSlotNames = () => {
  const itemSlots = (props.items ?? []).flatMap((item) => (item.slot ? [item.slot] : []))

  return [...new Set(['item', ...itemSlots])]
}

// Only the action slots the caller filled, so rows without one keep no empty action cell
const getActionSlotNames = () => Object.keys(slots).filter((name) => name.endsWith('-action'))
</script>
