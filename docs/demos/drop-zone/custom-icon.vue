<template>
  <DropZone
    v-model="cover"
    class="w-full max-w-[420px]"
    label="Drop a cover for your playlist"
    description="WebP or AVIF"
    trigger-label="Choose cover"
    accept="image/webp,image/avif"
  >
    <template #icon>
      <Icon icon="gravity-ui:music-note" />
    </template>
  </DropZone>
</template>

<script setup lang="ts">
import { DropZone } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const cover = ref<File[]>([])
</script>
