<template>
  <div class="w-full max-w-[520px] rounded-3xl bg-default p-4">
    <header class="mb-3 flex items-baseline justify-between px-1">
      <h3 class="m-0 text-sm font-semibold text-foreground">Shop assets</h3>
      <span class="text-xs text-muted">{{ live }} of {{ assets.length }} on the menu</span>
    </header>
    <DropZone
      label="Add menu photos and price sheets"
      description="Images, PDFs and spreadsheets, up to 15 MB each."
      trigger-label="Upload"
      multiple
      :ui="{ area: 'bg-surface', fileItem: 'bg-surface' }"
      @add="addAssets"
    >
      <template #icon>
        <Icon icon="gravity-ui:folder-open" />
      </template>
      <template #files>
        <DropZoneFileList>
          <DropZoneFileItem
            v-for="asset in assets"
            :key="asset.key"
            :name="asset.name"
            :size="asset.bytes"
            :status="statusOf(asset)"
            :progress="
              asset.lostConnection ? undefined : Math.floor((asset.sent / asset.bytes) * 100)
            "
            retryable
            @remove="removeAsset(asset.key)"
            @retry="resend(asset)"
          >
            <template #meta="{ size, status }">
              <span>{{ size }}</span>
              <span aria-hidden="true">·</span>
              <span v-if="status === 'uploading'">Sending to the shop…</span>
              <span v-else-if="status === 'complete'" class="flex items-center gap-1">
                <Icon icon="gravity-ui:circle-check-fill" class="size-3 text-success" /> On the menu
              </span>
              <span v-else class="flex items-center gap-1 text-danger">
                <Icon icon="gravity-ui:circle-xmark-fill" class="size-3" /> Connection lost
              </span>
            </template>
            <template #retry> Upload again </template>
          </DropZoneFileItem>
        </DropZoneFileList>
      </template>
    </DropZone>
  </div>
</template>

<script setup lang="ts">
import type { DropZoneFileStatus } from '@hareui/vue'
import { DropZone, DropZoneFileItem, DropZoneFileList } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type ShopAsset = {
  key: string
  name: string
  bytes: number
  sent: number
  lostConnection: boolean
}

const assets = ref<ShopAsset[]>([
  { key: 'menu', name: 'Spring menu.pdf', bytes: 1468006, sent: 1468006, lostConnection: false },
  { key: 'tray', name: 'Croissant tray.jpg', bytes: 3250586, sent: 1787822, lostConnection: false },
  {
    key: 'prices',
    name: 'Wholesale prices.xlsx',
    bytes: 655360,
    sent: 196608,
    lostConnection: true,
  },
])
let added = 0

const statusOf = (asset: ShopAsset): DropZoneFileStatus => {
  if (asset.lostConnection) return 'failed'
  return asset.sent >= asset.bytes ? 'complete' : 'uploading'
}

const live = computed(() => assets.value.filter((asset) => statusOf(asset) === 'complete').length)

const addAssets = (files: File[]) => {
  assets.value.push(
    ...files.map((file) => ({
      key: `asset-${added++}`,
      name: file.name,
      bytes: file.size,
      sent: 0,
      lostConnection: false,
    })),
  )
  resume()
}

const resend = (asset: ShopAsset) => {
  asset.lostConnection = false
  asset.sent = 0
  resume()
}

const removeAsset = (key: string) => {
  assets.value = assets.value.filter((asset) => asset.key !== key)
}

// Simulated network: one 1.5 MB/s connection shared by every file still sending, and at least 1.2 s per file
const BYTES_PER_MS = (1.5 * 1024 * 1024) / 1000
let frame = 0
let lastTime = 0

const pump = (now: number) => {
  const sending = assets.value.filter((asset) => statusOf(asset) === 'uploading')
  if (!sending.length) {
    frame = 0
    return
  }
  const elapsed = Math.min(now - lastTime, 100)
  for (const asset of sending)
    asset.sent = Math.min(
      asset.bytes,
      asset.sent +
        Math.max((BYTES_PER_MS * elapsed) / sending.length, (asset.bytes * elapsed) / 1200),
    )
  lastTime = now
  frame = requestAnimationFrame(pump)
}

const resume = () => {
  if (frame) return
  lastTime = performance.now()
  frame = requestAnimationFrame(pump)
}

onMounted(resume)
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>
