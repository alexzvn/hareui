<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type Footer = typeof theme

export interface FooterProps {
  /**
   * The element or component to render as.
   * @defaultValue 'footer'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Footer>
}

export interface FooterSlots {
  /** Content aligned to the start on large screens (e.g. copyright). */
  left?: () => any
  /** Centered content (e.g. links). */
  default?: () => any
  /** Content aligned to the end on large screens (e.g. social buttons). */
  right?: () => any
  /** Full-width area above the footer bar (e.g. link columns). Only rendered when filled. */
  top?: () => any
  /** Full-width area below the footer bar. Only rendered when filled. */
  bottom?: () => any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useComponentUI } from '../../composables/useComponentUI'

const props = withDefaults(defineProps<FooterProps>(), { as: 'footer' })
const slots = defineSlots<FooterSlots>()

const ui = useComponentUI('footer', theme, () => ({}))
</script>

<template>
  <Primitive :as="as" data-slot="footer" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.top" data-slot="footer-top" :class="ui.top({ class: props.ui?.top })">
      <slot name="top" />
    </div>

    <div data-slot="footer-container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="footer-right" :class="ui.right({ class: props.ui?.right })">
        <slot name="right" />
      </div>

      <div data-slot="footer-center" :class="ui.center({ class: props.ui?.center })">
        <slot />
      </div>

      <div data-slot="footer-left" :class="ui.left({ class: props.ui?.left })">
        <slot name="left" />
      </div>
    </div>

    <div v-if="!!slots.bottom" data-slot="footer-bottom" :class="ui.bottom({ class: props.ui?.bottom })">
      <slot name="bottom" />
    </div>
  </Primitive>
</template>
