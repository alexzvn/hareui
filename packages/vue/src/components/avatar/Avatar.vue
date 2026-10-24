<template>
  <AvatarRoot :class="ui.base({ class: [props.ui?.base, props.class] })">
    <!-- reka hard-codes role="img"; Radix sets none, and alt="" with a role breaks aria-allowed-role. -->
    <AvatarImage
      v-if="src"
      :as-child="!!slots.image"
      :src="src"
      :alt="alt"
      :role="undefined"
      :srcset="srcset"
      :sizes="sizes"
      :loading="loading"
      :cross-origin="crossOrigin"
      :referrer-policy="referrerPolicy"
      :class="ui.image({ class: props.ui?.image })"
      @loading-status-change="emit('loadingStatusChange', $event)"
    >
      <slot name="image" />
    </AvatarImage>
    <AvatarFallback
      data-slot="avatar-fallback"
      :delay-ms="delayMs"
      :class="ui.fallback({ class: props.ui?.fallback })"
    >
      <slot name="fallback">
        {{ fallback }}
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>

<script lang="ts">
import type { AvatarImageProps } from 'reka-ui'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type Avatar = typeof theme

export interface AvatarProps {
  /** Image source. The fallback shows until it loads, or if it fails. */
  src?: string
  /** Alternative text of the image. */
  alt?: string
  /** The image `srcset` attribute for responsive images. */
  srcset?: string
  /** The image `sizes` attribute for responsive images. */
  sizes?: string
  /** Native lazy loading attribute of the image. */
  loading?: 'eager' | 'lazy'
  /** CORS setting for the image request. */
  crossOrigin?: AvatarImageProps['crossOrigin']
  /** Referrer policy for the image request. */
  referrerPolicy?: AvatarImageProps['referrerPolicy']
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
  /**
   * Custom image component (e.g. `<NuxtImg>`). Rendered in place of the `<img>`, receiving
   * `src`, the `image` classes and the loading-state visibility. Requires `src`.
   */
  image?: () => any
  /** Fallback content (e.g. an icon). Defaults to the `fallback` text. */
  fallback?: () => any
}

export interface AvatarEmits {
  /** Emitted when the image loading status changes (`'loading'`, `'loaded'` or `'error'`). */
  loadingStatusChange: [value: 'idle' | 'loading' | 'loaded' | 'error']
}
</script>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

import { useComponentUI } from '../../composables/useComponentUI'

const props = defineProps<AvatarProps>()
const emit = defineEmits<AvatarEmits>()
const slots = defineSlots<AvatarSlots>()

const ui = useComponentUI('avatar', theme, () => ({
  color: props.color,
  size: props.size,
  variant: props.variant,
}))
</script>
