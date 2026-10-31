<template>
  <component
    :is="parts.Root"
    v-bind="rootProps"
    v-slot="{ close }: { close?: () => void }"
    @update:open="setOpen"
  >
    <component
      :is="parts.Trigger"
      v-if="!!slots.default"
      as-child
      :data-pressed="isOpen ? 'true' : undefined"
    >
      <slot :open="isOpen" />
    </component>
    <component :is="parts.Portal" :disabled="portalTarget.disabled" :to="portalTarget.to">
      <component
        :is="parts.Content"
        ref="contentRef"
        data-slot="popover"
        :side="side"
        :align="align"
        :side-offset="contentOffset"
        :avoid-collisions="flip"
        :collision-padding="8"
        :class="ui.base()"
        @escape-key-down="onEscapeKeyDown"
        @interact-outside="onInteractOutside"
        v-bind="contentListeners"
      >
        <div ref="dialogRef" data-slot="popover-dialog" tabindex="-1" :class="ui.dialog()">
          <h2 v-if="hasHeading" :id="headingId" data-slot="popover-heading" :class="ui.heading()">
            <slot name="title">{{ title }}</slot>
          </h2>
          <slot name="content" v-bind="(close ? { close } : {}) as PopoverContentSlotProps<M>" />
        </div>
        <component :is="parts.Arrow" v-if="arrow" as-child>
          <svg
            data-slot="popover-overlay-arrow"
            fill="none"
            height="12"
            viewBox="0 0 12 12"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
            :class="ui.arrow()"
          >
            <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
          </svg>
        </component>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts" generic="M extends PopoverMode = 'click'">
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed, useId, useSlots, useTemplateRef, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useInertOutside } from '@/composables/useInertOutside'
import { useLayerDismiss } from '@/composables/useLayerDismiss'
import { usePortal } from '@/composables/usePortal'

import type {
  PopoverContentSlotProps,
  PopoverEmits,
  PopoverMode,
  PopoverProps,
  PopoverSlots,
} from './Popover.types'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<PopoverProps<M>>(), {
  open: undefined,
  mode: 'click' as never,
  openDelay: 700,
  closeDelay: 300,
  enableTouch: false,
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
defineSlots<PopoverSlots<M>>()

const PARTS = {
  click: {
    Root: PopoverRoot,
    Trigger: PopoverTrigger,
    Portal: PopoverPortal,
    Content: PopoverContent,
    Arrow: PopoverArrow,
  },
  hover: {
    Root: HoverCardRoot,
    Trigger: HoverCardTrigger,
    Portal: HoverCardPortal,
    Content: HoverCardContent,
    Arrow: HoverCardArrow,
  },
}

const isHover = computed(() => props.mode === 'hover')
const parts = computed(() => (isHover.value ? PARTS.hover : PARTS.click))

const ui = useComponentUI('popover', { theme: theme, variantProps: () => ({}), props })

const contentRef = useTemplateRef<{ $el: HTMLElement }>('contentRef')
const dialogRef = useTemplateRef<HTMLElement>('dialogRef')
const hasHeading = computed(() => !!(props.title || slots.title))

// React Aria labels the dialog by its title heading (Reka labels it by the trigger).
const headingId = useId()

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (value) => emit('update:open', value),
})

// `isOpen` turns false synchronously in `setOpen` (Reka's `update:open`) and with the `open` prop. The
// content instance stays mounted while closed and its `$el` isn't reactive, so re-read it on every open.
// A hover card isn't modal, so the page stays interactive.
useInertOutside(
  () => (isOpen.value && !isHover.value ? contentRef.value?.$el : null),
  () => isOpen.value && !isHover.value,
)

// React Aria's useInteractOutside only reacts to the primary button, so a right click outside keeps the popover open.
const { onEscapeKeyDown, onInteractOutside } = useLayerDismiss({
  content: () => contentRef.value?.$el,
  isDismissible: () => props.dismissible,
  shouldIgnoreSecondaryButton: true,
  onPrevent: () => emit('close:prevent'),
  earlyPress: { isOpen: () => isOpen.value && !isHover.value, onDismiss: () => setOpen(false) },
})

// Hover mode opens and closes on its own delays and isn't modal.
const rootProps = computed(() =>
  isHover.value
    ? {
        open: isOpen.value,
        openDelay: props.openDelay,
        closeDelay: props.closeDelay,
        enableTouch: props.enableTouch,
      }
    : { open: isOpen.value, modal: true },
)

// Reka hard-codes `aria-labelledby` to the trigger id below any attrs we pass, so relabel the dialog
// here; Vue never re-patches it because Reka's value doesn't change between renders.
watch(dialogRef, (el) => {
  if (el && hasHeading.value)
    el.closest('[role=dialog]')?.setAttribute('aria-labelledby', headingId)
})

// React Aria moves focus into the dialog element itself when the popover opens;
// Reka's PopperContent otherwise focuses its own root, so redirect it here to match.
const onOpenAutoFocus = (event: Event) => {
  event.preventDefault()
  dialogRef.value?.focus()
}

// A hover card doesn't move focus, so it gets no `open-auto-focus` handler.
const contentListeners = computed(() => (isHover.value ? {} : { onOpenAutoFocus }))

// The arrow SVG is 12px tall. Reka's PopperContent adds the arrow's height to `sideOffset`, but
// React Aria measures `offset` from the trigger to the popover body (the arrow overlaps the gap),
// so subtract it to keep the HeroUI distance.
const ARROW_HEIGHT = 12
const contentOffset = computed(() => props.sideOffset - (props.arrow ? ARROW_HEIGHT : 0))
</script>
