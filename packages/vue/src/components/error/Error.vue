<template>
  <Primitive :as="as.root" data-slot="error" :class="ui.root()">
    <div v-if="slots.leading" data-slot="error-leading" :class="ui.leading()">
      <slot name="leading" :ui="ui" />
    </div>
    <p v-if="statusCode || slots.statusCode" data-slot="error-status-code" :class="ui.statusCode()">
      <slot name="statusCode">
        {{ statusCode }}
      </slot>
    </p>
    <Primitive
      v-if="statusMessage || slots.statusMessage"
      :as="as.statusMessage"
      data-slot="error-status-message"
      :class="ui.statusMessage()"
    >
      <slot name="statusMessage">
        {{ statusMessage }}
      </slot>
    </Primitive>
    <p
      v-if="(error?.message && error.message !== statusMessage) || slots.message"
      data-slot="error-message"
      :class="ui.message()"
    >
      <slot name="message">
        {{ error?.message }}
      </slot>
    </p>
    <div v-if="clear || slots.links" data-slot="error-links" :class="ui.links()">
      <slot name="links">
        <Button
          v-if="clear"
          :as="redirect ? 'a' : 'button'"
          size="lg"
          v-bind="clearButtonProps"
          :href="redirect || undefined"
          @click="emit('clear', $event)"
        >
          {{ clearLabel }}
        </Button>
      </slot>
    </div>
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import Button from '@/components/button/Button.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { resolveAs } from '@/utils/resolveAs'

import type { ErrorClearProps, ErrorProps, ErrorSlots, ErrorEmits } from './Error.types'
import theme from './theme'

const props = withDefaults(defineProps<ErrorProps>(), {
  as: 'main',
  redirect: '/',
  clear: true,
})

const emit = defineEmits<ErrorEmits>()
const slots = defineSlots<ErrorSlots>()

const ui = useComponentUI('error', {
  theme: theme,
  variantProps: () => ({}),
  props,
  classSlot: 'root',
})

const as = computed(() => resolveAs(props.as, { root: 'main', statusMessage: 'h1' }))
const statusCode = computed(() => props.error?.statusCode || props.error?.status)
const statusMessage = computed(() => props.error?.statusMessage || props.error?.statusText)

const clearProps = computed<ErrorClearProps>(() =>
  typeof props.clear === 'object' ? props.clear : {},
)

const clearLabel = computed(() => clearProps.value.label ?? 'Back to home')

const clearButtonProps = computed(() => {
  const { label: _label, ...button } = clearProps.value
  return button
})
</script>
