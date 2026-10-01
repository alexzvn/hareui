<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/popover'

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
   * Renders the popover content in a portal. `true` portals to `document.body`, a string is used as the teleport target, and `false` disables portalling.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
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
import {
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed, ref, useSlots } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  flip: true,
  arrow: false,
  dismissible: true,
  portal: true,
})
const emit = defineEmits<PopoverEmits>()
const slots = useSlots()
defineSlots<PopoverSlots>()

const ui = useComponentUI('popover', theme, () => ({}))

const dialogRef = ref<HTMLElement>()
const hasHeading = computed(() => !!(props.title || slots.title))

function preventIfNotDismissible(event: Event) {
  if (!props.dismissible)
    event.preventDefault()
}

// React Aria moves focus into the dialog element itself when the popover opens;
// Reka's PopperContent otherwise focuses its own root, so redirect it here to match.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  dialogRef.value?.focus()
}
</script>

<template>
  <PopoverRoot :open="open" :default-open="defaultOpen" :modal="false" v-slot="{ open: isOpen, close }" @update:open="emit('update:open', $event)">
    <PopoverTrigger v-if="!!slots.default" as-child>
      <slot :open="isOpen" />
    </PopoverTrigger>
    <PopoverPortal :disabled="portal === false" :to="typeof portal === 'boolean' ? 'body' : portal">
      <PopoverContent
        data-slot="popover"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :avoid-collisions="flip"
        :collision-padding="8"
        :class="ui.base({ class: [props.ui?.base, props.class] })"
        @escape-key-down="preventIfNotDismissible"
        @pointer-down-outside="preventIfNotDismissible"
        @interact-outside="preventIfNotDismissible"
        @open-auto-focus="onOpenAutoFocus"
      >
        <div ref="dialogRef" data-slot="popover-dialog" tabindex="-1" :class="ui.dialog({ class: props.ui?.dialog })">
          <h3 v-if="hasHeading" data-slot="popover-heading" :class="ui.heading({ class: props.ui?.heading })">
            <slot name="title">{{ title }}</slot>
          </h3>
          <slot name="content" :close="close" />
        </div>
        <PopoverArrow v-if="arrow" as-child>
          <svg data-slot="popover-overlay-arrow" fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg" :class="ui.arrow({ class: props.ui?.arrow })">
            <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
          </svg>
        </PopoverArrow>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
