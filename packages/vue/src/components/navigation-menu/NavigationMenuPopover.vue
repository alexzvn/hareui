<template>
  <Popover
    v-if="mode === 'click'"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    :portal="portal"
    :class="props.class"
    :ui="{ dialog: 'p-0' }"
  >
    <slot />
    <template #content="{ close }">
      <slot name="content" :close="close" />
    </template>
  </Popover>
  <HoverCardRoot
    v-else
    :open="open"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    @update:open="onOpenChange"
  >
    <HoverCardTrigger
      :ref="setTrigger"
      as-child
      :aria-expanded="open"
      :aria-controls="open ? contentId : undefined"
      @keydown="onTriggerKeydown"
      @blur="suppressOpen = false"
      @pointerleave="suppressOpen = false"
    >
      <slot />
    </HoverCardTrigger>
    <HoverCardPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <HoverCardContent
        :id="contentId"
        :ref="setContent"
        data-slot="popover"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
        :collision-padding="8"
        :class="
          ui.base({ class: ['origin-(--reka-hover-card-content-transform-origin)', props.class] })
        "
        @keydown="onContentKeydown"
        @focusout="onContentFocusout"
      >
        <slot
          name="content"
          :close="
            () => {
              open = false
            }
          "
        />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import Popover from '@/components/popover/Popover.vue'
import popoverTheme from '@/components/popover/theme'
import { TOOLTIP_OPEN_EVENT } from '@/composables/nestedLayer'
import { useComponentUI } from '@/composables/useComponentUI'
import { usePortal } from '@/composables/usePortal'

import type { NavigationMenuPopoverProps } from './types'

// The popover shown for a collapsed item with children. HareUI's `Popover` opens on click only, so
// `mode: 'hover'` (the default) is built on Reka's HoverCard with the same surface classes.
const props = withDefaults(defineProps<NavigationMenuPopoverProps>(), {
  mode: 'hover',
  side: 'right',
  align: 'start',
  sideOffset: 8,
  alignOffset: 2,
  openDelay: 0,
  closeDelay: 100,
  portal: undefined,
})
defineSlots<{
  /** The trigger element. */
  default?: () => unknown
  /** The popover's content. */
  content?: (props: { close: () => void }) => unknown
}>()

const ui = useComponentUI('popover', popoverTheme, () => ({}))
const portalTarget = usePortal(() => props.portal)
const open = ref(false)

// Reka's `tooltip.open` event closes every other tooltip at once. Opening a hover popover sends it too,
// and listens for it, so moving down a collapsed rail swaps tooltips and popovers instantly instead of
// the previous one lingering for its close delay next to the new one.
let announcing = false
watch(open, (value) => {
  if (!value) return
  announcing = true
  document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN_EVENT))
  announcing = false
})
function onOtherOpen() {
  if (!announcing) open.value = false
}
onMounted(() => document.addEventListener(TOOLTIP_OPEN_EVENT, onOtherOpen))
onBeforeUnmount(() => document.removeEventListener(TOOLTIP_OPEN_EVENT, onOtherOpen))

// Keyboard access to the hover card, which Reka leaves to the pointer: the side's arrow key (and Enter / Space
// on a button trigger) opens it and moves focus to its first link; it stays open while focus is inside, Escape
// or the opposite arrow closes it and returns focus to the trigger, and focus leaving it closes it.
const contentId = useId()
const triggerEl = ref<HTMLElement>()
const contentEl = ref<HTMLElement>()
// After a keyboard close, the trigger's focus must not reopen the card (Reka opens it on focus) until the
// trigger blurs or the pointer leaves it.
const suppressOpen = ref(false)
// Set by a keyboard open: the first focusable element of the card takes focus once it mounts.
let focusOnMount = false

const ENTRY_KEYS = {
  right: 'ArrowRight',
  left: 'ArrowLeft',
  top: 'ArrowUp',
  bottom: 'ArrowDown',
} as const
const EXIT_KEYS = {
  right: 'ArrowLeft',
  left: 'ArrowRight',
  top: 'ArrowDown',
  bottom: 'ArrowUp',
} as const
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusFirst() {
  focusOnMount = false
  contentEl.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
}

// Enter / Space keep their default, so a button trigger still clicks (and runs its `onSelect`).
function onTriggerKeydown(event: KeyboardEvent) {
  const target = event.currentTarget as HTMLElement
  const isEntryKey = event.key === ENTRY_KEYS[props.side]
  if (!isEntryKey && !(target.tagName === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')))
    return
  if (isEntryKey) event.preventDefault()
  triggerEl.value = target
  suppressOpen.value = false
  if (open.value && contentEl.value) {
    focusFirst()
    return
  }
  focusOnMount = true
  open.value = true
}

function onContentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' && event.key !== EXIT_KEYS[props.side]) return
  event.preventDefault()
  event.stopPropagation()
  suppressOpen.value = true
  open.value = false
  triggerEl.value?.focus()
}

// Focus moving to another element outside the card and its trigger closes it.
function onContentFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !contentEl.value?.contains(next) && !triggerEl.value?.contains(next))
    open.value = false
}

function onOpenChange(value: boolean) {
  if (value && suppressOpen.value) return
  // Reka closes on the trigger's blur or a pointer leave; focus inside the card keeps it open.
  if (!value && contentEl.value?.contains(document.activeElement)) return
  open.value = value
}

function setTrigger(el: unknown) {
  triggerEl.value = (el as { $el?: HTMLElement } | null)?.$el
}
function setContent(el: unknown) {
  contentEl.value = (el as { $el?: HTMLElement } | null)?.$el
  if (contentEl.value && focusOnMount) nextTick(focusFirst)
}
</script>
