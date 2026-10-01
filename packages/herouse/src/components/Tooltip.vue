<script lang="ts">
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/tooltip'

type Tooltip = typeof theme

export interface TooltipProps {
  /** The text content of the tooltip. Ignored when the `content` slot is used. */
  text?: string
  /** The controlled open state of the tooltip. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /**
   * Delay in milliseconds before the tooltip opens after the pointer enters the trigger.
   * @defaultValue 1500
   */
  delay?: number
  /**
   * The preferred side of the trigger to render against.
   * @defaultValue 'top'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The preferred alignment against the trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The distance in pixels from the trigger.
   * @defaultValue 7 when `arrow` is true, otherwise 3
   */
  sideOffset?: number
  /**
   * Whether to render an arrow pointing at the trigger.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * Whether the tooltip is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Where the tooltip is teleported. `true` teleports to `body`, `false` renders in place,
   * a string or element teleports to that target.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /** Additional classes merged into the tooltip content element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tooltip>
}

export interface TooltipSlots {
  /** The trigger element. */
  default?: (props: { open: boolean }) => any
  /** Replaces the default `text` content. */
  content?: () => any
}

export interface TooltipEmits {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useComponentUI } from '../composables/useComponentUI'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<TooltipProps>(), {
  open: undefined,
  defaultOpen: false,
  delay: 1500,
  side: 'top',
  align: 'center',
  arrow: false,
  portal: true,
})
const emit = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()

const ui = useComponentUI('tooltip', theme, () => ({}))

const sideOffset = computed(() => props.sideOffset ?? (props.arrow ? 7 : 3))
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :open="open" :default-open="defaultOpen" :delay-duration="delay" :disabled="disabled" @update:open="emit('update:open', $event)">
      <template #default="{ open: isOpen }">
        <TooltipTrigger as-child>
          <slot :open="isOpen" />
        </TooltipTrigger>
        <TooltipPortal :disabled="portal === false" :to="typeof portal === 'boolean' ? 'body' : portal">
          <TooltipContent
            :side="side"
            :align="align"
            :side-offset="sideOffset"
            :class="ui.base({ class: [props.ui?.base, props.class] })"
          >
            <slot name="content">
              <span v-if="text">{{ text }}</span>
            </slot>
            <TooltipArrow v-if="arrow" as-child>
              <svg data-slot="overlay-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.arrow({ class: props.ui?.arrow })">
                <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
              </svg>
            </TooltipArrow>
          </TooltipContent>
        </TooltipPortal>
      </template>
    </TooltipRoot>
  </TooltipProvider>
</template>
