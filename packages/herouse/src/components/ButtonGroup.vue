<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import type { ButtonProps } from './Button.vue'
import theme from '../theme/buttonGroup'

type ButtonGroup = typeof theme

export interface ButtonGroupProps {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Layout direction of the buttons.
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
  class?: any
  /** Per-slot class overrides. `button`/`buttonOutline` are added to each grouped Button, `separator` to each divider. */
  ui?: ComponentSlots<ButtonGroup>
}

export interface ButtonGroupSlots {
  /** The Buttons. Buttons placed directly in the group read its props. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { provide, toRef } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { buttonGroupContextKey } from './buttonGroupContext'

const props = withDefaults(defineProps<ButtonGroupProps>(), { as: 'div', disabled: undefined, fullWidth: undefined })
defineSlots<ButtonGroupSlots>()

const ui = useComponentUI('buttonGroup', theme, () => ({ orientation: props.orientation, fullWidth: props.fullWidth }))

provide(buttonGroupContextKey, {
  variant: toRef(() => props.variant),
  size: toRef(() => props.size),
  disabled: toRef(() => props.disabled),
  fullWidth: toRef(() => props.fullWidth),
  separator: toRef(() => props.separator),
  ui,
  uiOverrides: toRef(() => props.ui),
})
</script>

<template>
  <Primitive
    :as="as"
    role="group"
    data-slot="button-group"
    :aria-disabled="disabled ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>
