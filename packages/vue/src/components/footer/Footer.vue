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

    <div
      v-if="!!slots.bottom"
      data-slot="footer-bottom"
      :class="ui.bottom({ class: props.ui?.bottom })"
    >
      <slot name="bottom" />
    </div>
  </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Footer = typeof theme

export type FooterProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'footer'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Footer>
}

export type FooterSlots = {
  /** Content aligned to the start on large screens (e.g. copyright). */
  left?: () => VNode[]
  /** Centered content (e.g. links). */
  default?: () => VNode[]
  /** Content aligned to the end on large screens (e.g. social buttons). */
  right?: () => VNode[]
  /** Full-width area above the footer bar (e.g. link columns). Only rendered when filled. */
  top?: () => VNode[]
  /** Full-width area below the footer bar. Only rendered when filled. */
  bottom?: () => VNode[]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<FooterProps>(), { as: 'footer' })
const slots = defineSlots<FooterSlots>()

const ui = useComponentUI('footer', theme, () => ({}))
</script>
