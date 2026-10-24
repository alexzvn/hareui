<template>
  <div data-slot="switch-group" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div data-slot="switch-group-items" :class="ui.items({ class: props.ui?.items })">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type SwitchGroup = typeof theme

export interface SwitchGroupProps {
  /**
   * The axis the switches are laid out along.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<SwitchGroup>['orientation']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<SwitchGroup>
}

export interface SwitchGroupSlots {
  /** The `Switch` items to render. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useComponentUI } from '../../composables/useComponentUI'

const props = defineProps<SwitchGroupProps>()
defineSlots<SwitchGroupSlots>()

const ui = useComponentUI('switchGroup', theme, () => ({
  orientation: props.orientation,
}))
</script>
