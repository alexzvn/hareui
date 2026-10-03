<script setup lang="ts">
// Internal: one ListBox item. Not exported.
import type { Component } from 'vue'
import type { ListBoxItem, ListBoxItemSlotProps, ListBoxSlots, ListBoxValue } from './ListBox.vue'
import { injectListboxRootContext, ListboxItem } from 'reka-ui'
import { computed, ref, useTemplateRef } from 'vue'
import Description from '../description/Description.vue'
import Label from '../label/Label.vue'

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
  /** The Reka item primitive to render (ComboBox passes `ComboboxItem`). */
  component?: Component
  /**
   * Virtual focus (ComboBox: DOM focus stays in the input). Focus state follows Reka's highlight; `keyboard` tells
   * whether the last interaction was a keyboard one, so the highlight shows as focus-visible (RAC modality).
   */
  virtualFocus?: { keyboard: boolean, value?: ListBoxValue | null }
  /** Mouse hover focuses the option (RAC `shouldFocusOnHover`). */
  focusOnHover?: boolean
}>()
const emit = defineEmits<{ action: [event: Event], select: [event: CustomEvent<{ originalEvent?: Event }>] }>()
const slots = defineSlots<Omit<ListBoxSlots, 'section-label' | 'empty'>>()

// RAC interaction states that Reka doesn't expose
const hovered = ref(false)
const pressed = ref(false)
const focused = ref(false)
const focusVisible = ref(false)

// The enclosing Reka listbox (its highlight is the keyboard cursor)
const listbox = injectListboxRootContext(null)
const option = useTemplateRef<{ $el: HTMLElement }>('option')

function onFocus(event: FocusEvent) {
  focused.value = true
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
  // DOM focus is the keyboard cursor (RAC focusedKey): a mouse press or `focus()` must move Reka's highlight too
  const el = option.value?.$el
  if (!props.virtualFocus && listbox && el && listbox.highlightedElement.value !== el)
    listbox.highlightedElement.value = el
}

function onPointermove(event: PointerEvent) {
  const el = option.value?.$el
  if (props.focusOnHover && event.pointerType !== 'touch' && !state.value.disabled && el && document.activeElement !== el)
    el.focus({ preventScroll: true })
}

// A disabled option isn't focusable: keep focus on the focused option instead of the list container (RAC)
function onMousedown(event: MouseEvent) {
  if (state.value.disabled)
    event.preventDefault()
}
// With `virtualFocus.value` the owner tracks focus by value (virtualized rows unmount), else by Reka's highlighted element
const highlighted = computed(() => props.virtualFocus && 'value' in props.virtualFocus
  ? props.virtualFocus.value === props.item.value
  : !!listbox && !!option.value && listbox.highlightedElement.value === option.value.$el)
const isFocused = computed(() => props.virtualFocus ? highlighted.value : focused.value)
const isFocusVisible = computed(() => props.virtualFocus ? highlighted.value && props.virtualFocus.keyboard : focusVisible.value)

const state = computed<ListBoxItemSlotProps>(() => ({
  item: props.item,
  index: props.index,
  selected: props.selected,
  disabled: !!(props.listDisabled || props.item.disabled),
}))

function onSelect(event: CustomEvent<{ originalEvent?: Event }>) {
  emit('select', event)
  if (event.defaultPrevented)
    return
  if (!props.selectable) {
    event.preventDefault()
    emit('action', event)
  }
}
</script>

<template>
  <component
    :is="component ?? ListboxItem"
    ref="option"
    :value="item.value"
    :disabled="item.disabled"
    :text-value="item.textValue ?? item.label"
    data-slot="list-box-item"
    :aria-selected="selectable ? selected : undefined"
    :data-selected="selected ? 'true' : undefined"
    :data-selection-mode="selectable ? selectionMode : undefined"
    :data-hovered="hovered ? 'true' : undefined"
    :data-pressed="pressed ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :class="classes.item({ variant: item.variant, class: [ui?.item, item.class] })"
    @select="onSelect"
    @pointerenter="hovered = $event.pointerType === 'mouse'"
    @pointerleave="hovered = false; pressed = false"
    @pointerdown="pressed = true"
    @pointermove="onPointermove"
    @mousedown="onMousedown"
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
  </component>
</template>
