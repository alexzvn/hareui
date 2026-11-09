<template>
  <div role="status" data-slot="chat-loader" :data-variant="variant" :class="ui.base()">
    <template v-if="variant === 'skeleton'">
      <span aria-hidden="true" data-slot="chat-loader-avatar" :class="ui.avatar()" />
      <span aria-hidden="true" data-slot="chat-loader-bars" :class="ui.bars()">
        <span v-for="bar in lines" :key="bar" data-slot="chat-loader-bar" :class="ui.bar()" />
      </span>
    </template>
    <Spinner
      v-else-if="variant === 'spinner'"
      aria-hidden="true"
      color="accent"
      :size="size"
      :class="ui.spinner()"
    />
    <span
      v-else-if="variant === 'pulse'"
      aria-hidden="true"
      data-slot="chat-loader-pulse"
      :class="ui.pulse()"
    />
    <template v-else>
      <span
        v-for="dot in 3"
        :key="dot"
        aria-hidden="true"
        data-slot="chat-loader-dot"
        :class="ui.dot()"
      />
    </template>
    <!-- Last, so the dots and bars keep their `nth-child` delays and widths. -->
    <span :class="ui.label({ class: 'sr-only' })">{{ label ?? t('chatLoader.label') }}</span>
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type { ChatLoaderProps } from './ChatLoader.types'
import theme from './theme'

const props = withDefaults(defineProps<ChatLoaderProps>(), {
  variant: 'dots',
  size: 'md',
  lines: 3,
})

const { t } = useLocale()

const ui = useComponentUI('chatLoader', {
  theme,
  variantProps: () => ({ variant: props.variant, size: props.size }),
  props,
})
</script>
