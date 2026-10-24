<template>
  <div class="flex w-full max-w-[440px] flex-col gap-2">
    <DropZone
      v-model="episodeFiles"
      label="Upload this week's episode"
      description="Drop the audio, transcript and cover art together."
      trigger-label="Add episode files"
      multiple
    />
    <p class="m-0 text-end text-xs text-muted tabular-nums">
      {{ episodeFiles.length }} {{ episodeFiles.length === 1 ? 'file' : 'files' }} ·
      {{ totalMegabytes }} MB
    </p>
  </div>
</template>

<script setup lang="ts">
import { DropZone } from '@hareui/vue'
import { computed, ref } from 'vue'

const episodeFiles = ref<File[]>([])

const totalMegabytes = computed(() =>
  (episodeFiles.value.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(1),
)
</script>
