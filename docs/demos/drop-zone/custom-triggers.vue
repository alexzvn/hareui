<script setup lang="ts">
import { Button, DropZone, Link } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const invoices = ref<File[]>([])
const receipt = ref<File[]>([])
const playlist = ref<File[]>([])
</script>

<template>
  <div class="grid w-full max-w-[720px] gap-4 sm:grid-cols-2">
    <DropZone
      v-model="invoices"
      class="sm:col-span-2"
      label="Drop invoices to import"
      description="PDF or PNG, up to 10 MB each."
      accept=".pdf,.png"
      :max-size="10 * 1024 * 1024"
      multiple
    >
      <template #trigger="{ open, disabled }">
        <Button class="mt-2" :disabled="disabled" @click="open">
          <Icon icon="gravity-ui:receipt" /> Import invoices
        </Button>
      </template>
    </DropZone>

    <DropZone
      v-model="receipt"
      label="Add a receipt"
      description="Photos or scans, 5 MB at most."
      accept="image/*,.pdf"
      :max-size="5 * 1024 * 1024"
    >
      <template #icon>
        <Icon icon="gravity-ui:file" />
      </template>
      <template #trigger="{ open, disabled }">
        <Link as="button" type="button" class="mt-1 text-sm" :disabled="disabled" @click="open">
          Pick from this computer
        </Link>
      </template>
    </DropZone>

    <DropZone v-model="playlist" label="Import a playlist" description="M3U or TXT" accept=".m3u,.txt">
      <template #icon>
        <Icon icon="gravity-ui:music-note" />
      </template>
      <template #trigger="{ open, disabled }">
        <Button class="mt-1" size="sm" variant="ghost" :disabled="disabled" @click="open">
          <Icon icon="gravity-ui:arrow-down-to-line" /> Load playlist
        </Button>
      </template>
    </DropZone>
  </div>
</template>
