<template>
  <ConfigProvider
    :use-id="() => useId()"
    :dir="dir"
    :locale="locale"
    :scroll-body="scrollBody"
    :nonce="nonce"
  >
    <slot />
    <ToastProvider v-if="toaster !== null" v-bind="toaster" />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { inject, provide, useId } from 'vue'

import ToastProvider from '@/components/toast-provider/ToastProvider.vue'
import { hareUIConfigKey } from '@/config'

import type { AppProps, AppSlots } from './App.types'

const props = withDefaults(defineProps<AppProps>(), {
  dir: undefined,
  locale: undefined,
  scrollBody: undefined,
  nonce: undefined,
  portal: undefined,
  toaster: () => ({}),
})

defineSlots<AppSlots>()

// A child config that reads through to the parent one: `portal` from this component's prop when set.
const parent = inject(hareUIConfigKey, {})
provide(hareUIConfigKey, {
  get ui() {
    return parent.ui
  },
  get portal() {
    return props.portal ?? parent.portal
  },
})
</script>
