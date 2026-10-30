<template>
  <div class="w-full max-w-md">
    <div class="flex flex-col gap-4 bg-transparent p-4">
      <DisclosureGroup v-model="expandedKeys">
        <Disclosure
          aria-label="Preview the mobile app"
          value="preview"
          :ui="{ bodyInner: 'mx-2 flex flex-col items-center gap-2 p-4 text-center' }"
        >
          <template #trigger="{ indicator }">
            <Button
              :class="[
                'w-full border-none',
                { 'bg-transparent': !expandedKeys.includes('preview') },
              ]"
              :variant="expandedKeys.includes('preview') ? 'secondary' : 'tertiary'"
            >
              <div class="flex w-full items-center justify-start gap-2">
                <Icon height="16" icon="gravity-ui:qr-code" width="16" />
                Preview the mobile app
              </div>
              <component :is="indicator" class="text-muted" />
            </Button>
          </template>
          <p class="text-sm text-muted">
            Scan this QR code with your camera app to preview the mobile components.
          </p>
          <img
            alt="Expo Go QR Code"
            class="aspect-square w-full max-w-54 object-cover"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
          />
          <p class="text-sm text-muted">Expo must be installed on your device.</p>
          <Button class="mt-4" variant="primary">
            <Icon class="[&_path]:fill-accent-foreground" icon="logos:expo-icon" />
            Preview on Expo Go
          </Button>
        </Disclosure>
        <Separator class="my-2" />
        <Disclosure
          value="download"
          :ui="{ bodyInner: 'mx-2 flex flex-col items-center gap-2 p-4 text-center' }"
        >
          <template #trigger="{ indicator }">
            <Button
              :class="[
                'w-full border-none',
                { 'bg-transparent': !expandedKeys.includes('download') },
              ]"
              :variant="expandedKeys.includes('download') ? 'secondary' : 'tertiary'"
            >
              <div class="flex w-full items-center justify-start gap-2">
                <Icon icon="tabler:brand-apple-filled" />
                Download App
              </div>
              <component :is="indicator" class="text-muted" />
            </Button>
          </template>
          <p class="text-sm text-muted">
            Download the mobile app to explore our mobile components directly on your device.
          </p>
          <img
            alt="App Store QR Code"
            class="aspect-square w-full max-w-54 object-cover"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/qr-code-native.png"
          />
          <p class="text-sm text-muted">Available on iOS and Android devices.</p>
          <Button class="mt-4" variant="primary">
            <Icon icon="tabler:brand-apple-filled" />
            Download on App Store
          </Button>
        </Disclosure>
      </DisclosureGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExpandedValue } from '@hareui/vue'
import { Button, Disclosure, DisclosureGroup, Separator } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const expandedKeys = ref<ExpandedValue[]>(['preview'])
</script>
