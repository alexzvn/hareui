<template>
  <div
    :id="rowId"
    data-slot="tag"
    role="row"
    :aria-label="item.label"
    :tabindex="disabled ? undefined : tabindex"
    :aria-selected="selectionMode !== 'none' ? (selected ? 'true' : 'false') : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-selected="selected ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :class="classes.base()"
    @click="onClick"
    @pointerdown="onPointerdown"
    @mousedown="onMousedown"
    @pointerup="isPressed = false"
    @pointercancel="isPressed = false"
    @focus="onFocus"
    @blur="isFocusVisible = false"
  >
    <div role="gridcell" style="display: contents">
      <slot :item="item" :index="index" :selected="selected" :disabled="disabled">
        {{ item.label }}
      </slot>
      <CloseButton
        v-if="removable"
        :id="removeButtonId"
        data-slot="tag-remove-button"
        :aria-label="t('tagGroup.remove')"
        :aria-labelledby="`${removeButtonId} ${rowId}`"
        :disabled="disabled"
        :class="classes.removeButton()"
        @click="onRemoveClick"
      >
        <template v-if="$slots.removeButton" #default>
          <slot name="removeButton" :item="item" :index="index" />
        </template>
      </CloseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Internal: one TagGroup tag. Not exported. Roving tabindex, selection toggling and Enter/Space,
// Delete/Backspace and arrow-key navigation are all driven by the parent `TagGroup` (it owns the
// collection and needs to skip disabled tags), so this component only renders and tracks hover-ish
// visual state; it never attaches its own keydown handler. Presses are reported with their event so the
// parent can tell Shift+press (range) from a toggle.
import { ref, useId } from 'vue'

import CloseButton from '@/components/close-button/CloseButton.vue'
import { useLocale } from '@/composables/useLocale'
import type { ComponentUI } from '@/types/tv'

import type { TagGroupItem, TagGroupSlots } from './TagGroup.types'
import type tagTheme from './tagTheme'

const { t } = useLocale()

const props = defineProps<{
  item: TagGroupItem
  index: number
  selected: boolean
  disabled: boolean
  tabindex: 0 | -1
  selectionMode: 'none' | 'single' | 'multiple'
  removable: boolean
  /** Slot class functions of the parent TagGroup's `tag` theme; size/variant and its `ui` are already baked in. */
  classes: ComponentUI<typeof tagTheme>
}>()

const emit = defineEmits<{ press: [event: MouseEvent | PointerEvent]; remove: [] }>()
defineSlots<{ default?: TagGroupSlots['item']; removeButton?: TagGroupSlots['removeButton'] }>()

// RAC render-prop states the CSS actually styles (`:active`/`data-pressed`, `:focus-visible`/`data-focus-visible`).
const isPressed = ref(false)
const isFocusVisible = ref(false)

// RAC useTag: the row is named by its text, and each remove button by "Remove tag" plus that row, so the
// buttons are distinguishable ("Remove tag News") instead of all sharing one name
const rowId = useId()
const removeButtonId = `${rowId}-remove`

const onFocus = (event: FocusEvent) => {
  isFocusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}

// RAC selects on press *start* for mouse (on release for touch/pen), so a held mouse button already
// shows the selected state. `isSelectedOnDown` swallows the click that follows that same press.
let isSelectedOnDown = false

const onPointerdown = (event: PointerEvent) => {
  isSelectedOnDown = false
  if (props.disabled) return
  isPressed.value = true

  const fromRemoveButton =
    event.target instanceof Element && event.target.closest('[data-slot=tag-remove-button]')

  if (fromRemoveButton || event.pointerType !== 'mouse' || event.button !== 0) return
  isSelectedOnDown = true
  emit('press', event)
}

// A disabled tag isn't focusable: keep focus where it is instead of letting the press blur it to `body` (RAC)
const onMousedown = (event: MouseEvent) => {
  if (props.disabled) event.preventDefault()
}

const onClick = (event: MouseEvent) => {
  if (isSelectedOnDown) {
    isSelectedOnDown = false
    return
  }

  if (props.disabled) return
  emit('press', event)
}

const onRemoveClick = (event: MouseEvent) => {
  event.stopPropagation()
  emit('remove')
}
</script>
