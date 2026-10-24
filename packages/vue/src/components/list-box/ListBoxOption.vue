<template>
  <component
    :is="component ?? ListboxItem"
    ref="option"
    :value="item.value"
    :disabled="item.disabled"
    :text-value="item.textValue ?? item.label"
    data-slot="list-box-item"
    :aria-selected="selectable ? selected : undefined"
    :aria-disabled="state.disabled ? 'true' : undefined"
    :aria-labelledby="rich && hasLabel ? labelId : undefined"
    :aria-describedby="rich ? descriptionId : undefined"
    :data-selected="selected ? 'true' : undefined"
    :data-selection-mode="selectable ? selectionMode : undefined"
    :data-hovered="hovered ? 'true' : undefined"
    :data-pressed="pressed ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :class="classes.item({ variant: item.variant, class: [ui?.item, item.class] })"
    @select="onSelect"
    @pointerenter="hovered = $event.pointerType === 'mouse'"
    @pointerleave="onPointerleave"
    @pointerdown="pressed = true"
    @pointermove="onPointermove"
    @mousedown="onMousedown"
    @pointerup="pressed = false"
    @pointercancel="pressed = false"
    @focus="onFocus"
    @blur="focused = false"
  >
    <slot name="item" v-bind="state">
      <slot name="item-leading" v-bind="state" />
      <!-- With a description: Label + Description (HeroUI's rich item). Label only: plain text (HeroUI's `<ListBox.Item>Text</ListBox.Item>`). -->
      <div v-if="rich" class="flex flex-col">
        <Label v-if="hasLabel" :id="labelId" :disabled="state.disabled">
          <slot name="item-label" v-bind="state">
            {{ item.label }}
          </slot>
        </Label>
        <Description :id="descriptionId">
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
  </component>
</template>

<script setup lang="ts">
import { injectListboxRootContext, ListboxItem } from 'reka-ui'
// Internal: one ListBox item. Not exported.
import type { Component } from 'vue'
import { computed, inject, onMounted, onUpdated, ref, useId, useTemplateRef } from 'vue'

import Description from '@/components/description/Description.vue'
import Label from '@/components/label/Label.vue'
import { keyboardModalityKey } from '@/composables/useKeyboardModality'
import type { ClassValue } from '@/utils/tv'

import type { ListBoxItem, ListBoxItemSlotProps, ListBoxSlots, ListBoxValue } from './ListBox.types'

const props = defineProps<{
  item: ListBoxItem
  index: number
  selected: boolean
  selectable: boolean
  selectionMode: 'none' | 'single' | 'multiple'
  indicator: boolean
  listDisabled: boolean
  /** Slot class functions of the parent ListBox; `variant` is applied per item. */
  classes: Record<
    'item' | 'indicator',
    (options?: { variant?: string; class?: ClassValue }) => string
  >
  ui?: { item?: ClassValue; indicator?: ClassValue }
  /** The Reka item primitive to render (ComboBox passes `ComboboxItem`). */
  component?: Component
  /**
   * Virtual focus (ComboBox: DOM focus stays in the input). Focus state follows Reka's highlight; `keyboard` tells
   * whether the last interaction was a keyboard one, so the highlight shows as focus-visible (RAC modality).
   */
  virtualFocus?: { keyboard: boolean; value?: ListBoxValue | null }
  /** Mouse hover focuses the option (RAC `shouldFocusOnHover`). */
  focusOnHover?: boolean
}>()

const emit = defineEmits<{
  action: [event: Event]
  select: [event: CustomEvent<{ originalEvent?: Event }>]
}>()

const slots = defineSlots<Omit<ListBoxSlots, 'section-label' | 'empty'>>()

// RAC interaction states that Reka doesn't expose
const hovered = ref(false)
const pressed = ref(false)
const focused = ref(false)

// RAC interaction modality: DOM focus is focus-visible only after keyboard use (Reka focuses options on open and hover)
const keyboardModality = inject(keyboardModalityKey, null)

// The enclosing Reka listbox (its highlight is the keyboard cursor)
const listbox = injectListboxRootContext(null)
const option = useTemplateRef<{ $el: HTMLElement }>('option')

// RAC omits `aria-selected` when nothing can be selected; Reka always renders it (as `false`), and never rewrites an
// unchanged value, so removing it after each render sticks
const dropSelectedState = () => {
  if (!props.selectable) option.value?.$el.removeAttribute?.('aria-selected')
}

onMounted(dropSelectedState)
onUpdated(dropSelectedState)

const onFocus = () => {
  focused.value = true

  // DOM focus is the keyboard cursor (RAC focusedKey): a mouse press or `focus()` must move Reka's highlight too
  const el = option.value?.$el
  if (!props.virtualFocus && listbox && el && listbox.highlightedElement.value !== el)
    listbox.highlightedElement.value = el
}

const onPointerleave = () => {
  hovered.value = false
  pressed.value = false
}

const onPointermove = (event: PointerEvent) => {
  const el = option.value?.$el
  if (
    props.focusOnHover &&
    event.pointerType !== 'touch' &&
    !state.value.disabled &&
    el &&
    document.activeElement !== el
  )
    el.focus({ preventScroll: true })
}

// A disabled option isn't focusable: keep focus on the focused option instead of the list container (RAC)
const onMousedown = (event: MouseEvent) => {
  if (state.value.disabled) event.preventDefault()
}

// With `virtualFocus.value` the owner tracks focus by value (virtualized rows unmount), else by Reka's highlighted element
const highlighted = computed(() =>
  props.virtualFocus && 'value' in props.virtualFocus
    ? props.virtualFocus.value === props.item.value
    : !!listbox && !!option.value && listbox.highlightedElement.value === option.value.$el,
)

const isFocused = computed(() => (props.virtualFocus ? highlighted.value : focused.value))

const isFocusVisible = computed(() =>
  props.virtualFocus
    ? highlighted.value && props.virtualFocus.keyboard
    : focused.value && !!keyboardModality?.value,
)

// RAC useOption: a rich item is named by its label and described by its description
const labelId = useId()
const descriptionId = useId()
const rich = computed(() => !slots.item && !!(props.item.description || slots['item-description']))
const hasLabel = computed(() => !!(props.item.label || slots['item-label']))

const state = computed<ListBoxItemSlotProps>(() => ({
  item: props.item,
  index: props.index,
  selected: props.selected,
  disabled: !!(props.listDisabled || props.item.disabled),
}))

const onSelect = (event: CustomEvent<{ originalEvent?: Event }>) => {
  emit('select', event)
  if (event.defaultPrevented) return

  if (!props.selectable) {
    event.preventDefault()
    emit('action', event)
  }
}
</script>
