import type { AvatarImageProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Avatar = typeof theme

export type AvatarProps = {
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
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Avatar>
}

export type AvatarSlots = {
  /**
   * Custom image component (e.g. `<NuxtImg>`). Rendered in place of the `<img>`, receiving
   * `src`, the `image` classes and the loading-state visibility. Requires `src`.
   */
  image?: () => VNode[]
  /** Fallback content (e.g. an icon). Defaults to the `fallback` text. */
  fallback?: () => VNode[]
}

export type AvatarEmits = {
  /** Emitted when the image loading status changes (`'loading'`, `'loaded'` or `'error'`). */
  loadingStatusChange: [value: 'idle' | 'loading' | 'loaded' | 'error']
}
