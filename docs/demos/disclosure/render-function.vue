<template>
  <div class="w-full max-w-md text-center">
    <Disclosure
      :as="CustomRoot"
      v-model:open="isExpanded"
      :ui="{
        bodyInner: 'shadow-panel flex flex-col items-center rounded-3xl bg-surface p-4 text-center',
      }"
    >
      <template #trigger="{ indicator }">
        <Button variant="secondary">
          <Icon icon="gravity-ui:qr-code" />
          Preview HeroUI Native
          <component :is="indicator" />
        </Button>
      </template>
      <p class="text-sm text-muted">
        Scan this QR code with your camera app to preview the HeroUI native components.
      </p>
      <img
        alt="Expo Go QR Code"
        class="aspect-square w-full max-w-54 object-cover"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
      />
      <p class="text-sm text-muted">Expo must be installed on your device.</p>
      <Button class="mt-4" variant="primary">
        <Icon icon="tabler:brand-apple-filled" />
        Download on App Store
      </Button>
    </Disclosure>
  </div>
</template>

<script setup lang="ts">
import { Button, Disclosure } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { defineComponent, h, ref } from 'vue'

const isExpanded = ref(true)

const CustomRoot = defineComponent(
  (_, { attrs, slots }) =>
    () =>
      h('div', { ...attrs, 'data-custom': 'foo' }, slots.default?.()),
)
</script>
