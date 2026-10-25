<template>
  <AvatarRoot :class="ui.base()">
    <!-- reka hard-codes role="img"; Radix sets none, and alt="" with a role breaks aria-allowed-role. -->
    <AvatarImage
      v-if="src"
      :as-child="!!slots.image"
      :src="src"
      :alt="alt"
      :role="undefined"
      :srcset="srcset"
      :sizes="sizes"
      :loading="loading"
      :cross-origin="crossOrigin"
      :referrer-policy="referrerPolicy"
      :class="ui.image()"
      @loading-status-change="emit('loadingStatusChange', $event)"
    >
      <slot name="image" />
    </AvatarImage>
    <AvatarFallback data-slot="avatar-fallback" :delay-ms="delayMs" :class="ui.fallback()">
      <slot name="fallback">
        {{ fallback }}
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

import { useComponentUI } from '@/composables/useComponentUI'

import type { AvatarProps, AvatarSlots, AvatarEmits } from './Avatar.types'
import theme from './theme'

const props = defineProps<AvatarProps>()
const emit = defineEmits<AvatarEmits>()
const slots = defineSlots<AvatarSlots>()

const ui = useComponentUI('avatar', {
  theme,
  variantProps: () => ({
    color: props.color,
    size: props.size,
    variant: props.variant,
  }),
  props,
})
</script>
