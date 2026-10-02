<script setup lang="ts">
// Internal: one ListBox item. Not exported.
import type { ListBoxItem, ListBoxItemSlotProps, ListBoxSlots } from './ListBox.vue'
import { ListboxItem } from 'reka-ui'
import { computed, ref } from 'vue'
import Description from './Description.vue'
import Label from './Label.vue'

const props = defineProps<{
  item: ListBoxItem
  index: number
  selected: boolean
  selectable: boolean
  selectionMode: 'none' | 'single' | 'multiple'
  indicator: boolean
  listDisabled: boolean
  /** Slot class functions of the parent ListBox; `variant` is applied per item. */
  classes: Record<'item' | 'indicator', (options?: { variant?: string, class?: any }) => string>
  ui?: { item?: any, indicator?: any }
}>()
const emit = defineEmits<{ action: [event: Event] }>()
const slots = defineSlots<Omit<ListBoxSlots, 'section-label' | 'empty'>>()

// RAC interaction states that Reka doesn't expose
const hovered = ref(false)
const pressed = ref(false)
const focused = ref(false)
const focusVisible = ref(false)

function onFocus(event: FocusEvent) {
  focused.value = true
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}

const state = computed<ListBoxItemSlotProps>(() => ({
  item: props.item,
  index: props.index,
  selected: props.selected,
  disabled: !!(props.listDisabled || props.item.disabled),
}))

function onSelect(event: Event) {
  if (!props.selectable) {
    event.preventDefault()
    emit('action', event)
  }
}
</script>

<template>
  <ListboxItem
    :value="item.value"
    :disabled="item.disabled"
    :text-value="item.textValue ?? item.label"
    data-slot="list-box-item"
    :aria-selected="selectable ? selected : undefined"
    :data-selected="selected ? 'true' : undefined"
    :data-selection-mode="selectable ? selectionMode : undefined"
    :data-hovered="hovered ? 'true' : undefined"
    :data-pressed="pressed ? 'true' : undefined"
    :data-focused="focused ? 'true' : undefined"
    :data-focus-visible="focusVisible ? 'true' : undefined"
    :class="classes.item({ variant: item.variant, class: [ui?.item, item.class] })"
    @select="onSelect"
    @pointerenter="hovered = $event.pointerType === 'mouse'"
    @pointerleave="hovered = false; pressed = false"
    @pointerdown="pressed = true"
    @pointerup="pressed = false"
    @pointercancel="pressed = false"
    @focus="onFocus"
    @blur="focused = false; focusVisible = false"
  >
    <slot name="item" v-bind="state">
      <slot name="item-leading" v-bind="state" />
      <!-- With a description: Label + Description (HeroUI's rich item). Label only: plain text (HeroUI's `<ListBox.Item>Text</ListBox.Item>`). -->
      <div v-if="item.description || slots['item-description']" class="flex flex-col">
        <Label v-if="item.label || slots['item-label']" :disabled="state.disabled">
          <slot name="item-label" v-bind="state">
            {{ item.label }}
          </slot>
        </Label>
        <Description>
          <slot name="item-description" v-bind="state">
            {{ item.description }}
          </slot>
        </Description>
      </div>
      <slot v-else name="item-label" v-bind="state">
        {{ item.label }}
      </slot>
      <slot name="item-trailing" v-bind="state" />
      <span
        v-if="indicator && selectable"
        aria-hidden="true"
        data-slot="list-box-item-indicator"
        :data-visible="selected || undefined"
        :class="classes.indicator({ variant: item.variant, class: ui?.indicator })"
      >
        <slot name="indicator" v-bind="state">
          <svg
            aria-hidden="true"
            data-slot="list-box-item-indicator--checkmark"
            fill="none"
            role="presentation"
            stroke="currentColor"
            stroke-dasharray="22"
            :stroke-dashoffset="selected ? 44 : 66"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 17 18"
          >
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </slot>
      </span>
    </slot>
  </ListboxItem>
</template>
