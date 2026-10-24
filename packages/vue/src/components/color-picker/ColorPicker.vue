<script lang="ts">
import type { Color } from 'reka-ui'

import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type ColorPicker = typeof theme

export interface ColorPickerProps {
  /** The current colour (controlled). Use with `v-model`. */
  modelValue?: string | Color
  /** The initial colour when uncontrolled. */
  defaultValue?: string | Color
  /** Whether the popover is open (controlled). Use with `v-model:open`. */
  open?: boolean
  /** Whether the popover is open initially when uncontrolled. */
  defaultOpen?: boolean
  /**
   * Side of the trigger the popover opens on.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover against the trigger. HeroUI's default placement is `bottom left`, i.e. `start` in LTR.
   * @defaultValue 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Distance in px between the trigger and the popover.
   * @defaultValue 8
   */
  sideOffset?: number
  /**
   * Renders the color picker popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Whether the trigger is disabled. */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorPicker>
}

export interface ColorPickerSlots {
  /** Content of the trigger button, typically a ColorSwatch and a Label. Receives the current colour and open state. */
  trigger?: (props: { color: Color; open: boolean }) => any
  /**
   * Popover content (ColorArea, ColorSlider, ColorField, ColorSwatchPicker, …). Colour components rendered here
   * follow the picker's colour unless they have their own `v-model`.
   */
  default?: (props: { color: Color; close: () => void }) => any
}

export interface ColorPickerEmits {
  /** Emitted when the colour changes. */
  'update:modelValue': [value: Color]
  /** Emitted when the popover opens or closes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { normalizeColor, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'

import { outsideEventTarget, preventNestedLayerDismiss } from '../../composables/nestedLayer'
import { useComponentUI } from '../../composables/useComponentUI'
import { usePortal } from '../../composables/usePortal'
import { ColorPickerContextKey } from './context'

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

function setColor(value: Color | string) {
  const next = normalizeColor(value)
  internal.value = next
  emit('update:modelValue', next)
}

provide(ColorPickerContextKey, { color, setColor })

// RAC focuses the popover itself on open (not the first tabbable child like Reka), so Tab starts at the first control.
function focusContent(event: Event) {
  event.preventDefault()
  const el = (event.target as HTMLElement | null)?.querySelector<HTMLElement>(
    '[data-slot=color-picker-popover]',
  )
  // The event targets Reka's positioning wrapper; the popover is its child. It can't take focus until positioned.
  requestAnimationFrame(() => el?.focus({ preventScroll: true }))
}

// Reka's non-modal popover leaves focus where an outside interaction put it (the clicked control or `body`). RAC's
// popover is modal: its underlay swallows the outside click and focus always returns to the trigger. The trigger is
// refocused after the close, again once a pending outside click has finished moving focus, and on unmount.
const triggerRef = ref<{ $el?: unknown } | null>(null)
let closedByOutside = false
let openNow = props.open ?? props.defaultOpen ?? false
watch(
  () => props.open,
  (value) => {
    if (value !== undefined) openNow = value
  },
)
function focusTrigger() {
  const el = triggerRef.value?.$el
  if (el instanceof HTMLElement && !openNow) el.focus({ preventScroll: true })
}
function onOutsideClick() {
  document.removeEventListener('click', onOutsideClick, true)
  focusTrigger()
}
const contentRef = ref<{ $el: HTMLElement } | null>(null)
function onInteractOutside(event: CustomEvent<{ originalEvent: Event }>) {
  preventNestedLayerDismiss(event, contentRef.value?.$el)
  const el = triggerRef.value?.$el
  const target = outsideEventTarget(event)
  if (
    event.defaultPrevented ||
    (el instanceof Node && target instanceof Node && el.contains(target))
  )
    return
  closedByOutside = true
  // A mouse press closes the popover on pointerdown; the browser then moves focus on mousedown
  if (event.detail.originalEvent.type === 'pointerdown')
    document.addEventListener('click', onOutsideClick, true)
}
function onUpdateOpen(value: boolean) {
  openNow = value
  emit('update:open', value)
  if (value) {
    closedByOutside = false
    document.removeEventListener('click', onOutsideClick, true)
  } else if (closedByOutside) {
    nextTick(focusTrigger)
  }
}
function onCloseAutoFocus(event: Event) {
  document.removeEventListener('click', onOutsideClick, true)
  closedByOutside = false
  if (!(triggerRef.value?.$el instanceof HTMLElement)) return
  event.preventDefault()
  focusTrigger()
}
onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick, true))
</script>

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
