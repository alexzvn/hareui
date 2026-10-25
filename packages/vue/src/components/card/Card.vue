<template>
  <Primitive :as="as" data-slot="card" :class="ui.base()">
    <slot name="leading" />
    <div
      v-if="!!slots.header || title || !!slots.title || description || !!slots.description"
      data-slot="card-header"
      :class="ui.header()"
    >
      <slot name="header">
        <h3 v-if="title || !!slots.title" data-slot="card-title" :class="ui.title()">
          <slot name="title">
            {{ title }}
          </slot>
        </h3>
        <p
          v-if="description || !!slots.description"
          data-slot="card-description"
          :class="ui.description()"
        >
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </slot>
    </div>
    <div v-if="!!slots.default" data-slot="card-content" :class="ui.content()">
      <slot />
    </div>
    <div v-if="!!slots.footer" data-slot="card-footer" :class="ui.footer()">
      <slot name="footer" />
    </div>
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { CardProps, CardSlots } from './Card.types'
import theme from './theme'

const props = withDefaults(defineProps<CardProps>(), { as: 'div' })
const slots = defineSlots<CardSlots>()

const ui = useComponentUI('card', {
  theme,
  variantProps: () => ({ variant: props.variant }),
  props,
})
</script>
