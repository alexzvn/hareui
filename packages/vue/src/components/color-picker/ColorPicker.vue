<template>
  <PopoverRoot
    :open="open"
    :default-open="defaultOpen"
    :modal="false"
    v-slot="{ open: isOpen, close }"
    @update:open="onUpdateOpen"
  >
    <div data-slot="color-picker" :class="ui.base({ class: [props.ui?.base, props.class] })">
      <PopoverTrigger
        ref="triggerRef"
        data-slot="color-picker-trigger"
        :disabled="disabled"
        :data-disabled="disabled ? 'true' : undefined"
        :class="ui.trigger({ class: props.ui?.trigger })"
      >
        <slot name="trigger" :color="color" :open="isOpen" />
      </PopoverTrigger>
    </div>
    <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <PopoverContent
        ref="contentRef"
        data-slot="color-picker-popover"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
        @open-auto-focus="focusContent"
        @close-auto-focus="onCloseAutoFocus"
        @interact-outside="onInteractOutside"
        :class="ui.popover({ class: props.ui?.popover })"
      >
        <slot :color="color" :close="close" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import type { Color } from 'reka-ui'
import { normalizeColor, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'

import { outsideEventTarget, preventNestedLayerDismiss } from '@/composables/nestedLayer'
import { useComponentUI } from '@/composables/useComponentUI'
import { usePortal } from '@/composables/usePortal'

import type { ColorPickerEmits, ColorPickerProps, ColorPickerSlots } from './ColorPicker.types'
import { ColorPickerContextKey } from './context'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply.
const props = withDefaults(defineProps<ColorPickerProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
  portal: undefined,
})

const portalTarget = usePortal(() => props.portal)
const emit = defineEmits<ColorPickerEmits>()
defineSlots<ColorPickerSlots>()

const ui = useComponentUI('colorPicker', theme, () => ({}))

// RAC's ColorPicker defaults to black when neither value nor defaultValue is given.
const internal = ref<Color>(normalizeColor(props.defaultValue ?? '#000000'))

const color = computed<Color>(() =>
  props.modelValue === undefined ? internal.value : normalizeColor(props.modelValue),
)

const setColor = (value: Color | string) => {
  const next = normalizeColor(value)
  internal.value = next
  emit('update:modelValue', next)
}

provide(ColorPickerContextKey, { color, setColor })

// RAC focuses the popover itself on open (not the first tabbable child like Reka), so Tab starts at the first control.
const focusContent = (event: Event) => {
  event.preventDefault()

  const wrapper = event.target as HTMLElement | null
  const popover = wrapper?.querySelector<HTMLElement>('[data-slot=color-picker-popover]')

  // The event targets Reka's positioning wrapper; the popover is its child. It can't take focus until positioned.
  requestAnimationFrame(() => popover?.focus({ preventScroll: true }))
}

// Reka's non-modal popover leaves focus where an outside interaction put it (the clicked control or `body`). RAC's
// popover is modal: its underlay swallows the outside click and focus always returns to the trigger. The trigger is
// refocused after the close, again once a pending outside click has finished moving focus, and on unmount.
const triggerRef = ref<{ $el?: unknown } | null>(null)
const contentRef = ref<{ $el: HTMLElement } | null>(null)

let isClosedByOutside = false
let isOpenNow = props.open ?? props.defaultOpen ?? false

watch(
  () => props.open,
  (value) => {
    if (value !== undefined) isOpenNow = value
  },
)

const focusTrigger = () => {
  const trigger = triggerRef.value?.$el
  if (trigger instanceof HTMLElement && !isOpenNow) trigger.focus({ preventScroll: true })
}

const onOutsideClick = () => {
  document.removeEventListener('click', onOutsideClick, true)
  focusTrigger()
}

const isInsideTrigger = (target: unknown) => {
  const trigger = triggerRef.value?.$el

  return trigger instanceof Node && target instanceof Node && trigger.contains(target)
}

const onInteractOutside = (event: CustomEvent<{ originalEvent: Event }>) => {
  preventNestedLayerDismiss(event, contentRef.value?.$el)
  if (event.defaultPrevented || isInsideTrigger(outsideEventTarget(event))) return

  isClosedByOutside = true

  // A mouse press closes the popover on pointerdown; the browser then moves focus on mousedown
  const isMousePress = event.detail.originalEvent.type === 'pointerdown'
  if (isMousePress) document.addEventListener('click', onOutsideClick, true)
}

const onUpdateOpen = (value: boolean) => {
  isOpenNow = value
  emit('update:open', value)

  if (value) {
    isClosedByOutside = false
    document.removeEventListener('click', onOutsideClick, true)

    return
  }

  if (isClosedByOutside) nextTick(focusTrigger)
}

const onCloseAutoFocus = (event: Event) => {
  document.removeEventListener('click', onOutsideClick, true)
  isClosedByOutside = false

  if (!(triggerRef.value?.$el instanceof HTMLElement)) return

  event.preventDefault()
  focusTrigger()
}

onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick, true))
</script>
