<template>
  <Primitive :as="as" data-slot="footer" :class="ui.root()">
    <div v-if="!!slots.top" data-slot="footer-top" :class="ui.top()">
      <slot name="top" />
    </div>

    <div data-slot="footer-container" :class="ui.container()">
      <div data-slot="footer-right" :class="ui.right()">
        <slot name="right" />
      </div>

      <div data-slot="footer-center" :class="ui.center()">
        <slot />
      </div>

      <div data-slot="footer-left" :class="ui.left()">
        <slot name="left" />
      </div>
    </div>

    <div v-if="!!slots.bottom" data-slot="footer-bottom" :class="ui.bottom()">
      <slot name="bottom" />
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { FooterProps, FooterSlots } from './Footer.types'
import theme from './theme'

const props = withDefaults(defineProps<FooterProps>(), { as: 'footer' })
const slots = defineSlots<FooterSlots>()

const ui = useComponentUI('footer', {
  theme: theme,
  variantProps: () => ({}),
  props,
  classSlot: 'root',
})
</script>
