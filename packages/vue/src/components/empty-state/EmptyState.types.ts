import type { VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type { ButtonProps } from '@/components/button/Button.types'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EmptyState = typeof theme

/**
 * Props of `EmptyState`, the placeholder shown when a collection such as a `Table` has no items. Without `icon`,
 * `avatar`, `title`, `description`, `actions` or their slots it renders its default slot as a single muted line.
 */
export type EmptyStateProps = {
  /** Icon shown above the title in a muted circle: a class string or a component. */
  icon?: IconValue
  /** Avatar shown above the title, instead of the icon. */
  avatar?: AvatarProps
  /** Heading, rendered as an `h3`. */
  title?: string
  /** Text shown under the title. */
  description?: string
  /** Buttons shown under the text. Each takes its size from `size` unless it sets its own. */
  actions?: ButtonProps[]
  /**
   * Padding, spacing, media and text size (24/32/48px vertical padding; 40/48/56px media).
   * @defaultValue 'md'
   */
  size?: ComponentVariants<EmptyState>['size']
  /**
   * Container style: `outline` adds a dashed border, `secondary` a filled background.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<EmptyState>['variant']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EmptyState>
}

/** Slots of `EmptyState`. */
export type EmptyStateSlots = {
  /** The empty-state content. Defaults to "No results found" when no other part is set. */
  default?: () => VNode[]
  /** The media above the title, replacing the icon or avatar. */
  leading?: () => VNode[]
  /** The heading content, replacing `title`. */
  title?: () => VNode[]
  /** The text under the title, replacing `description`. */
  description?: () => VNode[]
  /** The action area, replacing the `actions` buttons. */
  actions?: () => VNode[]
}
