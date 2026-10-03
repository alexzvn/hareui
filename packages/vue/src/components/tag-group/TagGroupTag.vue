<script setup lang="ts">
// Internal: one TagGroup tag. Not exported. Roving tabindex, selection toggling and Enter/Space,
// Delete/Backspace and arrow-key navigation are all driven by the parent `TagGroup` (it owns the
// collection and needs to skip disabled tags), so this component only renders and tracks hover-ish
// visual state; it never attaches its own keydown handler. Presses are reported with their event so the
// parent can tell Shift+press (range) from a toggle.
import type { ComponentUI } from '../../types/tv'
import type tagTheme from './tagTheme'
import type { TagGroupItem, TagGroupSlots } from './TagGroup.vue'
import { ref } from 'vue'
import CloseButton from '../close-button/CloseButton.vue'

const props = defineProps<{
  item: TagGroupItem
  index: number
  selected: boolean
  disabled: boolean
  tabindex: 0 | -1
  selectionMode: 'none' | 'single' | 'multiple'
  removable: boolean
  /** Slot class functions of the parent TagGroup's `tag` theme; size/variant are already baked in. */
  classes: ComponentUI<typeof tagTheme>
  ui?: { tag?: any, removeButton?: any }
}>()
const emit = defineEmits<{ press: [event: MouseEvent | PointerEvent], remove: [] }>()
defineSlots<{ default?: TagGroupSlots['item'], removeButton?: TagGroupSlots['removeButton'] }>()

// RAC render-prop states the CSS actually styles (`:active`/`data-pressed`, `:focus-visible`/`data-focus-visible`).
const pressed = ref(false)
const focusVisible = ref(false)

function onFocus(event: FocusEvent) {
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}

// RAC selects on press *start* for mouse (on release for touch/pen), so a held mouse button already
// shows the selected state. `selectedOnDown` swallows the click that follows that same press.
let selectedOnDown = false

function onPointerdown(event: PointerEvent) {
  selectedOnDown = false
  if (props.disabled)
    return
  pressed.value = true
  const fromRemoveButton = event.target instanceof Element && event.target.closest('[data-slot=tag-remove-button]')
  if (fromRemoveButton || event.pointerType !== 'mouse' || event.button !== 0)
    return
  selectedOnDown = true
  emit('press', event)
}

// A disabled tag isn't focusable: keep focus where it is instead of letting the press blur it to `body` (RAC)
function onMousedown(event: MouseEvent) {
  if (props.disabled)
    event.preventDefault()
}

function onClick(event: MouseEvent) {
  if (selectedOnDown) {
    selectedOnDown = false
    return
  }
  if (props.disabled)
    return
  emit('press', event)
}

function onRemoveClick(event: MouseEvent) {
  event.stopPropagation()
  emit('remove')
}
</script>

<template>
  <div
    data-slot="tag"
    role="row"
    :tabindex="disabled ? undefined : tabindex"
    :aria-selected="selectionMode !== 'none' ? (selected ? 'true' : 'false') : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-selected="selected ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-pressed="pressed ? 'true' : undefined"
    :data-focus-visible="focusVisible ? 'true' : undefined"
    :class="classes.base({ class: ui?.tag })"
    @click="onClick"
    @pointerdown="onPointerdown"
    @mousedown="onMousedown"
    @pointerup="pressed = false"
    @pointercancel="pressed = false"
    @focus="onFocus"
    @blur="focusVisible = false"
  >
    <div role="gridcell" style="display: contents">
      <slot :item="item" :index="index" :selected="selected" :disabled="disabled">
        {{ item.label }}
      </slot>
      <CloseButton
        v-if="removable"
        data-slot="tag-remove-button"
        aria-label="Remove tag"
        :disabled="disabled"
        :class="classes.removeButton({ class: ui?.removeButton })"
        @click="onRemoveClick"
      >
        <template v-if="$slots.removeButton" #default>
          <slot name="removeButton" :item="item" :index="index" />
        </template>
      </CloseButton>
    </div>
  </div>
</template>
