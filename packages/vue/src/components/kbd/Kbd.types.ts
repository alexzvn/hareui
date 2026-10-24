import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type { KbdKey } from './kbdKeys'
import type theme from './theme'

type Kbd = typeof theme

export type KbdProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'kbd'
   */
  as?: PrimitiveProps['as']
  /** Modifier or special keys rendered as symbols before the content (HeroUI's `Kbd.Abbr keyValue`), each with its name as `title`. */
  keys?: KbdKey | KbdKey[]
  /** Visual variant. */
  variant?: ComponentVariants<Kbd>['variant']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Kbd>
}

export type KbdSlots = {
  /** The key text after the symbols, wrapped in the `content` element (HeroUI's `Kbd.Content`). */
  default?: () => VNode[]
}
