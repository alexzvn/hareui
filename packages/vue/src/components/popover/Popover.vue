<template>
  <PopoverRoot :open="isOpen" modal v-slot="{ close }" @update:open="setOpen">
    <PopoverTrigger v-if="!!slots.default" as-child :data-pressed="isOpen ? 'true' : undefined">
      <slot :open="isOpen" />
    </PopoverTrigger>
    <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <PopoverContent
        ref="contentRef"
        data-slot="popover"
        :side="side"
        :align="align"
        :side-offset="contentOffset"
        :avoid-collisions="flip"
        :collision-padding="8"
        :class="ui.base({ class: [props.ui?.base, props.class] })"
        @escape-key-down="onEscapeKeyDown"
        @interact-outside="onInteractOutside"
        @open-auto-focus="onOpenAutoFocus"
      >
        <div
          ref="dialogRef"
          data-slot="popover-dialog"
          tabindex="-1"
          :class="ui.dialog({ class: props.ui?.dialog })"
        >
          <h2
            v-if="hasHeading"
            :id="headingId"
            data-slot="popover-heading"
            :class="ui.heading({ class: props.ui?.heading })"
          >
            <slot name="title">{{ title }}</slot>
          </h2>
          <slot name="content" :close="close" />
        </div>
        <PopoverArrow v-if="arrow" as-child>
          <svg
            data-slot="popover-overlay-arrow"
            fill="none"
            height="12"
            viewBox="0 0 12 12"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
            :class="ui.arrow({ class: props.ui?.arrow })"
          >
            <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
          </svg>
        </PopoverArrow>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script lang="ts">
import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type Popover = typeof theme

export interface PopoverProps {
  /**
   * The controlled open state of the popover.
   */
  open?: boolean
  /**
   * The open state of the popover when it is initially rendered. Use when you do not need to control its open state.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * The title rendered inside the popover's heading.
   */
  title?: string
  /**
   * The preferred side of the trigger to render against when open.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The preferred alignment against the trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The distance in pixels from the trigger.
   * @defaultValue 8
   */
  sideOffset?: number
  /**
   * Whether the popover can change orientation to fit in the viewport when it would otherwise overflow.
   * @defaultValue true
   */
  flip?: boolean
  /**
   * Whether to render an arrow pointing at the trigger.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * When `false`, the popover will not close when clicking outside or pressing Escape.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Renders the popover content in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the popover surface. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Popover>
}

export interface PopoverSlots {
  /** The trigger element. Receives the current open state. */
  default?: (props: { open: boolean }) => any
  /** Replaces the heading text derived from `title`. */
  title?: () => any
  /** The popover's content. Receives a `close` callback. */
  content?: (props: { close: () => void }) => any
}

export interface PopoverEmits {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, ref, useId, useSlots, watch } from 'vue'

import { useLayerDismiss } from '@/composables/useLayerDismiss'

import { useComponentUI } from '../../composables/useComponentUI'
import { useInertOutside } from '../../composables/useInertOutside'
import { usePortal } from '../../composables/usePortal'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  flip: true,
  arrow: false,
  dismissible: true,
  portal: undefined,
})
const portalTarget = usePortal(() => props.portal)
const emit = defineEmits<PopoverEmits>()
const slots = useSlots()
defineSlots<PopoverSlots>()

const ui = useComponentUI('popover', theme, () => ({}))

const contentRef = ref<{ $el: HTMLElement } | null>(null)
const dialogRef = ref<HTMLElement>()
const hasHeading = computed(() => !!(props.title || slots.title))
// React Aria labels the dialog by its title heading (Reka labels it by the trigger).
const headingId = useId()

const openState = ref(props.defaultOpen ?? false)
const isOpen = computed(() => props.open ?? openState.value)
function setOpen(value: boolean) {
  openState.value = value
  emit('update:open', value)
}
// `isOpen` turns false synchronously in `setOpen` (Reka's `update:open`) and with the `open` prop. The
// content instance stays mounted while closed and its `$el` isn't reactive, so re-read it on every open.
useInertOutside(() => (isOpen.value ? contentRef.value?.$el : null), isOpen)

// React Aria's useInteractOutside only reacts to the primary button, so a right click outside keeps the popover open.
const { onEscapeKeyDown, onInteractOutside } = useLayerDismiss({
  content: () => contentRef.value?.$el,
  isDismissible: () => props.dismissible,
  shouldIgnoreSecondaryButton: true,
  earlyPress: { isOpen, onDismiss: () => setOpen(false) },
})

// Reka hard-codes `aria-labelledby` to the trigger id below any attrs we pass, so relabel the dialog
// here; Vue never re-patches it because Reka's value doesn't change between renders.
watch(dialogRef, (el) => {
  if (el && hasHeading.value)
    el.closest('[role=dialog]')?.setAttribute('aria-labelledby', headingId)
})

// React Aria moves focus into the dialog element itself when the popover opens;
// Reka's PopperContent otherwise focuses its own root, so redirect it here to match.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  dialogRef.value?.focus()
}

// The arrow SVG is 12px tall. Reka's PopperContent adds the arrow's height to `sideOffset`, but
// React Aria measures `offset` from the trigger to the popover body (the arrow overlaps the gap),
// so subtract it to keep the HeroUI distance.
const ARROW_HEIGHT = 12
const contentOffset = computed(() => props.sideOffset - (props.arrow ? ARROW_HEIGHT : 0))
</script>
