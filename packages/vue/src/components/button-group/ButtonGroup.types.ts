import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ButtonGroup = typeof theme

export type ButtonGroupProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Layout direction of the buttons. Inside a Toolbar it defaults to the toolbar's orientation.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<ButtonGroup>['orientation']
  /** Variant applied to every Button in the group that doesn't set its own. */
  variant?: ButtonProps['variant']
  /** Size applied to every Button in the group that doesn't set its own. */
  size?: ButtonProps['size']
  /**
   * Disables every Button in the group; a Button's own `disabled` wins (`:disabled="false"` re-enables it).
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group and its Buttons take the full width of the container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Draws a divider at the start of every Button except the first (HeroUI's `ButtonGroup.Separator`).
   * @defaultValue false
   */
  separator?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `button`/`buttonOutline` are added to each grouped Button, `separator` to each divider. */
  ui?: ComponentSlots<ButtonGroup>
}

export type ButtonGroupSlots = {
  /** The Buttons. Buttons placed directly in the group read its props. */
  default?: () => VNode[]
}
