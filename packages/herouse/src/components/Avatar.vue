<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/avatar'

type Avatar = typeof theme

export interface AvatarProps {
  /** Image source. The fallback shows until it loads, or if it fails. */
  src?: string
  /** Alternative text of the image. */
  alt?: string
  /** Fallback text (usually initials) shown when there is no image. */
  fallback?: string
  /** Delay in milliseconds before the fallback renders, to avoid flashing it while the image loads. */
  delayMs?: number
  /**
   * Color of the fallback.
   * @defaultValue 'default'
   */
  color?: ComponentVariants<Avatar>['color']
  /**
   * Size of the avatar.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Avatar>['size']
  /**
   * Visual style of the avatar.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Avatar>['variant']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Avatar>
}

export interface AvatarSlots {
  /** Fallback content (e.g. an icon). Defaults to the `fallback` text. */
  fallback?: () => any
}
</script>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { useComponentUI } from '../composables/useComponentUI'

const props = defineProps<AvatarProps>()
defineSlots<AvatarSlots>()

const ui = useComponentUI('avatar', theme, () => ({ color: props.color, size: props.size, variant: props.variant }))
</script>

<template>
  <AvatarRoot :class="ui.base({ class: [props.ui?.base, props.class] })">
    <AvatarImage v-if="src" :src="src" :alt="alt" :class="ui.image({ class: props.ui?.image })" />
    <AvatarFallback data-slot="avatar-fallback" :delay-ms="delayMs" :class="ui.fallback({ class: props.ui?.fallback })">
      <slot name="fallback">
        {{ fallback }}
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>
